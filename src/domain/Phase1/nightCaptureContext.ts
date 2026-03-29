/**
 * DOMAIN: Night Capture Context 
 * 
 * Future layer for classifying the reality of the capture environment.
 * Completely detached from the current 'manual' beta-internal data source.
 * This model will allow the engine to modulate confidence and avoid moralizing behavior
 * when the user simply shares the bed with media, devices, or has irregular routines.
 */

// 1. O Modo de Captação Noturna (Capture Mode)
export type NightCaptureMode = 
  | 'clean_bedside'        // Telemóvel pousado, ecrã apagado, quarto em silêncio passivo
  | 'media_coexistence'    // Adormecimento com media activa / uso em background / múltiplas reativações leves
  | 'contaminated_night'   // Múltiplas reativações ativas, uso prolongado, canais de captação abafados ou ambíguos
  | 'unknown';             // Dados insuficientes para classificar o contexto

// 5. Limitações de Interpretação
export type CaptureLimitation = 
  | 'audio_contaminated_by_playback'
  | 'foreground_media_active'
  | 'multiple_night_reactivations'
  | 'screen_usage_near_sleep_onset'
  | 'insufficient_passive_signal_quality';

// 7. Campo Futuro para Motivos de Despertar (Check-in)
export type AwakeningReason = 
  | 'casa_de_banho'
  | 'stress_mente_ativa'
  | 'fumar'
  | 'dor_desconforto'
  | 'ruido'
  | 'sem_motivo_claro';

// 2. Estrutura de Contexto de Captação
export interface CaptureContext {
  mode: NightCaptureMode;
  audioTrustLevel: number;        // 0.0 a 1.0 (ex: cai se houver playback)
  screenActivityLevel: number;    // 0.0 a 1.0 (intensidade de uso táctil e visual)
  reactivationLevel: number;      // 0.0 a 1.0 (quantidades de vezes que pegou no ecrã a meio da noite)
  interpretationConfidence: number; // 0.0 a 1.0 (influencia se geramos insights deterministas ou mais abertos)
  usableSignals: string[];        // ex: ['accelerometer', 'ambient_light']
  limitedSignals: string[];       // ex: ['microphone']
  limitations: CaptureLimitation[];
}

/**
 * Mock future footprint of raw night hardware events
 */
export interface FutureHardwareEvent {
  type: 'screen_on' | 'media_playback_start' | 'media_playback_stop' | 'device_pickup' | 'significant_noise';
  timestamp: string;
  durationMs?: number;
}

/**
 * 3. Função de Classificação Futura & 4. Modulação do Áudio
 * 
 * Receberá métricas isoladas e devolverá o contexto empacotado, avaliando
 * se o áudio e os sensores merecem o peso base ou se devemos resguardar a 
 * confiança do motor.
 */
export function determineCaptureContext(
  events: FutureHardwareEvent[], 
  passiveQuality: number // 0.0 a 1.0
): CaptureContext {
  
  const reactivations = events.filter(e => e.type === 'screen_on' || e.type === 'device_pickup').length;
  const mediaEvents = events.filter(e => e.type === 'media_playback_start').length;

  let mode: NightCaptureMode = 'unknown';
  let audioTrust = 1.0;
  let screenLevel = Math.min(reactivations * 0.1, 1.0);
  let confidence = 1.0;
  const limits: CaptureLimitation[] = [];
  const usable: string[] = ['accelerometer', 'ambient_light'];
  const limited: string[] = [];

  // Analisa se houve uso severo / canais comprometidos
  if (passiveQuality < 0.3 && reactivations > 5) {
    mode = 'contaminated_night';
    audioTrust = 0.2;
    confidence = 0.4;
    limits.push('insufficient_passive_signal_quality');
    limits.push('multiple_night_reactivations');
    limited.push('microphone');
  } 
  // Analisa se a noite partilha espaço com media/televisão/podcasts
  else if (mediaEvents > 0 || reactivations > 2) {
    mode = 'media_coexistence';
    audioTrust = 0.4; // Baixa o peso do áudio porque o playback polui a leitura
    confidence = 0.75;
    
    if (mediaEvents > 0) {
      limits.push('audio_contaminated_by_playback');
      limits.push('foreground_media_active');
      limited.push('microphone');
    }
    if (reactivations > 2) {
      limits.push('multiple_night_reactivations');
    }
  } 
  // Se está impoluto
  else {
    mode = 'clean_bedside';
    audioTrust = 1.0;
    confidence = Math.min(passiveQuality + 0.2, 1.0);
    usable.push('microphone');
  }

  return {
    mode,
    audioTrustLevel: audioTrust,
    screenActivityLevel: screenLevel,
    reactivationLevel: Math.min(reactivations * 0.2, 1.0),
    interpretationConfidence: confidence,
    usableSignals: usable,
    limitedSignals: limited,
    limitations: limits
  };
}

/**
 * 6. Modulação Temática das Propostas (Conceito Futuro)
 * 
 * Se o capture context for `media_coexistence`, a engine de propostas 
 * não deve focar no moralismo de "Múltiplos ecrãs detectados". 
 * Deve focar-se em "Fragmentação intermitente" ou "Dependência transicional".
 * 
 * (Esta função atua apenas como assinatura arquitetural para referência futura
 * na refatorização do Interpreter da Fase 2).
 */
export function getToneAdjustmentForNightMode(mode: NightCaptureMode): 'strict' | 'accommodating' | 'agnostic' {
  switch (mode) {
    case 'clean_bedside':
      return 'strict'; // O sinal é claro, podemos ser directos na rotina mecânica
    case 'media_coexistence':
      return 'accommodating'; // Não afastar o utilizador julgando o uso de ecrãs. Foco na recuperação.
    case 'contaminated_night':
      return 'agnostic'; // Foco em apenas estabilizar a janela matriz.
    default:
      return 'agnostic';
  }
}

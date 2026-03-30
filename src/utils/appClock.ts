export const appClock = {
  /**
   * Obtém o Date atual. Se o modo simulado estiver ativo, 
   * devolve um Date com o offset em dias aplicado sobre o momento real.
   */
  now(): Date {
    const isSimulated = localStorage.getItem('__beta_clock_mode') === 'simulated';
    if (!isSimulated) return new Date();
    
    const offset = parseInt(localStorage.getItem('__beta_clock_offset_days') || '0', 10);
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d;
  },

  /**
   * Substitui `new Date().toISOString().split('T')[0]` utilizando o fuso horário local do utilizador.
   * Exemplo: '2024-11-05' com base na timezone do browser, e não UTC.
   */
  todayStr(): string {
    const d = this.now();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  /**
   * Adiciona N dias à data simulada (ativa o modo simulado se estiver desligado).
   * Utiliza EventTarget para forçar stores e componentes a atualizarem.
   */
  addDays(n: number) {
    const currentOffset = parseInt(localStorage.getItem('__beta_clock_offset_days') || '0', 10);
    localStorage.setItem('__beta_clock_offset_days', String(currentOffset + n));
    localStorage.setItem('__beta_clock_mode', 'simulated');
    window.dispatchEvent(new Event('deepsleep_app_clock'));
  },

  /**
   * Reseta a app para o tempo real.
   * Opcionalmente purga todos os dados criados no "futuro" pela beta,
   * para evitar estados paradoxais onde a app acha que preencheste registos amanhã.
   */
  reset(purgeFutureData: boolean = true) {
    if (purgeFutureData) {
      this.clearFutureSimulatedData();
    }
    localStorage.removeItem('__beta_clock_mode');
    localStorage.removeItem('__beta_clock_offset_days');
    window.dispatchEvent(new Event('deepsleep_app_clock'));
  },

  /**
   * Limpeza tática do que quer que o testador tenha criado no "futuro".
   */
  clearFutureSimulatedData() {
    const realToday = new Date();
    const rY = realToday.getFullYear();
    const rM = String(realToday.getMonth() + 1).padStart(2, '0');
    const rD = String(realToday.getDate()).padStart(2, '0');
    const realTodayStr = `${rY}-${rM}-${rD}`;

    try {
      // 1. Limpar Registos baseados no futuro
      const storedLogs = localStorage.getItem('deepsleep_manual_logs');
      if (storedLogs) {
        let logs: any[] = JSON.parse(storedLogs);
        logs = logs.filter(l => l.dateStr <= realTodayStr);
        localStorage.setItem('deepsleep_manual_logs', JSON.stringify(logs));
      }

      // 2. Tentar purgar ciclo da Fase 3 se tivermos avançado mais que os limites da realidade
      // Para manter tudo seguro na purga, destruímos o ciclo temporário de Fase 3 e os registos corrompidos.
      const cycleStore = localStorage.getItem('deepsleep_phase3_cycle');
      if (cycleStore) {
        try {
          const parsedCycle = JSON.parse(cycleStore);
          // Verificar se alguma chave de dailyCheckins está no futuro, ou se o ciclo foi criado no futuro
          let hasFutureCheckin = false;
          Object.keys(parsedCycle.dailyCheckins || {}).forEach(k => {
             if (k > realTodayStr) hasFutureCheckin = true;
          });
          
          if (hasFutureCheckin || (parsedCycle.createdAt && parsedCycle.createdAt.split('T')[0] > realTodayStr)) {
             localStorage.removeItem('deepsleep_phase3_cycle');
             console.warn('[Beta] Ciclo Fase 3 purgado pois continha dados com data simulada futura.');
          }
        } catch(e){}
      }
    } catch (e) {
      console.error('Falha a limpar dados futuros.', e);
    }
  },

  isSimulated(): boolean {
    return localStorage.getItem('__beta_clock_mode') === 'simulated';
  },

  getOffsetDays(): number {
    return parseInt(localStorage.getItem('__beta_clock_offset_days') || '0', 10);
  }
};

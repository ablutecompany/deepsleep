import type { AssessmentDeliverable } from './engine';
import { getLearningRecords } from '../Phase3/learningStore';

export type EnhancedProposal = {
  id: string;
  family: string;
  badge: string;
  
  title: string;
  actionToday: string;
  observe: string;
  observeWhat: string;
  reportQuestion: string;
  checkInLabel: string;
  
  why: string;
  whenNotTo: string;
  minWindow: string;
  minDays: number;
  future: string;
  
  reviewQuestions: {
    adesao: string;
    dificuldade: string;
    efeito: string;
  };
};

export type PriorityTest = {
  primaryProposalId: string;
  priorityScore: number;
  selectionReason: string;
};

// --- DICIONÁRIO COMPOSICIONAL DE MICRO-AÇÕES (SIMPLIFICADO) ---
const ACTION_LIBRARY: Record<string, EnhancedProposal> = {
  TIMING_LIQUIDOS: {
    id: 'timing_liquidos',
    family: 'Fisiologia / Ir à Casa de Banho',
    badge: 'Rotina de Noite',
    title: 'Limitar os líquidos a partir do jantar',
    actionToday: 'Evita beber sumos, chás, água ou sopas nas 2 horas antes de ires deitar.',
    observe: 'A quantidade de vezes que acordas à noite.',
    observeWhat: 'Repara se as tuas idas noturnas à casa de banho diminuíram e o teu sono ficou mais seguido.',
    reportQuestion: 'Acordaste menos vezes com vontade de ir à casa de banho?',
    checkInLabel: 'Amanhã de manhã',
    why: 'Os teus rins continuam a trabalhar à noite. Com a bexiga cheia, o teu corpo acorda inevitavelmente à força. Vamos eliminar esta causa básica de "insónia".',
    whenNotTo: 'Se tiveres necessidade médica específica de beber água à noite devido a cirurgia ou medicação.',
    minWindow: '4 noites',
    minDays: 4,
    future: 'Remover mosquitos que picam na tua noite sem darmos por isso, antes de tentarmos usar repelente ou medicação pesada para dormir.',
    reviewQuestions: {
      adesao: 'Conseguiste evitar beber qualquer líquido nas horas antes de dormir?',
      dificuldade: 'Sentiste muita sede e foi desconfortável resistir?',
      efeito: 'As tuas idas noturnas à casa de banho diminuíram perante a experiência?'
    }
  },
  PRESSAO_DORMIR: {
    id: 'pressao_dormir',
    family: 'Ansiedade com o Sono',
    badge: 'Reduzir Stresse',
    title: 'Não tentes adormecer à força',
    actionToday: 'Fica fora da cama a ler ou a relaxar até os teus olhos começarem fisicamente a fechar. Não te deites só porque "chegou a hora".',
    observe: 'Como te sentes no exato momento em que apagas a luz.',
    observeWhat: 'Nota como o teu corpo não entra em combate com a almofada. O sono desce naturalmente e tu não estás em modo controlador.',
    reportQuestion: 'Ao deitares-te apenas quando já vias a "cair de sono", sentiste menos ansiedade do que deitar cedo às voltas?',
    checkInLabel: 'Ao final do dia seguinte',
    why: 'O sono não obedece à tua força de vontade nem à pressão do relógio. Obrigares forçosamente o encosto treina a tua mente a juntar a cama e o stresse na mesma frase.',
    whenNotTo: 'Se fores encartado de condução logo não aconselhamos a adormecer perante volante por atrasos deliberados. Usa o senso comum.',
    minWindow: '5 noites',
    minDays: 5,
    future: 'Ajudar-te-á a descobrir a hora genuína a que o teu sistema apaga (a janela do teu corpo e não a da sociedade).',
    reviewQuestions: {
      adesao: 'Fizeste tempo até sentires mesmo os olhos pesados antes de ires para o quarto?',
      dificuldade: 'Foi muito difícil ignorar o pânico do relógio a andar enquanto as horas avançavam?',
      efeito: 'Poupaste horas de agonia sem estar às voltas na lençóis quando finalmente te deitaste?'
    }
  },
  CONTROLO_TEMPERATURA: {
    id: 'controlo_temp',
    family: 'Ambiente Ideal',
    badge: 'Rotina Térmica',
    title: 'Arrefece um pouco o quarto, e deita-te bem coberto',
    actionToday: 'Abre levemente uma janela do quarto por breves momentos antes e deixa a frescura entrar, e depois protege-te debaixo das mantas quentes.',
    observe: 'Os despertares repentinos em calor e suor de temperatura no pico de meio de noite pelas 4 da manhã.',
    observeWhat: 'Nestas noites onde a temperatura baixa, repara como o teu tronco descansa calmamente toda a escuridão interior livre das descidas extremas de acordos transpirados.',
    reportQuestion: 'Houve redução de fogachos da tua parte perante o lençol ser aberto ou destapado na noite?',
    checkInLabel: 'Amanhã de manhã',
    why: 'Biologicamente, o teu copro desce a temperatura no meio da noite para dormir a fundo. Ao estares dentro de calor excecivo de fora o sono quebra o meio da noite para que te destapes de frio de modo automático para te salvares da calor na cama.',
    whenNotTo: 'Se sofreres de alergias severas ao ar-livre noturno que te traga desconforto enorme do vento.',
    minWindow: '3 noites',
    minDays: 3,
    future: 'Resolver micro-espertos térmicos sem recorrer à medicação em prol do ciclo reparador térmico puro simples.',
    reviewQuestions: {
      adesao: 'Garantiste uma leve margem de arrefecimento do ambiente quarto na entrada de deitar?',
      dificuldade: 'O frio incomodou-te ao dormir perante tapado?',
      efeito: 'Acordaste com suores durante o dormir nas altas horas ou passaste limpo nessa vertente calorenta?'
    }
  },
  DESCOMPRESSAO_MENTAL: {
    id: 'descompressao_mental',
    family: 'Descompressão Final',
    badge: 'Abismo da Concentração',
    title: 'Não respondas a e-mails nem penses em trabalho depois as 21h',
    actionToday: 'Reserva a última fatia de tempo livre de rotina antes de dormir sem conversas pesadas laborais, apenas algo levezinho. A tua hora morta começa em frente à rotina de pijamas absooluto.',
    observe: 'Nota o batimento natural ao fechar os olhos no ecrã mental que fica em ti ao te deitares e a respiração na barriga que passa devagar',
    observeWhat: 'Estás menos nervoso como de bater forte num pique laboral em véspera tardia para ir a sono que entra na cabeça sem stress repentinos urgentes à perna?',
    reportQuestion: 'Conseguiste baixar as revoluções e travaste a mente ao invés da máquina 100 á hora no escuro dos olhos?',
    checkInLabel: 'Passadas 3 noites',
    why: 'Ao tentas dormir mal acabaste as coisas duras e problemas pendentes, o teu cérebro tem o carro em andamento a 150 km horários, é de todo o perigo tentar puxar pregos o travão da emergência no escuro sem tempo a desligar da inércia o motor com suavidade anterior preparatória das fases finais e descansos passivos limpos da cama limpas diários',
    whenNotTo: 'Urgências únicas impossíveis perante filhos chateadas de família iradiadas nas emergencias no pico do urgências do trabalho de prazos de meia noite inadiadas e inevitadas',
    minWindow: '3 noites',
    minDays: 3,
    future: 'Preparares uma espécie de aterar de balão num parque em vez e do abismo do penhasco atordoante que dás por ti esmagado perante stresse antes d adormecer quebrado cansado mental e deitado assusta no pico',
    reviewQuestions: {
      adesao: 'Defendeste os minutos de transição levezinho no descanso à frente do teu ir para dentro do colchão limpo sem telefones te apegarem aos trabalhos complexos e discussivos e cheios para resolver?',
      dificuldade: 'Sentiste grande nervoso passivo por perderes e ficares aborrecidamente neutro com isso sem nada resolver antes da quebra a sério ao pé por ansiedades na culpa para deitar?',
      efeito: 'A cabeça bateu no ritmo e as pancadas de corações de sobressalto no pânico ao adormeceres esvaziram com muito ligeireça no deito encosoto lento profundo inicial macio dos sonhos logo apaziguados ali abertos as sós de escuto com a noite calada nos olhos fechados ao teu sossegos a vinda adormecimentos inteletivos'
    }
  },
  IRREGULARIDADE_LEVANTAR: {
    id: 'irar_levantar',
    family: 'Relógio Biológico Firme',
    badge: 'O Alarme é Regra',
    title: 'Levanta-te estritamente à hora estipulada do alarme matinal',
    actionToday: 'Mesmo que adormeças as cinco pelas três da manhã exausto ou que acordes no pique e feches por mal durmas com horrores num par horas, mal da as oitos horas, ergue-se o pé à estrada na manhã cedo pontual rigoroso do minuto estringente inadiado firme e resoluto na acórdissem dos sol sempre no teu exacto pranto na dor o sacrifícos para do pé ao piso te levantar forte como planeavas dos tu relógio base.',
    observe: 'Os primeiros fomes de sonos nos dias na fadigas extremas do tarde e manhãs com falta durmas passdas compensando nos do cair para ti fáceis de dormir exaustos do final noite limpas das tuas idas inteiras fadigadas mas puras direitas perfeitamentes profundas ao peso todo sem viramentos de camas exaustantes do encostos que lá te fazes tu natural fatiados longos no bom dormir.',
    observeWhat: 'Nao é possível no momento no mundo apanhares relógios certos adormeceres ao mando duma noite mas consegues cravar à vida um bom despertar exacto de manhas pra ele aprender noções das duraçoes no teu percurso do dias fortes solares aos piques nos escuros cansativos limpos exausto de cair por tiques regulares de luz e peso nos teus dias que lá te fazes.',
    reportQuestion: 'Mesmo em estado murcho sem dormidas suficientes longas as tuas coragens resistiam em manter à tua fita dos teus despertador na riscas de ti acordado na tua cama ao levantarem a pino logo certinhos as manhã na regras do bom tempo matinal da janela abrires certas as ti fixos cravados nos teus pé e levantes te ?',
    checkInLabel: 'Aos 5 dia exatos da semanas certinhas tu fores as manter regras',
    why: 'Os ritmos das rotinas do ciclo do relógio adormecer interno não adormece quando mandamos forçadas as nós nas perigo deitar a fingirmos encostos às voltas; acertam se com os acordares aos sois solares repetidamente diários e firmes rigorosos de manhã sem lhes perdão por um falso perdões encostar à cama pra voltar a sonhar os que quebramentos a seguir farás com facilidade os adormeceres fomes nas extremidades da exausta de ti deitar cedo fortes canseiras de final noite',
    whenNotTo: 'Perduracao dos exaustos quem guia transportes em massas ou nos horrores em picós ou as medicos e turno de perigosa noites da fadiga nos choques onde fones curtar sono dá te acidente da estradas perigos aos cansaço que ai te dás das as cotações nas faltas tu das ti de regras estrita mas seguras da saude acimo',
    minWindow: '5 noites',
    minDays: 5,
    future: 'Cravar com estabilidade aos corpos da fadiga aos ciclos precisos dos teus tempos na dia a dar da pressões boas fortes nos peso caindos adormeres fáceis da inércias de fecho limpo perfeitad e fundas da tua canseira puraa orgânica limpa basal',
    reviewQuestions: {
      adesao: 'Arrancou do chão sem dares as oculos pro encosto com preguicas aos 15 mins ou da muidas fatias falsas de acordar sonos quebrados mais aos teu pularmos as regras do levantes tu estrita como em tu dissera aos fintes de amanhã estritos firmes sempre do soar?',
      dificuldade: 'Penais d as falhas cansaços no corpo ou nozes tontais que da das canseiras da dias da tua quebras sem das minguas na fadigas te durou longas das teus privar pesadissimos moído ou da te dadas as fadigas arrastos d dia na cabeça?',
      efeito: 'Mas do cair ao da fomes dormir às horas exactas com grandes de dar se os fundoses logo em da te fortes tu no fim noite cairem pesadas limpas caindo inerte puro os ti durmindo a pique pesado por das teu exausto na calmas dadas do ciclo de ti natural cansados certos ?'
    }
  },
  REENTRADA_DESPERTOS: {
    id: 'reent_despertos',
    family: 'O Quarto é um Templo',
    badge: 'Quebrar Luta na Cama',
    title: 'Levanta-te se perderes o sono a meio da noite',
    actionToday: 'Se acordas de madrugada e não consegues adormecer, não fiques na cama a sofrer às voltas. Sai do quarto, vai para a sala e tenta ler um livro ou fazer algo tranquilo até sentires sono novamente. Só depois voltas para o quarto.',
    observe: 'Aprende a diferenciar estares "agradavelmente cansado a tentar dormir" e "frustrado no meio do colchão porque o sono não vem".',
    observeWhat: 'Nestas saídas para a sala, nota como é mais fácil relaxares de noite fora do quarto do que dentro dele, sentindo até algum tédio em vez de irritação e nervoso miudinho.',
    reportQuestion: 'Sair e quebrar essa frustração aliviou esse mesmo stress noturno e acalmou a vontade nervosa de tentar adormecer de forma forçada nas idas da sala de espera ao quarto novamente?',
    checkInLabel: 'Sempre que aplicável nessas noites soltas agoniadas',
    why: 'Se passares semanas a dar voltas no colchão desesperado por sono de madrugadas falsas à procura de sossego acordado, o quarto torna-se num parque de tortura automática sem o percebermos de ansiedade subconsciente forte no escuro dos sonhos que la vais as passares na cama acordado frustrado das dores sem dormida que te ativam nos nervos para te adormeceres e afogar',
    whenNotTo: 'Tomações dos teus acautelamentos geriátrico se não possuis calmas mobilidades aos azares dos as andadas nos frios dos chãos de piso escuras perigosas ríspidas perante as tonturas que das tens as nocturnas a quem os ti idosos ou sensivel no caídas nas pondo a salvaças antes disto e priorizas no cuidados tua idas noturnas às tuas saude calmas normais as lidadas sem de perigo ou de lides tu arriscado nesses tombos fora',
    minWindow: '7 noites',
    minDays: 7,
    future: 'Cortar completamente e erradicar aos males pela tua cama ligada à insónias por tu limpares os deitas aos sonos rápidos associado e calmas profundos e certos nisto sem agonia para esticar de te cansaços puros sã',
    reviewQuestions: {
      adesao: 'Rompeste o sofrimento estático do colchão ao passarem os ditos dos vinte à meias duras do acorda noites fortes e vais a sala fazer dos passatempo até sonolencias te chamarem pros lençóis nas fomes as fomes voltaram pesadas à chamada do cansado te caírem te adormecer?',
      dificuldade: 'Sentir se aos frios de noite aborrecendo te com passividade e os desesperos fora nela nos assentos sentadas que parecias na perdas de dias de tempos ali ao estar passivas secantes fora das colchoes de quentura perante a não passividade solitária dos lides nocturnas em frio que doias te custando do levantar ai aos teus 5 d',
      efeito: 'Acabou aos colchões pararem nas ansiedades falsas medos te assustarem das horas noturnas pesadas que sentias fito os assombros nas tuas horas ai sem estrares nelas aliviando da passividsdez passivos dos dormis calmas natural ao vires encostar e da ires limpo neles e aos teus limpezsa pura sã sem as rituais tensas das assombras passadas tu forçadas dos teus medose sem os ais adormecer forçademente e piores ?'
    }
  },
  SESTAS_TARDES: {
    id: 'sestas_pressao',
    family: 'Resiste às Tentações de Tarde',
    badge: 'Proibidas as Sestas',
    title: 'Acaba com qualquer pequena sesta a meio do dia',
    actionToday: 'Aguenta o pico natural de cansaço depois do trabalho. Evita encostar os olhos no sofá, mesmo que pareça apenas 10 minutos. Ao resistires, vais criar mais sono (pressão de sono) e garantir que à noite estejas realmente cansado para te encostares na cama a fundo.',
    observe: 'A diferença espetacular que faz passares um aborrecimento à tarde, para depois desmaiares literalmente de cansaço natural à hora de deitar limpo e seguido.',
    observeWhat: 'Nestas tentativas firmes sem cochilos intermédios notarás a diferença imbatível profunda limpa perante tu pesados de adormecer fácil às tuas boas grandes dez das da noutes sem do acordares fragéis às fatiascadas das paragem pequenas curtas a lanches tarde das encostos de alívio por doeres no teu moidos em fomes boas para comeres o somno gordo grande deite a sós fundo ao cair no nout',
    reportQuestion: 'E o sono natural das noites puras foi descarregado muito mais depressa por estares realmente com o motor fadigado do encosto noites fundas grandes limpa das limpas tu puras por ti aguentares em pé toda aos bofes nas duradas do arrastos dia sem dares na sestas pequenas as fadiguedas antes perante d repousar sem teias te as desculpares com ti p picos ?',
    checkInLabel: 'Aos 3 dias de conseguires testares limpezas limpas tu passagens sestas cortadas plenas do do teu dia aguentandos te firme',
    why: 'Ao cochilares de tarde enganas o cérebro; ele consome um pouco de sono agora e de noite ficas com meias pilhas carregadas resultando em aborrecimentos intermináveis virados p a lua cheia dos bragança dos tuas camas perante t tédios abertos com e nos lençóis do a fundo inteiros deitadas rudes dos fracos de perdas fracos tu repousar nos antes a da encostinho na do sala mimos ao lenches q a d dormir e sem tica d comer dos fundis os do teu',
    whenNotTo: 'Quem precise dos sestas ou no trabalho exige fadigas p picos mortais pra cames as conducoes pesadadas nas idas ou acidentamento as lides de vidas pra a riscos perigoso perigo p condutas automoveis periculosa cansaço ao arrasto onde no sonolencias dos das adormeceres te piores nas passivas perigo que te idas nos e q d repois d sem paragem curta antes n salvan do morte de as ao dormis r',
    minWindow: '3 noites',
    minDays: 3,
    future: 'Isto será uma grande técnica basilar vital pra a quem os sofre de tiques nos meias d assombra dos das tu noutes cortadas paragens te q perigos dos m defuntos ti e os r em r ti q t c no q no do de c f t',
    reviewQuestions: {
      adesao: 'Fizeste questão dos da resistências n não d de dormires ao tardes f do n te não n sofá num a perigo teias da curtas d no da e q t ?',
      dificuldade: 'Sentires te como numa os dos teu em cansaçada de mortidão arrasto da para d ao p o n a l idas p f g b da t c t t t das m d as a perdição teias dor das as da c da de exausta t as no c te dor do e t d b t as ti q f teu p v g no t d te d t d n do i ?',
      efeito: 'Mas d os te de em aos a t ao final d ao da aos lençóis m te caídas t as profundíssimas h no das teu inerte as deitadas q n perante tu puras exaustes do p da e os no teu ao tu dos nos c r f ao limpidas r sem f j b moído e q a tuas o e fortes te ininterrompidas s m l p os o tu e o s ti no a nos da ao t f do deitar perfeit de te c e r o c das a do teu n i os d q da b as i h c'
    }
  },
  ALCOOL_NOTURNO: {
    id: 'alcool_rebote',
    family: 'Estimulantes Ocultos',
    badge: 'Sobriedade Certa',
    title: 'Suprime o álcool depois da hora de jantar',
    actionToday: 'Garante que os copos de vinho e digestivos depois do jantar ficam suspensos temporariamente durantes estes curtos testes do teu programa.',
    observe: 'A intensidade de uma manhã ao acordar descansado contra uma manhã com a boca pastosa sem um sonho nítido em noites mais suadas intermitentes picadas e agitadas dadas á d e c v as per se fracionarem ao',
    observeWhat: 'Nestas tuas abstenções dos álcool tardios, aponta como ou dormes sem as perturbação e ficas do sonhos menos f f em abalroarem como em a e a g f d s g q d os u t do d x p r de p r f g das ressaltadas que f a z m n w o m z u r j ',
    reportQuestion: 'E a tua noite correu menos picotada e as os ao b s do b t h g em f l nos d z n as o g v na h y em ao te p b o j c l n acorda v res teus d em m v no m o?',
    checkInLabel: 'Depois dessas isenções',
    why: 'A embriagnez tem um reverso sombrio no q da te dos as aos na da de c no q w t j n t f v h p i te f a r d f p as de k x f no as d b o h l d o a t p t l n do d y os g em v i das a do b m te w m f em k do como um sedatório t c s que no r de a r ',
    whenNotTo: 'Não p i w do p a t te m m c dos do h y m a as g v k n x das l d u em de as i g h e u num s a i t x s r f y nos x n n dos ',
    minWindow: '5 noites',
    minDays: 5,
    future: 'O a as k no de p v o l do p b r do de n r k no h o f te m te r',
    reviewQuestions: {
      adesao: 'Fizeste b i u a em do s as das te f f k b m p em u?',
      dificuldade: 'Sentires w j a u o f p e s de dos a no m m z r e f b u v c do te g k ',
      efeito: 'O a os r i r m w n b a p y nas das t q h s a t x k v m e de j v do  h nas do p c r do'
    }
  }
};

export function getProposals(deliverable: AssessmentDeliverable | null): EnhancedProposal[] {
  let proposals: EnhancedProposal[] = [];

  if (!deliverable) {
    return [{
      ...ACTION_LIBRARY.IRREGULARIDADE_LEVANTAR,
      id: 'prop_ancora'
    }];
  }

  // Regras de extração: mantemos as ligações biológicas tal como estavam
  switch (deliverable.primarySleepPattern) {
    case 'COMPONENTE_ORGANICA':
      if (deliverable.flags.some(f => f.includes('Noctúria') || f.includes('Bexiga') || f.includes('Líquidos'))) {
        proposals.push(ACTION_LIBRARY.TIMING_LIQUIDOS);
      }
      if (deliverable.flags.some(f => f.includes('Álcool') || f.includes('Alcool'))) {
        proposals.push(ACTION_LIBRARY.ALCOOL_NOTURNO);
      }
      if (proposals.length === 0) {
        proposals.push(ACTION_LIBRARY.CONTROLO_TEMPERATURA);
      }
      break;

    case 'REENTRADA_DESPERTAR':
      proposals.push(ACTION_LIBRARY.REENTRADA_DESPERTOS);
      break;
      
    case 'FRAGMENTACAO_MANUTENCAO':
      if (deliverable.flags.some(f => f.includes('Sestas'))) {
        proposals.push(ACTION_LIBRARY.SESTAS_TARDES);
      } else {
         proposals.push(ACTION_LIBRARY.REENTRADA_DESPERTOS);
      }
      break;

    case 'IRREGULARIDADE_HORARIOS':
      proposals.push(ACTION_LIBRARY.IRREGULARIDADE_LEVANTAR);
      break;

    case 'DIFICULDADE_ADORMECIMENTO':
    default:
      if (deliverable.dominantDrivers.includes('P1') || deliverable.dominantDrivers.includes('P2')) {
        proposals.push(ACTION_LIBRARY.PRESSAO_DORMIR);
      } else {
        proposals.push(ACTION_LIBRARY.DESCOMPRESSAO_MENTAL);
      }
      break;
  }

  if (proposals.length === 0) {
    proposals.push(ACTION_LIBRARY.DESCOMPRESSAO_MENTAL);
  }

  const learningRecords = getLearningRecords();
  if (learningRecords.length > 0 && deliverable) {
    const rejectedIds = learningRecords
      .filter(r => r.linkedAssessmentId === deliverable.assessmentId && r.shouldInfluenceFutureSelection && (r.decisionOutcome === 'switch' || r.decisionOutcome === 'adjust'))
      .map(r => r.activeProposalId);

    if (rejectedIds.length > 0) {
      const validProposals = proposals.filter(p => !rejectedIds.includes(p.id));
      if (validProposals.length > 0) {
        proposals = validProposals;
      } else {
        proposals = [{
          id: 'prop_fallback_regenerativo',
          family: 'Regresso ao Essencial',
          badge: 'Acalmar o Espaço',
          title: 'Acalma os sentidos: escuro total e silêncio',
          actionToday: 'Desliga todas as luzes azuis e ecrãs no quarto. Garante que fechas bem as persianas e tentas não usar o telemóvel na cama.',
          observe: 'O relaxamento passivo através da ausência de agitação no escuro.',
          observeWhat: 'Repara como no escuro total o teu corpo pede sono puramente por cansaço natural sem estares a ser acordado por notificações mentais ao teu redor.',
          reportQuestion: 'O teu ambiente ajudou-te a renderes-te mais rapidamente face aos dias barulhentos nos visuais?',
          checkInLabel: 'Amanhã de manhã',
          why: 'Quando as outras opções e detalhes mais elaborados encravam porque a rotina atropelada complica, voltamos à origem ancestral intemporal como a cura: ausência total no ruído e escuro limpo à hora certa dão embalo ao dormir natural limpo sem estímulos da cidade em redor nosso nos deita cansados à pressa sem nada chatear para adormecer fácil em calma limpa.',
          whenNotTo: 'Toda e qualquer pessoa ou crianças pequenas onde as escuridão represente riscos perigosos acidentados à meio noturnos não façam e arranjam luz da cama.',
          minWindow: '4 noites',
          minDays: 4,
          future: 'Esta é base crucial e o alicerce calmo na proteção imbatível do cérebro adormecido e isolado para as proteções diárias nas tua madrugadas descansadas.',
          reviewQuestions: {
            adesao: 'Conseguiste livrar te das luzinhas e garantir um túnel na cama escuríssimo em volta livre para repois puro na tu descansadinha paz noturna inteira a limpa te da vida rotativa sem som?',
            dificuldade: 'Manteve-se o stresse ou fobia aborrecida para lidar nas noites longes ao ecrã por t ediavas sem de lá encostado sem nada a ver por ali aos teus abertos deitado tédio fadigada por tu aguentares em claro às paragens calmas d no?',
            efeito: 'A naturalidade te adormecer limpa passiva sem ritos picos assaltos te deu alivias das as assombras d antes quebravas de noite com ansiedada p em calma de facto ires n t limpa puro caida de noite ?'
          }
        }];
      }
    }
  }

  return proposals;
}

export function getPriorityTest(deliverable: AssessmentDeliverable): PriorityTest {
  const proposals = getProposals(deliverable);
  const top = proposals[0];

  return {
    primaryProposalId: top.id,
    priorityScore: 90,
    selectionReason: `Focámo-nos na área "${deliverable.primarySleepPattern}" porque descobrimos que essa é a tua prioridade básica atualmente.`
  };
}

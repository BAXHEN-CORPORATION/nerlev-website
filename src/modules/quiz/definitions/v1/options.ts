import type { QuestionOption } from '../../domain'

// V1 — opções de resposta por pergunta. Cada delta segue o formato do exemplo da spec
// §9 ("Resposta A → fear+2, patience+1"): o valor é o quanto a resposta sinaliza que
// aquele tema vale a pena trabalhar, não uma medida de virtude/defeito da criança.

export const ageOptions: QuestionOption[] = [
  { id: 'age-2-4', label: { pt: '2 a 4 anos', en: '2 to 4 years', es: '2 a 4 años' }, deltas: {} },
  { id: 'age-5-7', label: { pt: '5 a 7 anos', en: '5 to 7 years', es: '5 a 7 años' }, deltas: {} },
  {
    id: 'age-8-10',
    label: { pt: '8 a 10 anos', en: '8 to 10 years', es: '8 a 10 años' },
    deltas: {},
  },
  {
    id: 'age-11-plus',
    label: { pt: '11 anos ou mais', en: '11+ years', es: '11 años o más' },
    deltas: {},
  },
]

export const fearReactionOptions: QuestionOption[] = [
  {
    id: 'fear-cry-cling',
    label: {
      pt: 'Chora ou se agarra a alguém de confiança',
      en: 'Cries or clings to someone they trust',
      es: 'Llora o se aferra a alguien de confianza',
    },
    deltas: { fear: 2 },
  },
  {
    id: 'fear-freeze',
    label: {
      pt: 'Fica paralisado(a) e quieto(a)',
      en: 'Freezes and goes quiet',
      es: 'Se queda paralizado(a) y callado(a)',
    },
    deltas: { fear: 2, loneliness: 1 },
  },
  {
    id: 'fear-brave-face',
    label: {
      pt: 'Tenta parecer corajoso(a), mas evita o assunto depois',
      en: 'Tries to act brave, but avoids the topic afterward',
      es: 'Intenta parecer valiente, pero evita el tema después',
    },
    deltas: { fear: 1, truth: 1 },
  },
  {
    id: 'fear-ask-questions',
    label: {
      pt: 'Pergunta muito sobre o que aconteceu, querendo entender',
      en: 'Asks a lot of questions about what happened, wanting to understand',
      es: 'Pregunta mucho sobre lo que pasó, queriendo entender',
    },
    deltas: { fear: 1, patience: 1 },
  },
]

export const wantingReactionOptions: QuestionOption[] = [
  {
    id: 'want-angry',
    label: {
      pt: 'Fica com raiva e reclama bastante',
      en: 'Gets angry and complains a lot',
      es: 'Se enoja y se queja bastante',
    },
    deltas: { anger: 2, desire: 1 },
  },
  {
    id: 'want-sad',
    label: {
      pt: 'Fica triste e desanima fácil',
      en: 'Gets sad and discouraged easily',
      es: 'Se pone triste y se desanima fácilmente',
    },
    deltas: { sadness: 2, desire: 1 },
  },
  {
    id: 'want-persist',
    label: {
      pt: 'Insiste e tenta de outro jeito',
      en: 'Keeps trying a different way',
      es: 'Insiste y lo intenta de otra manera',
    },
    deltas: { desire: 2, patience: 1 },
  },
  {
    id: 'want-move-on',
    label: {
      pt: 'Aceita rápido e segue pra outra coisa',
      en: 'Accepts it quickly and moves on',
      es: 'Lo acepta rápido y sigue con otra cosa',
    },
    deltas: { patience: 2 },
  },
]

export const sharingReactionOptions: QuestionOption[] = [
  {
    id: 'share-fight-back',
    label: {
      pt: 'Briga ou tenta pegar de volta na hora',
      en: 'Fights or tries to grab it back right away',
      es: 'Pelea o intenta recuperarlo de inmediato',
    },
    deltas: { conflict: 2, anger: 1 },
  },
  {
    id: 'share-jealous',
    label: {
      pt: 'Fica com ciúme e não larga do assunto',
      en: "Gets jealous and won't let it go",
      es: 'Se pone celoso(a) y no suelta el tema',
    },
    deltas: { jealousy: 2, conflict: 1 },
  },
  {
    id: 'share-tell-adult',
    label: {
      pt: 'Avisa um adulto e espera ajuda',
      en: 'Tells an adult and waits for help',
      es: 'Avisa a un adulto y espera ayuda',
    },
    deltas: { conflict: 1, patience: 1 },
  },
  {
    id: 'share-let-go',
    label: {
      pt: 'Deixa pra lá, mesmo incomodado',
      en: 'Lets it go, even if still upset about it',
      es: 'Lo deja pasar, aunque le moleste',
    },
    deltas: { forgiveness: 1, sadness: 1 },
  },
]

export const mistakeReactionOptions: QuestionOption[] = [
  {
    id: 'mistake-tell-truth',
    label: {
      pt: 'Conta a verdade mesmo com medo da reação',
      en: 'Tells the truth even when afraid of the reaction',
      es: 'Dice la verdad aunque tema la reacción',
    },
    deltas: { truth: 2, guilt: 1 },
  },
  {
    id: 'mistake-hide',
    label: {
      pt: 'Tenta esconder ou negar',
      en: 'Tries to hide it or deny it',
      es: 'Intenta esconderlo o negarlo',
    },
    deltas: { guilt: 2, fear: 1 },
  },
  {
    id: 'mistake-hard-on-self',
    label: {
      pt: 'Fica muito chateado(a) consigo mesmo(a)',
      en: 'Gets very hard on themself',
      es: 'Se pone muy duro(a) consigo mismo(a)',
    },
    deltas: { guilt: 2, sadness: 1 },
  },
  {
    id: 'mistake-quick-sorry',
    label: {
      pt: 'Pede desculpa rápido, sem parecer muito afetado(a)',
      en: 'Says sorry quickly, without seeming very affected',
      es: 'Pide perdón rápido, sin parecer muy afectado(a)',
    },
    deltas: { truth: 1, forgiveness: 1 },
  },
]

export const waitingReactionOptions: QuestionOption[] = [
  {
    id: 'wait-impatient',
    label: {
      pt: 'Fica impaciente e insiste bastante',
      en: 'Gets impatient and pushes hard',
      es: 'Se impacienta e insiste bastante',
    },
    deltas: { patience: 2 },
  },
  {
    id: 'wait-cry',
    label: {
      pt: 'Chora ou fica triste',
      en: 'Cries or gets sad',
      es: 'Llora o se pone triste',
    },
    deltas: { sadness: 1, patience: 1 },
  },
  {
    id: 'wait-negotiate',
    label: {
      pt: 'Tenta negociar ou entender o motivo',
      en: 'Tries to negotiate or understand why',
      es: 'Intenta negociar o entender el motivo',
    },
    deltas: { patience: 1, truth: 1 },
  },
  {
    id: 'wait-accept',
    label: {
      pt: 'Aceita bem, sem grande resistência',
      en: 'Accepts it well, without much resistance',
      es: 'Lo acepta bien, sin mucha resistencia',
    },
    deltas: {},
  },
]

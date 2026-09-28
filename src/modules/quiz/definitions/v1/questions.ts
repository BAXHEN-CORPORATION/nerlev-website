import type { Question, QuestionOption } from '../../domain'
import {
  ageOptions,
  fearReactionOptions,
  mistakeReactionOptions,
  sharingReactionOptions,
  waitingReactionOptions,
  wantingReactionOptions,
} from './options'
import { themes } from './themes'

// V1 — os 7 prompts são literais da spec §8.2. Q1 é demográfica (não pontua). Q2-Q6 são
// comportamentais. Q7 é escolha direta de área — gerada a partir de `themes` (uma opção
// por tema canônico), com delta forte (+3): sinal explícito do pai pesa mais que
// inferência comportamental.
const preferenceOptions: QuestionOption[] = themes.map((theme) => ({
  id: `prefer-${theme.id}`,
  label: theme.label,
  deltas: { [theme.id]: 3 },
}))

export const questions: Question[] = [
  {
    id: 'q1-age',
    kind: 'demographic',
    prompt: {
      pt: 'Qual é a idade da criança?',
      en: 'How old is your child?',
      es: '¿Qué edad tiene el niño o la niña?',
    },
    options: ageOptions,
  },
  {
    id: 'q2-fear-reaction',
    kind: 'behavioral',
    prompt: {
      pt: 'Quando alguma coisa assusta seu filho, como ele costuma reagir?',
      en: 'When something scares your child, how do they usually react?',
      es: 'Cuando algo asusta a tu hijo, ¿cómo suele reaccionar?',
    },
    options: fearReactionOptions,
  },
  {
    id: 'q3-wanting-reaction',
    kind: 'behavioral',
    prompt: {
      pt: 'Quando ele não consegue algo que queria, como reage?',
      en: "When they can't get something they wanted, how do they react?",
      es: 'Cuando no consigue algo que quería, ¿cómo reacciona?',
    },
    options: wantingReactionOptions,
  },
  {
    id: 'q4-sharing-reaction',
    kind: 'behavioral',
    prompt: {
      pt: 'Como reage quando outra criança pega algo dele?',
      en: 'How do they react when another child takes something of theirs?',
      es: '¿Cómo reacciona cuando otro niño le quita algo?',
    },
    options: sharingReactionOptions,
  },
  {
    id: 'q5-mistake-reaction',
    kind: 'behavioral',
    prompt: {
      pt: 'Como reage quando percebe que fez algo errado?',
      en: 'How do they react when they realize they did something wrong?',
      es: '¿Cómo reacciona cuando se da cuenta de que hizo algo mal?',
    },
    options: mistakeReactionOptions,
  },
  {
    id: 'q6-waiting-reaction',
    kind: 'behavioral',
    prompt: {
      pt: "Como reage quando precisa esperar ou aceitar um 'não'?",
      en: "How do they react when they need to wait or accept a 'no'?",
      es: "¿Cómo reacciona cuando necesita esperar o aceptar un 'no'?",
    },
    options: waitingReactionOptions,
  },
  {
    id: 'q7-preference',
    kind: 'preference',
    prompt: {
      pt: 'Qual área você gostaria especialmente de ajudá-lo a desenvolver?',
      en: 'Which area would you especially like to help them develop?',
      es: '¿Qué área te gustaría especialmente ayudarle a desarrollar?',
    },
    options: preferenceOptions,
  },
]

export function getQuestionById(id: string) {
  return questions.find((question) => question.id === id)
}

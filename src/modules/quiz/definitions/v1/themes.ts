import type { Theme } from '../../domain'

// V1 — primeira versão do conteúdo de cada tema (explicação + dicas). Tom não-clínico
// (spec §3.4-3.5): descreve comportamento observado, nunca diagnostica. Sujeito a
// iteração — mudanças de conteúdo aqui não precisam de nova ScoringStrategy version,
// só mudanças na lógica de pontuação precisam (spec §10).
export const themes: Theme[] = [
  {
    id: 'fear',
    label: { pt: 'Medo', en: 'Fear', es: 'Miedo' },
    explanation: {
      pt: 'Seu filho tem demonstrado medo diante de situações novas ou desconhecidas — isso é uma parte normal do crescimento.',
      en: "Your child has been showing fear in new or unfamiliar situations — that's a normal part of growing up.",
      es: 'Tu hijo ha mostrado miedo ante situaciones nuevas o desconocidas — eso es parte normal de crecer.',
    },
    tips: [
      {
        pt: "Valide o medo antes de tentar resolvê-lo: 'Eu entendo que isso assusta.'",
        en: "Validate the fear before trying to fix it: 'I understand this feels scary.'",
        es: "Valida el miedo antes de intentar resolverlo: 'Entiendo que esto da miedo.'",
      },
      {
        pt: 'Converse sobre um momento em que vocês superaram um medo juntos.',
        en: 'Talk about a time you overcame a fear together.',
        es: 'Habla sobre un momento en que superaron un miedo juntos.',
      },
    ],
  },
  {
    id: 'anger',
    label: { pt: 'Raiva', en: 'Anger', es: 'Enojo' },
    explanation: {
      pt: 'Seu filho tem reagido com raiva quando as coisas não saem como esperava.',
      en: "Your child has been reacting with anger when things don't go as expected.",
      es: 'Tu hijo ha reaccionado con enojo cuando las cosas no salen como esperaba.',
    },
    tips: [
      {
        pt: "Ajude a nomear o sentimento: 'Percebo que você está com raiva.'",
        en: "Help name the feeling: 'I can see you're angry.'",
        es: "Ayuda a nombrar el sentimiento: 'Veo que estás enojado.'",
      },
      {
        pt: 'Ofereça uma forma segura de descarregar a raiva antes de conversar sobre o que aconteceu.',
        en: 'Offer a safe way to release the anger before talking about what happened.',
        es: 'Ofrece una forma segura de liberar el enojo antes de hablar sobre lo ocurrido.',
      },
    ],
  },
  {
    id: 'sadness',
    label: { pt: 'Tristeza', en: 'Sadness', es: 'Tristeza' },
    explanation: {
      pt: 'Seu filho tem mostrado tristeza com mais frequência ultimamente.',
      en: 'Your child has been showing sadness more often lately.',
      es: 'Tu hijo ha mostrado tristeza con más frecuencia últimamente.',
    },
    tips: [
      {
        pt: 'Esteja presente sem tentar consertar o sentimento na hora.',
        en: 'Be present without rushing to fix the feeling.',
        es: 'Está presente sin intentar arreglar el sentimiento de inmediato.',
      },
      {
        pt: 'Pergunte o que ajudaria ele a se sentir melhor, mesmo que a resposta seja simples.',
        en: 'Ask what would help them feel better, even if the answer is simple.',
        es: 'Pregunta qué le ayudaría a sentirse mejor, aunque la respuesta sea simple.',
      },
    ],
  },
  {
    id: 'longing',
    label: { pt: 'Saudade', en: 'Longing', es: 'Nostalgia' },
    explanation: {
      pt: 'Seu filho tem demonstrado saudade de pessoas, lugares ou momentos importantes.',
      en: 'Your child has been missing people, places, or moments that matter to them.',
      es: 'Tu hijo ha extrañado a personas, lugares o momentos importantes.',
    },
    tips: [
      {
        pt: 'Fale sobre a pessoa ou momento com carinho, sem evitar o assunto.',
        en: 'Talk about the person or moment warmly, instead of avoiding it.',
        es: 'Habla de la persona o momento con cariño, sin evitar el tema.',
      },
      {
        pt: 'Crie um jeito de manter a conexão viva, como uma ligação ou uma lembrança guardada.',
        en: 'Find a way to keep the connection alive, like a call or a kept memory.',
        es: 'Busca una forma de mantener viva la conexión, como una llamada o un recuerdo guardado.',
      },
    ],
  },
  {
    id: 'jealousy',
    label: { pt: 'Ciúme', en: 'Jealousy', es: 'Celos' },
    explanation: {
      pt: 'Seu filho tem demonstrado ciúme em relação a irmãos, amigos ou atenção dividida.',
      en: 'Your child has been showing jealousy over siblings, friends, or divided attention.',
      es: 'Tu hijo ha mostrado celos por hermanos, amigos o atención dividida.',
    },
    tips: [
      {
        pt: 'Reserve um tempo individual só para ele, sem distrações.',
        en: 'Set aside one-on-one time with no distractions.',
        es: 'Reserva un tiempo individual sin distracciones.',
      },
      {
        pt: "Ajude a nomear o ciúme sem julgamento: 'Faz sentido você querer atenção também.'",
        en: "Name the jealousy without judgment: 'It makes sense you want attention too.'",
        es: "Nombra los celos sin juzgar: 'Tiene sentido que también quieras atención.'",
      },
    ],
  },
  {
    id: 'patience',
    label: { pt: 'Paciência', en: 'Patience', es: 'Paciencia' },
    explanation: {
      pt: "Seu filho tem tido dificuldade em esperar ou aceitar um 'não'.",
      en: "Your child has had a hard time waiting or accepting a 'no'.",
      es: "Tu hijo ha tenido dificultad para esperar o aceptar un 'no'.",
    },
    tips: [
      {
        pt: 'Pratique esperas curtas antes de pedir esperas longas.',
        en: 'Practice short waits before asking for longer ones.',
        es: 'Practica esperas cortas antes de pedir esperas largas.',
      },
      {
        pt: 'Elogie especificamente quando ele conseguir esperar, mesmo que por pouco tempo.',
        en: 'Praise specifically when they manage to wait, even briefly.',
        es: 'Elogia específicamente cuando logre esperar, aunque sea poco tiempo.',
      },
    ],
  },
  {
    id: 'desire',
    label: { pt: 'Desejo', en: 'Desire', es: 'Deseo' },
    explanation: {
      pt: 'Seu filho tem demonstrado forte desejo por coisas que nem sempre pode ter.',
      en: "Your child has shown strong wanting for things they can't always have.",
      es: 'Tu hijo ha mostrado un deseo fuerte por cosas que no siempre puede tener.',
    },
    tips: [
      {
        pt: "Ajude a diferenciar 'eu quero' de 'eu preciso' em conversas simples.",
        en: "Help tell apart 'I want' from 'I need' in simple conversations.",
        es: "Ayuda a diferenciar 'quiero' de 'necesito' en conversaciones simples.",
      },
      {
        pt: "Reconheça o desejo antes de explicar o limite: 'Eu vejo que você quer muito isso.'",
        en: "Acknowledge the desire before explaining the limit: 'I can see you really want this.'",
        es: "Reconoce el deseo antes de explicar el límite: 'Veo que quieres mucho esto.'",
      },
    ],
  },
  {
    id: 'guilt',
    label: { pt: 'Culpa', en: 'Guilt', es: 'Culpa' },
    explanation: {
      pt: 'Seu filho tem demonstrado culpa forte quando percebe que errou.',
      en: 'Your child has shown strong guilt when they realize they did something wrong.',
      es: 'Tu hijo ha mostrado culpa fuerte al darse cuenta de que se equivocó.',
    },
    tips: [
      {
        pt: "Separe o erro da identidade: 'Você errou, isso não te faz uma pessoa má.'",
        en: "Separate the mistake from identity: 'You made a mistake — that doesn't make you a bad person.'",
        es: "Separa el error de la identidad: 'Te equivocaste, eso no te hace una mala persona.'",
      },
      {
        pt: 'Modele como pedir desculpa e seguir em frente, sem ficar remoendo.',
        en: 'Model how to apologize and move on, without dwelling on it.',
        es: 'Modela cómo pedir disculpas y seguir adelante, sin quedarse dando vueltas.',
      },
    ],
  },
  {
    id: 'truth',
    label: { pt: 'Verdade', en: 'Truth', es: 'Verdad' },
    explanation: {
      pt: 'Seu filho tem tido dificuldade em contar a verdade quando teme a reação.',
      en: 'Your child has had a hard time telling the truth when afraid of the reaction.',
      es: 'Tu hijo ha tenido dificultad para decir la verdad cuando teme la reacción.',
    },
    tips: [
      {
        pt: 'Reaja com calma quando ele disser a verdade, mesmo que seja difícil de ouvir.',
        en: "Stay calm when they tell the truth, even if it's hard to hear.",
        es: 'Reacciona con calma cuando diga la verdad, aunque sea difícil de escuchar.',
      },
      {
        pt: 'Valorize a honestidade em voz alta, mais do que o comportamento em si.',
        en: 'Praise honesty out loud, more than the behavior itself.',
        es: 'Valora la honestidad en voz alta, más que el comportamiento en sí.',
      },
    ],
  },
  {
    id: 'conflict',
    label: { pt: 'Conflito', en: 'Conflict', es: 'Conflicto' },
    explanation: {
      pt: 'Seu filho tem enfrentado conflitos com outras crianças com frequência.',
      en: 'Your child has been facing conflict with other children often.',
      es: 'Tu hijo ha enfrentado conflictos con otros niños con frecuencia.',
    },
    tips: [
      {
        pt: "Ensine frases simples para resolver conflitos: 'Posso brincar também?'",
        en: "Teach simple phrases to resolve conflict: 'Can I play too?'",
        es: "Enseña frases simples para resolver conflictos: '¿Puedo jugar también?'",
      },
      {
        pt: 'Ajude a pensar em soluções junto, em vez de resolver por ele.',
        en: 'Help think through solutions together, instead of solving it for them.',
        es: 'Ayuda a pensar soluciones juntos, en vez de resolverlo por él.',
      },
    ],
  },
  {
    id: 'forgiveness',
    label: { pt: 'Perdão', en: 'Forgiveness', es: 'Perdón' },
    explanation: {
      pt: 'Seu filho tem tido dificuldade em perdoar ou seguir em frente após uma mágoa.',
      en: 'Your child has had a hard time forgiving or moving on after being hurt.',
      es: 'Tu hijo ha tenido dificultad para perdonar o seguir adelante después de una herida.',
    },
    tips: [
      {
        pt: 'Explique perdão como uma escolha, não como esquecer o que aconteceu.',
        en: 'Explain forgiveness as a choice, not as forgetting what happened.',
        es: 'Explica el perdón como una elección, no como olvidar lo ocurrido.',
      },
      {
        pt: 'Compartilhe um exemplo simples de quando você perdoou alguém.',
        en: 'Share a simple example of when you forgave someone.',
        es: 'Comparte un ejemplo simple de cuando tú perdonaste a alguien.',
      },
    ],
  },
  {
    id: 'loneliness',
    label: { pt: 'Solidão', en: 'Loneliness', es: 'Soledad' },
    explanation: {
      pt: 'Seu filho tem demonstrado sinais de solidão ou dificuldade em se conectar.',
      en: 'Your child has shown signs of loneliness or difficulty connecting.',
      es: 'Tu hijo ha mostrado señales de soledad o dificultad para conectar.',
    },
    tips: [
      {
        pt: 'Pergunte sobre os momentos do dia em que ele se sentiu mais sozinho.',
        en: 'Ask about the parts of the day they felt most alone.',
        es: 'Pregunta sobre los momentos del día en que se sintió más solo.',
      },
      {
        pt: 'Busque pequenas oportunidades de conexão em família, mesmo que breves.',
        en: 'Look for small chances to connect as a family, even brief ones.',
        es: 'Busca pequeñas oportunidades de conexión en familia, aunque sean breves.',
      },
    ],
  },
]

export function getThemeById(id: string) {
  return themes.find((theme) => theme.id === id)
}

// State machine states per spec §30, extended in T3 with an open-questions step (§8.3)
// between the last structured question and completion:
// idle → starting → question → saving → question → openQuestions → completing → result.
export type QuizState =
  | { status: 'idle' }
  | { status: 'starting' }
  | { status: 'question'; sessionId: string; questionIndex: number }
  | { status: 'saving'; sessionId: string; questionIndex: number }
  | { status: 'openQuestions'; sessionId: string }
  | { status: 'completing'; sessionId: string }
  | { status: 'result'; sessionId: string }
  | { status: 'error'; message: string }

export type QuizAction =
  | { type: 'START_REQUESTED' }
  | { type: 'START_SUCCEEDED'; sessionId: string }
  | { type: 'ANSWER_SUBMITTED' }
  | { type: 'ANSWER_SAVED'; hasNext: boolean }
  | { type: 'OPEN_QUESTIONS_SUBMITTED' }
  | { type: 'COMPLETE_SUCCEEDED' }
  | { type: 'FAILED'; message: string }

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'START_REQUESTED':
      return { status: 'starting' }

    case 'START_SUCCEEDED':
      return { status: 'question', sessionId: action.sessionId, questionIndex: 0 }

    case 'ANSWER_SUBMITTED':
      if (state.status !== 'question') return state
      return { status: 'saving', sessionId: state.sessionId, questionIndex: state.questionIndex }

    case 'ANSWER_SAVED':
      if (state.status !== 'saving') return state
      if (!action.hasNext) return { status: 'openQuestions', sessionId: state.sessionId }
      return {
        status: 'question',
        sessionId: state.sessionId,
        questionIndex: state.questionIndex + 1,
      }

    case 'OPEN_QUESTIONS_SUBMITTED':
      if (state.status !== 'openQuestions') return state
      return { status: 'completing', sessionId: state.sessionId }

    case 'COMPLETE_SUCCEEDED':
      if (state.status !== 'completing') return state
      return { status: 'result', sessionId: state.sessionId }

    case 'FAILED':
      return { status: 'error', message: action.message }

    default:
      return state
  }
}

export const initialQuizState: QuizState = { status: 'idle' }

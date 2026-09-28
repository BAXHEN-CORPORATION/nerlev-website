// modules/catalog/domain — livros, edicoes, links de loja (Amazon)
// Regra de dependencia: Regras de negocio e tipos puros do modulo. Nao importa de application/infrastructure/ui.
export type { Book, BookCover, LocalizedText } from './book'
export { books } from './books'

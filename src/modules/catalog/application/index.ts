// modules/catalog/application — casos de uso do catalogo
// Regra de dependencia: Casos de uso, orquestra domain + interfaces de repository. Nao importa de infrastructure/ui.
export { listBooks } from './list-books'
export { getBookBySlug } from './get-book'

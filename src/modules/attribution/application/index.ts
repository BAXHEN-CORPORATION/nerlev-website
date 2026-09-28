// modules/attribution/application — caso de uso: registrar clique no redirect da Amazon
// Regra de dependencia: Casos de uso, orquestra domain + interfaces de repository. Nao importa de infrastructure/ui.
export type { AmazonClickRepository } from './amazon-click-repository'
export { logAmazonClick } from './log-amazon-click'

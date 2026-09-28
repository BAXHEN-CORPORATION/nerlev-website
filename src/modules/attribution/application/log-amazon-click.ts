import type { AmazonClickInput } from '../domain'
import type { AmazonClickRepository } from './amazon-click-repository'

export async function logAmazonClick(repository: AmazonClickRepository, input: AmazonClickInput) {
  await repository.logClick(input)
}

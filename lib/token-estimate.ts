// Rough token estimator: ~4 chars per token (GPT/Claude approximation)
export const estimateTokens = (text: string): number =>
  Math.ceil(text.length / 4)

export const formatTokens = (n: number): string =>
  n.toLocaleString()

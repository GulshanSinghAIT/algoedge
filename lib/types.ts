export type OptionStrategyType = "long_call" | "long_put" | "short_call" | "short_put"

export interface OptionStrategy {
  type: OptionStrategyType
  strikePrice: number
  premium: number
  expiryDays: number
  quantity: number
  underlyingPrice: number
  volatility: number
  interestRate: number
}

export interface OptionMetrics {
  delta: number
  gamma: number
  theta: number
  vega: number
  rho: number
  theoreticalPrice: number
}

import type { OptionMetrics, OptionStrategy } from "./types"

// Normal distribution function for Black-Scholes
function normalCDF(x: number): number {
  const a1 = 0.254829592
  const a2 = -0.284496736
  const a3 = 1.421413741
  const a4 = -1.453152027
  const a5 = 1.061405429
  const p = 0.3275911

  const sign = x < 0 ? -1 : 1
  x = Math.abs(x) / Math.sqrt(2)

  const t = 1.0 / (1.0 + p * x)
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)

  return 0.5 * (1.0 + sign * y)
}

// Normal probability density function
function normalPDF(x: number): number {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI)
}

// Black-Scholes option pricing model
export function calculateOptionMetrics(strategy: OptionStrategy): OptionMetrics {
  const { type, strikePrice: K, underlyingPrice: S, expiryDays, volatility: sigma, interestRate: r } = strategy

  // Convert days to years
  const T = expiryDays / 365

  // Calculate d1 and d2
  const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T))
  const d2 = d1 - sigma * Math.sqrt(T)

  // Calculate option price and Greeks based on option type
  let delta, gamma, theta, vega, rho, price

  const isCall = type === "long_call" || type === "short_call"
  const isLong = type === "long_call" || type === "long_put"

  if (isCall) {
    // Call option
    price = S * normalCDF(d1) - K * Math.exp(-r * T) * normalCDF(d2)
    delta = normalCDF(d1)
    rho = (K * T * Math.exp(-r * T) * normalCDF(d2)) / 100
  } else {
    // Put option
    price = K * Math.exp(-r * T) * normalCDF(-d2) - S * normalCDF(-d1)
    delta = normalCDF(d1) - 1
    rho = (-K * T * Math.exp(-r * T) * normalCDF(-d2)) / 100
  }

  // Common Greeks for both call and put
  gamma = normalPDF(d1) / (S * sigma * Math.sqrt(T))
  vega = (S * Math.sqrt(T) * normalPDF(d1)) / 100

  // Theta calculation (per day)
  const term1 = -(S * sigma * normalPDF(d1)) / (2 * Math.sqrt(T))
  const term2 = r * K * Math.exp(-r * T)

  if (isCall) {
    theta = (term1 - term2 * normalCDF(d2)) / 365
  } else {
    theta = (term1 + term2 * normalCDF(-d2)) / 365
  }

  // Adjust signs for short positions
  if (!isLong) {
    delta = -delta
    gamma = -gamma
    theta = -theta
    vega = -vega
    rho = -rho
  }

  return {
    delta,
    gamma,
    theta,
    vega,
    rho,
    theoreticalPrice: price,
  }
}

// Calculate P&L at a given price
export function calculatePnLAtPrice(strategy: OptionStrategy, price: number): number {
  const { type, strikePrice, premium, quantity } = strategy
  let pnl = 0

  // Calculate intrinsic value at expiration
  if (type === "long_call") {
    pnl = Math.max(0, price - strikePrice) - premium
  } else if (type === "long_put") {
    pnl = Math.max(0, strikePrice - price) - premium
  } else if (type === "short_call") {
    pnl = premium - Math.max(0, price - strikePrice)
  } else if (type === "short_put") {
    pnl = premium - Math.max(0, strikePrice - price)
  }

  // Multiply by quantity and contract size (100 shares per contract)
  return pnl * quantity * 100
}

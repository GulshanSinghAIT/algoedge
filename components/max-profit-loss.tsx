import type { OptionMetrics, OptionStrategy } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Scale } from "lucide-react"

interface MaxProfitLossProps {
  metrics: OptionMetrics
  strategy: OptionStrategy
}

export default function MaxProfitLoss({ metrics, strategy }: MaxProfitLossProps) {
  // Calculate max profit and loss based on strategy type
  const calculateMaxValues = () => {
    const { type, premium, quantity } = strategy

    if (type === "long_call" || type === "long_put") {
      return {
        maxLoss: premium * 100 * quantity,
        maxProfit: type === "long_call" ? "Unlimited" : premium * 100 * quantity,
      }
    } else {
      // Short positions
      return {
        maxLoss: type === "short_call" ? "Unlimited" : premium * 100 * quantity,
        maxProfit: premium * 100 * quantity,
      }
    }
  }

  const { maxProfit, maxLoss } = calculateMaxValues()

  // Calculate current P&L
  const currentPnL = metrics.theoreticalPrice * 100 * strategy.quantity - strategy.premium * 100 * strategy.quantity

  // Calculate risk/reward ratio
  const riskReward =
    typeof maxProfit === "string" ? "∞" : (maxProfit / (typeof maxLoss === "string" ? 1 : maxLoss)).toFixed(2)

  // Calculate progress percentage for the progress bar
  const progressPercentage =
    typeof maxLoss === "string"
      ? currentPnL > 0
        ? 75
        : 25
      : Math.min(Math.max(50 + (currentPnL / (maxLoss as number)) * 50, 0), 100)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-emerald-100">
          <CardContent className="p-4 bg-emerald-50">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-5 w-5 mr-2 text-emerald-500" />
              <h3 className="text-sm font-medium text-slate-700">Max Profit</h3>
            </div>
            <div className="text-2xl font-bold text-emerald-500">
              {typeof maxProfit === "string" ? maxProfit : `$${maxProfit.toFixed(2)}`}
            </div>
          </CardContent>
        </Card>

        <Card className="border-rose-100">
          <CardContent className="p-4 bg-rose-50">
            <div className="flex items-center mb-2">
              <TrendingDown className="h-5 w-5 mr-2 text-rose-500" />
              <h3 className="text-sm font-medium text-slate-700">Max Loss</h3>
            </div>
            <div className="text-2xl font-bold text-rose-500">
              {typeof maxLoss === "string" ? maxLoss : `$${maxLoss.toFixed(2)}`}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-700">Current P&L</h3>
            <span className={`text-sm font-medium ${currentPnL >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
              ${currentPnL.toFixed(2)}
            </span>
          </div>
          <Progress
            value={progressPercentage}
            className="h-2"
            indicatorClassName={currentPnL >= 0 ? "bg-emerald-500" : "bg-rose-500"}
          />
        </CardContent>
      </Card>

      <Card className="border-blue-100">
        <CardContent className="p-4 bg-blue-50">
          <div className="flex items-center mb-2">
            <Scale className="h-5 w-5 mr-2 text-blue-500" />
            <h3 className="text-sm font-medium text-slate-700">Risk/Reward Ratio</h3>
          </div>
          <div className="text-xl font-bold text-blue-500">{riskReward}</div>
          <p className="text-xs text-slate-500 mt-1">
            {riskReward === "∞"
              ? "Unlimited profit potential"
              : `For every $1 risked, potential return is $${riskReward}`}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

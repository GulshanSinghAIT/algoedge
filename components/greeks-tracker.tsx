import { Card, CardContent } from "@/components/ui/card"
import type { OptionMetrics } from "@/lib/types"
import { TrendingUp, TrendingDown, Clock, BarChart2, Percent } from "lucide-react"

interface GreeksTrackerProps {
  metrics: OptionMetrics
}

export default function GreeksTracker({ metrics }: GreeksTrackerProps) {
  const greeks = [
    {
      name: "Delta",
      value: metrics.delta.toFixed(4),
      description: "Rate of change of option price with respect to underlying price",
      icon: TrendingUp,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-100",
    },
    {
      name: "Gamma",
      value: metrics.gamma.toFixed(4),
      description: "Rate of change of delta with respect to underlying price",
      icon: TrendingDown,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100",
    },
    {
      name: "Theta",
      value: metrics.theta.toFixed(4),
      description: "Rate of change of option price with respect to time",
      icon: Clock,
      color: "text-amber-500",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-100",
    },
    {
      name: "Vega",
      value: metrics.vega.toFixed(4),
      description: "Rate of change of option price with respect to volatility",
      icon: BarChart2,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-100",
    },
    {
      name: "Rho",
      value: metrics.rho.toFixed(4),
      description: "Rate of change of option price with respect to interest rate",
      icon: Percent,
      color: "text-indigo-500",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-100",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {greeks.map((greek) => (
        <Card key={greek.name} className={`overflow-hidden border ${greek.borderColor}`}>
          <CardContent className={`p-4 ${greek.bgColor}`}>
            <div className="flex items-center mb-2">
              <greek.icon className={`h-5 w-5 mr-2 ${greek.color}`} />
              <span className="text-sm font-medium text-slate-700">{greek.name}</span>
            </div>
            <span className={`text-2xl font-bold ${greek.color}`}>{greek.value}</span>
            <span className="text-xs text-slate-500 mt-1 block">{greek.description}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

"use client"

import type { OptionStrategy } from "@/lib/types"
import { calculatePnLAtPrice } from "@/lib/option-calculations"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"

interface PnLChartProps {
  strategy: OptionStrategy
}

export default function PnLChart({ strategy }: PnLChartProps) {
  // Generate price points for the chart
  const generatePricePoints = () => {
    const { underlyingPrice, strikePrice } = strategy
    const range = Math.max(underlyingPrice * 0.3, 30)
    const minPrice = Math.max(underlyingPrice - range, 1)
    const maxPrice = underlyingPrice + range
    const step = range / 20

    const points = []
    for (let price = minPrice; price <= maxPrice; price += step) {
      points.push({
        price: Number.parseFloat(price.toFixed(2)),
        pnl: calculatePnLAtPrice(strategy, price),
      })
    }
    return points
  }

  const data = generatePricePoints()
  const breakeven =
    strategy.type === "long_call" ? strategy.strikePrice + strategy.premium : strategy.strikePrice - strategy.premium

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-slate-800">Profit & Loss Chart</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
            <span className="text-sm text-slate-600">P&L</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-rose-500 rounded-full mr-2"></div>
            <span className="text-sm text-slate-600">Breakeven</span>
          </div>
        </div>
      </div>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 10,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="price"
              tickFormatter={(value) => `$${value}`}
              label={{ value: "Stock Price", position: "insideBottom", offset: -10 }}
            />
            <YAxis
              tickFormatter={(value) => `$${value}`}
              label={{ value: "Profit/Loss", angle: -90, position: "insideLeft" }}
            />
            <Tooltip
              formatter={(value: number) => [`$${value.toFixed(2)}`, "P&L"]}
              labelFormatter={(value) => `Price: $${value}`}
              contentStyle={{ backgroundColor: "white", borderRadius: "0.375rem", border: "1px solid #e2e8f0" }}
            />
            <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={1} />
            <ReferenceLine x={breakeven} stroke="#f43f5e" strokeWidth={1} strokeDasharray="5 5" />
            <Line
              type="monotone"
              dataKey="pnl"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2, fill: "white" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4">
        <p className="text-sm text-slate-600">
          Breakeven at <span className="font-medium text-slate-800">${breakeven.toFixed(2)}</span>
        </p>
      </div>
    </div>
  )
}

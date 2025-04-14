"use client"

import type { OptionStrategy } from "@/lib/types"
import { calculatePnLAtPrice } from "@/lib/option-calculations"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"

interface BreakevenZonesProps {
  strategy: OptionStrategy
}

export default function BreakevenZones({ strategy }: BreakevenZonesProps) {
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

  // Calculate breakeven point
  const breakeven =
    strategy.type === "long_call" ? strategy.strikePrice + strategy.premium : strategy.strikePrice - strategy.premium

  // Determine profit and loss zones
  const profitZone = strategy.type === "long_call" ? `Above $${breakeven.toFixed(2)}` : `Below $${breakeven.toFixed(2)}`

  const lossZone = strategy.type === "long_call" ? `Below $${breakeven.toFixed(2)}` : `Above $${breakeven.toFixed(2)}`

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-slate-800">Breakeven Zones</h3>
      </div>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
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
            <defs>
              <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="lossGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="pnl"
              stroke="#10b981"
              fillOpacity={1}
              fill="url(#profitGradient)"
              activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2, fill: "white" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-6">
        <div className="bg-emerald-50 p-4 rounded-md border border-emerald-100">
          <h4 className="text-sm font-medium text-emerald-700">Profit Zone</h4>
          <p className="text-sm text-emerald-600 mt-1">{profitZone}</p>
        </div>
        <div className="bg-rose-50 p-4 rounded-md border border-rose-100">
          <h4 className="text-sm font-medium text-rose-700">Loss Zone</h4>
          <p className="text-sm text-rose-600 mt-1">{lossZone}</p>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import GreeksTracker from "@/components/greeks-tracker"
import PnLChart from "@/components/pnl-chart"
import BreakevenZones from "@/components/breakeven-zones"
import MaxProfitLoss from "@/components/max-profit-loss"
import StockSelector from "@/components/stock-selector"
import type { OptionStrategy } from "@/lib/types"
import { calculateOptionMetrics } from "@/lib/option-calculations"

export default function Dashboard() {
  const [selectedStock, setSelectedStock] = useState("AAPL")
  const [strategy, setStrategy] = useState<OptionStrategy>({
    type: "long_call",
    strikePrice: 150,
    premium: 5,
    expiryDays: 30,
    quantity: 1,
    underlyingPrice: 145,
    volatility: 0.3,
    interestRate: 0.05,
  })

  const metrics = calculateOptionMetrics(strategy)

  return (
    <main className="flex min-h-screen flex-col bg-slate-50">
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-6 shadow-md">
        <h1 className="text-3xl font-bold tracking-tight">Options Trading Dashboard</h1>
        <p className="text-slate-200 mt-1">Track option Greeks and visualize profit/loss scenarios</p>
      </div>

      <div className="p-4 md:p-6 max-w-7xl mx-auto w-full">
        <StockSelector
          selectedStock={selectedStock}
          onSelectStock={setSelectedStock}
          strategy={strategy}
          onStrategyChange={setStrategy}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-100">
            <h2 className="text-xl font-semibold mb-4 text-slate-800">Live Greeks</h2>
            <GreeksTracker metrics={metrics} />
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-100">
            <h2 className="text-xl font-semibold mb-4 text-slate-800">Max Profit/Loss</h2>
            <MaxProfitLoss metrics={metrics} strategy={strategy} />
          </div>
        </div>

        <div className="mt-6">
          <Tabs defaultValue="pnl" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-2">
              <TabsTrigger value="pnl">PnL Chart</TabsTrigger>
              <TabsTrigger value="breakeven">Breakeven Zones</TabsTrigger>
            </TabsList>
            <TabsContent value="pnl" className="bg-white p-5 rounded-lg shadow-sm border border-slate-100">
              <PnLChart strategy={strategy} />
            </TabsContent>
            <TabsContent value="breakeven" className="bg-white p-5 rounded-lg shadow-sm border border-slate-100">
              <BreakevenZones strategy={strategy} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}

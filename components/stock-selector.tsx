"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { OptionStrategy } from "@/lib/types"

interface StockSelectorProps {
  selectedStock: string
  onSelectStock: (stock: string) => void
  strategy: OptionStrategy
  onStrategyChange: (strategy: OptionStrategy) => void
}

export default function StockSelector({
  selectedStock,
  onSelectStock,
  strategy,
  onStrategyChange,
}: StockSelectorProps) {
  const stocks = [
    { symbol: "AAPL", name: "Apple Inc.", price: 145.0 },
    { symbol: "MSFT", name: "Microsoft Corp.", price: 290.5 },
    { symbol: "GOOGL", name: "Alphabet Inc.", price: 135.75 },
    { symbol: "AMZN", name: "Amazon.com Inc.", price: 125.3 },
    { symbol: "TSLA", name: "Tesla Inc.", price: 240.2 },
  ]

  const handleStockChange = (value: string) => {
    onSelectStock(value)
    const stock = stocks.find((s) => s.symbol === value)
    if (stock) {
      onStrategyChange({
        ...strategy,
        underlyingPrice: stock.price,
        strikePrice: Math.round(stock.price),
      })
    }
  }

  const handleStrategyTypeChange = (value: string) => {
    onStrategyChange({
      ...strategy,
      type: value as OptionStrategy["type"],
    })
  }

  const handleInputChange = (field: keyof OptionStrategy, value: number) => {
    onStrategyChange({
      ...strategy,
      [field]: value,
    })
  }

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="pb-3 bg-slate-50 border-b border-slate-100">
        <CardTitle className="text-slate-800">Strategy Configuration</CardTitle>
        <CardDescription>Configure your options strategy and parameters</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="stock" className="text-slate-700">
                Select Stock
              </Label>
              <Select value={selectedStock} onValueChange={handleStockChange}>
                <SelectTrigger id="stock" className="bg-white border-slate-200">
                  <SelectValue placeholder="Select a stock" />
                </SelectTrigger>
                <SelectContent>
                  {stocks.map((stock) => (
                    <SelectItem key={stock.symbol} value={stock.symbol}>
                      {stock.symbol} - {stock.name} (${stock.price.toFixed(2)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="strategy" className="text-slate-700">
                Strategy Type
              </Label>
              <Tabs value={strategy.type} onValueChange={handleStrategyTypeChange} className="w-full">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger
                    value="long_call"
                    className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
                  >
                    Long Call
                  </TabsTrigger>
                  <TabsTrigger
                    value="long_put"
                    className="data-[state=active]:bg-rose-500 data-[state=active]:text-white"
                  >
                    Long Put
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-slate-700">
                Quantity (Contracts)
              </Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={strategy.quantity}
                onChange={(e) => handleInputChange("quantity", Number.parseInt(e.target.value) || 1)}
                className="bg-white border-slate-200"
              />
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="strikePrice" className="text-slate-700">
                  Strike Price
                </Label>
                <span className="text-sm font-medium text-slate-600">${strategy.strikePrice}</span>
              </div>
              <Slider
                id="strikePrice"
                min={Math.max(strategy.underlyingPrice * 0.7, 1)}
                max={strategy.underlyingPrice * 1.3}
                step={1}
                value={[strategy.strikePrice]}
                onValueChange={(values) => handleInputChange("strikePrice", values[0])}
                className="py-1"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>${Math.max(strategy.underlyingPrice * 0.7, 1).toFixed(0)}</span>
                <span>${(strategy.underlyingPrice * 1.3).toFixed(0)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="premium" className="text-slate-700">
                  Premium
                </Label>
                <span className="text-sm font-medium text-slate-600">${strategy.premium}</span>
              </div>
              <Slider
                id="premium"
                min={0.5}
                max={20}
                step={0.5}
                value={[strategy.premium]}
                onValueChange={(values) => handleInputChange("premium", values[0])}
                className="py-1"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>$0.50</span>
                <span>$20.00</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="expiryDays" className="text-slate-700">
                  Days to Expiry
                </Label>
                <span className="text-sm font-medium text-slate-600">{strategy.expiryDays} days</span>
              </div>
              <Slider
                id="expiryDays"
                min={1}
                max={90}
                step={1}
                value={[strategy.expiryDays]}
                onValueChange={(values) => handleInputChange("expiryDays", values[0])}
                className="py-1"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>1 day</span>
                <span>90 days</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="volatility" className="text-slate-700">
                  Implied Volatility
                </Label>
                <span className="text-sm font-medium text-slate-600">{(strategy.volatility * 100).toFixed(0)}%</span>
              </div>
              <Slider
                id="volatility"
                min={0.1}
                max={1}
                step={0.05}
                value={[strategy.volatility]}
                onValueChange={(values) => handleInputChange("volatility", values[0])}
                className="py-1"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>10%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

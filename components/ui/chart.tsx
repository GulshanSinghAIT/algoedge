import React from "react"
import {
  Area,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts"
import { cn } from "@/lib/utils"

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  data: any[]
  xAxisKey: string
  yAxisKey: string
  children: React.ReactNode
}

export const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ data, xAxisKey, yAxisKey, children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("w-full h-full", className)} {...props}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              dataKey={xAxisKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
              tickFormatter={(value) => `$${value}`}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
              tickFormatter={(value) => `$${value}`}
            />
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child, {
                  data,
                  xAxisKey,
                  yAxisKey,
                })
              }
              return child
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
  },
)
ChartContainer.displayName = "ChartContainer"

interface ChartXAxisProps {
  data?: any[]
  xAxisKey?: string
}

export const ChartXAxis: React.FC<ChartXAxisProps> = () => {
  // This is a placeholder component as XAxis is already included in ChartContainer
  return null
}

interface ChartYAxisProps {
  data?: any[]
  yAxisKey?: string
}

export const ChartYAxis: React.FC<ChartYAxisProps> = () => {
  // This is a placeholder component as YAxis is already included in ChartContainer
  return null
}

interface ChartAreaProps {
  className?: string
  data?: any[]
  xAxisKey?: string
  yAxisKey?: string
}

export const ChartArea: React.FC<ChartAreaProps> = ({ className, data, xAxisKey, yAxisKey }) => {
  if (!data || !xAxisKey || !yAxisKey) return null

  return (
    <Area
      type="monotone"
      dataKey={yAxisKey}
      stroke="#8884d8"
      fill={className?.includes("fill-") ? undefined : "#8884d8"}
      fillOpacity={0.2}
      className={className}
    />
  )
}

interface ChartLineProps {
  data?: any[]
  xAxisKey?: string
  yAxisKey?: string
  className?: string
  strokeWidth?: number
  curve?: string
  dataKey?: string
}

export const ChartLine: React.FC<ChartLineProps> = ({
  className,
  data,
  yAxisKey,
  strokeWidth = 2,
  curve = "monotone",
  dataKey,
}) => {
  if (!data) return null

  return (
    <Line
      type={curve as any}
      dataKey={dataKey || yAxisKey}
      stroke={className?.includes("stroke-") ? undefined : "#8884d8"}
      strokeWidth={strokeWidth}
      dot={false}
      className={className}
    />
  )
}

interface ChartTooltipProps {
  children: React.ReactNode
}

export const ChartTooltip: React.FC<ChartTooltipProps> = ({ children }) => {
  return (
    <RechartsTooltip
      content={({ active, payload }) => {
        if (active && payload && payload.length) {
          return React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child as React.ReactElement, {
                point: payload[0].payload,
              })
            }
            return child
          })
        }
        return null
      }}
    />
  )
}

interface ChartTooltipContentProps {
  content?: ({ point }: { point: any }) => React.ReactNode | null
  className?: string
  point?: any
}

export const ChartTooltipContent: React.FC<ChartTooltipContentProps> = ({ content, className, point }) => {
  if (!content || !point) return null

  return <div className={cn("bg-white p-2 border shadow-md rounded-md", className)}>{content({ point })}</div>
}

export const Chart = () => {
  return <div />
}


import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface LineChartProps {
  data: Array<{ date: string; value: number; [key: string]: any }>
  dataKey: string
  height?: number
  color?: string
}

export function SimpleLineChart({ data, dataKey, height = 300, color = "hsl(var(--primary))" }: LineChartProps) {
  if (!data || data.length === 0) return null

  const values = data.map((d) => d[dataKey])
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1

  const gridLines = 5
  const yStep = range / gridLines

  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * 100
      const y = 100 - ((d[dataKey] - min) / range) * 100
      return `${x},${y}`
    })
    .join(" ")

  return (
    <div className="w-full relative pl-12" style={{ height }}>
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        {/* Grid lines */}
        {Array.from({ length: gridLines + 1 }).map((_, i) => {
          const y = (i / gridLines) * 100
          return (
            <line
              key={i}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="currentColor"
              className="text-border/50"
              strokeWidth="0.3"
              vectorEffect="non-scaling-stroke"
            />
          )
        })}

        {/* Gradient definition */}
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <polyline
          fill="url(#chartGradient)"
          stroke="none"
          points={`0,100 ${points} 100,100`}
        />

        {/* Line stroke */}
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="1.2"
          points={points}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * 100
          const y = 100 - ((d[dataKey] - min) / range) * 100
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="1.5"
              fill={color}
              vectorEffect="non-scaling-stroke"
            />
          )
        })}
      </svg>

      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-muted-foreground w-10 text-right pr-2">
        {Array.from({ length: gridLines + 1 }).map((_, i) => {
          const value = max - i * yStep
          return <span key={i}>{value.toFixed(0)}%</span>
        })}
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between text-xs text-muted-foreground mt-3 px-1">
        <span>{data[0]?.date}</span>
        <span>{data[Math.floor(data.length / 2)]?.date}</span>
        <span>{data[data.length - 1]?.date}</span>
      </div>
    </div>
  )
}

interface BarChartProps {
  data: Array<{ name: string; value: number; [key: string]: any }>
  dataKey: string
  height?: number
  color?: string
  horizontal?: boolean
}

export function SimpleBarChart({
  data,
  dataKey,
  height = 300,
  color = "rgb(59, 130, 246)",
  horizontal = false,
}: BarChartProps) {
  if (!data || data.length === 0) return null

  const values = data.map((d) => d[dataKey])
  const max = Math.max(...values)

  if (horizontal) {
    return (
      <div className="space-y-3" style={{ height }}>
        {data.map((item, i) => {
          const percentage = (item[dataKey] / max) * 100
          return (
            <div key={i} className="flex items-center gap-3">
              <div className="w-24 text-sm text-foreground truncate">{item.name}</div>
              <div className="flex-1 bg-muted rounded-full h-8 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
              <div className="w-16 text-sm text-muted-foreground text-right">{item[dataKey].toFixed(1)}%</div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="w-full" style={{ height }}>
      <div className="flex items-end justify-around h-full gap-2 pb-8">
        {data.map((item, i) => {
          const percentage = (item[dataKey] / max) * 100
          return (
            <div key={i} className="flex flex-col items-center flex-1 h-full justify-end">
              <div className="text-xs text-muted-foreground mb-1">{item[dataKey]}</div>
              <div
                className="w-full rounded-t transition-all duration-500"
                style={{
                  height: `${percentage}%`,
                  backgroundColor: color,
                }}
              />
              <div className="text-xs text-muted-foreground mt-2 truncate w-full text-center">{item.name}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface StackedBarChartProps {
  data: Array<{ name: string; positive: number; neutral: number; negative: number }>
  height?: number
}

export function SimpleStackedBarChart({ data, height = 300 }: StackedBarChartProps) {
  if (!data || data.length === 0) return null

  return (
    <div className="space-y-4" style={{ height, overflow: 'auto' }}>
      {data.map((item, i) => {
        const total = 100 // Assuming the values are already percentages
        const positivePercent = item.positive
        const neutralPercent = item.neutral
        const negativePercent = item.negative

        return (
          <div key={i} className="flex items-center gap-4">
            <div className="w-28 text-sm font-medium text-foreground truncate" title={item.name}>
              {item.name}
            </div>
            <div className="flex-1 relative">
              <div className="flex h-10 rounded-lg overflow-hidden bg-muted/30 shadow-sm">
                {positivePercent > 0 && (
                  <div
                    className="bg-emerald-500 hover:bg-emerald-600 transition-all duration-500 flex items-center justify-center group relative"
                    style={{ width: `${positivePercent}%` }}
                  >
                    {positivePercent > 8 && (
                      <span className="text-xs font-semibold text-white">
                        {positivePercent.toFixed(1)}%
                      </span>
                    )}
                    <div className="absolute hidden group-hover:block bg-gray-900 text-white text-xs px-2 py-1 rounded -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap z-10">
                      Positive: {positivePercent.toFixed(2)}%
                    </div>
                  </div>
                )}
                {neutralPercent > 0 && (
                  <div
                    className="bg-amber-500 hover:bg-amber-600 transition-all duration-500 flex items-center justify-center group relative"
                    style={{ width: `${neutralPercent}%` }}
                  >
                    {neutralPercent > 8 && (
                      <span className="text-xs font-semibold text-white">
                        {neutralPercent.toFixed(1)}%
                      </span>
                    )}
                    <div className="absolute hidden group-hover:block bg-gray-900 text-white text-xs px-2 py-1 rounded -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap z-10">
                      Neutral: {neutralPercent.toFixed(2)}%
                    </div>
                  </div>
                )}
                {negativePercent > 0 && (
                  <div
                    className="bg-red-500 hover:bg-red-600 transition-all duration-500 flex items-center justify-center group relative"
                    style={{ width: `${negativePercent}%` }}
                  >
                    {negativePercent > 8 && (
                      <span className="text-xs font-semibold text-white">
                        {negativePercent.toFixed(1)}%
                      </span>
                    )}
                    <div className="absolute hidden group-hover:block bg-gray-900 text-white text-xs px-2 py-1 rounded -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap z-10">
                      Negative: {negativePercent.toFixed(2)}%
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

interface MultiLineChartProps {
  data: Array<{ date: string; [key: string]: any }>
  lines: Array<{ key: string; name: string; color: string }>
  height?: number
}

export function MultiLineChart({ data, lines, height = 400 }: MultiLineChartProps) {
  if (!data || data.length === 0 || !lines || lines.length === 0) return null

  // Custom Tick components for better theme support
  const CustomXAxisTick = (props: any) => {
    const { x, y, payload } = props
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="middle"
          className="text-xs fill-muted-foreground"
        >
          {payload.value}
        </text>
      </g>
    )
  }

  const CustomYAxisTick = (props: any) => {
    const { x, y, payload } = props
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dx={-10}
          textAnchor="end"
          className="text-xs fill-muted-foreground"
        >
          {payload.value}%
        </text>
      </g>
    )
  }

  // Custom legend
  const CustomLegend = () => (
    <div className="flex items-center justify-center gap-6 mb-2">
      {lines.map((line) => (
        <div key={line.key} className="flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: line.color }}
          />
          <span className="text-xs text-muted-foreground">{line.name}</span>
        </div>
      ))}
    </div>
  )

  return (
    <div>
      <CustomLegend />
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <defs>
            {lines.map((line) => (
              <linearGradient key={`gradient-${line.key}`} id={`gradient-${line.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={line.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={line.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border opacity-30" />
          <XAxis
            dataKey="date"
            tick={<CustomXAxisTick />}
            tickLine={false}
            axisLine={{ className: 'stroke-border' }}
          />
          <YAxis
            tick={<CustomYAxisTick />}
            tickLine={false}
            axisLine={{ className: 'stroke-border' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px',
              color: 'hsl(var(--foreground))',
            }}
            labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
            itemStyle={{ color: 'hsl(var(--foreground))' }}
            formatter={(value: any) => [`${value}%`, '']}
          />
          {lines.map((line) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              name={line.name}
              stroke={line.color}
              strokeWidth={2}
              dot={{
                r: 4,
                strokeWidth: 2,
                fill: line.color,
                className: 'stroke-background'
              }}
              activeDot={{
                r: 6,
                strokeWidth: 0,
                fill: line.color
              }}
              fill={`url(#gradient-${line.key})`}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

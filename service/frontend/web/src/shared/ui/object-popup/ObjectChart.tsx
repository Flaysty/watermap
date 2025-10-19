import React, { FC } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from 'recharts'
import styles from './ObjectChart.module.scss'

interface ObjectChartProps {
  chartData?: Array<{
    x: number
    y: number
    label?: string
  }>
  chartConfig?: {
    color: string
    title: string
    xAxisLabel: string
    yAxisLabel: string
    legend?: Array<{
      label: string
      color: string
    }>
    multiLineData?: Array<{
      data: { x: number; y: number }[]
      color: string
      label: string
    }>
  }
}

export const ObjectChart: FC<ObjectChartProps> = ({
  chartData,
  chartConfig,
}) => {
  // Подготовка данных для графика
  let formattedData: any[] = []
  let linesToRender: any[] = []

  if (chartConfig?.multiLineData && chartConfig.multiLineData.length > 0) {
    // Множественные линии
    const allXValues = new Set<number>()
    chartConfig.multiLineData.forEach(line => {
      line.data.forEach(point => allXValues.add(point.x))
    })

    // Сортируем X значения для правильного порядка
    const sortedXValues = Array.from(allXValues).sort((a, b) => a - b)

    formattedData = sortedXValues.map(x => {
      const dataPoint: any = {
        time: x.toString().padStart(2, '0'),
      }
      chartConfig.multiLineData!.forEach((line, lineIndex) => {
        const point = line.data.find(p => p.x === x)
        dataPoint[`value${lineIndex}`] = point ? point.y : null
      })
      return dataPoint
    })

    linesToRender = chartConfig.multiLineData.map((line, index) => (
      <Line
        key={index}
        type="monotone"
        dataKey={`value${index}`}
        stroke={line.color}
        strokeWidth={2}
        dot={{ r: 3 }}
        activeDot={{ r: 5, stroke: line.color, strokeWidth: 2, fill: '#fff' }}
        connectNulls={false}
      />
    ))
  } else {
    // Одна линия
    const data = chartData || [
      { x: 4, y: 2.8 },
      { x: 5, y: 2.7 },
      { x: 6, y: 2.6 },
      { x: 7, y: 2.5 },
      { x: 8, y: 2.4 },
      { x: 9, y: 2.2 },
      { x: 10, y: 2.0 },
      { x: 11, y: 1.8 },
      { x: 12, y: 1.5 },
      { x: 13, y: 1.2 },
    ]

    // Сортируем данные по X для правильного порядка
    const sortedData = [...data].sort((a, b) => a.x - b.x)

    formattedData = sortedData.map(item => ({
      time: item.label || item.x.toString().padStart(2, '0'),
      value: item.y,
    }))

    linesToRender = [
      <Line
        key="single"
        type="monotone"
        dataKey="value"
        stroke={chartConfig?.color || '#dc3545'}
        strokeWidth={2}
        dot={{ r: 3 }}
        activeDot={{
          r: 5,
          stroke: chartConfig?.color || '#dc3545',
          strokeWidth: 2,
          fill: '#fff',
        }}
        connectNulls={false}
      />,
    ]
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.tooltip}>
          <div className={styles.tooltipHeader}>
            <span className={styles.tooltipTitle}>Время: {label}</span>
          </div>
          <div className={styles.tooltipContent}>
            {payload.map((entry: any, index: number) => {
              const lineData = chartConfig?.multiLineData?.[index]
              const lineName = lineData?.label || 'Значение'
              const value =
                typeof entry.value === 'number'
                  ? entry.value.toFixed(2)
                  : entry.value

              return (
                <div
                  key={index}
                  className={styles.tooltipRow}
                >
                  <span
                    className={styles.tooltipLabel}
                    style={{ color: entry.color }}
                  >
                    {lineName}:
                  </span>
                  <span className={styles.tooltipValue}>{value}</span>
                </div>
              )
            })}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartTitle}>
        {chartConfig?.title || 'График данных'}
      </div>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer
          width="100%"
          height={250}
        >
          <LineChart
            data={formattedData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 40,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              strokeOpacity={0.6}
            />
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 10,
                fill: '#6b7280',
                fontFamily: 'Inter, sans-serif',
              }}
              label={
                chartConfig?.xAxisLabel
                  ? {
                      value: chartConfig.xAxisLabel,
                      position: 'insideBottom',
                      offset: 0,
                      style: {
                        textAnchor: 'middle',
                        fontSize: '10px',
                        fill: '#374151',
                        fontFamily: 'Inter, sans-serif',
                      },
                    }
                  : undefined
              }
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              domain={['auto', 'auto']}
              tick={{
                fontSize: 12,
                fill: '#6b7280',
                fontFamily: 'Inter, sans-serif',
              }}
              label={
                chartConfig?.yAxisLabel
                  ? {
                      value: chartConfig.yAxisLabel,
                      angle: -90,
                      position: 'insideLeft',
                      style: {
                        textAnchor: 'middle',
                        fontSize: '12px',
                        fill: '#374151',
                        fontFamily: 'Inter, sans-serif',
                      },
                    }
                  : undefined
              }
            />
            <Tooltip content={<CustomTooltip />} />
            {chartConfig?.multiLineData &&
              chartConfig.multiLineData.length > 0 && (
                <Legend
                  formatter={(value, entry) => {
                    const lineIndex = parseInt(value.replace('value', ''))
                    return (
                      chartConfig.multiLineData?.[lineIndex]?.label || value
                    )
                  }}
                  verticalAlign="bottom"
                  align="center"
                />
              )}
            {linesToRender}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

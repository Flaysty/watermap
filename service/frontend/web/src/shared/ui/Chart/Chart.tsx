import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import styles from './Chart.module.scss'
import { FC } from 'react'

interface ChartProps {
  data: { x: number; y: number }[]
  color?: string
  animated?: boolean
  interactive?: boolean
}

export const Chart: FC<ChartProps> = ({
  data,
  color = '#dc3545',
  animated = true,
  interactive = true,
}) => {
  // Данные для графика (имитация реальных данных)
  const chartData = data || [
    { x: 4, y: 30 },
    { x: 5, y: 45 },
    { x: 6, y: 35 },
    { x: 7, y: 25 },
    { x: 8, y: 20 },
    { x: 9, y: 40 },
    { x: 10, y: 60 },
    { x: 11, y: 75 },
    { x: 12, y: 85 },
    { x: 13, y: 95 },
  ]

  const formattedData = chartData.map(item => ({
    time: item.x.toString().padStart(2, '0'),
    value: item.y,
    baseline: 45,
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.tooltip}>
          <p className={styles.tooltipLabel}>{`Время: ${label}`}</p>
          <p
            className={styles.tooltipValue}
            style={{ color: color }}
          >
            {`Значение: ${payload[0].value}%`}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className={styles.chartContainer}>
      <ResponsiveContainer
        width="100%"
        height={100}
      >
        <LineChart
          data={formattedData}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e7eb"
          />
          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#6b7280' }}
          />
          <YAxis hide />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '3 3' }}
          />
          <ReferenceLine
            y={45}
            stroke="#9ca3af"
            strokeDasharray="4 4"
            opacity={0.7}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={3}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: color, strokeWidth: 2, fill: '#fff' }}
            isAnimationActive={animated}
            animationDuration={2000}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

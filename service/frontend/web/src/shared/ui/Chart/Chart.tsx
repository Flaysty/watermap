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
  data: { x: number; y: number; label?: string }[]
  color?: string
  animated?: boolean
  interactive?: boolean
  // Поддержка нескольких линий
  multiLineData?: Array<{
    data: { x: number; y: number }[]
    color: string
    label: string
  }>
  // Подписи осей
  xAxisLabel?: string
  yAxisLabel?: string
  showLegend?: boolean
}

export const Chart: FC<ChartProps> = ({
  data,
  color = '#dc3545',
  animated = true,
  interactive = true,
  multiLineData,
  xAxisLabel,
  yAxisLabel,
  showLegend = false,
}) => {
  // Подготовка данных для графика
  let formattedData: any[]
  let linesToRender: any[] = []

  if (multiLineData && multiLineData.length > 0) {
    // Множественные линии
    const allXValues = new Set()
    multiLineData.forEach(line => {
      line.data.forEach(point => allXValues.add(point.x))
    })

    formattedData = Array.from(allXValues).map(x => {
      const dataPoint: any = { time: x.toString().padStart(2, '0') }
      multiLineData.forEach((line, index) => {
        const point = line.data.find(p => p.x === x)
        dataPoint[`value${index}`] = point ? point.y : null
      })
      return dataPoint
    })

    linesToRender = multiLineData.map((line, index) => (
      <Line
        key={index}
        type="monotone"
        dataKey={`value${index}`}
        stroke={line.color}
        strokeWidth={3}
        dot={{ fill: line.color, strokeWidth: 2, r: 4 }}
        activeDot={{ r: 6, stroke: line.color, strokeWidth: 2, fill: '#fff' }}
        isAnimationActive={animated}
        animationDuration={2000}
        connectNulls={false}
      />
    ))
  } else {
    // Одна линия (старая логика)
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

    formattedData = chartData.map(item => ({
      time: item.x.toString().padStart(2, '0'),
      value: item.y,
      baseline: 45,
    }))

    linesToRender = [
      <Line
        key="single"
        type="monotone"
        dataKey="value"
        stroke={color}
        strokeWidth={3}
        dot={{ fill: color, strokeWidth: 2, r: 4 }}
        activeDot={{ r: 6, stroke: color, strokeWidth: 2, fill: '#fff' }}
        isAnimationActive={animated}
        animationDuration={2000}
      />,
    ]
  }

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
      {yAxisLabel && (
        <div
          style={{
            position: 'absolute',
            left: '-25px',
            top: '50%',
            transform: 'translateY(-50%) rotate(-90deg)',
            fontSize: '10px',
            color: '#6b7280',
            fontWeight: '500',
            whiteSpace: 'nowrap',
            zIndex: 1,
          }}
        >
          {yAxisLabel}
        </div>
      )}
      <ResponsiveContainer
        width="100%"
        height={100}
      >
        <LineChart
          data={formattedData}
          margin={{
            top: 5,
            right: 5,
            left: yAxisLabel ? 40 : 5,
            bottom: xAxisLabel ? 30 : 5,
          }}
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
          {linesToRender}
        </LineChart>
      </ResponsiveContainer>
      {xAxisLabel && (
        <div
          style={{
            textAlign: 'center',
            fontSize: '10px',
            color: '#6b7280',
            fontWeight: '500',
            marginTop: '4px',
          }}
        >
          {xAxisLabel}
        </div>
      )}
      {showLegend && multiLineData && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            marginTop: '8px',
            fontSize: '12px',
          }}
        >
          {multiLineData.map((line, index) => (
            <div
              key={index}
              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: line.color,
                  borderRadius: '2px',
                }}
              />
              <span>{line.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

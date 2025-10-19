import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
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
    data: { x: string | number; y: number; label?: string }[]
    color: string
    label: string
    isForecast?: boolean // Флаг для прогнозных данных
  }>
  // Подписи осей
  xAxisLabel?: string
  yAxisLabel?: string
  showLegend?: boolean
  // Единицы измерения для тултипов
  unit?: string
  // Название метрики для тултипов
  metricName?: string
  // Пороговые значения
  thresholds?: {
    warning?: { min: number; max: number }
    critical?: { min: number; max: number }
    optimal?: { min: number; max: number }
  }
  // Обрезка оси Y
  yAxisDomain?: [number, number]
  // Подписи для оси X
  xAxisLabels?: string[]
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
  unit = '',
  metricName = 'Значение',
  thresholds,
  yAxisDomain,
  xAxisLabels,
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

    formattedData = Array.from(allXValues).map((x, index) => {
      const dataPoint: any = {
        time:
          xAxisLabels && xAxisLabels[index]
            ? xAxisLabels[index]
            : (x as number).toString().padStart(2, '0'),
      }
      multiLineData.forEach((line, lineIndex) => {
        const point = line.data.find(p => p.x === (x as number))
        dataPoint[`value${lineIndex}`] = point ? point.y : null
      })
      return dataPoint
    })

    linesToRender = multiLineData.map((line, index) => (
      <Line
        key={index}
        type="monotone"
        dataKey={`value${index}`}
        stroke={line.color}
        strokeWidth={line.isForecast ? 2 : 3} // Тоньше для прогнозов
        strokeDasharray={line.isForecast ? '5 5' : undefined} // Пунктир для прогнозов
        dot={false} // Убираем обычные точки для всех линий
        activeDot={{ r: 5, stroke: line.color, strokeWidth: 2, fill: '#fff' }} // Оставляем точки только при наведении
        isAnimationActive={false} // Убираем анимацию для всех линий
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

    formattedData = chartData.map((item, index) => ({
      time: item.label || item.x.toString().padStart(2, '0'),
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
        dot={false} // Убираем обычные точки
        activeDot={{ r: 5, stroke: color, strokeWidth: 2, fill: '#fff' }} // Оставляем точки только при наведении
        isAnimationActive={false} // Убираем анимацию
        animationDuration={2000}
      />,
    ]
  }

  const CustomTooltip = ({ active, payload, label, coordinate }: any) => {
    if (active && payload && payload.length) {
      // Если есть multiLineData, показываем все линии
      if (multiLineData && multiLineData.length > 0) {
        return (
          <div
            className={styles.tooltip}
            style={{
              position: 'absolute',
              left: coordinate?.x || 0,
              top: coordinate?.y || 0,
              transform: 'translate(-50%, -100%)',
              marginTop: '-10px',
              zIndex: 1000,
            }}
          >
            <div className={styles.tooltipHeader}>
              <span className={styles.tooltipTitle}>
                {(() => {
                  // Определяем тип графика по меткам
                  const hasWaterFlow = multiLineData.some(
                    line =>
                      line.label.includes('Подача') ||
                      line.label.includes('Обратка') ||
                      line.label.includes('Потребление'),
                  )
                  const hasTemperature = multiLineData.some(
                    line =>
                      line.label.includes('Т1') ||
                      line.label.includes('Т2') ||
                      line.label.includes('Температура'),
                  )
                  const isForecast = multiLineData.every(
                    line => line.isForecast,
                  )

                  if (hasWaterFlow) {
                    return isForecast ? 'Водопоток (прогноз)' : 'Водопоток'
                  } else if (hasTemperature) {
                    return isForecast ? 'Температура (прогноз)' : 'Температура'
                  } else {
                    return isForecast ? 'Параметры (прогноз)' : 'Параметры'
                  }
                })()}
              </span>
            </div>
            <div className={styles.tooltipContent}>
              <div className={styles.tooltipRow}>
                <span className={styles.tooltipLabel}>Время:</span>
                <span className={styles.tooltipValue}>{label}</span>
              </div>
              {payload.map((entry: any, index: number) => {
                const lineData =
                  multiLineData[parseInt(entry.dataKey.replace('value', ''))]
                const isForecast = lineData?.isForecast || false
                const formattedValue =
                  typeof entry.value === 'number'
                    ? entry.value.toFixed(2)
                    : entry.value

                return (
                  <div
                    key={index}
                    className={styles.tooltipRow}
                  >
                    <span className={styles.tooltipLabel}>
                      {lineData?.label || `Параметр ${index + 1}`}:
                    </span>
                    <span
                      className={styles.tooltipValue}
                      style={{ color: entry.color }}
                    >
                      {formattedValue} {unit}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      }

      // Обычный тултип для одной линии
      const value = payload[0].value
      const dataKey = payload[0].dataKey
      const formattedValue =
        typeof value === 'number' ? value.toFixed(2) : value

      // Определяем, является ли это прогнозной линией
      const isForecast =
        multiLineData && dataKey
          ? multiLineData[parseInt(dataKey.replace('value', ''))]?.isForecast
          : false

      // Определяем статус по пороговым значениям
      let status = ''
      let statusColor = '#6b7280'
      if (thresholds) {
        if (
          thresholds.critical &&
          value >= thresholds.critical.min &&
          value <= thresholds.critical.max
        ) {
          status = 'КРИТИЧНО'
          statusColor = '#dc2626'
        } else if (
          thresholds.warning &&
          value >= thresholds.warning.min &&
          value <= thresholds.warning.max
        ) {
          status = 'ПРЕДУПРЕЖДЕНИЕ'
          statusColor = '#f59e0b'
        } else if (
          thresholds.optimal &&
          value >= thresholds.optimal.min &&
          value <= thresholds.optimal.max
        ) {
          status = 'ОПТИМАЛЬНО'
          statusColor = '#10b981'
        }
      }

      return (
        <div
          className={styles.tooltip}
          style={{
            position: 'absolute',
            left: coordinate?.x || 0,
            top: coordinate?.y || 0,
            transform: 'translate(-50%, -100%)',
            marginTop: '-10px',
            zIndex: 1000,
          }}
        >
          <div className={styles.tooltipHeader}>
            <span className={styles.tooltipTitle}>
              {metricName}
              {isForecast ? ' (прогноз)' : ''}
            </span>
          </div>
          <div className={styles.tooltipContent}>
            <div className={styles.tooltipRow}>
              <span className={styles.tooltipLabel}>Время:</span>
              <span className={styles.tooltipValue}>{label}</span>
            </div>
            <div className={styles.tooltipRow}>
              <span className={styles.tooltipLabel}>Значение:</span>
              <span
                className={styles.tooltipValue}
                style={{ color: color }}
              >
                {formattedValue} {unit}
              </span>
            </div>
            {isForecast && (
              <div className={styles.tooltipRow}>
                <span className={styles.tooltipLabel}>Тип данных:</span>
                <span
                  className={styles.tooltipValue}
                  style={{ color: '#6b7280' }}
                >
                  Прогнозная модель
                </span>
              </div>
            )}
            {status && (
              <div
                className={styles.tooltipStatus}
                style={{ borderLeftColor: statusColor }}
              >
                <span style={{ color: statusColor }}>{status}</span>
              </div>
            )}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className={styles.chartContainer}>
      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <LineChart
          data={formattedData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
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
            tickFormatter={(value, index) => {
              // Показываем только начало, через каждую неделю и конец
              const totalTicks = formattedData.length
              if (index === 0 || index === totalTicks - 1) {
                return value // Показываем первую и последнюю
              }
              // Для промежуточных - показываем через каждую неделю (примерно каждые 7 дней)
              if (
                totalTicks > 14 &&
                index % Math.max(1, Math.floor(totalTicks / 7)) === 0
              ) {
                return value
              }
              return '' // Скрываем остальные
            }}
            label={
              xAxisLabel
                ? {
                    value: xAxisLabel,
                    position: 'insideBottom',
                    offset: -5,
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
            domain={yAxisDomain || ['dataMin', 'dataMax']}
            tick={{
              fontSize: 12,
              fill: '#6b7280',
              fontFamily: 'Inter, sans-serif',
            }}
            label={
              yAxisLabel
                ? {
                    value: yAxisLabel,
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
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '3 3' }}
          />

          {/* Пороговые коридоры */}
          {thresholds?.warning && (
            <ReferenceArea
              y1={thresholds.warning.min}
              y2={thresholds.warning.max}
              fill="#f59e0b"
              fillOpacity={0.1}
              stroke="#f59e0b"
              strokeWidth={1}
              strokeDasharray="3 3"
              label={{
                value: `Предупреждение: ${thresholds.warning.min}-${thresholds.warning.max} ${unit}`,
                position: 'top',
                style: {
                  fill: '#f59e0b',
                  fontSize: '10px',
                  fontFamily: 'Inter, sans-serif',
                },
              }}
            />
          )}
          {thresholds?.critical && (
            <ReferenceArea
              y1={thresholds.critical.min}
              y2={thresholds.critical.max}
              fill="#dc2626"
              fillOpacity={0.1}
              stroke="#dc2626"
              strokeWidth={1}
              strokeDasharray="3 3"
              label={{
                value: `Критично: ${thresholds.critical.min}-${thresholds.critical.max} ${unit}`,
                position: 'top',
                style: {
                  fill: '#dc2626',
                  fontSize: '10px',
                  fontFamily: 'Inter, sans-serif',
                },
              }}
            />
          )}
          {thresholds?.optimal && (
            <ReferenceArea
              y1={thresholds.optimal.min}
              y2={thresholds.optimal.max}
              fill="#10b981"
              fillOpacity={0.1}
              stroke="#10b981"
              strokeWidth={1}
              strokeDasharray="3 3"
              label={{
                value: `Оптимально: ${thresholds.optimal.min}-${thresholds.optimal.max} ${unit}`,
                position: 'top',
                style: {
                  fill: '#10b981',
                  fontSize: '10px',
                  fontFamily: 'Inter, sans-serif',
                },
              }}
            />
          )}

          {linesToRender}
        </LineChart>
      </ResponsiveContainer>
      {showLegend && multiLineData && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            marginTop: '8px',
            fontSize: '12px',
            fontFamily: 'Inter, sans-serif',
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

import React, { FC, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import {
  fetchChartData,
  fetchPredictionData,
  fetchIntradayAnalyticsData,
} from '../../api/chart-api'
import styles from './ChartModal.module.scss'

interface ChartModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ChartModal: FC<ChartModalProps> = ({ isOpen, onClose }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['chartData'],
    queryFn: fetchChartData,
    enabled: isOpen, // Загружаем данные только когда модалка открыта
  })

  const {
    data: predictionData,
    isLoading: isPredictionLoading,
    error: predictionError,
  } = useQuery({
    queryKey: ['predictionData'],
    queryFn: fetchPredictionData,
    enabled: isOpen,
  })

  const {
    data: intradayData,
    isLoading: isIntradayLoading,
    error: intradayError,
  } = useQuery({
    queryKey: ['intradayAnalyticsData'],
    queryFn: fetchIntradayAnalyticsData,
    enabled: isOpen,
  })

  // Преобразуем данные для Recharts
  const chartData = useMemo(() => {
    if (!data || !data.datetime || data.datetime.length === 0) return []

    return data.datetime.map((datetime, index) => ({
      datetime: new Date(datetime).toLocaleString('ru-RU', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
      }),
      podacha: data.podacha?.[index] || 0,
      obratka: data.obratka?.[index] || 0,
      potreblenie: data.potreblenie?.[index] || 0,
      temperatura1: data.temperatura1?.[index] || 0,
      temperatura2: data.temperatura2?.[index] || 0,
    }))
  }, [data])

  // Преобразуем прогнозные данные для Recharts
  const predictionChartData = useMemo(() => {
    if (!predictionData) return []

    const historical = predictionData.historical.map(item => ({
      datetime: new Date(item.datetime).toLocaleString('ru-RU', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
      }),
      podacha: item.podacha,
      obratka: item.obratka,
      potreblenie: item.potreblenie,
      temperatura1: item.temperatura1,
      temperatura2: item.temperatura2,
      podachaPrognoz: null,
      obratkaPrognoz: null,
      potrebleniePrognoz: null,
      temperatura1Prognoz: null,
      temperatura2Prognoz: null,
    }))

    const forecast = predictionData.forecast.map(item => ({
      datetime: new Date(item.datetime).toLocaleString('ru-RU', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
      }),
      podacha: null,
      obratka: null,
      potreblenie: null,
      temperatura1: null,
      temperatura2: null,
      podachaPrognoz: item.podacha,
      obratkaPrognoz: item.obratka,
      potrebleniePrognoz: item.potreblenie,
      temperatura1Prognoz: item.temperatura1,
      temperatura2Prognoz: item.temperatura2,
    }))

    // Объединяем данные для правильного отображения осей
    return [...historical, ...forecast]
  }, [predictionData])

  // Преобразуем данные внутридневной аналитики для Recharts
  const intradayChartData = useMemo(() => {
    if (
      !intradayData ||
      !intradayData.datetime ||
      intradayData.datetime.length === 0
    )
      return []

    return intradayData.datetime.map((datetime, index) => ({
      datetime: new Date(datetime).toLocaleString('ru-RU', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
      }),
      podacha: intradayData.podacha?.[index] || 0,
      obratka: intradayData.obratka?.[index] || 0,
      potreblenie: intradayData.potreblenie?.[index] || 0,
      temperatura1: intradayData.temperatura1?.[index] || 0,
      temperatura2: intradayData.temperatura2?.[index] || 0,
    }))
  }, [intradayData])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.tooltip}>
          <p className={styles.tooltipLabel}>{label}</p>
          {payload.map((entry: any, index: number) => (
            <p
              key={index}
              style={{ color: entry.color }}
            >
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  if (!isOpen) return null

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
    >
      <div
        className={styles.chartModal}
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2>Визуализация данных системы</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {(isLoading || isPredictionLoading || isIntradayLoading) && (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Загрузка данных...</p>
          </div>
        )}

        {(error || predictionError || intradayError) && (
          <div className={styles.error}>
            <p>
              Ошибка загрузки данных:{' '}
              {error?.message ||
                predictionError?.message ||
                intradayError?.message}
            </p>
          </div>
        )}

        {data && (
          <div className={styles.content}>
            <div className={styles.chartSection}>
              <h3>Объёмы воды (м³)</h3>
              <div className={styles.chartContainer}>
                <ResponsiveContainer
                  width="100%"
                  height={400}
                >
                  <LineChart data={chartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e5e7eb"
                    />
                    <XAxis
                      dataKey="datetime"
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis
                      yAxisId="left"
                      tick={{ fontSize: 12 }}
                      label={{
                        value: 'Объём (м³)',
                        angle: -90,
                        position: 'insideLeft',
                      }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="podacha"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Подача"
                      dot={{ r: 3 }}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="obratka"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Обратка"
                      dot={{ r: 3 }}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="potreblenie"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      name="Потребление"
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={styles.chartSection}>
              <h3>Температура ГВС (°C)</h3>
              <div className={styles.chartContainer}>
                <ResponsiveContainer
                  width="100%"
                  height={400}
                >
                  <LineChart data={chartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e5e7eb"
                    />
                    <XAxis
                      dataKey="datetime"
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      label={{
                        value: 'Температура (°C)',
                        angle: -90,
                        position: 'insideLeft',
                      }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="temperatura1"
                      stroke="#ef4444"
                      strokeWidth={2}
                      name="Т1 ГВС"
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="temperatura2"
                      stroke="#dc2626"
                      strokeWidth={2}
                      name="Т2 ГВС"
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={styles.metadata}>
              <h3>Информация о данных</h3>
              <div className={styles.metadataGrid}>
                <div className={styles.metadataItem}>
                  <span className={styles.label}>Период:</span>
                  <span className={styles.value}>
                    {data.datetime?.[0] || 'N/A'} -{' '}
                    {data.datetime?.[data.datetime.length - 1] || 'N/A'}
                  </span>
                </div>
                <div className={styles.metadataItem}>
                  <span className={styles.label}>Количество точек:</span>
                  <span className={styles.value}>
                    {data.datetime?.length || 0}
                  </span>
                </div>
                <div className={styles.metadataItem}>
                  <span className={styles.label}>Средняя подача:</span>
                  <span className={styles.value}>
                    {data.podacha?.length > 0
                      ? (
                          data.podacha.reduce((a, b) => a + b, 0) /
                          data.podacha.length
                        ).toFixed(1)
                      : 'N/A'}{' '}
                    м³
                  </span>
                </div>
                <div className={styles.metadataItem}>
                  <span className={styles.label}>Средняя температура:</span>
                  <span className={styles.value}>
                    {data.temperatura1?.length > 0 &&
                    data.temperatura2?.length > 0
                      ? (
                          (data.temperatura1.reduce((a, b) => a + b, 0) /
                            data.temperatura1.length +
                            data.temperatura2.reduce((a, b) => a + b, 0) /
                              data.temperatura2.length) /
                          2
                        ).toFixed(1)
                      : 'N/A'}
                    °C
                  </span>
                </div>
                <div className={styles.metadataItem}>
                  <span className={styles.label}>Максимальная подача:</span>
                  <span className={styles.value}>
                    {data.podacha?.length > 0
                      ? Math.max(...data.podacha).toFixed(1)
                      : 'N/A'}{' '}
                    м³
                  </span>
                </div>
                <div className={styles.metadataItem}>
                  <span className={styles.label}>Минимальная подача:</span>
                  <span className={styles.value}>
                    {data.podacha?.length > 0
                      ? Math.min(...data.podacha).toFixed(1)
                      : 'N/A'}{' '}
                    м³
                  </span>
                </div>
                <div className={styles.metadataItem}>
                  <span className={styles.label}>
                    Максимальная температура:
                  </span>
                  <span className={styles.value}>
                    {data.temperatura1?.length > 0 &&
                    data.temperatura2?.length > 0
                      ? Math.max(
                          ...data.temperatura1,
                          ...data.temperatura2,
                        ).toFixed(1)
                      : 'N/A'}
                    °C
                  </span>
                </div>
                <div className={styles.metadataItem}>
                  <span className={styles.label}>Минимальная температура:</span>
                  <span className={styles.value}>
                    {data.temperatura1?.length > 0 &&
                    data.temperatura2?.length > 0
                      ? Math.min(
                          ...data.temperatura1,
                          ...data.temperatura2,
                        ).toFixed(1)
                      : 'N/A'}
                    °C
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {predictionData && (
          <div className={styles.content}>
            <div className={styles.chartSection}>
              <h3>Прогноз объёмов воды (м³)</h3>
              <div className={styles.chartContainer}>
                <ResponsiveContainer
                  width="100%"
                  height={400}
                >
                  <LineChart data={predictionChartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e5e7eb"
                    />
                    <XAxis
                      dataKey="datetime"
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis
                      yAxisId="left"
                      tick={{ fontSize: 12 }}
                      label={{
                        value: 'Объём (м³)',
                        angle: -90,
                        position: 'insideLeft',
                      }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    {/* Исторические данные - сплошные линии */}
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="podacha"
                      stroke="#3b82f6"
                      dot={false}
                      name="Подача (история)"
                      connectNulls={false}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="obratka"
                      stroke="#ef4444"
                      dot={false}
                      name="Обратка (история)"
                      connectNulls={false}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="potreblenie"
                      stroke="#22c55e"
                      dot={false}
                      name="Потребление (история)"
                      connectNulls={false}
                    />
                    {/* Прогнозные данные - пунктирные линии */}
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="podachaPrognoz"
                      stroke="#3b82f6"
                      strokeDasharray="5 5"
                      dot={false}
                      name="Подача (прогноз)"
                      connectNulls={false}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="obratkaPrognoz"
                      stroke="#ef4444"
                      strokeDasharray="5 5"
                      dot={false}
                      name="Обратка (прогноз)"
                      connectNulls={false}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="potrebleniePrognoz"
                      stroke="#22c55e"
                      strokeDasharray="5 5"
                      dot={false}
                      name="Потребление (прогноз)"
                      connectNulls={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={styles.chartSection}>
              <h3>Прогноз температуры ГВС (°C)</h3>
              <div className={styles.chartContainer}>
                <ResponsiveContainer
                  width="100%"
                  height={400}
                >
                  <LineChart data={predictionChartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e5e7eb"
                    />
                    <XAxis
                      dataKey="datetime"
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      label={{
                        value: 'Температура (°C)',
                        angle: -90,
                        position: 'insideLeft',
                      }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    {/* Исторические данные - сплошные линии */}
                    <Line
                      type="monotone"
                      dataKey="temperatura1"
                      stroke="#f97316"
                      dot={false}
                      name="Т1 ГВС (история)"
                      connectNulls={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="temperatura2"
                      stroke="#8b5cf6"
                      dot={false}
                      name="Т2 ГВС (история)"
                      connectNulls={false}
                    />
                    {/* Прогнозные данные - пунктирные линии */}
                    <Line
                      type="monotone"
                      dataKey="temperatura1Prognoz"
                      stroke="#f97316"
                      strokeDasharray="5 5"
                      dot={false}
                      name="Т1 ГВС (прогноз)"
                      connectNulls={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="temperatura2Prognoz"
                      stroke="#8b5cf6"
                      strokeDasharray="5 5"
                      dot={false}
                      name="Т2 ГВС (прогноз)"
                      connectNulls={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={styles.metadata}>
              <h3>Информация о прогнозе</h3>
              <div className={styles.metadataGrid}>
                <div className={styles.metadataItem}>
                  <span className={styles.label}>Исторических точек:</span>
                  <span className={styles.value}>
                    {predictionData.historical.length}
                  </span>
                </div>
                <div className={styles.metadataItem}>
                  <span className={styles.label}>Прогнозных точек:</span>
                  <span className={styles.value}>
                    {predictionData.forecast.length}
                  </span>
                </div>
                <div className={styles.metadataItem}>
                  <span className={styles.label}>Период прогноза:</span>
                  <span className={styles.value}>
                    {predictionData.forecast[0]?.datetime || 'N/A'} -{' '}
                    {predictionData.forecast[predictionData.forecast.length - 1]
                      ?.datetime || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {intradayData && (
          <div className={styles.content}>
            <div className={styles.chartSection}>
              <h3>Внутридневная аналитика - Объёмы воды (м³)</h3>
              <div className={styles.chartContainer}>
                <ResponsiveContainer
                  width="100%"
                  height={400}
                >
                  <LineChart data={intradayChartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e5e7eb"
                    />
                    <XAxis
                      dataKey="datetime"
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis
                      yAxisId="left"
                      tick={{ fontSize: 12 }}
                      label={{
                        value: 'Объём (м³)',
                        angle: -90,
                        position: 'insideLeft',
                      }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="podacha"
                      stroke="#3b82f6"
                      dot={false}
                      name="Подача"
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="obratka"
                      stroke="#ef4444"
                      dot={false}
                      name="Обратка"
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="potreblenie"
                      stroke="#22c55e"
                      dot={false}
                      name="Потребление"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={styles.chartSection}>
              <h3>Внутридневная аналитика - Температура ГВС (°C)</h3>
              <div className={styles.chartContainer}>
                <ResponsiveContainer
                  width="100%"
                  height={400}
                >
                  <LineChart data={intradayChartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e5e7eb"
                    />
                    <XAxis
                      dataKey="datetime"
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis
                      yAxisId="left"
                      tick={{ fontSize: 12 }}
                      label={{
                        value: 'Температура (°C)',
                        angle: -90,
                        position: 'insideLeft',
                      }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="temperatura1"
                      stroke="#f59e0b"
                      dot={false}
                      name="Т1 ГВС"
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="temperatura2"
                      stroke="#8b5cf6"
                      dot={false}
                      name="Т2 ГВС"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={styles.metadata}>
              <h3>Информация о внутридневной аналитике</h3>
              <div className={styles.metadataGrid}>
                <div className={styles.metadataItem}>
                  <span className={styles.label}>Количество точек:</span>
                  <span className={styles.value}>
                    {intradayData.datetime.length}
                  </span>
                </div>
                <div className={styles.metadataItem}>
                  <span className={styles.label}>Период:</span>
                  <span className={styles.value}>
                    {intradayData.datetime[0] || 'N/A'} -{' '}
                    {intradayData.datetime[intradayData.datetime.length - 1] ||
                      'N/A'}
                  </span>
                </div>
                <div className={styles.metadataItem}>
                  <span className={styles.label}>Средняя подача:</span>
                  <span className={styles.value}>
                    {intradayData.podacha.length > 0
                      ? (
                          intradayData.podacha.reduce((a, b) => a + b, 0) /
                          intradayData.podacha.length
                        ).toFixed(2)
                      : 'N/A'}{' '}
                    м³
                  </span>
                </div>
                <div className={styles.metadataItem}>
                  <span className={styles.label}>Средняя температура:</span>
                  <span className={styles.value}>
                    {intradayData.temperatura1.length > 0 &&
                    intradayData.temperatura2.length > 0
                      ? (
                          (intradayData.temperatura1.reduce(
                            (a, b) => a + b,
                            0,
                          ) /
                            intradayData.temperatura1.length +
                            intradayData.temperatura2.reduce(
                              (a, b) => a + b,
                              0,
                            ) /
                              intradayData.temperatura2.length) /
                          2
                        ).toFixed(1)
                      : 'N/A'}{' '}
                    °C
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

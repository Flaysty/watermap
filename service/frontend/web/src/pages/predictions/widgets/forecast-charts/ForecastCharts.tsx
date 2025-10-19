import { ProcessedPredictionData } from '../../../../shared/api/chart-api'
import { Chart } from '../../../../shared/ui/Chart'
import {
  Droplets,
  Thermometer,
  Calendar,
  CalendarDays,
  CalendarRange,
  Info,
} from 'lucide-react'
import { Tooltip } from 'react-tooltip'
import styles from './ForecastCharts.module.scss'

interface ForecastChartsProps {
  data: ProcessedPredictionData
  timeGrouping: 'hourly'
}

export const ForecastCharts = ({ data, timeGrouping }: ForecastChartsProps) => {
  // Функция для разделения исторических и прогнозных данных
  const separateHistoricalAndForecast = (
    historicalData: ProcessedPredictionData['historical'],
    forecastData: ProcessedPredictionData['forecast'],
    grouping: 'hourly',
    metric:
      | 'podacha'
      | 'obratka'
      | 'potreblenie'
      | 'temperatura1'
      | 'temperatura2',
  ) => {
    const historicalGrouped: { [key: string]: any[] } = {}
    const forecastGrouped: { [key: string]: any[] } = {}

    // Группируем исторические данные
    historicalData.forEach(item => {
      const date = new Date(item.datetime)
      const groupKey = date.toISOString().slice(0, 13) // YYYY-MM-DDTHH

      if (!historicalGrouped[groupKey]) {
        historicalGrouped[groupKey] = []
      }
      historicalGrouped[groupKey].push(item)
    })

    // Группируем прогнозные данные
    forecastData.forEach(item => {
      const date = new Date(item.datetime)
      const groupKey = date.toISOString().slice(0, 13) // YYYY-MM-DDTHH

      if (!forecastGrouped[groupKey]) {
        forecastGrouped[groupKey] = []
      }
      forecastGrouped[groupKey].push(item)
    })

    // Объединяем все ключи и сортируем
    const allKeys = [
      ...new Set([
        ...Object.keys(historicalGrouped),
        ...Object.keys(forecastGrouped),
      ]),
    ].sort()
    const isTemperature = metric.startsWith('temperatura')

    const historicalPoints = allKeys.map((date, index) => {
      const items = historicalGrouped[date] || []
      const dateObj = new Date(date + ':00:00.000Z')
      const formattedLabel = dateObj.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })

      return {
        x: index, // Используем индекс для оси X
        y:
          items.length > 0
            ? isTemperature
              ? Math.round(
                  (items.reduce((sum, item) => sum + item[metric], 0) /
                    items.length) *
                    10,
                ) / 10
              : Math.round(
                  items.reduce((sum, item) => sum + item[metric], 0) * 10,
                ) / 10
            : null,
        label: formattedLabel, // Сохраняем отформатированную дату для тултипов
      }
    })

    const forecastPoints = allKeys.map((date, index) => {
      const items = forecastGrouped[date] || []
      const dateObj = new Date(date + ':00:00.000Z')
      const formattedLabel = dateObj.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })

      return {
        x: index, // Используем индекс для оси X
        y:
          items.length > 0
            ? isTemperature
              ? Math.round(
                  (items.reduce((sum, item) => sum + item[metric], 0) /
                    items.length) *
                    10,
                ) / 10
              : Math.round(
                  items.reduce((sum, item) => sum + item[metric], 0) * 10,
                ) / 10
            : null,
        label: formattedLabel, // Сохраняем отформатированную дату для тултипов
      }
    })

    return { historicalPoints, forecastPoints }
  }

  // Получаем данные для всех метрик (разделенные исторические и прогнозные)
  const waterSupplyData = separateHistoricalAndForecast(
    data.historical,
    data.forecast,
    timeGrouping,
    'podacha',
  )
  const returnFlowData = separateHistoricalAndForecast(
    data.historical,
    data.forecast,
    timeGrouping,
    'obratka',
  )
  const consumptionData = separateHistoricalAndForecast(
    data.historical,
    data.forecast,
    timeGrouping,
    'potreblenie',
  )
  const temperature1Data = separateHistoricalAndForecast(
    data.historical,
    data.forecast,
    timeGrouping,
    'temperatura1',
  )
  const temperature2Data = separateHistoricalAndForecast(
    data.historical,
    data.forecast,
    timeGrouping,
    'temperatura2',
  )

  // Создаем массив подписей для оси X
  const createXAxisLabels = (data: ProcessedPredictionData) => {
    const allKeys = [
      ...new Set([
        ...data.historical.map(item => {
          const date = new Date(item.datetime)
          return date.toISOString().slice(0, 13) // YYYY-MM-DDTHH
        }),
        ...data.forecast.map(item => {
          const date = new Date(item.datetime)
          return date.toISOString().slice(0, 13) // YYYY-MM-DDTHH
        }),
      ]),
    ].sort()

    return allKeys.map(date => {
      const dateObj = new Date(date + ':00:00.000Z')
      return dateObj.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    })
  }

  const xAxisLabels = createXAxisLabels(data)

  return (
    <div className={styles.forecastCharts}>
      <h3>Прогнозируемые параметры (по часам)</h3>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h4>
              <Droplets size={20} />
              Прогноз подачи, обратки и потребления (м³/час)
            </h4>
          </div>
          <div className={styles.chartContainer}>
            <Chart
              data={[]}
              multiLineData={[
                {
                  data: waterSupplyData.historicalPoints,
                  color: '#3b82f6',
                  label: 'Подача',
                  isForecast: false,
                },
                {
                  data: waterSupplyData.forecastPoints,
                  color: '#3b82f6',
                  label: 'Подача',
                  isForecast: true,
                },
                {
                  data: returnFlowData.historicalPoints,
                  color: '#10b981',
                  label: 'Обратка',
                  isForecast: false,
                },
                {
                  data: returnFlowData.forecastPoints,
                  color: '#10b981',
                  label: 'Обратка',
                  isForecast: true,
                },
                {
                  data: consumptionData.historicalPoints,
                  color: '#8b5cf6',
                  label: 'Потребление',
                  isForecast: false,
                },
                {
                  data: consumptionData.forecastPoints,
                  color: '#8b5cf6',
                  label: 'Потребление',
                  isForecast: true,
                },
              ]}
              xAxisLabel="Период"
              yAxisLabel="м³/час"
              unit="м³/час"
              metricName="Водопотоки"
              showLegend={true}
              xAxisLabels={xAxisLabels}
              // thresholds={{
              //   warning: { min: 0, max: 0.05 },
              //   critical: { min: 1, max: 1.2 },
              //   optimal: { min: 0.05, max: 1 },
              // }}
              // yAxisDomain={[0, 1.2]}
            />
          </div>
        </div>

        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h4>
              <Thermometer size={20} />
              Прогноз температуры ГВС Т1 и Т2 (°C)
              <Info
                size={16}
                className={styles.infoIcon}
                data-tooltip-id="temperature-norms"
              />
            </h4>
            <div className={styles.chartInfo}>
              <span className={styles.groupingIndicator}>
                {timeGrouping === 'hourly' ? (
                  <Calendar size={14} />
                ) : (
                  <CalendarDays size={14} />
                )}{' '}
                {timeGrouping === 'hourly' ? 'Почасовая' : 'Дневная'}{' '}
                группировка
              </span>
            </div>
          </div>
          <div className={styles.chartContainer}>
            <Chart
              data={[]}
              multiLineData={[
                {
                  data: temperature1Data.historicalPoints,
                  color: '#ef4444',
                  label: 'Т1',
                  isForecast: false,
                },
                {
                  data: temperature1Data.forecastPoints,
                  color: '#ef4444',
                  label: 'Т1',
                  isForecast: true,
                },
                {
                  data: temperature2Data.historicalPoints,
                  color: '#f97316',
                  label: 'Т2',
                  isForecast: false,
                },
                {
                  data: temperature2Data.forecastPoints,
                  color: '#f97316',
                  label: 'Т2',
                  isForecast: true,
                },
              ]}
              xAxisLabel="Период"
              yAxisLabel="°C"
              unit="°C"
              metricName="Температура ГВС"
              showLegend={true}
              xAxisLabels={xAxisLabels}
              thresholds={{
                warning: { min: 55, max: 60 },
                critical: { min: 75, max: 90 },
                optimal: { min: 60, max: 75 },
              }}
              yAxisDomain={[40, 90]}
            />
          </div>
        </div>
      </div>

      {/* Тултипы с нормами СанПиН */}
      <Tooltip
        id="temperature-norms"
        place="top"
        style={{
          backgroundColor: '#1e293b',
          color: '#f8fafc',
          borderRadius: '8px',
          padding: '12px',
          fontSize: '14px',
          maxWidth: '350px',
          zIndex: 1000,
        }}
      >
        <div>
          <strong>Нормы СанПиН 2.1.4.2496-09:</strong>
          <br />
          • Оптимально: 60-75°C (строго по СанПиН)
          <br />
          • Предупреждение: 55-60°C
          <br />
          • Критично: 75-90°C
          <br />
          • Т1 (подача): выше для компенсации потерь
          <br />• Т2 (обратка): не менее 55°C
        </div>
      </Tooltip>
    </div>
  )
}

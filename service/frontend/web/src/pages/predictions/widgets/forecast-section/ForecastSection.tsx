import { useState, useEffect } from 'react'
import {
  fetchPredictionData,
  ProcessedPredictionData,
} from '../../../../shared/api/chart-api'
import { ForecastCharts } from '../../../../pages/predictions/widgets/forecast-charts'
import { AnalyticsPanel } from '../../../../pages/predictions/widgets/analytics-panel'
import { AlertsPanel } from '../../../../pages/predictions/widgets/alerts-panel'
import styles from './ForecastSection.module.scss'

export const ForecastSection = () => {
  const [predictionData, setPredictionData] =
    useState<ProcessedPredictionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeGrouping, setTimeGrouping] = useState<'hourly'>('hourly')

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const data = await fetchPredictionData()
        setPredictionData(data)
      } catch (err) {
        console.error('Data loading error:', err)
        setError('Ошибка загрузки прогнозных данных')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Загрузка прогнозных данных...</p>
      </div>
    )
  }

  if (error || !predictionData) {
    return (
      <div className={styles.error}>
        <h3>Ошибка загрузки прогнозных данных</h3>
        <p>{error || 'Не удалось загрузить прогнозные данные'}</p>
      </div>
    )
  }

  return (
    <div className={styles.forecastSection}>
      {/* Аналитические показатели - в самом верху */}
      {/* <AnalyticsPanel data={predictionData} /> */}

      <ForecastCharts
        data={predictionData}
        timeGrouping={timeGrouping}
      />
      <AlertsPanel />
    </div>
  )
}

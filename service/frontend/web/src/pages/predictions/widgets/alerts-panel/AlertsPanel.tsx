import { useState, useEffect } from 'react'
import {
  fetchPredictionData,
  ProcessedPredictionData,
} from '../../../../shared/api/chart-api'
import styles from './AlertsPanel.module.scss'

interface PredictionAlert {
  id: number
  type: 'critical' | 'warning' | 'info'
  title: string
  description: string
  probability: number
  timeframe: string
  impact: string
  recommendations: string[]
}

export const AlertsPanel = () => {
  const [predictionData, setPredictionData] =
    useState<ProcessedPredictionData | null>(null)
  const [alerts, setAlerts] = useState<PredictionAlert[]>([])

  // Нормативы МВК и РФ
  const regulations = {
    temperature: {
      min: 60, // °C - минимальная температура ГВС по СанПиН
      max: 75, // °C - максимальная температура ГВС по СанПиН
      optimal: 65, // °C - оптимальная температура
      source: 'СанПиН 2.1.4.2496-09',
    },
    waterLoss: {
      max: 15, // % - максимальные потери воды
      optimal: 8, // % - оптимальные потери
      source: 'СП 30.13330.2016',
    },
    efficiency: {
      min: 85, // % - минимальная эффективность системы
      optimal: 92, // % - оптимальная эффективность
      source: 'МВК стандарты',
    },
    pressure: {
      min: 0.3, // МПа - минимальное давление
      max: 0.6, // МПа - максимальное давление
      source: 'СП 30.13330.2016',
    },
  }

  // Генерируем предупреждения на основе прогнозных данных
  const generateAlerts = (data: ProcessedPredictionData): PredictionAlert[] => {
    const alerts: PredictionAlert[] = []

    // Анализ температуры с учетом нормативов
    const maxTemp1 = Math.max(...data.forecast.map(d => d.temperatura1))
    const maxTemp2 = Math.max(...data.forecast.map(d => d.temperatura2))

    if (
      maxTemp1 > regulations.temperature.max ||
      maxTemp2 > regulations.temperature.max
    ) {
      alerts.push({
        id: 1,
        type: 'critical',
        title: 'Критическая температура ГВС',
        description: `Температура ГВС превышает нормативы ${regulations.temperature.source}: Т1=${maxTemp1}°C, Т2=${maxTemp2}°C (норма: ${regulations.temperature.min}-${regulations.temperature.max}°C)`,
        probability: 85,
        timeframe: '2-4 часа',
        impact: 'Риск ожогов потребителей, повреждение трубопроводов',
        recommendations: [
          'Немедленно снизить температуру подачи до нормы',
          'Проверить работу регуляторов температуры',
          'Уведомить диспетчерскую службу',
          `Соблюдать требования ${regulations.temperature.source}`,
        ],
      })
    } else if (
      maxTemp1 < regulations.temperature.min ||
      maxTemp2 < regulations.temperature.min
    ) {
      alerts.push({
        id: 1,
        type: 'warning',
        title: 'Низкая температура ГВС',
        description: `Температура ГВС ниже нормы ${regulations.temperature.source}: Т1=${maxTemp1}°C, Т2=${maxTemp2}°C (норма: ${regulations.temperature.min}-${regulations.temperature.max}°C)`,
        probability: 70,
        timeframe: '4-6 часов',
        impact: 'Риск бактериального заражения, недовольство потребителей',
        recommendations: [
          'Повысить температуру подачи до нормы',
          'Проверить работу теплообменников',
          `Обеспечить соответствие ${regulations.temperature.source}`,
        ],
      })
    }

    // Анализ водоподачи с учетом нормативов
    const avgPodacha =
      data.forecast.reduce((sum, d) => sum + d.podacha, 0) /
      data.forecast.length
    const avgObratka =
      data.forecast.reduce((sum, d) => sum + d.obratka, 0) /
      data.forecast.length
    const waterLoss = ((avgPodacha - avgObratka) / avgPodacha) * 100

    // if (waterLoss > regulations.waterLoss.max) {
    //   alerts.push({
    //     id: 2,
    //     type: 'warning',
    //     title: 'Превышение нормативов потерь воды',
    //     description: `Потери воды превышают норму ${regulations.waterLoss.source}: ${waterLoss.toFixed(1)}% (норма: до ${regulations.waterLoss.max}%)`,
    //     probability: 70,
    //     timeframe: '6-12 часов',
    //     impact: 'Финансовые потери, неэффективное использование ресурсов',
    //     recommendations: [
    //       'Провести диагностику трубопроводной сети',
    //       'Проверить герметичность соединений',
    //       'Оптимизировать режимы работы насосов',
    //       `Обеспечить соответствие ${regulations.waterLoss.source}`,
    //     ],
    //   })
    // }

    // Анализ потребления
    const consumptionTrend =
      data.forecast.slice(-3).reduce((sum, d, i, arr) => {
        if (i === 0) return 0
        return sum + (d.potreblenie - arr[i - 1].potreblenie)
      }, 0) / 2

    if (consumptionTrend > 20) {
      alerts.push({
        id: 3,
        type: 'info',
        title: 'Рост потребления воды',
        description: `Ожидается рост потребления на ${consumptionTrend.toFixed(1)} м³/час`,
        probability: 60,
        timeframe: '4-8 часов',
        impact: 'Повышенная нагрузка на систему водоснабжения',
        recommendations: [
          'Подготовить резервные мощности',
          'Мониторить давление в сети',
          'Координировать с диспетчерской службой',
        ],
      })
    }

    return alerts
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchPredictionData()
        setPredictionData(data)
        const generatedAlerts = generateAlerts(data)
        setAlerts(generatedAlerts)
      } catch (err) {
        console.error('Error loading prediction data:', err)
      }
    }

    loadData()
  }, [])

  const criticalAlerts = alerts.filter(a => a.type === 'critical')
  const warningAlerts = alerts.filter(a => a.type === 'warning')
  const infoAlerts = alerts.filter(a => a.type === 'info')

  return (
    <div className={styles.alertsSection}>
      <h2>Система предупреждений</h2>

      {criticalAlerts.length > 0 && (
        <div className={styles.alertGroup}>
          <h3 className={styles.criticalTitle}>Критические риски</h3>
          <div className={styles.alertsGrid}>
            {criticalAlerts.map(alert => (
              <div
                key={alert.id}
                className={`${styles.alert} ${styles.critical}`}
              >
                <div className={styles.alertHeader}>
                  <h4>{alert.title}</h4>
                  <span className={styles.probability}>
                    {alert.probability}%
                  </span>
                </div>
                <p className={styles.description}>{alert.description}</p>
                <div className={styles.alertDetails}>
                  <div className={styles.detail}>
                    <strong>Временной горизонт:</strong> {alert.timeframe}
                  </div>
                  <div className={styles.detail}>
                    <strong>Воздействие:</strong> {alert.impact}
                  </div>
                </div>
                <div className={styles.recommendations}>
                  <strong>Рекомендации:</strong>
                  <ul>
                    {alert.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {warningAlerts.length > 0 && (
        <div className={styles.alertGroup}>
          <h3 className={styles.warningTitle}>Предупреждения</h3>
          <div className={styles.alertsGrid}>
            {warningAlerts.map(alert => (
              <div
                key={alert.id}
                className={`${styles.alert} ${styles.warning}`}
              >
                <div className={styles.alertHeader}>
                  <h4>{alert.title}</h4>
                  <span className={styles.probability}>
                    {alert.probability}%
                  </span>
                </div>
                <p className={styles.description}>{alert.description}</p>
                <div className={styles.alertDetails}>
                  <div className={styles.detail}>
                    <strong>Временной горизонт:</strong> {alert.timeframe}
                  </div>
                  <div className={styles.detail}>
                    <strong>Воздействие:</strong> {alert.impact}
                  </div>
                </div>
                <div className={styles.recommendations}>
                  <strong>Рекомендации:</strong>
                  <ul>
                    {alert.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {infoAlerts.length > 0 && (
        <div className={styles.alertGroup}>
          <h3 className={styles.infoTitle}>Информационные уведомления</h3>
          <div className={styles.alertsGrid}>
            {infoAlerts.map(alert => (
              <div
                key={alert.id}
                className={`${styles.alert} ${styles.info}`}
              >
                <div className={styles.alertHeader}>
                  <h4>{alert.title}</h4>
                  <span className={styles.probability}>
                    {alert.probability}%
                  </span>
                </div>
                <p className={styles.description}>{alert.description}</p>
                <div className={styles.alertDetails}>
                  <div className={styles.detail}>
                    <strong>Временной горизонт:</strong> {alert.timeframe}
                  </div>
                  <div className={styles.detail}>
                    <strong>Воздействие:</strong> {alert.impact}
                  </div>
                </div>
                <div className={styles.recommendations}>
                  <strong>Рекомендации:</strong>
                  <ul>
                    {alert.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {alerts.length === 0 && (
        <div className={styles.noAlerts}>
          <div className={styles.successIcon}></div>
          <h3>Все параметры в норме</h3>
          <p>
            Критических отклонений в прогнозируемых параметрах не обнаружено
          </p>
        </div>
      )}
    </div>
  )
}

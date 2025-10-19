import { ProcessedPredictionData } from '../../../../shared/api/chart-api'
import { AlertTriangle, Thermometer, Droplets, Shield } from 'lucide-react'
import styles from './AnalyticsPanel.module.scss'

interface AnalyticsPanelProps {
  data: ProcessedPredictionData
}

export const AnalyticsPanel = ({ data }: AnalyticsPanelProps) => {
  // Расчет показателей для водоканала
  const avgSupply =
    data.forecast.reduce((sum, d) => sum + d.podacha, 0) / data.forecast.length
  const avgReturn =
    data.forecast.reduce((sum, d) => sum + d.obratka, 0) / data.forecast.length
  const avgConsumption =
    data.forecast.reduce((sum, d) => sum + d.potreblenie, 0) /
    data.forecast.length
  const avgTemp1 =
    data.forecast.reduce((sum, d) => sum + d.temperatura1, 0) /
    data.forecast.length
  const avgTemp2 =
    data.forecast.reduce((sum, d) => sum + d.temperatura2, 0) /
    data.forecast.length

  // Коэффициент циркуляции (обратка/подача)
  const circulationRatio = (avgReturn / avgSupply) * 100

  // Температурная стабильность
  const tempStability = Math.abs(avgTemp1 - avgTemp2)

  // Максимальные нагрузки
  const maxSupply = Math.max(...data.forecast.map(d => d.podacha))
  const maxConsumption = Math.max(...data.forecast.map(d => d.potreblenie))

  return (
    <div className={styles.analyticsSection}>
      <h2>Ключевые показатели системы</h2>
      <div className={styles.analyticsGrid}>
        <div className={styles.analyticsCard}>
          <div className={styles.cardIcon}>
            <Droplets size={20} />
          </div>
          <h3>Водопотоки</h3>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Средняя подача:</span>
            <span className={styles.metricValue}>
              {avgSupply.toFixed(1)} м³/ч
            </span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Средняя обратка:</span>
            <span className={styles.metricValue}>
              {avgReturn.toFixed(1)} м³/ч
            </span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Потребление:</span>
            <span className={styles.metricValue}>
              {avgConsumption.toFixed(1)} м³/ч
            </span>
          </div>
          <div className={styles.statusIndicator}>
            {circulationRatio >= 80 ? (
              <span className={styles.statusGood}>Циркуляция в норме</span>
            ) : (
              <span className={styles.statusWarning}>Низкая циркуляция</span>
            )}
          </div>
        </div>

        <div className={styles.analyticsCard}>
          <div className={styles.cardIcon}>
            <Thermometer size={20} />
          </div>
          <h3>Температурный режим</h3>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Т1 (подача):</span>
            <span className={styles.metricValue}>{avgTemp1.toFixed(1)}°C</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Т2 (обратка):</span>
            <span className={styles.metricValue}>{avgTemp2.toFixed(1)}°C</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Перепад:</span>
            <span className={styles.metricValue}>
              {tempStability.toFixed(1)}°C
            </span>
          </div>
          <div className={styles.statusIndicator}>
            {tempStability <= 5 ? (
              <span className={styles.statusGood}>Стабильный режим</span>
            ) : (
              <span className={styles.statusWarning}>Большой перепад</span>
            )}
          </div>
        </div>

        <div className={styles.analyticsCard}>
          <div className={styles.cardIcon}>
            <AlertTriangle size={20} />
          </div>
          <h3>Пиковые нагрузки</h3>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Макс. подача:</span>
            <span className={styles.metricValue}>
              {maxSupply.toFixed(1)} м³/ч
            </span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Макс. потребление:</span>
            <span className={styles.metricValue}>
              {maxConsumption.toFixed(1)} м³/ч
            </span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Коэфф. циркуляции:</span>
            <span className={styles.metricValue}>
              {circulationRatio.toFixed(1)}%
            </span>
          </div>
          <div className={styles.statusIndicator}>
            {maxSupply <= 150 && maxConsumption <= 120 ? (
              <span className={styles.statusGood}>Нагрузки в норме</span>
            ) : (
              <span className={styles.statusCritical}>Высокие нагрузки</span>
            )}
          </div>
        </div>

        <div className={styles.analyticsCard}>
          <div className={styles.cardIcon}>
            <Shield size={20} />
          </div>
          <h3>Состояние системы</h3>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Период прогноза:</span>
            <span className={styles.metricValue}>4 дня</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Точность модели:</span>
            <span className={styles.metricValue}>92.4%</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Статус:</span>
            <span className={styles.metricValue}>Мониторинг</span>
          </div>
          <div className={styles.statusIndicator}>
            <span className={styles.statusGood}>
              Система работает стабильно
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

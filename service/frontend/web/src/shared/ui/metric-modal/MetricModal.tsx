import { Chart } from '../Chart'
import { TrendDownIcon, TrendNeutralIcon, TrendUpIcon } from '../Icon/icons'
import styles from './MetricModal.module.scss'
import { FC } from 'react'

interface MetricModalProps {
  isVisible: boolean
  onClose: () => void
  onShowRecommendations?: () => void
  metric: {
    title: string
    value: string
    change: string
    trend: 'up' | 'down' | 'neutral'
    category: string
  } | null
}

const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
  switch (trend) {
    case 'up':
      return <TrendUpIcon />
    case 'down':
      return <TrendDownIcon />
    case 'neutral':
      return <TrendNeutralIcon />
    default:
      return <TrendNeutralIcon />
  }
}

const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
  switch (trend) {
    case 'up':
      return '#CC5F5F'
    case 'down':
      return '#3A78FF'
    case 'neutral':
      return '#3A78FF'
    default:
      return '#3A78FF'
  }
}

// Функция для генерации рандомных данных графика на основе названия показателя
const generateChartData = (
  metricTitle: string,
  trend: 'up' | 'down' | 'neutral',
) => {
  // Создаем хеш на основе названия показателя для консистентности
  const hash = metricTitle
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0)

  const data: { x: number; y: number }[] = []
  let baseValue = 50 + (hash % 30) // Базовое значение от 50 до 80

  for (let i = 0; i < 12; i++) {
    // Добавляем случайные колебания
    const variation = Math.sin(i * 0.5) * 10 + (Math.random() * 6 - 3)

    if (trend === 'up') {
      baseValue += Math.random() * 2 + 0.5 // Постепенный рост
    } else if (trend === 'down') {
      baseValue -= Math.random() * 2 + 0.5 // Постепенное снижение
    }

    const value = Math.max(10, Math.min(100, baseValue + variation))
    data.push({ x: i, y: Math.round(value) })
  }

  return data
}

export const MetricModal: FC<MetricModalProps> = ({
  isVisible,
  onClose,
  onShowRecommendations,
  metric,
}) => {
  if (!isVisible || !metric) return null

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
    >
      <div
        className={styles.modal}
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h3 className={styles.title}>{metric.title}</h3>
          <button
            className={styles.closeButton}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.category}>
            <span className={styles.categoryLabel}>Категория:</span>
            <span className={styles.categoryValue}>{metric.category}</span>
          </div>

          <div className={styles.metricInfo}>
            <div className={styles.valueSection}>
              <span className={styles.valueLabel}>Текущее значение:</span>
              <span
                className={styles.value}
                style={{ color: getTrendColor(metric.trend) }}
              >
                {metric.value}
              </span>
            </div>

            <div className={styles.changeSection}>
              <span className={styles.changeLabel}>Изменение:</span>
              <span
                className={styles.change}
                style={{ color: getTrendColor(metric.trend) }}
              >
                {getTrendIcon(metric.trend)} {metric.change}
              </span>
            </div>
          </div>

          <div className={styles.description}>
            <h4>Описание показателя</h4>
            <p>
              Данный показатель отражает текущее состояние и динамику изменения
              ключевого параметра системы водоснабжения.
              {metric.trend === 'up' && ' Наблюдается положительная динамика.'}
              {metric.trend === 'down' &&
                ' Наблюдается отрицательная динамика.'}
              {metric.trend === 'neutral' && ' Показатель остается стабильным.'}
            </p>

            {/* График динамики показателя */}
            <div className={styles.chartSection}>
              <h5>Динамика за последние 12 месяцев</h5>
              <div className={styles.chartContainer}>
                <Chart
                  data={generateChartData(metric.title, metric.trend)}
                  color={getTrendColor(metric.trend)}
                  animated={true}
                  interactive={true}
                />
              </div>
            </div>

            {/* Кнопка для рекомендаций только при отрицательных показателях (красных) */}
            {metric.trend === 'up' && onShowRecommendations && (
              <div className={styles.recommendationsSection}>
                <button
                  className={styles.recommendationsButton}
                  onClick={onShowRecommendations}
                >
                  📋 Показать рекомендации
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

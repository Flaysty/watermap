import React, { FC, useEffect, useState } from 'react'
import { METRIC_TEMPLATES } from '~/shared/constants'
import {
  formatMetricValue,
  generateConsistentRandom,
  generateTrend,
} from '~/shared/lib/data-utils'
import type { MetricItem, TrendType } from '~/shared/types'
import { MetricCard } from './components/MetricCard'
import { MetricModal } from '../metric-modal'
import { ObjectPopup } from '../object-popup'
import styles from './MetricsPanel.module.scss'
import { Modal } from '~/shared'

interface Category {
  title: string
  metrics: MetricItem[]
}

interface MetricsPanelProps {
  isVisible: boolean
  onClose: () => void
  objectName?: string
}

// Шаблоны вынесены в shared/constants

/**
 * Генерация показателей для объекта
 */
const generateRandomMetrics = (objectName: string): Category[] => {
  const objectHash = generateConsistentRandom(objectName)

  return Object.entries(METRIC_TEMPLATES).map(([categoryTitle, templates]) => {
    const metrics: MetricItem[] = templates.map((template, index) => {
      const seed = generateConsistentRandom(
        objectName + index.toString() + categoryTitle,
      )
      const trend = generateTrend(seed)
      const { value, change } = formatMetricValue(trend, template.unit)

      return {
        title: template.title,
        value,
        change,
        trend,
      }
    })

    return {
      title: categoryTitle,
      metrics,
    }
  })
}

export const MetricsPanel: FC<MetricsPanelProps> = ({
  isVisible,
  onClose,
  objectName = 'Объект водоканала',
}) => {
  const [selectedMetric, setSelectedMetric] = useState<{
    title: string
    value: string
    change: string
    trend: TrendType
    category: string
  } | null>(null)

  const [showRecommendations, setShowRecommendations] = useState(false)
  const [metricsData, setMetricsData] = useState<Category[]>([])

  // Генерируем и фиксируем данные только при первом открытии панели или смене объекта
  useEffect(() => {
    if (isVisible) {
      const generatedData = generateRandomMetrics(objectName)
      setMetricsData(generatedData)
    }
  }, [isVisible, objectName])

  // Сбрасываем данные при закрытии панели
  useEffect(() => {
    if (!isVisible) {
      setMetricsData([])
      setSelectedMetric(null)
      setShowRecommendations(false)
    }
  }, [isVisible])

  const handleMetricClick = (metric: MetricItem, category: string) => {
    // Если это отклонение (красный показатель), сразу открываем рекомендации
    if (metric.trend === 'up') {
      handleShowRecommendations()
    } else {
      // Для нормальных показателей открываем описание
      setSelectedMetric({
        ...metric,
        category,
      })
    }
  }

  const handleCloseModal = () => {
    setSelectedMetric(null)
  }

  const handleShowRecommendations = () => {
    setShowRecommendations(true)
  }

  const handleCloseRecommendations = () => {
    setShowRecommendations(false)
  }

  // Рендер карточек вынесен в компонент MetricCard

  if (!isVisible) return null

  return (
    <div className={styles.metricsPanel}>
      <div className={styles.header}>
        <h3 className={styles.title}>Показатели: {objectName}</h3>
        <button
          className={styles.closeButton}
          onClick={onClose}
        >
          ✕
        </button>
      </div>

      <div className={styles.content}>
        {metricsData.map((category, categoryIndex) => (
          <div
            key={categoryIndex}
            className={styles.category}
          >
            <h4 className={styles.categoryTitle}>{category.title}</h4>
            <div className={styles.metricsGrid}>
              {category.metrics.map((metric, index) => (
                <MetricCard
                  key={index}
                  metric={metric}
                  onClick={m => handleMetricClick(m, category.title)}
                  classNames={{
                    metricCard: styles.metricCard,
                    metricTitle: styles.metricTitle,
                    metricBottom: styles.metricBottom,
                    metricLeft: styles.metricLeft,
                    trendIcon: styles.trendIcon,
                    value: styles.value,
                    arrowIcon: styles.arrowIcon,
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <MetricModal
        isVisible={!!selectedMetric}
        onClose={handleCloseModal}
        onShowRecommendations={handleShowRecommendations}
        metric={selectedMetric}
      />

      {/* Модалка с рекомендациями */}
      <Modal
        isOpen={showRecommendations}
        onClose={handleCloseRecommendations}
      >
        <ObjectPopup
          name={objectName}
          description="Анализ показателей и рекомендации"
          onClose={handleCloseRecommendations}
        />
      </Modal>
    </div>
  )
}

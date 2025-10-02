import type { MetricItem } from '~/shared/types'
import { FC } from 'react'

interface CategorySectionProps {
  title: string
  metrics: MetricItem[]
  onMetricClick: (metric: MetricItem) => void
}

export const CategorySection: FC<CategorySectionProps> = ({
  title,
  metrics,
  onMetricClick,
}) => {
  return (
    <div className={'category'}>
      <h4 className={'categoryTitle'}>{title}</h4>
      <div className={'metricsGrid'}>
        {metrics.map((metric, index) => (
          <div
            key={index}
            onClick={() => onMetricClick(metric)}
          >
            {/* Внешние стили применяются из родительского SCSS через классы */}
          </div>
        ))}
      </div>
    </div>
  )
}

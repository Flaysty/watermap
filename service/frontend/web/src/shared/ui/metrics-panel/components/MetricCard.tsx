import type { MetricItem, TrendType } from '~/shared/types'
import {
  ArrowRightIcon,
  TrendDownIcon,
  TrendNeutralIcon,
  TrendUpIcon,
} from '../../Icon/icons'
import { FC } from 'react'

interface MetricCardClassNames {
  metricCard?: string
  metricTitle?: string
  metricBottom?: string
  metricLeft?: string
  trendIcon?: string
  value?: string
  arrowIcon?: string
}

interface MetricCardProps {
  metric: MetricItem
  onClick: (metric: MetricItem) => void
  classNames?: MetricCardClassNames
}

const getTrendIcon = (trend: TrendType) => {
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

const getTrendColor = (trend: TrendType) => {
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

export const MetricCard: FC<MetricCardProps> = ({
  metric,
  onClick,
  classNames,
}) => {
  return (
    <div
      className={classNames?.metricCard ?? 'metricCard'}
      onClick={() => onClick(metric)}
      style={{ cursor: 'pointer' }}
    >
      <div className={classNames?.metricTitle ?? 'metricTitle'}>
        {metric.title}
      </div>
      <div className={classNames?.metricBottom ?? 'metricBottom'}>
        <div className={classNames?.metricLeft ?? 'metricLeft'}>
          <span className={classNames?.trendIcon ?? 'trendIcon'}>
            {getTrendIcon(metric.trend)}
          </span>
          <span
            className={classNames?.value ?? 'value'}
            style={{ color: getTrendColor(metric.trend) }}
          >
            {metric.value}
          </span>
        </div>
        <span className={classNames?.arrowIcon ?? 'arrowIcon'}>
          <ArrowRightIcon />
        </span>
      </div>
    </div>
  )
}

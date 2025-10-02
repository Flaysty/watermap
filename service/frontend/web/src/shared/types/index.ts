/**
 * Общие типы для приложения
 */
import { ReactNode } from 'react'

export interface BaseComponentProps {
  className?: string
  children?: ReactNode
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export interface PanelProps extends BaseComponentProps {
  title?: string
  isCollapsible?: boolean
  defaultCollapsed?: boolean
  onToggle?: (collapsed: boolean) => void
}

export interface MetricItem {
  title: string
  value: string
  change: string
  trend: 'up' | 'down' | 'neutral'
  unit?: string
}

export interface EventItem {
  id: number
  time: string
  type: 'critical' | 'warning' | 'info'
  priority: 'high' | 'medium' | 'low'
  number?: number
  title: string
  status: string
  // Детальная информация для плана аварии
  location?: string
  problem?: string
  possibleCauses?: string[]
  recommendedActions?: Array<{
    text: string
    urgency: string
    deadline?: string
  }>
  expectedEffect?: string
  responsible?: string
  deadline?: string
  // Динамическая метрика вместо статичной "вероятности утечки"
  metric?: {
    label: string
    value: string
    percentage: number
  }
  // Данные для графика
  chartData?: Array<{
    x: number
    y: number
    label?: string
  }>
  chartConfig?: {
    color: string
    title: string
    xAxisLabel: string
    yAxisLabel: string
    legend?: Array<{
      label: string
      color: string
    }>
    // Поддержка множественных линий
    multiLineData?: Array<{
      data: { x: number; y: number }[]
      color: string
      label: string
    }>
  }
}

export interface MenuItem {
  id: string
  label: string
  icon: ReactNode
  onClick?: () => void
}

export type TrendType = 'up' | 'down' | 'neutral'
export type EventType = 'critical' | 'warning' | 'info'
export type PriorityType = 'high' | 'medium' | 'low'
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl'

import type { EventItem, MetricItem, PriorityType, TrendType } from '../types'

/**
 * Утилиты для работы с данными приложения
 */

/**
 * Генерация консистентного случайного числа на основе строки
 * 
 * @param seed - Строка для генерации хеша
 * @param max - Максимальное значение (по умолчанию 100)
 * @returns Число от 0 до max-1
 */
export const generateConsistentRandom = (seed: string, max: number = 100): number => {
  const hash = seed
    .split('')
    .reduce((hash, char) => hash + char.charCodeAt(0), 0)
  return hash % max
}

/**
 * Получение текстового описания приоритета
 * 
 * @param priority - Уровень приоритета
 * @returns Текстовое описание приоритета
 */
export const getPriorityText = (priority: PriorityType): string => {
  const priorityMap: Record<PriorityType, string> = {
    high: 'Высокий приоритет',
    medium: 'Средний приоритет',
    low: 'Низкий приоритет',
  }
  return priorityMap[priority] || 'Средний приоритет'
}

/**
 * Получение цвета приоритета
 */
export const getPriorityColor = (priority: PriorityType): string => {
  const colorMap: Record<PriorityType, string> = {
    high: '#dc3545',
    medium: '#ffc107',
    low: '#28a745',
  }
  return colorMap[priority] || '#ffc107'
}

/**
 * Получение цвета тренда
 */
export const getTrendColor = (trend: TrendType): string => {
  const colorMap: Record<TrendType, string> = {
    up: '#CC5F5F', // Красный для роста
    down: '#3A78FF', // Синий для снижения
    neutral: '#3A78FF', // Синий для нейтрального
  }
  return colorMap[trend] || '#3A78FF'
}

/**
 * Генерация случайного тренда на основе хеша
 */
export const generateTrend = (hash: number): TrendType => {
  if (hash < 30) return 'up'
  if (hash < 70) return 'down'
  return 'neutral'
}

/**
 * Форматирование значения метрики
 */
export const formatMetricValue = (trend: TrendType, unit: string = '%'): { value: string; change: string } => {
  let changeValue: string
  let value: string

  if (trend === 'up') {
    changeValue = (Math.random() * 25 + 5).toFixed(2) // 5-30%
    value = `+${changeValue}${unit}`
  } else if (trend === 'down') {
    changeValue = (Math.random() * 15 + 2).toFixed(2) // 2-17%
    value = `-${changeValue}${unit}`
  } else {
    changeValue = (Math.random() * 3 + 0.5).toFixed(2) // 0.5-3.5%
    value = `±${changeValue}${unit}`
  }

  return { value, change: value }
}

/**
 * Генерация метрик для объекта
 */
export const generateMetricsForObject = (objectName: string): MetricItem[] => {
  const templates = [
    { title: 'Объем добычи воды', unit: '%' },
    { title: 'Объем добычи воды на собственные нужды', unit: '%' },
    { title: 'Объем подачи воды', unit: '%' },
    { title: 'Объем реализации воды', unit: '%' },
    { title: 'Объем недоходной воды', unit: '%' },
    { title: 'Доля недоходной воды', unit: '%' },
    { title: 'Общее потребление ГСМ', unit: '%' },
  ]

  return templates.map((template, index) => {
    const seed = generateConsistentRandom(objectName + index.toString())
    const trend = generateTrend(seed)
    const { value, change } = formatMetricValue(trend, template.unit)

    return {
      title: template.title,
      value,
      change,
      trend,
    }
  })
}

/**
 * Проверка является ли событие критическим
 */
export const isCriticalEvent = (event: EventItem): boolean => {
  return event.type === 'critical' || event.priority === 'high'
}

/**
 * Сортировка событий по приоритету и времени
 */
export const sortEventsByPriority = (events: EventItem[]): EventItem[] => {
  return [...events].sort((a, b) => {
    // Сначала по типу (critical > warning > info)
    const typeOrder = { critical: 3, warning: 2, info: 1 }
    const typeDiff = typeOrder[b.type] - typeOrder[a.type]
    if (typeDiff !== 0) return typeDiff

    // Затем по приоритету (high > medium > low)
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
    if (priorityDiff !== 0) return priorityDiff

    // Наконец по времени (новые сначала)
    return b.time.localeCompare(a.time)
  })
}

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
export const generateConsistentRandom = (
  seed: string,
  max: number = 100,
): number => {
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
export const formatMetricValue = (
  trend: TrendType,
  unit: string = '%',
): { value: string; change: string } => {
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
    return a.time.localeCompare(b.time)
  })
}

/**
 * Конвертация события падения давления в EmergencyAlert
 */
export const convertPressureDropEventToEmergencyAlert = (event: EventItem) => {
  // Для нового события "Возможная аварийная ситуация" используем данные из инцидента
  if (event.title === 'Возможная аварийная ситуация') {
    return {
      id: event.id,
      address: event.location || 'Тверская ул., д. 3',
      cause: 'Старение и коррозия → Порывы/утечки',
      system: 'Водопроводные сети',
      equipment: 'Трубы (чугун/сталь/ПЭ/ПВХ)',
      consequence: 'Утечка воды на участке ДУ300, сталь, 1990 г.в.',
      criticality: 9,
      hoursToFailure: 1.5,
      preventionHours: 4,
      startTime: '18.10.2025 13:59',
      predictedFailureTime: '18.10.2025 16:29',
      actionRequired: true,
      priorityScore: 533.33,
      recommendations:
        'Локализовать участок согласно СП 31.13330.2012; закрыть задвижки по схеме отключения; снизить давление до 0.3 МПа; направить АВБ с муфтами типа "Жибо" и хомутами; запустить корреляционный поиск утечек по ГОСТ Р 56201-2014.',
    }
  }

  // Для остальных событий используем старую логику
  // Извлекаем текущее давление из метрики
  const currentPressure = parseFloat(
    event.metric?.value?.replace(' атм', '') || '1.2',
  )
  const normalPressure = 2.5 // Нормальное давление
  const criticalPressure = 0.8 // Критическое давление

  // Рассчитываем время до критического состояния
  const pressureDropRate = (normalPressure - currentPressure) / 6 // за 6 часов упало
  const hoursToCritical = Math.max(
    0,
    (currentPressure - criticalPressure) / pressureDropRate,
  )

  return {
    id: event.id,
    address: event.location || 'Адрес не указан',
    cause: event.problem || 'Причина не указана',
    system: 'Система водоснабжения',
    equipment: 'Трубопровод ДУ300',
    consequence:
      event.expectedEffect || 'Отключение водоснабжения у 200 абонентов',
    criticality: 10, // Критический приоритет
    hoursToFailure: 1.5, // Полтора часа до критического состояния
    preventionHours: 0.5, // 30 минут на предотвращение
    startTime: event.time,
    predictedFailureTime: new Date(
      Date.now() + hoursToCritical * 3600000,
    ).toLocaleTimeString(),
    actionRequired: true,
    priorityScore: event.metric?.percentage || 40,
    recommendations:
      event.recommendedActions?.map(action => action.text).join('; ') ||
      'Немедленное вмешательство требуется',
  }
}

import { ProcessedChartData } from '../../../../shared/api/chart-api'
import { Chart } from '../../../../shared/ui/Chart'
import { Droplets, Thermometer } from 'lucide-react'
import styles from './ChartsGrid.module.scss'

interface ChartsGridProps {
  data: ProcessedChartData
  timeGrouping: 'hourly' | 'daily' | 'weekly'
}

export const ChartsGrid = ({ data, timeGrouping }: ChartsGridProps) => {
  // Функция группировки данных по часам/дням/неделям
  const groupDataByTime = (
    values: number[],
    datetimes: string[],
    grouping: 'hourly' | 'daily' | 'weekly',
    isTemperature = false, // Флаг для температуры
  ) => {
    const groupedData: { [key: string]: number[] } = {}

    datetimes.forEach((datetime, index) => {
      const date = new Date(datetime)
      let groupKey: string = ''

      if (grouping === 'hourly') {
        // Группировка по часам - просто округляем до часа
        groupKey = date.toISOString().slice(0, 13) // YYYY-MM-DDTHH
      } else if (grouping === 'daily') {
        // Группировка по дням
        groupKey = date.toISOString().split('T')[0] // YYYY-MM-DD
      } else if (grouping === 'weekly') {
        // Группировка по неделям (понедельник - начало недели)
        const year = date.getFullYear()
        const month = date.getMonth()
        const day = date.getDate()
        const dayOfWeek = date.getDay() // 0 = воскресенье, 1 = понедельник, ..., 6 = суббота
        const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // Дней до понедельника

        // Создаем дату начала недели безопасно
        const weekStart = new Date(year, month, day - daysToMonday)
        groupKey = weekStart.toISOString().split('T')[0]
      }

      if (!groupedData[groupKey]) {
        groupedData[groupKey] = []
      }
      groupedData[groupKey].push(values[index])
    })

    // Преобразуем в формат для графика
    return Object.entries(groupedData).map(([date, values], index) => {
      const formattedLabel =
        grouping === 'hourly'
          ? new Date(date + ':00:00.000Z').toLocaleString('ru-RU', {
              day: '2-digit',
              month: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })
          : grouping === 'weekly'
            ? new Date(date).toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
              }) + ' (неделя)'
            : new Date(date).toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
              }) + ' (день)'

      return {
        x: formattedLabel, // Используем отформатированную дату как x
        y: isTemperature
          ? values.reduce((sum, val) => sum + val, 0) / values.length // Среднее для температуры
          : values.reduce((sum, val) => sum + val, 0), // Сумма для водопотоков
        label: formattedLabel,
      }
    })
  }

  const waterSupplyData = groupDataByTime(
    data.podacha,
    data.datetime,
    timeGrouping,
  )
  const returnFlowData = groupDataByTime(
    data.obratka,
    data.datetime,
    timeGrouping,
  )
  const consumptionData = groupDataByTime(
    data.potreblenie,
    data.datetime,
    timeGrouping,
  )
  const temperature1Data = groupDataByTime(
    data.temperatura1,
    data.datetime,
    timeGrouping,
    true, // isTemperature = true
  )
  const temperature2Data = groupDataByTime(
    data.temperatura2,
    data.datetime,
    timeGrouping,
    true, // isTemperature = true
  )

  // Отладочная информация
  console.log('Current data debug:', {
    totalItems: data.datetime.length,
    timeGrouping,
    waterSupplyPoints: waterSupplyData.length,
    returnFlowPoints: returnFlowData.length,
    consumptionPoints: consumptionData.length,
    temperature1Points: temperature1Data.length,
    temperature2Points: temperature2Data.length,
    firstFewItems: data.datetime.slice(0, 3),
  })

  return (
    <div className={styles.chartsSection}>
      <h3>
        Графики показателей (
        {timeGrouping === 'hourly'
          ? 'по часам'
          : timeGrouping === 'daily'
            ? 'по дням'
            : 'по неделям'}
        )
      </h3>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h4>
              <Droplets size={20} />
              Подача, обратка и потребление воды (м³/час)
            </h4>
          </div>
          <div className={styles.chartContainer}>
            <Chart
              data={[]}
              multiLineData={[
                {
                  data: waterSupplyData,
                  color: '#3b82f6',
                  label: 'Подача',
                },
                {
                  data: returnFlowData,
                  color: '#10b981',
                  label: 'Обратка',
                },
                {
                  data: consumptionData,
                  color: '#8b5cf6',
                  label: 'Потребление',
                },
              ]}
              xAxisLabel="Период"
              yAxisLabel="м³/час"
              unit="м³/час"
              metricName="Водопотоки"
              showLegend={true}
              thresholds={{
                warning: { min: 80, max: 120 },
                critical: { min: 120, max: 200 },
                optimal: { min: 50, max: 80 },
              }}
            />
            {waterSupplyData.length === 0 &&
              returnFlowData.length === 0 &&
              consumptionData.length === 0 && (
                <div className={styles.noDataMessage}>
                  Нет данных для отображения
                </div>
              )}
          </div>
        </div>

        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h4>
              <Thermometer size={20} />
              Температура ГВС Т1 и Т2 (°C)
            </h4>
          </div>
          <div className={styles.chartContainer}>
            <Chart
              data={[]}
              multiLineData={[
                {
                  data: temperature1Data,
                  color: '#ef4444',
                  label: 'Т1',
                },
                {
                  data: temperature2Data,
                  color: '#f97316',
                  label: 'Т2',
                },
              ]}
              xAxisLabel="Период"
              yAxisLabel="°C"
              unit="°C"
              metricName="Температура ГВС"
              showLegend={true}
              thresholds={{
                warning: { min: 55, max: 65 },
                critical: { min: 65, max: 80 },
                optimal: { min: 45, max: 55 },
              }}
            />
            {temperature1Data.length === 0 && temperature2Data.length === 0 && (
              <div className={styles.noDataMessage}>
                Нет данных для отображения
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

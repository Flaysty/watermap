import { useState, useEffect } from 'react'
import { Chart } from '../../../../shared/ui/Chart'
import {
  fetchChartData,
  ProcessedChartData,
} from '../../../../shared/api/chart-api'
import { DataTable } from '../data-table'
import { ChartsGrid } from '../charts-grid'
import styles from './CurrentDataSection.module.scss'

export const CurrentDataSection = () => {
  const [currentData, setCurrentData] = useState<ProcessedChartData | null>(
    null,
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeGrouping, setTimeGrouping] = useState<
    'hourly' | 'daily' | 'weekly'
  >('daily')

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const data = await fetchChartData()
        setCurrentData(data)
      } catch (err) {
        console.error('Data loading error:', err)
        setError('Ошибка загрузки данных')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Загрузка данных мониторинга...</p>
      </div>
    )
  }

  if (error || !currentData) {
    return (
      <div className={styles.error}>
        <h3>Ошибка загрузки данных</h3>
        <p>{error || 'Не удалось загрузить данные'}</p>
      </div>
    )
  }

  return (
    <div className={styles.currentDataSection}>
      <div className={styles.sectionHeader}>
        <h2>Текущий мониторинг системы водоснабжения</h2>
      </div>

      <DataTable data={currentData} />

      <div className={styles.chartsSectionHeader}>
        <div className={styles.timeGroupingControls}>
          <button
            className={`${styles.groupingButton} ${timeGrouping === 'hourly' ? styles.active : ''}`}
            onClick={() => setTimeGrouping('hourly')}
          >
            По часам
          </button>
          <button
            className={`${styles.groupingButton} ${timeGrouping === 'daily' ? styles.active : ''}`}
            onClick={() => setTimeGrouping('daily')}
          >
            По дням
          </button>
          <button
            className={`${styles.groupingButton} ${timeGrouping === 'weekly' ? styles.active : ''}`}
            onClick={() => setTimeGrouping('weekly')}
          >
            По неделям
          </button>
        </div>
      </div>

      <ChartsGrid
        data={currentData}
        timeGrouping={timeGrouping}
      />
    </div>
  )
}

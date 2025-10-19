import { ProcessedChartData } from '../../../../shared/api/chart-api'
import styles from './DataTable.module.scss'

interface DataTableProps {
  data: ProcessedChartData
}

// Нормативы МВК и РФ
const regulations = {
  temperature: {
    min: 60, // °C - минимальная температура ГВС по СанПиН
    max: 75, // °C - максимальная температура ГВС по СанПиН
    optimal: 65, // °C - оптимальная температура
    source: 'СанПиН 2.1.4.2496-09',
  },
  waterLoss: {
    max: 15, // % - максимальные потери воды
    optimal: 8, // % - оптимальные потери
    source: 'СП 30.13330.2016',
  },
  efficiency: {
    min: 85, // % - минимальная эффективность системы
    optimal: 92, // % - оптимальная эффективность
    source: 'МВК стандарты',
  },
  pressure: {
    min: 0.3, // МПа - минимальное давление
    max: 0.6, // МПа - максимальное давление
    source: 'СП 30.13330.2016',
  },
}

export const DataTable = ({ data }: DataTableProps) => {
  const getCurrentValue = (values: number[]) => values[values.length - 1] || 0
  const getAverageValue = (values: number[]) =>
    values.reduce((sum, val) => sum + val, 0) / values.length

  const efficiency =
    (getAverageValue(data.obratka) / getAverageValue(data.podacha)) * 100

  return (
    <div className={styles.dataTable}>
      <div className={styles.tableHeader}>
        <h3>Последние измерения</h3>
        <div className={styles.tableInfo}>
          <span>Обновлено: {new Date().toLocaleString('ru-RU')}</span>
        </div>
      </div>

      <div className={styles.tableGrid}>
        <div className={styles.tableCard}>
          <div className={styles.cardHeader}>
            <h4>Водоподача</h4>
            <span className={styles.unit}>м³/час</span>
          </div>
          <div className={styles.currentValue}>
            {getCurrentValue(data.podacha).toFixed(1)}
          </div>
          <div className={styles.trend}>
            <span className={styles.trendLabel}>Среднее за период:</span>
            <span className={styles.trendValue}>
              {getAverageValue(data.podacha).toFixed(1)}
            </span>
          </div>
        </div>

        <div className={styles.tableCard}>
          <div className={styles.cardHeader}>
            <h4>Обратка</h4>
            <span className={styles.unit}>м³/час</span>
          </div>
          <div className={styles.currentValue}>
            {getCurrentValue(data.obratka).toFixed(1)}
          </div>
          <div className={styles.trend}>
            <span className={styles.trendLabel}>Среднее за период:</span>
            <span className={styles.trendValue}>
              {getAverageValue(data.obratka).toFixed(1)}
            </span>
          </div>
        </div>

        <div className={styles.tableCard}>
          <div className={styles.cardHeader}>
            <h4>Потребление</h4>
            <span className={styles.unit}>м³/час</span>
          </div>
          <div className={styles.currentValue}>
            {getCurrentValue(data.potreblenie).toFixed(1)}
          </div>
          <div className={styles.trend}>
            <span className={styles.trendLabel}>Среднее за период:</span>
            <span className={styles.trendValue}>
              {getAverageValue(data.potreblenie).toFixed(1)}
            </span>
          </div>
        </div>

        <div className={styles.tableCard}>
          <div className={styles.cardHeader}>
            <h4>Температура Т1</h4>
            <span className={styles.unit}>°C</span>
          </div>
          <div className={styles.currentValue}>
            {getCurrentValue(data.temperatura1).toFixed(1)}
          </div>
          {/* <div className={styles.normativeIndicator}>
            <span className={styles.normativeLabel}>Норматив:</span>
            <span className={styles.normativeValue}>
              {regulations.temperature.min}-{regulations.temperature.max}°C
            </span>
            <span className={styles.normativeSource}>
              ({regulations.temperature.source})
            </span>
          </div> */}
          <div className={styles.trend}>
            <span className={styles.trendLabel}>Среднее за период:</span>
            <span className={styles.trendValue}>
              {getAverageValue(data.temperatura1).toFixed(1)}
            </span>
          </div>
        </div>

        <div className={styles.tableCard}>
          <div className={styles.cardHeader}>
            <h4>Температура Т2</h4>
            <span className={styles.unit}>°C</span>
          </div>
          <div className={styles.currentValue}>
            {getCurrentValue(data.temperatura2).toFixed(1)}
          </div>
          <div className={styles.trend}>
            <span className={styles.trendLabel}>Среднее за период:</span>
            <span className={styles.trendValue}>
              {getAverageValue(data.temperatura2).toFixed(1)}
            </span>
          </div>
        </div>

        <div className={styles.tableCard}>
          <div className={styles.cardHeader}>
            <h4>Эффективность</h4>
            <span className={styles.unit}>%</span>
          </div>
          <div className={styles.currentValue}>{efficiency.toFixed(1)}</div>
          <div className={styles.trend}>
            <span className={styles.trendLabel}>Коэффициент возврата:</span>
            <span className={styles.trendValue}>{efficiency.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

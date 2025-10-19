import { useState } from 'react'
import { BarChart3, AlertTriangle } from 'lucide-react'
import { CurrentDataSection } from '../widgets/current-data-section'
import { ForecastSection } from '../widgets/forecast-section'
import styles from './PredictionsPage.module.scss'

export const PredictionsPage = () => {
  const [activeTab, setActiveTab] = useState<'current' | 'forecast'>('current')

  return (
    <div className={styles.content}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Прогнозирование аварийных ситуаций</h1>
          <p className={styles.subtitle}>
            Мониторинг водоканала с предупреждением критических ситуаций
          </p>
        </div>
      </div>

      {/* Переключатель вкладок */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'current' ? styles.active : ''}`}
          onClick={() => setActiveTab('current')}
        >
          <BarChart3 size={16} />
          Текущий мониторинг
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'forecast' ? styles.active : ''}`}
          onClick={() => setActiveTab('forecast')}
        >
          <AlertTriangle size={16} />
          Прогнозы и предупреждения
        </button>
      </div>

      {/* Контент вкладок */}
      {activeTab === 'current' && <CurrentDataSection />}
      {activeTab === 'forecast' && <ForecastSection />}
    </div>
  )
}

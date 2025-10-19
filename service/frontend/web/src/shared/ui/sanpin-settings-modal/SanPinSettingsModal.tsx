import React, { useState } from 'react'
import {
  Thermometer,
  Droplets,
  Save,
  RotateCcw,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
} from 'lucide-react'
import styles from './SanPinSettingsModal.module.scss'

interface SanPinSettingsModalProps {
  onClose: () => void
}

interface Thresholds {
  optimal: { min: number; max: number }
  warning: { min: number; max: number }
  critical: { min: number; max: number }
}

interface SanPinSettings {
  temperature: Thresholds
  waterFlow: Thresholds
}

const defaultSettings: SanPinSettings = {
  temperature: {
    optimal: { min: 60, max: 75 },
    warning: { min: 55, max: 60 },
    critical: { min: 75, max: 90 },
  },
  waterFlow: {
    optimal: { min: 0.1, max: 0.2 },
    warning: { min: 0.2, max: 0.4 },
    critical: { min: 0.5, max: 0.8 },
  },
}

export const SanPinSettingsModal: React.FC<SanPinSettingsModalProps> = ({
  onClose,
}) => {
  const [settings, setSettings] = useState<SanPinSettings>(defaultSettings)
  const [activeTab, setActiveTab] = useState<'temperature' | 'waterFlow'>(
    'temperature',
  )

  const handleThresholdChange = (
    category: 'temperature' | 'waterFlow',
    level: 'optimal' | 'warning' | 'critical',
    field: 'min' | 'max',
    value: number,
  ) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [level]: {
          ...prev[category][level],
          [field]: value,
        },
      },
    }))
  }

  const handleSave = () => {
    // Здесь можно добавить логику сохранения в localStorage или отправки на сервер
    console.log('Сохранение настроек СанПиН:', settings)
    onClose()
  }

  const handleReset = () => {
    setSettings(defaultSettings)
  }

  const getStatusIcon = (level: 'optimal' | 'warning' | 'critical') => {
    switch (level) {
      case 'optimal':
        return (
          <CheckCircle
            size={16}
            className={styles.statusIconOptimal}
          />
        )
      case 'warning':
        return (
          <AlertTriangle
            size={16}
            className={styles.statusIconWarning}
          />
        )
      case 'critical':
        return (
          <XCircle
            size={16}
            className={styles.statusIconCritical}
          />
        )
    }
  }

  const getStatusColor = (level: 'optimal' | 'warning' | 'critical') => {
    switch (level) {
      case 'optimal':
        return '#10b981'
      case 'warning':
        return '#f59e0b'
      case 'critical':
        return '#ef4444'
    }
  }

  return (
    <div className={styles.modal}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <Settings size={24} />
          Настройки порогов по нормам СанПиН
        </h2>
        <button
          className={styles.closeButton}
          onClick={onClose}
        >
          ✕
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'temperature' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('temperature')}
          >
            <Thermometer size={18} />
            Температура ГВС
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'waterFlow' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('waterFlow')}
          >
            <Droplets size={18} />
            Водопотоки
          </button>
        </div>

        <div className={styles.settingsContent}>
          {activeTab === 'temperature' && (
            <div className={styles.thresholdsSection}>
              <div className={styles.sectionHeader}>
                <h3>Пороги температуры ГВС (°C)</h3>
                <div className={styles.infoTooltip}>
                  <Info size={16} />
                  <div className={styles.tooltipContent}>
                    <strong>СанПиН 2.1.4.2496-09:</strong>
                    <br />
                    • Т1 (подача): 60-75°C
                    <br />
                    • Т2 (обратка): не менее 55°C
                    <br />• Критично: выше 75°C
                  </div>
                </div>
              </div>

              {(['optimal', 'warning', 'critical'] as const).map(level => (
                <div
                  key={level}
                  className={styles.thresholdGroup}
                >
                  <div className={styles.thresholdHeader}>
                    {getStatusIcon(level)}
                    <span
                      className={styles.thresholdLabel}
                      style={{ color: getStatusColor(level) }}
                    >
                      {level === 'optimal'
                        ? 'Оптимально'
                        : level === 'warning'
                          ? 'Предупреждение'
                          : 'Критично'}
                    </span>
                  </div>
                  <div className={styles.inputGroup}>
                    <div className={styles.inputField}>
                      <label>От:</label>
                      <input
                        type="number"
                        value={settings.temperature[level].min}
                        onChange={e =>
                          handleThresholdChange(
                            'temperature',
                            level,
                            'min',
                            Number(e.target.value),
                          )
                        }
                        className={styles.numberInput}
                      />
                    </div>
                    <div className={styles.inputField}>
                      <label>До:</label>
                      <input
                        type="number"
                        value={settings.temperature[level].max}
                        onChange={e =>
                          handleThresholdChange(
                            'temperature',
                            level,
                            'max',
                            Number(e.target.value),
                          )
                        }
                        className={styles.numberInput}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'waterFlow' && (
            <div className={styles.thresholdsSection}>
              <div className={styles.sectionHeader}>
                <h3>Пороги водопотоков (м³/час)</h3>
                <div className={styles.infoTooltip}>
                  <Info size={16} />
                  <div className={styles.tooltipContent}>
                    <strong>Промышленные нормы:</strong>
                    <br />
                    • Оптимально: 0.1-0.2 м³/ч
                    <br />
                    • Предупреждение: 0.2-0.4 м³/ч
                    <br />• Критично: выше 0.5 м³/ч
                  </div>
                </div>
              </div>

              {(['optimal', 'warning', 'critical'] as const).map(level => (
                <div
                  key={level}
                  className={styles.thresholdGroup}
                >
                  <div className={styles.thresholdHeader}>
                    {getStatusIcon(level)}
                    <span
                      className={styles.thresholdLabel}
                      style={{ color: getStatusColor(level) }}
                    >
                      {level === 'optimal'
                        ? 'Оптимально'
                        : level === 'warning'
                          ? 'Предупреждение'
                          : 'Критично'}
                    </span>
                  </div>
                  <div className={styles.inputGroup}>
                    <div className={styles.inputField}>
                      <label>От:</label>
                      <input
                        type="number"
                        step="0.1"
                        value={settings.waterFlow[level].min}
                        onChange={e =>
                          handleThresholdChange(
                            'waterFlow',
                            level,
                            'min',
                            Number(e.target.value),
                          )
                        }
                        className={styles.numberInput}
                      />
                    </div>
                    <div className={styles.inputField}>
                      <label>До:</label>
                      <input
                        type="number"
                        step="0.1"
                        value={settings.waterFlow[level].max}
                        onChange={e =>
                          handleThresholdChange(
                            'waterFlow',
                            level,
                            'max',
                            Number(e.target.value),
                          )
                        }
                        className={styles.numberInput}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles.footer}>
        <button
          className={styles.resetButton}
          onClick={handleReset}
        >
          <RotateCcw size={16} />
          Сбросить
        </button>
        <div className={styles.footerActions}>
          <button
            className={styles.cancelButton}
            onClick={onClose}
          >
            Отмена
          </button>
          <button
            className={styles.saveButton}
            onClick={handleSave}
          >
            <Save size={16} />
            Сохранить
          </button>
        </div>
      </div>
    </div>
  )
}

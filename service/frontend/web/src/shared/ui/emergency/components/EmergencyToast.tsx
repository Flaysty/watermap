import React, { useEffect, useState } from 'react'
import { AlertTriangle, CheckCircle, Clock, X } from 'lucide-react'
import toast from 'react-hot-toast'
import type { EmergencyAlert } from '../types'
import { showSimpleToast } from './SimpleToast'
import styles from '../styles/EmergencyToast.module.scss'

interface EmergencyToastProps {
  alert: EmergencyAlert
  onDismiss: () => void
  onTakeAction: () => void
  onPostpone: () => void
  onOpenWorkflow: () => void
}

export const EmergencyToast: React.FC<EmergencyToastProps> = ({
  alert,
  onDismiss,
  onTakeAction,
  onPostpone,
  onOpenWorkflow,
}) => {
  // Конвертируем часы в секунды для точного расчета
  const totalSeconds = Math.floor(alert.hoursToFailure * 3600)
  const [timeLeft, setTimeLeft] = useState(totalSeconds)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000) // обновляем каждую секунду

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getCriticalityColor = (criticality: number) => {
    if (criticality >= 8) return '#dc2626' // красный
    if (criticality >= 6) return '#d97706' // оранжевый
    return '#2563eb' // синий
  }

  const getCriticalityText = (criticality: number) => {
    if (criticality >= 8) return 'КРИТИЧЕСКАЯ'
    if (criticality >= 6) return 'ВЫСОКАЯ'
    return 'СРЕДНЯЯ'
  }

  if (!isVisible) return null

  return (
    <div className={styles.emergencyToast}>
      <div className={styles.toastHeader}>
        <div className={styles.alertIcon}>
          <AlertTriangle size={24} />
        </div>
        <div className={styles.alertInfo}>
          <h3 className={styles.alertTitle}>{alert.cause}</h3>
          <p className={styles.alertSubtitle}>
            {getCriticalityText(alert.criticality)} приоритет • ID: {alert.id}
          </p>
        </div>
        <button
          className={styles.closeButton}
          onClick={() => {
            setIsVisible(false)
            onDismiss()
          }}
        >
          <X size={20} />
        </button>
      </div>

      <div className={styles.toastContent}>
        <div className={styles.locationInfo}>
          <h4 className={styles.address}>{alert.address}</h4>
          <p className={styles.system}>
            {alert.system} • {alert.equipment}
          </p>
        </div>

        <div className={styles.alertDetails}>
          <p className={styles.cause}>
            <strong>Проблема:</strong> Падение давления до 1.2 атм при норме
            2.5-3.0 атм
          </p>
          <p className={styles.consequence}>
            <strong>Последствие:</strong> Без вмешательства давление упадет до
            0.8 атм в течение 30 минут, что приведет к отключению воды у 200
            абонентов
          </p>
        </div>

        <div className={styles.timerSection}>
          <div className={styles.timerContainer}>
            <div className={styles.timerDisplay}>
              <span className={styles.timerLabel}>
                До критического падения давления:
              </span>
              <span
                className={styles.timerValue}
                style={{ color: '#dc2626' }}
              >
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button
            className={`${styles.actionButton} ${styles.postponeButton}`}
            onClick={() => {
              showSimpleToast('Падение давления отложено на 30 минут', 'info')
              onPostpone()
            }}
          >
            <Clock size={16} />
            Отложить
          </button>
          <button
            className={`${styles.actionButton} ${styles.takeActionButton}`}
            onClick={() => {
              onTakeAction()
              onOpenWorkflow()
            }}
          >
            <CheckCircle size={16} />
            Взять в работу
          </button>
        </div>
      </div>
    </div>
  )
}

// Функция для показа аварийного тоста
export const showEmergencyToast = (
  alert: EmergencyAlert,
  onOpenWorkflow: () => void,
) => {
  return toast.custom(
    t => (
      <EmergencyToast
        alert={alert}
        onDismiss={() => toast.remove(t.id)}
        onTakeAction={() => toast.remove(t.id)}
        onPostpone={() => toast.remove(t.id)}
        onOpenWorkflow={onOpenWorkflow}
      />
    ),
    {
      duration: Infinity,
      position: 'top-center',
    },
  )
}

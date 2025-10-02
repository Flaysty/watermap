import React, { FC, useEffect, useState } from 'react'
import { AlertCircle, ArrowRight, CheckCircle, Shield, X } from 'lucide-react'
import styles from './ElectronicSignature.module.scss'

interface ElectronicSignatureProps {
  isVisible: boolean
  onClose: () => void
  onComplete: () => void
}

export const ElectronicSignature: FC<ElectronicSignatureProps> = ({
  isVisible,
  onClose,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)

  const steps = [
    {
      name: 'Проверка сертификата',
      description: 'Проверка действительности сертификата подписанта',
      action: 'Проверить сертификат',
      details: 'Сертификат действителен до 15.12.2024',
    },
    {
      name: 'Валидация подписи',
      description: 'Проверка соответствия подписи требованиям',
      action: 'Валидировать подпись',
      details: 'Подпись соответствует ГОСТ Р 34.10-2012',
    },
    {
      name: 'Шифрование документа',
      description: 'Шифрование документа перед подписанием',
      action: 'Зашифровать документ',
      details: 'Используется алгоритм AES-256',
    },
    {
      name: 'Создание подписи',
      description: 'Создание электронной подписи документа',
      action: 'Подписать документ',
      details: 'Подпись создана успешно',
    },
    {
      name: 'Завершение',
      description: 'Финализация процесса подписания',
      action: 'Завершить подписание',
      details: 'Документ подписан и сохранен',
    },
  ]

  // Автоматическое выполнение шагов 1-3 и 5
  useEffect(() => {
    if (!isVisible || isCompleted) return

    // Если это автоматический шаг (не подписание)
    if (currentStep !== 3 && !completedSteps.includes(currentStep)) {
      setIsLoading(true)
      setLoadingProgress(0)

      const loadingDuration = 1500 + Math.random() * 1000 // 1.5-2.5 секунды
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          const increment = 100 / (loadingDuration / 50)
          const newProgress = prev + increment

          if (newProgress >= 100) {
            clearInterval(interval)
            setIsLoading(false)
            setLoadingProgress(0)

            // Завершаем текущий шаг
            setCompletedSteps(prev => [...prev, currentStep])

            // Переходим к следующему шагу
            if (currentStep < steps.length - 1) {
              setCurrentStep(prev => prev + 1)
            } else {
              // Последний шаг завершен
              setIsCompleted(true)
              onComplete()
            }

            return 100
          }

          return newProgress
        })
      }, 50)

      return () => clearInterval(interval)
    }
  }, [
    currentStep,
    isVisible,
    isCompleted,
    completedSteps,
    steps.length,
    onComplete,
  ])

  const handleStepConfirm = () => {
    // Только для шага подписания (4-й шаг)
    if (currentStep === 3) {
      setIsLoading(true)
      setLoadingProgress(0)

      const loadingDuration = 2000 + Math.random() * 1000 // 2-3 секунды
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          const increment = 100 / (loadingDuration / 50)
          const newProgress = prev + increment

          if (newProgress >= 100) {
            clearInterval(interval)
            setIsLoading(false)
            setLoadingProgress(0)

            // Завершаем шаг подписания
            setCompletedSteps(prev => [...prev, currentStep])

            // Переходим к последнему шагу
            setCurrentStep(prev => prev + 1)

            return 100
          }

          return newProgress
        })
      }, 50)
    }
  }

  const progress =
    ((completedSteps.length + (currentStep < steps.length ? 1 : 0)) /
      steps.length) *
    100

  if (!isVisible) return null

  const currentStepData = steps[currentStep]

  // Финальный экран с анимированной галочкой
  if (isCompleted) {
    return (
      <div className={styles.overlay}>
        <div className={styles.completionModal}>
          <div className={styles.checkmarkContainer}>
            <div className={styles.checkmarkCircle}>
              <div className={styles.checkmark}>
                <div className={styles.checkmarkStem}></div>
                <div className={styles.checkmarkKick}></div>
              </div>
            </div>
          </div>
          <div className={styles.completionContent}>
            <h3 className={styles.completionTitle}>Подпись завершена!</h3>
            <p className={styles.completionSubtitle}>
              Документ успешно подписан и сохранен
            </p>
            <button
              className={styles.closeCompletionButton}
              onClick={onClose}
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <Shield className={styles.icon} />
            <div>
              <h3 className={styles.title}>Электронная подпись</h3>
              <p className={styles.subtitle}>Подписание плана действий</p>
            </div>
          </div>
          <button
            className={styles.closeButton}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.progressSection}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className={styles.progressText}>
              Шаг {currentStep + 1} из {steps.length}
            </div>
          </div>

          <div className={styles.currentStep}>
            <div className={styles.stepHeader}>
              <div className={styles.stepIcon}>
                {completedSteps.includes(currentStep) ? (
                  <CheckCircle size={24} />
                ) : (
                  <AlertCircle size={24} />
                )}
              </div>
              <div className={styles.stepInfo}>
                <h4 className={styles.stepTitle}>{currentStepData.name}</h4>
                <p className={styles.stepDescription}>
                  {currentStepData.description}
                </p>
              </div>
            </div>

            <div className={styles.stepDetails}>
              <div className={styles.detailsCard}>
                <div className={styles.detailsHeader}>
                  <span className={styles.detailsLabel}>Детали:</span>
                </div>
                <div className={styles.detailsContent}>
                  {currentStepData.details}
                </div>
              </div>
            </div>

            <div className={styles.stepActions}>
              {isLoading ? (
                <div className={styles.loadingContainer}>
                  <div className={styles.loadingBar}>
                    <div
                      className={styles.loadingFill}
                      style={{ width: `${loadingProgress}%` }}
                    />
                  </div>
                  <div className={styles.loadingText}>
                    Выполняется... {Math.round(loadingProgress)}%
                  </div>
                </div>
              ) : (
                <>
                  {currentStep === 3 && (
                    <button
                      className={styles.confirmButton}
                      onClick={handleStepConfirm}
                    >
                      <ArrowRight size={16} />
                      {currentStepData.action}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          <div className={styles.completedSteps}>
            <h5 className={styles.completedTitle}>Завершенные шаги:</h5>
            <div className={styles.completedList}>
              {completedSteps.map(stepIndex => (
                <div
                  key={stepIndex}
                  className={styles.completedItem}
                >
                  <CheckCircle size={16} />
                  <span>{steps[stepIndex].name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.signatureInfo}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Подписант:</span>
              <span className={styles.infoValue}>Иванов И.И.</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Сертификат:</span>
              <span className={styles.infoValue}>
                CN=Иванов И.И., O=Водоканал
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Время подписи:</span>
              <span className={styles.infoValue}>
                {new Date().toLocaleString('ru-RU')}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button
            className={styles.cancelButton}
            onClick={onClose}
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  )
}

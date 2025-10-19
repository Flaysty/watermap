import { useState, useEffect } from 'react'
import { showEmergencyToast } from '../ui/emergency'
import { MOCK_EVENTS } from '../constants/constants'
import { convertPressureDropEventToEmergencyAlert } from '../lib/data-utils'

interface EmergencyAlert {
  id: number
  address: string
  cause: string
  system: string
  equipment: string
  consequence: string
  criticality: number
  hoursToFailure: number
  preventionHours: number
  startTime: string
  predictedFailureTime: string
  actionRequired: boolean
  priorityScore: number
  recommendations: string
}

// Получаем событие "Возможная аварийная ситуация" из MOCK_EVENTS
const emergencyEvent = MOCK_EVENTS.find(event =>
  event.title.includes('Возможная аварийная ситуация'),
)
const emergencyAlert = emergencyEvent
  ? convertPressureDropEventToEmergencyAlert(emergencyEvent)
  : null

export const useEmergencyAlerts = () => {
  const [currentAlert, setCurrentAlert] = useState<EmergencyAlert | null>(null)
  const [isWorkflowOpen, setIsWorkflowOpen] = useState(false)
  const [hasBeenShown, setHasBeenShown] = useState(false)

  // Инициализируем аварию "Возможная аварийная ситуация" без показа
  useEffect(() => {
    if (emergencyAlert) {
      setCurrentAlert(emergencyAlert)
    }
  }, [])

  // Функция для показа аварии "Возможная аварийная ситуация" (только один раз)
  const showEmergencyAlert = () => {
    if (!hasBeenShown && currentAlert) {
      setHasBeenShown(true)
      showEmergencyToast(currentAlert, () => setIsWorkflowOpen(true))
    }
  }

  const openWorkflow = () => setIsWorkflowOpen(true)
  const closeWorkflow = () => setIsWorkflowOpen(false)

  return {
    currentAlert,
    isWorkflowOpen,
    openWorkflow,
    closeWorkflow,
    showEmergencyAlert,
    hasBeenShown,
    totalAlerts: emergencyAlert ? 1 : 0,
  }
}

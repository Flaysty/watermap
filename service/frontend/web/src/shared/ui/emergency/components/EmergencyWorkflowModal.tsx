import React, { useState } from 'react'
import { X } from 'lucide-react'
import type { EmergencyAlert } from '../types'
import { EmergencyWorkflow } from './EmergencyWorkflow'
import styles from '../styles/EmergencyWorkflowModal.module.scss'

interface EmergencyWorkflowModalProps {
  isOpen: boolean
  alert: EmergencyAlert | null
  onClose: () => void
  onTakeAction: () => void
  onPostpone: () => void
}

export const EmergencyWorkflowModal: React.FC<EmergencyWorkflowModalProps> = ({
  isOpen,
  alert,
  onClose,
  onTakeAction,
  onPostpone,
}) => {
  if (!isOpen || !alert) return null

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <EmergencyWorkflow
          alert={alert}
          onClose={onClose}
          onTakeAction={onTakeAction}
          onPostpone={onPostpone}
        />
      </div>
    </div>
  )
}

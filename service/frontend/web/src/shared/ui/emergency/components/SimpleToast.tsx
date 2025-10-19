import React from 'react'
import { CheckCircle, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import styles from '../styles/SimpleToast.module.scss'

interface SimpleToastProps {
  message: string
  type: 'success' | 'info'
  onClose: () => void
}

export const SimpleToast: React.FC<SimpleToastProps> = ({
  message,
  type,
  onClose,
}) => {
  return (
    <div className={`${styles.simpleToast} ${styles[type]}`}>
      <div className={styles.icon}>
        {type === 'success' ? <CheckCircle size={20} /> : <Clock size={20} />}
      </div>
      <div className={styles.message}>{message}</div>
      <button
        className={styles.closeButton}
        onClick={onClose}
      >
        ×
      </button>
    </div>
  )
}

// Функция для показа простых тостов
export const showSimpleToast = (
  message: string,
  type: 'success' | 'info' = 'success',
) => {
  return toast.custom(
    t => (
      <SimpleToast
        message={message}
        type={type}
        onClose={() => toast.remove(t.id)}
      />
    ),
    {
      duration: 3000,
      position: 'top-center',
    },
  )
}

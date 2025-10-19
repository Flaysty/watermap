import { MENU_ITEMS, Sidebar } from '~/widgets'
import { Outlet } from '@tanstack/react-router'
import styles from './AppLayout.module.scss'
import { Toaster } from 'react-hot-toast'
import { EmergencyWorkflowModal, useEmergencyAlerts } from '~/shared'
import { useEffect } from 'react'

export const AppLayout = () => {
  // Инициализируем аварийные уведомления
  const {
    currentAlert,
    isWorkflowOpen,
    closeWorkflow,
    openWorkflow,
    showEmergencyAlert,
    hasBeenShown,
  } = useEmergencyAlerts()

  // Обработчик горячих клавиш
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Проверяем нажатие клавиши "0"
      if (event.key === '0') {
        // Предотвращаем стандартное поведение
        event.preventDefault()

        // Если модальное окно уже открыто, закрываем его
        if (isWorkflowOpen) {
          closeWorkflow()
        } else {
          // Если закрыто и еще не показывали, показываем аварию "Возможная аварийная ситуация"
          showEmergencyAlert()
        }
      }
    }

    // Добавляем обработчик событий
    document.addEventListener('keydown', handleKeyDown)

    // Очищаем обработчик при размонтировании
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isWorkflowOpen, closeWorkflow, showEmergencyAlert])

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <Sidebar.Root>
          {MENU_ITEMS.map(item => (
            <Sidebar.Item
              id={item.id}
              key={item.id}
              icon={item.icon}
              text={item.label}
            />
          ))}
        </Sidebar.Root>
      </div>
      <Outlet />

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 5,
          style: {
            background: 'transparent',
            boxShadow: 'none',
            padding: 0,
            margin: 0,
          },
        }}
      />
      <EmergencyWorkflowModal
        isOpen={isWorkflowOpen}
        alert={currentAlert}
        onClose={closeWorkflow}
        onTakeAction={() => {
          closeWorkflow()
          // Здесь можно добавить логику для взятия в работу
        }}
        onPostpone={() => {
          closeWorkflow()
          // Здесь можно добавить логику для отложения
        }}
      />
    </div>
  )
}

interface LoadingOverlayProps {
  isVisible: boolean
}

/**
 * Компонент загрузочного экрана во время анимации
 */
export const LoadingOverlay: FC<LoadingOverlayProps> = ({ isVisible }) => {
  if (!isVisible) return null

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.1)',
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'wait',
      }}
    >
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          fontSize: '16px',
          color: '#333',
        }}
      >
        <div style={{ fontSize: '24px', marginBottom: '10px' }}>⏳</div>
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
          Перемещение
        </div>
        <div style={{ fontSize: '14px', opacity: 0.7 }}>
          Подождите завершения анимации...
        </div>
      </div>
    </div>
  )
}

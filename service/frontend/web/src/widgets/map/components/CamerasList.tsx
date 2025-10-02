import type { CamerasListProps } from '../types'
import { FC } from 'react'

/**
 * Компонент списка камер
 */
export const CamerasList: FC<CamerasListProps> = ({
  cameras,
  isOpen,
  onCameraClick,
}) => {
  if (!isOpen) return null

  return (
    <div
      style={{
        borderTop: '1px solid rgba(0, 0, 0, 0.1)',
        maxHeight: '600px',
        overflowY: 'auto',
      }}
    >
      {cameras.map(camera => (
        <div
          key={camera.id}
          style={{
            padding: '8px 12px',
            borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
          onClick={() => onCameraClick(camera)}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '160px',
              borderRadius: '6px',
              overflow: 'hidden',
              background: '#f3f4f6',
              marginBottom: '8px',
            }}
          >
            <img
              src={camera.image}
              alt={camera.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            {/* Подписи сверху */}
            <div
              style={{
                position: 'absolute',
                top: '8px',
                left: '8px',
                background: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(4px)',
                padding: '4px 8px',
                borderRadius: '4px',
                color: 'white',
                fontSize: '11px',
                fontWeight: '600',
              }}
            >
              {camera.title}
            </div>
            <div
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                background: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(4px)',
                padding: '4px 8px',
                borderRadius: '4px',
                color: 'white',
                fontSize: '11px',
                fontWeight: '600',
              }}
            >
              {camera.identifier}
            </div>
            {/* Иконка расширения */}
            <div
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '20px',
                height: '20px',
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '3px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                color: '#374151',
                marginTop: '24px',
              }}
            >
              ↗
            </div>
          </div>
          <div
            style={{
              fontSize: '12px',
              fontWeight: '500',
              color: '#374151',
              textAlign: 'center',
            }}
          >
            {camera.title}
          </div>
        </div>
      ))}
    </div>
  )
}

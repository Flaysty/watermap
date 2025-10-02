import { ADDRESSES, MOCK_CAMERAS } from '../constants'
import { CamerasList } from './CamerasList'
import { OfficeList } from './OfficeList'
import { FC } from 'react'

interface MapOverlayProps {
  isOfficeListOpen: boolean
  isCamerasOpen: boolean
  isAnimating: boolean
  inspectionMode: boolean
  activeBuilding: number | null
  onToggleOfficeList: () => void
  onToggleCameras: () => void
  onExitInspection: () => void
  onAddressClick: (index: number, coords: [number, number]) => void
  onCameraClick: (camera: (typeof MOCK_CAMERAS)[0]) => void
}

export const MapOverlay: FC<MapOverlayProps> = ({
  isOfficeListOpen,
  isCamerasOpen,
  isAnimating,
  inspectionMode,
  activeBuilding,
  onToggleOfficeList,
  onToggleCameras,
  onExitInspection,
  onAddressClick,
  onCameraClick,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '20px',
        left: '50px',
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(10px)',
        minWidth: '280px',
        maxWidth: '360px',
      }}
    >
      <button
        onClick={onToggleOfficeList}
        style={{
          width: '100%',
          padding: '12px 16px',
          background: 'none',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '14px',
          fontWeight: '600',
          color: '#374151',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'none'
        }}
      >
        <span>Объекты водоканала</span>
        <span
          style={{
            transform: isOfficeListOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            fontSize: '16px',
          }}
        >
          ▼
        </span>
      </button>

      {isOfficeListOpen && (
        <>
          {isAnimating && (
            <div
              style={{
                background: 'rgba(255, 165, 0, 0.1)',
                border: '1px solid #ffa500',
                borderRadius: '4px',
                padding: '8px',
                margin: '8px 16px',
                textAlign: 'center',
                fontSize: '12px',
                color: '#ffa500',
              }}
            >
              ⏳ Перемещение к зданию...
              <br />
              <span style={{ fontSize: '10px', opacity: 0.8 }}>
                Подождите завершения анимации
              </span>
            </div>
          )}

          {inspectionMode && !isAnimating && (
            <div
              style={{
                background: 'rgba(230, 57, 70, 0.1)',
                border: '1px solid #3a78ff',
                borderRadius: '4px',
                padding: '8px',
                margin: '8px 16px',
                textAlign: 'center',
                fontSize: '12px',
                color: '#3a78ff',
              }}
            >
              🔍 Режим осмотра здания
              <br />
              <span style={{ fontSize: '10px', opacity: 0.8 }}>
                Вращение вокруг здания - ЛКМ (левая кнопка мыши)
              </span>
              <br />
              <button
                onClick={e => {
                  e.preventDefault()
                  onExitInspection()
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#3a78ff',
                  cursor: 'pointer',
                  fontSize: '10px',
                  textDecoration: 'underline',
                  padding: '2px 4px',
                  marginTop: '4px',
                }}
                disabled={isAnimating}
              >
                Выйти из режима осмотра
              </button>
            </div>
          )}
        </>
      )}

      <OfficeList
        addresses={ADDRESSES}
        isOpen={isOfficeListOpen}
        isAnimating={isAnimating}
        inspectionMode={inspectionMode}
        activeBuilding={activeBuilding}
        onAddressClick={onAddressClick}
      />

      <button
        onClick={onToggleCameras}
        style={{
          width: '100%',
          padding: '12px 16px',
          background: 'none',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '14px',
          fontWeight: '600',
          color: '#374151',
          transition: 'all 0.2s ease',
          marginTop: '8px',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'none'
        }}
      >
        <span>Камеры</span>
        <span
          style={{
            transform: isCamerasOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            fontSize: '16px',
          }}
        >
          ▼
        </span>
      </button>

      <CamerasList
        cameras={MOCK_CAMERAS}
        isOpen={isCamerasOpen}
        onCameraClick={onCameraClick}
      />
    </div>
  )
}

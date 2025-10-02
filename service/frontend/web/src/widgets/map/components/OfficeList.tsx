import type { OfficeListProps } from '../types'
import { FC } from 'react'

/**
 * Компонент списка офисов водоканала
 */
export const OfficeList: FC<OfficeListProps> = ({
  addresses,
  isOpen,
  isAnimating,
  inspectionMode,
  activeBuilding,
  onAddressClick,
}) => {
  if (!isOpen) return null

  return (
    <div
      style={{
        borderTop: '1px solid rgba(0, 0, 0, 0.1)',
        maxHeight: '400px',
        overflowY: 'auto',
      }}
    >
      {addresses.map((address, index) => (
        <button
          key={index}
          disabled={isAnimating}
          onClick={() => onAddressClick(index, address.coords)}
          style={{
            width: '100%',
            padding: '12px 16px',
            background: (() => {
              if (isAnimating && activeBuilding === index) return '#ffa500'
              if (isAnimating) return '#999'
              if (inspectionMode && activeBuilding === index) return '#3a78ff'
              return 'transparent'
            })(),
            color: (() => {
              if (isAnimating && activeBuilding === index) return 'white'
              if (isAnimating) return '#666'
              if (inspectionMode && activeBuilding === index) return 'white'
              return '#374151'
            })(),
            border: 'none',
            borderRadius: '0',
            cursor: isAnimating ? 'not-allowed' : 'pointer',
            fontSize: '13px',
            textAlign: 'left',
            transition: 'all 0.2s ease',
            borderBottom:
              index < addresses.length - 1
                ? '1px solid rgba(0, 0, 0, 0.05)'
                : 'none',
          }}
          onMouseEnter={e => {
            if (!isAnimating && !(inspectionMode && activeBuilding === index)) {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)'
            }
          }}
          onMouseLeave={e => {
            if (!isAnimating && !(inspectionMode && activeBuilding === index)) {
              e.currentTarget.style.background = 'transparent'
            }
          }}
        >
          <div
            style={{
              fontWeight: '600',
              marginBottom: '4px',
              color: 'inherit',
            }}
          >
            {address.name}
          </div>
          <div
            style={{
              fontSize: '11px',
              opacity: 0.8,
              color: 'inherit',
            }}
          >
            {address.description}
          </div>
        </button>
      ))}
    </div>
  )
}

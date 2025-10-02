/**
 * Типы для компонентов карты
 */

export interface Address {
  name: string
  coords: [number, number]
  description: string
  icon: string
}

export interface Camera {
  id: string
  title: string
  identifier: string
  image: string
}

export interface Map3DProps {
  onObjectClick?: (objectName: string) => void
}

export interface MapControlsProps {
  isOfficeListOpen: boolean
  isCamerasOpen: boolean
  isAnimating: boolean
  inspectionMode: boolean
  activeBuilding: number | null
  onToggleOfficeList: () => void
  onToggleCameras: () => void
  onExitInspection: () => void
  onAddressClick: (index: number, coords: [number, number]) => void
  onCameraClick: (camera: Camera) => void
}

export interface OfficeListProps {
  addresses: Address[]
  isOpen: boolean
  isAnimating: boolean
  inspectionMode: boolean
  activeBuilding: number | null
  onAddressClick: (index: number, coords: [number, number]) => void
}

export interface CamerasListProps {
  cameras: Camera[]
  isOpen: boolean
  onCameraClick: (camera: Camera) => void
}

export interface MapFooterProps {
  className?: string
}

export interface InspectionModeState {
  isActive: boolean
  activeBuilding: number | null
}

export interface MapAnimationState {
  isAnimating: boolean
  isBlocked: boolean
}

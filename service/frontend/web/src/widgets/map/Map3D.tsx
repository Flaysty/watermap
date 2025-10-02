import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import { LoadingOverlay } from './components/LoadingOverlay'
import { MapControls } from './components/MapControls'
import { MapFooter } from './components/MapFooter'
import { Modal, ObjectPopup } from '~/shared/ui'
import { MapOverlay } from './components/MapOverlay'
import { ADDRESSES, MAP_CONFIG, MOCK_CAMERAS } from './constants'
import { MOCK_EVENTS } from '~/shared/constants'
import { useInspectionMode, useMapAnimation, useMapInstance } from './hooks'
import { Building3DManager } from './lib/building-3d-manager'
import { createMapStyle } from './lib/create-map-style'
import { InspectionModeManager } from './lib/inspection-mode-manager'
import { MarkerManager } from './lib/marker-manager'
import type { Map3DProps } from './types'

/**
 * Главный компонент 3D карты с интерактивными элементами
 *
 * @param onObjectClick - Callback функция, вызываемая при клике на объект
 * @returns JSX элемент карты с панелями управления
 */
const Map3DComponent: FC<Map3DProps> = ({ onObjectClick }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const [isOfficeListOpen, setIsOfficeListOpen] = useState<boolean>(false)
  const [isCamerasOpen, setIsCamerasOpen] = useState<boolean>(true)
  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean
    coords: [number, number] | null
    eventData: (typeof MOCK_EVENTS)[0] | null
  }>({ isOpen: false, coords: null, eventData: null })

  const {
    mapRef,
    handleMapResize,
    disableAllInteractions,
    enableAllInteractions,
    flyToBuilding,
    flyToDefault,
  } = useMapInstance()

  const { inspectionMode, enterInspectionMode, exitInspectionMode } =
    useInspectionMode()
  const { animationState, startAnimation, endAnimation } = useMapAnimation()

  // Менеджеры для работы с картой
  const inspectionManagerRef = useRef<InspectionModeManager | null>(null)
  const markerManagerRef = useRef<MarkerManager | null>(null)
  const buildingManagerRef = useRef<Building3DManager | null>(null)

  // Обработчики для управления картой
  const handleAddressClick = useCallback(
    (index: number, coords: [number, number]) => {
      if (mapRef.current && !animationState.isAnimating) {
        if (
          inspectionMode.isActive &&
          inspectionMode.activeBuilding === index
        ) {
          // Повторный клик - выходим из режима осмотра
          exitInspectionMode()
          inspectionManagerRef.current?.restoreDefaultControls()

          startAnimation()
          flyToDefault(() => {
            enableAllInteractions()
            endAnimation()
          })
        } else {
          // Первый клик - входим в режим осмотра
          if (inspectionMode.isActive) {
            exitInspectionMode()
            inspectionManagerRef.current?.restoreDefaultControls()
          }

          startAnimation()
          flyToBuilding(coords, () => {
            enterInspectionMode(index)
            inspectionManagerRef.current?.setupInspectionControls()
            endAnimation()
          })
        }
      }
    },
    [
      mapRef,
      animationState.isAnimating,
      inspectionMode,
      exitInspectionMode,
      enterInspectionMode,
      startAnimation,
      endAnimation,
      flyToBuilding,
      flyToDefault,
      enableAllInteractions,
    ],
  )

  const handleCameraClick = useCallback((camera: (typeof MOCK_CAMERAS)[0]) => {
    console.log('Клик на камеру:', camera.title)
    // Здесь можно добавить логику для открытия камеры
  }, [])

  const handleToggleOfficeList = useCallback(() => {
    setIsOfficeListOpen(prev => {
      const newValue = !prev
      if (newValue) {
        setIsCamerasOpen(false)
      }
      return newValue
    })
  }, [])

  const handleToggleCameras = useCallback(() => {
    setIsCamerasOpen(prev => {
      const newValue = !prev
      if (newValue) {
        setIsOfficeListOpen(false)
      }
      return newValue
    })
  }, [])

  const handleExitInspection = useCallback(() => {
    if (mapRef.current && !animationState.isAnimating) {
      exitInspectionMode()
      inspectionManagerRef.current?.restoreDefaultControls()

      startAnimation()
      flyToDefault(() => {
        enableAllInteractions()
        endAnimation()
      })
    }
  }, [
    mapRef,
    animationState.isAnimating,
    exitInspectionMode,
    startAnimation,
    endAnimation,
    flyToDefault,
    enableAllInteractions,
  ])

  // Инициализация карты
  useEffect(() => {
    if (!mapContainer.current) return

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: createMapStyle() as any,
      center: MAP_CONFIG.center,
      zoom: MAP_CONFIG.zoom,
      pitch: MAP_CONFIG.pitch,
      bearing: MAP_CONFIG.bearing,
    })

    mapRef.current = map

    // Инициализируем менеджеры
    inspectionManagerRef.current = new InspectionModeManager(map)
    markerManagerRef.current = new MarkerManager(map)
    buildingManagerRef.current = new Building3DManager(map)

    // Добавляем контролы
    map.addControl(
      new maplibregl.NavigationControl({ visualizePitch: true }),
      'top-right',
    )

    map.addControl(
      new maplibregl.AttributionControl({
        compact: false,
        customAttribution: '',
      }),
      'bottom-right',
    )

    // Обработчик загрузки карты
    map.on('load', () => {
      // Создаем маркеры
      markerManagerRef.current?.createMarkers(ADDRESSES, name => {
        onObjectClick?.(name)
      })

      // Добавляем 4 случайных алерт-маркера в пределах Москвы
      markerManagerRef.current?.addRandomAlertMarkers(4, coords => {
        // Выбираем случайный набор данных из MOCK_EVENTS
        const randomEvent =
          MOCK_EVENTS[Math.floor(Math.random() * MOCK_EVENTS.length)]
        setAlertModal({ isOpen: true, coords, eventData: randomEvent })
      })

      // Добавляем 3D здания
      buildingManagerRef.current?.add3DBuildings()
      buildingManagerRef.current?.configureLayerVisibility()

      // Добавляем обработчик клика на карту для отладки
      map.on('click', e => {
        console.log('Клик на карту в координатах:', e.lngLat)
      })
    })

    // Добавляем обработчик изменения размера окна
    const resizeObserver = new ResizeObserver(handleMapResize)
    if (mapContainer.current) {
      resizeObserver.observe(mapContainer.current)
    }

    return () => {
      resizeObserver.disconnect()
      if (mapRef.current) {
        markerManagerRef.current?.clearMarkers()
        map.remove()
      }
    }
  }, [handleMapResize, onObjectClick])

  return (
    <>
      <div
        ref={mapContainer}
        className="w-full h-full"
        style={{
          width: '100%',
          height: '100%',
          // Предотвращаем мерцание при изменении размеров
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          perspective: '1000px',
        }}
      />

      <LoadingOverlay isVisible={animationState.isAnimating} />

      <MapControls
        isOfficeListOpen={isOfficeListOpen}
        isCamerasOpen={isCamerasOpen}
        isAnimating={animationState.isAnimating}
        inspectionMode={inspectionMode.isActive}
        activeBuilding={inspectionMode.activeBuilding}
        onToggleOfficeList={handleToggleOfficeList}
        onToggleCameras={handleToggleCameras}
        onExitInspection={handleExitInspection}
        onAddressClick={handleAddressClick}
        onCameraClick={handleCameraClick}
      />

      <MapOverlay
        isOfficeListOpen={isOfficeListOpen}
        isCamerasOpen={isCamerasOpen}
        isAnimating={animationState.isAnimating}
        inspectionMode={inspectionMode.isActive}
        activeBuilding={inspectionMode.activeBuilding}
        onToggleOfficeList={handleToggleOfficeList}
        onToggleCameras={handleToggleCameras}
        onExitInspection={handleExitInspection}
        onAddressClick={handleAddressClick}
        onCameraClick={handleCameraClick}
      />

      <MapFooter />

      <Modal
        isOpen={alertModal.isOpen}
        onClose={() =>
          setAlertModal({ isOpen: false, coords: null, eventData: null })
        }
      >
        {alertModal.eventData && (
          <ObjectPopup
            name={alertModal.eventData.title}
            description={alertModal.eventData.status}
            location={alertModal.eventData.location}
            problem={alertModal.eventData.problem}
            possibleCauses={alertModal.eventData.possibleCauses}
            recommendedActions={alertModal.eventData.recommendedActions}
            expectedEffect={alertModal.eventData.expectedEffect}
            responsible={alertModal.eventData.responsible}
            deadline={alertModal.eventData.deadline}
            priority={alertModal.eventData.priority}
            metric={alertModal.eventData.metric}
            chartData={alertModal.eventData.chartData}
            chartConfig={alertModal.eventData.chartConfig}
            onClose={() =>
              setAlertModal({ isOpen: false, coords: null, eventData: null })
            }
          />
        )}
      </Modal>

      <style>
        {`
          /* Предотвращение мерцания карты */
          .maplibregl-canvas-container {
            transform: translateZ(0);
            backface-visibility: hidden;
          }
          
          .maplibregl-canvas {
            transform: translateZ(0);
            backface-visibility: hidden;
          }
          
          .custom-marker svg {
            transition: all 0.2s ease;
          }
          .custom-marker g {
            fill: #3a78ff;
            transition: all 0.2s ease;
          }
          .custom-marker.active-marker {
            transform: scale(1.2) !important;
            box-shadow: 0 0 15px rgba(58, 120, 255, 0.8) !important;
            background-color: #2c5ce6 !important;
          }
          .custom-marker:hover svg {
            transform: scale(1.5) !important;
            cursor: pointer;
          }

          .alert-marker:hover span {
            transform: scale(1.5) !important;
          }

          .alert-marker span {
            transition: all 0.2s ease;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #dc3545;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-weight: 800;
            font-size: 16px;
            line-height: 1;
            box-shadow: 0 0 6px rgba(0,0,0,0.3);
            border: 1px solid #fff;
            position: relative;
            cursor: pointer;
          }

          /* Алерт-маркеры: пульсация */
          .alert-marker {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #3b82f6;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-weight: 800;
            font-size: 16px;
            line-height: 1;
            box-shadow: 0 0 6px rgba(0,0,0,0.3);
            border: 1px solid #fff;
            cursor: pointer;
            position: relative;
          }

          .alert-marker::after {
            content: '';
            position: absolute;
            inset: -6px;
            border-radius: 50%;
            background: rgba(220, 53, 69, 0.35);
            animation: alert-pulse 1.8s ease-out infinite;
          }

          @keyframes alert-pulse {
            0% { transform: scale(0.8); opacity: 0.6; }
            70% { transform: scale(1.6); opacity: 0; }
            100% { transform: scale(1.6); opacity: 0; }
          }
        `}
      </style>
    </>
  )
}

export const Map3D = memo(Map3DComponent)

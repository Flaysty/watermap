import maplibregl from 'maplibre-gl'
import { useCallback, useRef, useState } from 'react'
import { MAP_CONFIG } from '../constants'
import type { InspectionModeState, MapAnimationState } from '../types'

/**
 * Хук для управления состоянием инспекции зданий
 */
export const useInspectionMode = () => {
  const [inspectionMode, setInspectionMode] = useState<InspectionModeState>({
    isActive: false,
    activeBuilding: null,
  })

  const enterInspectionMode = useCallback((buildingIndex: number) => {
    setInspectionMode({
      isActive: true,
      activeBuilding: buildingIndex,
    })
  }, [])

  const exitInspectionMode = useCallback(() => {
    setInspectionMode({
      isActive: false,
      activeBuilding: null,
    })
  }, [])

  return {
    inspectionMode,
    enterInspectionMode,
    exitInspectionMode,
  }
}

/**
 * Хук для управления анимацией карты
 */
export const useMapAnimation = () => {
  const [animationState, setAnimationState] = useState<MapAnimationState>({
    isAnimating: false,
    isBlocked: false,
  })

  const startAnimation = useCallback(() => {
    setAnimationState({
      isAnimating: true,
      isBlocked: true,
    })
  }, [])

  const endAnimation = useCallback(() => {
    setAnimationState({
      isAnimating: false,
      isBlocked: false,
    })
  }, [])

  return {
    animationState,
    startAnimation,
    endAnimation,
  }
}

/**
 * Хук для управления картой MapLibre
 */
export const useMapInstance = () => {
  const mapRef = useRef<maplibregl.Map | null>(null)
  const resizeTimeoutRef = useRef<number | undefined>(undefined)

  const handleMapResize = useCallback(() => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current)
    }

    resizeTimeoutRef.current = window.setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.resize()
      }
    }, MAP_CONFIG.resizeDebounceMs)
  }, [])

  const disableAllInteractions = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.dragPan.disable()
      mapRef.current.dragRotate.disable()
      mapRef.current.doubleClickZoom.disable()
      mapRef.current.touchZoomRotate.disable()
      mapRef.current.scrollZoom.disable()
      mapRef.current.boxZoom.disable()
      mapRef.current.keyboard.disable()

      const canvas = mapRef.current.getCanvas()
      canvas.style.cursor = 'wait'
      canvas.style.pointerEvents = 'none'
    }
  }, [])

  const enableAllInteractions = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.dragPan.enable()
      mapRef.current.dragRotate.enable()
      mapRef.current.doubleClickZoom.enable()
      mapRef.current.touchZoomRotate.enable()
      mapRef.current.scrollZoom.enable()
      mapRef.current.boxZoom.enable()
      mapRef.current.keyboard.enable()

      const canvas = mapRef.current.getCanvas()
      canvas.style.cursor = ''
      canvas.style.pointerEvents = 'auto'
    }
  }, [])

  const flyToBuilding = useCallback((
    coords: [number, number],
    onComplete?: () => void
  ) => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: coords,
        zoom: MAP_CONFIG.inspectionZoom,
        pitch: MAP_CONFIG.pitch,
        bearing: MAP_CONFIG.inspectionBearing,
        duration: MAP_CONFIG.animationDuration,
      })

      if (onComplete) {
        const handleMoveEnd = () => {
          onComplete()
          mapRef.current?.off('moveend', handleMoveEnd)
        }
        mapRef.current.on('moveend', handleMoveEnd)
      }
    }
  }, [])

  const flyToDefault = useCallback((onComplete?: () => void) => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: MAP_CONFIG.center,
        zoom: MAP_CONFIG.zoom,
        pitch: MAP_CONFIG.pitch,
        bearing: MAP_CONFIG.bearing,
        duration: MAP_CONFIG.animationDuration,
      })

      if (onComplete) {
        const handleMoveEnd = () => {
          onComplete()
          mapRef.current?.off('moveend', handleMoveEnd)
        }
        mapRef.current.on('moveend', handleMoveEnd)
      }
    }
  }, [])

  return {
    mapRef,
    handleMapResize,
    disableAllInteractions,
    enableAllInteractions,
    flyToBuilding,
    flyToDefault,
  }
}

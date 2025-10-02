import maplibregl from 'maplibre-gl'

/**
 * Утилиты для управления режимом инспекции зданий
 */
export class InspectionModeManager {
  private map: maplibregl.Map
  private isRotating = false
  private lastMousePos: { x: number; y: number } | null = null

  constructor(map: maplibregl.Map) {
    this.map = map
  }

  /**
   * Настройка кастомного управления для режима инспекции
   */
  setupInspectionControls(): void {
    // Отключаем стандартное управление
    this.map.dragPan.disable()
    this.map.dragRotate.disable()
    this.map.doubleClickZoom.disable()
    this.map.touchZoomRotate.disable()
    this.map.scrollZoom.disable()
    this.map.boxZoom.disable()
    this.map.keyboard.disable()

    // Настраиваем canvas для кастомного управления
    const canvas = this.map.getCanvas()
    canvas.style.cursor = 'grab'
    canvas.style.pointerEvents = 'auto'

    // Добавляем обработчики событий
    const handleMouseDown = this.handleMouseDown.bind(this)
    const handleMouseMove = this.handleMouseMove.bind(this)
    const handleMouseUp = this.handleMouseUp.bind(this)
    const handleContextMenu = this.handleContextMenu.bind(this)

    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseup', handleMouseUp)
    canvas.addEventListener('mouseleave', handleMouseUp)
    canvas.addEventListener('contextmenu', handleContextMenu)

    // Сохраняем обработчики для удаления
    ;(this.map as any).inspectionHandlers = {
      handleMouseDown,
      handleMouseMove,
      handleMouseUp,
      handleContextMenu,
    }
  }

  /**
   * Восстановление стандартного управления
   */
  restoreDefaultControls(): void {
    // Убираем кастомные обработчики
    const inspectionHandlers = (this.map as any).inspectionHandlers
    if (inspectionHandlers) {
      const canvas = this.map.getCanvas()
      canvas.removeEventListener('mousedown', inspectionHandlers.handleMouseDown)
      canvas.removeEventListener('mousemove', inspectionHandlers.handleMouseMove)
      canvas.removeEventListener('mouseup', inspectionHandlers.handleMouseUp)
      canvas.removeEventListener('mouseleave', inspectionHandlers.handleMouseUp)
      canvas.removeEventListener('contextmenu', inspectionHandlers.handleContextMenu)
      delete (this.map as any).inspectionHandlers
    }

    // Восстанавливаем стандартное управление
    this.map.dragPan.enable()
    this.map.dragRotate.enable()
    this.map.doubleClickZoom.enable()
    this.map.touchZoomRotate.enable()
    this.map.scrollZoom.enable()
    this.map.boxZoom.enable()
    this.map.keyboard.enable()
  }

  private handleMouseDown(e: MouseEvent): void {
    if (e.button === 0) { // ЛКМ
      this.isRotating = true
      this.lastMousePos = { x: e.clientX, y: e.clientY }
      const canvas = this.map.getCanvas()
      canvas.style.cursor = 'grabbing'
      e.preventDefault()
    }
  }

  private handleMouseMove(e: MouseEvent): void {
    if (this.isRotating && this.lastMousePos) {
      const deltaX = e.clientX - this.lastMousePos.x
      const deltaY = e.clientY - this.lastMousePos.y

      // Вращение по горизонтали (bearing)
      const currentBearing = this.map.getBearing()
      this.map.setBearing(currentBearing + deltaX * 0.5)

      this.lastMousePos = { x: e.clientX, y: e.clientY }
    }
  }

  private handleMouseUp(): void {
    this.isRotating = false
    this.lastMousePos = null
    const canvas = this.map.getCanvas()
    canvas.style.cursor = 'grab'
  }

  private handleContextMenu(e: MouseEvent): void {
    e.preventDefault() // Отключаем контекстное меню
  }
}

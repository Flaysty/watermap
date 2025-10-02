import { FC, useCallback, useMemo, useState } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { MetricsPanel } from '~/shared/ui'
import { Map3D } from '~/widgets'

interface MapContainerProps {
  onObjectClick?: (objectName: string) => void
}

/**
 * Контейнер карты с панелью показателей
 *
 * @param onObjectClick - Callback функция для обработки кликов по объектам
 * @returns JSX элемент с картой и панелью показателей
 */
export const MapContainer: FC<MapContainerProps> = ({ onObjectClick }) => {
  const [selectedObject, setSelectedObject] = useState<string | null>(null)
  const [showMetrics, setShowMetrics] = useState(false)

  const handleObjectClick = useCallback(
    (objectName: string) => {
      setSelectedObject(objectName)
      setShowMetrics(true)
      onObjectClick?.(objectName)
    },
    [onObjectClick],
  )

  const handleCloseMetrics = useCallback(() => {
    setShowMetrics(false)
    setSelectedObject(null)
  }, [])

  // Стабильная ссылка на обработчик для предотвращения перерисовки карты
  const stableObjectClickHandler = useMemo(
    () => handleObjectClick,
    [handleObjectClick],
  )

  // Мемоизируем размеры панелей для предотвращения мерцания
  const mapPanelProps = useMemo(
    () => ({
      defaultSize: showMetrics ? 70 : 100,
      minSize: showMetrics ? 50 : 100,
      maxSize: showMetrics ? 80 : 100,
    }),
    [showMetrics],
  )

  const metricsPanelProps = useMemo(
    () => ({
      defaultSize: showMetrics ? 30 : 0,
      minSize: showMetrics ? 20 : 0,
      maxSize: showMetrics ? 50 : 0,
    }),
    [showMetrics],
  )

  return (
    <div className="h-full w-full">
      <PanelGroup direction="vertical">
        {/* Карта */}
        <Panel
          {...mapPanelProps}
          className="relative"
        >
          <Map3D onObjectClick={stableObjectClickHandler} />
        </Panel>

        {/* Resize Handle - рендерим только когда панель видима */}
        {showMetrics && <PanelResizeHandle />}

        {/* Панель показателей */}
        <Panel
          {...metricsPanelProps}
          className={`min-h-[200px] ${!showMetrics ? 'hidden' : ''}`}
        >
          {showMetrics && (
            <MetricsPanel
              isVisible={showMetrics}
              onClose={handleCloseMetrics}
              objectName={selectedObject || 'Объект водоканала'}
            />
          )}
        </Panel>
      </PanelGroup>
    </div>
  )
}

import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { EventsPanel, Sidebar } from '~/shared/ui'
import { MapContainer } from '~/widgets'

/**
 * Главная страница приложения с картой и панелями
 *
 * @returns JSX элемент главной страницы
 */
export const IndexPage = () => {
  return (
    <div className="h-screen flex">
      <div className="flex-shrink-0">
        <Sidebar />
      </div>

      <div className="flex-1">
        <PanelGroup direction="horizontal">
          <Panel
            minSize={40}
            className="relative"
          >
            <MapContainer />
          </Panel>

          <PanelResizeHandle />

          <Panel
            minSize={20}
            maxSize={40}
            className="min-w-[200px] max-w-[400px]"
          >
            <EventsPanel />
          </Panel>
        </PanelGroup>
      </div>
    </div>
  )
}

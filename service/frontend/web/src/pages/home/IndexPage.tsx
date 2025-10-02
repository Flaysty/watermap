import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { EventsPanel, Sidebar } from '~/shared/ui'
import { MapContainer } from '~/widgets'
import styles from './IndexPage.module.scss'

/**
 * Главная страница приложения с картой и панелями
 *
 * @returns JSX элемент главной страницы
 */
export const IndexPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>

      <div className={styles.content}>
        {/* Desktop Layout */}
        <div className={styles.desktopLayout}>
          <PanelGroup direction="horizontal">
            <Panel
              minSize={40}
              className={styles.mapPanel}
            >
              <MapContainer />
            </Panel>

            <PanelResizeHandle />

            <Panel
              minSize={20}
              maxSize={40}
              className={styles.eventsPanel}
            >
              <EventsPanel />
            </Panel>
          </PanelGroup>
        </div>

        {/* Mobile Layout */}
        <div className={styles.mobileLayout}>
          <EventsPanel />
        </div>
      </div>
    </div>
  )
}

import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { EventsPanel } from '~/shared/ui'
import { MapContainer } from '~/widgets'

import styles from './DashboardPage.module.scss'

export const DashboardPage = () => {
  return (
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
  )
}

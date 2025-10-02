import { Filter, MoreHorizontal, BarChart3 } from 'lucide-react'
import React, { FC, useState } from 'react'
import { MOCK_EVENTS } from '~/shared/constants'
import {
  getPriorityColor,
  getPriorityText,
  sortEventsByPriority,
} from '~/shared/lib/data-utils'
import type { EventItem } from '~/shared/types'
import { Modal, ObjectPopup, ChartModal } from '~/shared/ui'
import styles from './EventsPanel.module.scss'

export const EventsPanel: FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null)
  const [isChartModalOpen, setIsChartModalOpen] = useState(false)
  const sortedEvents = sortEventsByPriority(MOCK_EVENTS)

  return (
    <>
      <div className={styles.eventsPanel}>
        <div className={styles.header}>
          <h3 className={styles.title}>Рекомендации</h3>
          <div className={styles.headerButtons}>
            <button
              className={styles.chartButton}
              onClick={() => setIsChartModalOpen(true)}
              title="Открыть графики данных"
            >
              <BarChart3 size={16} />
            </button>
            <button className={styles.filtersButton}>
              <Filter size={14} />
            </button>
          </div>
        </div>

        <div className={styles.eventsList}>
          {sortedEvents.map(event => (
            <div
              key={event.id}
              className={styles.eventItem}
              onClick={() => setSelectedEvent(event)}
            >
              <div className={styles.eventHeader}>
                <span className={styles.time}>{event.time}</span>
                <span
                  className={styles.priorityTag}
                  style={{
                    backgroundColor: `${getPriorityColor(event.priority)}20`,
                    color: getPriorityColor(event.priority),
                  }}
                >
                  {getPriorityText(event.priority)}
                </span>
                <button className={styles.moreButton}>
                  <MoreHorizontal size={16} />
                </button>
              </div>

              <div className={styles.eventContent}>
                <div
                  className={styles.indicatorBar}
                  style={{ backgroundColor: getPriorityColor(event.priority) }}
                />
                <div className={styles.eventText}>
                  <div className={styles.eventTitle}>{event.title}</div>
                  <div className={styles.eventStatus}>
                    Статус: {event.status}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
      >
        {selectedEvent && (
          <ObjectPopup
            name={selectedEvent.title}
            description={selectedEvent.status}
            location={selectedEvent.location}
            problem={selectedEvent.problem}
            possibleCauses={selectedEvent.possibleCauses}
            recommendedActions={selectedEvent.recommendedActions}
            expectedEffect={selectedEvent.expectedEffect}
            responsible={selectedEvent.responsible}
            deadline={selectedEvent.deadline}
            priority={selectedEvent.priority}
            metric={selectedEvent.metric}
            chartData={selectedEvent.chartData}
            chartConfig={selectedEvent.chartConfig}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </Modal>

      <ChartModal
        isOpen={isChartModalOpen}
        onClose={() => setIsChartModalOpen(false)}
      />
    </>
  )
}

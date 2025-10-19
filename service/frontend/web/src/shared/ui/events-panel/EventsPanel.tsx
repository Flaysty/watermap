import {
  Filter,
  MoreHorizontal,
  BarChart3,
  AlertTriangle,
  Clock,
  CheckCircle,
  Zap,
  MapPin,
  Calendar,
} from 'lucide-react'
import React, { FC, useState, useEffect, useRef } from 'react'
import { MOCK_EVENTS } from '~/shared/constants'
import {
  getPriorityColor,
  getPriorityText,
  sortEventsByPriority,
} from '~/shared/lib/data-utils'
import type { EventItem } from '~/shared/types'
import { Modal, ObjectPopup } from '~/shared/ui'
import styles from './EventsPanel.module.scss'

export const EventsPanel: FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const sortedEvents = sortEventsByPriority(MOCK_EVENTS)
  const filterRef = useRef<HTMLDivElement>(null)

  const handleFilterClick = () => {
    setIsFilterOpen(!isFilterOpen)
  }

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter)
    setIsFilterOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <>
      <div className={styles.eventsPanel}>
        <div className={styles.header}>
          <h3 className={styles.title}>Рекомендации</h3>
          <div className={styles.headerButtons}>
            <div
              className={styles.filterContainer}
              ref={filterRef}
            >
              <button
                className={`${styles.filtersButton} ${isFilterOpen ? styles.active : ''}`}
                onClick={handleFilterClick}
              >
                <Filter size={14} />
                {selectedFilter !== 'all' && (
                  <span className={styles.filterBadge}>1</span>
                )}
              </button>

              {isFilterOpen && (
                <div className={styles.filterDropdown}>
                  <div
                    className={styles.filterOption}
                    onClick={() => handleFilterSelect('all')}
                  >
                    <span>Все рекомендации</span>
                    {selectedFilter === 'all' && <CheckCircle size={16} />}
                  </div>
                  <div
                    className={styles.filterOption}
                    onClick={() => handleFilterSelect('high')}
                  >
                    <span>Высокий приоритет</span>
                    {selectedFilter === 'high' && <CheckCircle size={16} />}
                  </div>
                  <div
                    className={styles.filterOption}
                    onClick={() => handleFilterSelect('medium')}
                  >
                    <span>Средний приоритет</span>
                    {selectedFilter === 'medium' && <CheckCircle size={16} />}
                  </div>
                  <div
                    className={styles.filterOption}
                    onClick={() => handleFilterSelect('low')}
                  >
                    <span>Низкий приоритет</span>
                    {selectedFilter === 'low' && <CheckCircle size={16} />}
                  </div>
                </div>
              )}
            </div>
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
                <div className={styles.timeAndPriority}>
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
                </div>
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
                  <div className={styles.eventLocation}>{event.location}</div>
                  <div className={styles.eventProblem}>{event.problem}</div>
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
    </>
  )
}

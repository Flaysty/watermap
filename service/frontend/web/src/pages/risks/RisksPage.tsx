import React, { useState, useMemo } from 'react'
import {
  AlertTriangle,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Clock,
  MapPin,
  Wrench,
  Info,
  Zap,
  TrendingUp,
  Calendar,
} from 'lucide-react'
import { Modal, ObjectPopup } from '~/shared/ui'
import { MOCK_INCIDENTS, type Incident } from '~/shared/constants'
import styles from './RisksPage.module.scss'

const getCriticalityLevel = (
  criticality: number,
  actionRequiredNow: boolean,
) => {
  if (criticality >= 8 || actionRequiredNow) {
    return { label: 'КРИТИЧНО', color: '#dc2626' }
  }
  if (criticality >= 6) {
    return { label: 'ВЫСОКИЙ', color: '#d97706' }
  }
  if (criticality >= 4) {
    return { label: 'СРЕДНИЙ', color: '#f59e0b' }
  }
  return { label: 'НИЗКИЙ', color: '#10b981' }
}

const getUrgencyLevel = (hours: number) => {
  if (hours < 1) return { label: 'СРОЧНО', color: '#dc2626' }
  if (hours < 3) return { label: 'ТРЕБУЕТ ВНИМАНИЯ', color: '#d97706' }
  if (hours < 6) return { label: 'УМЕРЕННАЯ', color: '#f59e0b' }
  return { label: 'НИЗКАЯ', color: '#10b981' }
}

export const RisksPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCriticality, setSelectedCriticality] = useState<string>('all')
  const [selectedSystem, setSelectedSystem] = useState<string>('all')
  const [expandedIncidents, setExpandedIncidents] = useState<Set<number>>(
    new Set(),
  )
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
    null,
  )
  const [isModalOpen, setIsModalOpen] = useState(false)

  const toggleIncident = (id: number) => {
    setExpandedIncidents(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const handleTakeAction = (incident: Incident) => {
    setSelectedIncident(incident)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedIncident(null)
  }

  const convertIncidentToPopupData = (incident: Incident) => {
    const criticalityInfo = getCriticalityLevel(
      incident.criticality,
      incident.actionRequiredNow,
    )

    // Отладочная информация
    console.log('Converting incident:', incident.id, {
      chartData: incident.chartData,
      chartConfig: incident.chartConfig,
    })

    // Преобразуем рекомендации в список действий
    const actions = incident.recommendations.split(';').map((rec, index) => ({
      text: rec.trim(),
      urgency: incident.actionRequiredNow ? 'Срочно' : 'Плановая',
      deadline: incident.actionRequiredNow
        ? incident.latestStartTime
        : undefined,
    }))

    return {
      name: `Инцидент #${incident.id}`,
      description: incident.consequence,
      location: incident.address,
      problem: `${incident.system} - ${incident.equipment}`,
      priority: (incident.criticality >= 8
        ? 'high'
        : incident.criticality >= 6
          ? 'medium'
          : 'low') as 'high' | 'medium' | 'low',
      possibleCauses: [incident.cause],
      recommendedActions: actions,
      responsible: 'Бригада назначается автоматически',
      deadline: incident.latestStartTime,
      expectedEffect: `Предотвращение аварии и минимизация последствий. Прогнозируемое время до аварии: ${incident.hoursToFailure} ч`,
      metric: {
        label: 'Критичность инцидента',
        value: `${incident.criticality}/10`,
        percentage: incident.criticality * 10,
      },
      chartData: incident.chartData,
      chartConfig: incident.chartConfig,
    }
  }

  const filteredIncidents = useMemo(() => {
    return MOCK_INCIDENTS.filter(incident => {
      const matchesSearch =
        !searchQuery ||
        incident.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        incident.cause.toLowerCase().includes(searchQuery.toLowerCase()) ||
        incident.system.toLowerCase().includes(searchQuery.toLowerCase()) ||
        incident.equipment.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCriticality =
        selectedCriticality === 'all' ||
        (selectedCriticality === 'critical' && incident.criticality >= 8) ||
        (selectedCriticality === 'high' &&
          incident.criticality >= 6 &&
          incident.criticality < 8) ||
        (selectedCriticality === 'medium' &&
          incident.criticality >= 4 &&
          incident.criticality < 6) ||
        (selectedCriticality === 'low' && incident.criticality < 4)

      const matchesSystem =
        selectedSystem === 'all' ||
        (selectedSystem === 'water' &&
          incident.system === 'Водопроводные сети') ||
        (selectedSystem === 'sewage' &&
          incident.system === 'Канализационные сети')

      return matchesSearch && matchesCriticality && matchesSystem
    })
  }, [searchQuery, selectedCriticality, selectedSystem])

  const stats = useMemo(() => {
    const total = filteredIncidents.length
    const critical = filteredIncidents.filter(i => i.criticality >= 8).length
    const urgent = filteredIncidents.filter(i => i.actionRequiredNow).length

    return { total, critical, urgent }
  }, [filteredIncidents])

  return (
    <div className={styles.content}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Аномалии и риски</h1>
          <p className={styles.subtitle}>
            Прогнозирование и мониторинг аварийных ситуаций на водоканале
          </p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.searchContainer}>
            <Search
              size={18}
              className={styles.searchIcon}
            />
            <input
              type="text"
              placeholder="Поиск по адресу, причине, оборудованию..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
      </div>

      <div className={styles.scrollableContent}>
        <div className={styles.sections}>
          {/* Статистика */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <AlertTriangle size={24} />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{stats.total}</div>
                <div className={styles.statLabel}>
                  {searchQuery ? 'Найдено аномалий' : 'Всего аномалий'}
                </div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <AlertTriangle size={24} />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{stats.critical}</div>
                <div className={styles.statLabel}>Критических</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <Clock size={24} />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{stats.urgent}</div>
                <div className={styles.statLabel}>Требуют действий</div>
              </div>
            </div>
          </div>

          {/* Фильтры */}
          <div className={styles.filtersSection}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>
                <Filter size={16} />
                Критичность
              </label>
              <select
                value={selectedCriticality}
                onChange={e => setSelectedCriticality(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">Все уровни</option>
                <option value="critical">Критические (≥8)</option>
                <option value="high">Высокие (6-7)</option>
                <option value="medium">Средние (4-5)</option>
                <option value="low">Низкие (&lt;4)</option>
              </select>
            </div>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>
                <Filter size={16} />
                Система
              </label>
              <select
                value={selectedSystem}
                onChange={e => setSelectedSystem(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">Все системы</option>
                <option value="water">Водопроводные сети</option>
                <option value="sewage">Канализационные сети</option>
              </select>
            </div>
          </div>

          {/* Таблица инцидентов */}
          <div className={styles.categorySection}>
            <div className={styles.categoryHeader}>
              <h2 className={styles.categoryTitle}>Список аномалий</h2>
            </div>

            <div className={styles.incidentsTable}>
              {filteredIncidents.length === 0 ? (
                <div className={styles.emptyState}>
                  <Search size={48} />
                  <h3>Ничего не найдено</h3>
                  <p>Попробуйте изменить фильтры или поисковый запрос</p>
                </div>
              ) : (
                filteredIncidents.map(incident => {
                  const isExpanded = expandedIncidents.has(incident.id)
                  const criticalityInfo = getCriticalityLevel(
                    incident.criticality,
                    incident.actionRequiredNow,
                  )
                  const urgencyInfo = getUrgencyLevel(incident.hoursToFailure)

                  return (
                    <div
                      key={incident.id}
                      className={styles.incidentRow}
                    >
                      <div
                        className={styles.incidentHeader}
                        onClick={() => toggleIncident(incident.id)}
                      >
                        <div className={styles.expandIcon}>
                          {isExpanded ? (
                            <ChevronDown size={20} />
                          ) : (
                            <ChevronRight size={20} />
                          )}
                        </div>

                        <div className={styles.incidentMainInfo}>
                          <div className={styles.incidentTop}>
                            <span className={styles.incidentId}>
                              #{incident.id}
                            </span>
                            <span
                              className={styles.criticalityBadge}
                              style={{ backgroundColor: criticalityInfo.color }}
                            >
                              {criticalityInfo.label}
                            </span>
                          </div>
                          <div className={styles.incidentAddress}>
                            <MapPin size={14} />
                            {incident.address}
                          </div>
                          <div className={styles.incidentSystem}>
                            {incident.system} • {incident.equipment}
                          </div>
                        </div>

                        <div className={styles.incidentStats}>
                          <div className={styles.incidentStat}>
                            <Clock size={14} />
                            <span>{incident.hoursToFailure.toFixed(1)} ч</span>
                          </div>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className={styles.incidentDetails}>
                          <div className={styles.detailsGrid}>
                            <div className={styles.detailItem}>
                              <div className={styles.detailLabelWithIcon}>
                                <AlertTriangle size={14} />
                                <span>Причина</span>
                              </div>
                              <span className={styles.detailValue}>
                                {incident.cause}
                              </span>
                            </div>
                            <div className={styles.detailItem}>
                              <div className={styles.detailLabelWithIcon}>
                                <Zap size={14} />
                                <span>Последствие</span>
                              </div>
                              <span className={styles.detailValue}>
                                {incident.consequence}
                              </span>
                            </div>
                            <div className={styles.detailItem}>
                              <div className={styles.detailLabelWithIcon}>
                                <Clock size={14} />
                                <span>Время до аварии</span>
                              </div>
                              <span className={styles.detailValue}>
                                {incident.hoursToFailure} ч
                              </span>
                            </div>
                            <div className={styles.detailItem}>
                              <div className={styles.detailLabelWithIcon}>
                                <TrendingUp size={14} />
                                <span>Время на предотвращение</span>
                              </div>
                              <span className={styles.detailValue}>
                                {incident.hoursToPrevent} ч
                              </span>
                            </div>
                            <div className={styles.detailItem}>
                              <div className={styles.detailLabelWithIcon}>
                                <Calendar size={14} />
                                <span>Начать не позднее</span>
                              </div>
                              <span className={styles.detailValue}>
                                {incident.latestStartTime}
                              </span>
                            </div>
                            <div className={styles.detailItem}>
                              <div className={styles.detailLabelWithIcon}>
                                <Calendar size={14} />
                                <span>Прогноз аварии</span>
                              </div>
                              <span className={styles.detailValue}>
                                {incident.predictedFailureTime}
                              </span>
                            </div>
                          </div>

                          <div className={styles.recommendations}>
                            <div className={styles.recommendationsHeader}>
                              <Wrench size={16} />
                              <span>Рекомендации для бригады</span>
                            </div>
                            <ul className={styles.recommendationsList}>
                              {incident.recommendations
                                .split(';')
                                .map((rec, index) => (
                                  <li
                                    key={index}
                                    className={styles.recommendationItem}
                                  >
                                    {rec.trim()}
                                  </li>
                                ))}
                            </ul>
                          </div>

                          <div className={styles.incidentActions}>
                            <button
                              className={styles.actionButtonPrimary}
                              onClick={() => handleTakeAction(incident)}
                            >
                              <AlertTriangle size={16} />
                              Просмотр
                            </button>
                            <button className={styles.actionButtonSecondary}>
                              <MapPin size={16} />
                              Показать на карте
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Модалка с деталями инцидента */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      >
        {selectedIncident && (
          <ObjectPopup
            {...convertIncidentToPopupData(selectedIncident)}
            onClose={handleCloseModal}
          />
        )}
      </Modal>
    </div>
  )
}

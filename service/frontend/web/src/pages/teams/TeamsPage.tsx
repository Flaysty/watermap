import React, { useState, useMemo } from 'react'
import {
  Users,
  ChevronDown,
  ChevronRight,
  Phone,
  Mail,
  Wrench,
  Edit,
  Trash2,
  Search,
  Plus,
  Award,
  Clock,
} from 'lucide-react'
import styles from './TeamsPage.module.scss'

interface Employee {
  id: number
  name: string
  specialty: string
  phone: string
  email: string
  experience: number
  status: 'active' | 'vacation' | 'sick'
}

interface Team {
  id: number
  name: string
  supervisor: string
  phone: string
  specialization: string
  employees: Employee[]
  status: 'active' | 'inactive'
  activeIncidents: number
}

const mockTeams: Team[] = [
  {
    id: 1,
    name: 'Бригада №1 - Водоснабжение',
    supervisor: 'Иванов Сергей Петрович',
    phone: '+7 (912) 345-67-89',
    specialization: 'Водоснабжение',
    status: 'active',
    activeIncidents: 2,
    employees: [
      {
        id: 101,
        name: 'Петров Алексей Иванович',
        specialty: 'Слесарь-сантехник',
        phone: '+7 (912) 111-11-11',
        email: 'petrov@vodokanal.ru',
        experience: 8,
        status: 'active',
      },
      {
        id: 102,
        name: 'Сидоров Дмитрий Николаевич',
        specialty: 'Электрик',
        phone: '+7 (912) 222-22-22',
        email: 'sidorov@vodokanal.ru',
        experience: 5,
        status: 'active',
      },
      {
        id: 103,
        name: 'Козлов Владимир Сергеевич',
        specialty: 'Слесарь-сантехник',
        phone: '+7 (912) 333-33-33',
        email: 'kozlov@vodokanal.ru',
        experience: 12,
        status: 'vacation',
      },
    ],
  },
  {
    id: 2,
    name: 'Бригада №2 - Водоотведение',
    supervisor: 'Смирнов Андрей Владимирович',
    phone: '+7 (912) 456-78-90',
    specialization: 'Водоотведение',
    status: 'active',
    activeIncidents: 1,
    employees: [
      {
        id: 201,
        name: 'Морозов Игорь Александрович',
        specialty: 'Оператор очистных сооружений',
        phone: '+7 (912) 444-44-44',
        email: 'morozov@vodokanal.ru',
        experience: 10,
        status: 'active',
      },
      {
        id: 202,
        name: 'Новиков Евгений Петрович',
        specialty: 'Слесарь КИПиА',
        phone: '+7 (912) 555-55-55',
        email: 'novikov@vodokanal.ru',
        experience: 7,
        status: 'active',
      },
      {
        id: 203,
        name: 'Соколов Павел Викторович',
        specialty: 'Оператор очистных сооружений',
        phone: '+7 (912) 666-66-66',
        email: 'sokolov@vodokanal.ru',
        experience: 4,
        status: 'sick',
      },
      {
        id: 204,
        name: 'Лебедев Максим Игоревич',
        specialty: 'Слесарь-ремонтник',
        phone: '+7 (912) 777-77-77',
        email: 'lebedev@vodokanal.ru',
        experience: 6,
        status: 'active',
      },
    ],
  },
  {
    id: 3,
    name: 'Бригада №3 - Аварийная',
    supervisor: 'Волков Михаил Дмитриевич',
    phone: '+7 (912) 567-89-01',
    specialization: 'Аварийные работы',
    status: 'active',
    activeIncidents: 0,
    employees: [
      {
        id: 301,
        name: 'Федоров Артем Владимирович',
        specialty: 'Слесарь-сантехник',
        phone: '+7 (912) 888-88-88',
        email: 'fedorov@vodokanal.ru',
        experience: 15,
        status: 'active',
      },
      {
        id: 302,
        name: 'Васильев Денис Сергеевич',
        specialty: 'Электрогазосварщик',
        phone: '+7 (912) 999-99-99',
        email: 'vasilev@vodokanal.ru',
        experience: 9,
        status: 'active',
      },
      {
        id: 303,
        name: 'Семенов Роман Андреевич',
        specialty: 'Машинист экскаватора',
        phone: '+7 (912) 000-00-00',
        email: 'semenov@vodokanal.ru',
        experience: 11,
        status: 'active',
      },
    ],
  },
  {
    id: 4,
    name: 'Бригада №4 - Техническое обслуживание',
    supervisor: 'Егоров Николай Александрович',
    phone: '+7 (912) 678-90-12',
    specialization: 'Техническое обслуживание',
    status: 'active',
    activeIncidents: 0,
    employees: [
      {
        id: 401,
        name: 'Попов Станислав Викторович',
        specialty: 'Слесарь КИПиА',
        phone: '+7 (913) 111-11-11',
        email: 'popov@vodokanal.ru',
        experience: 6,
        status: 'active',
      },
      {
        id: 402,
        name: 'Зайцев Кирилл Игоревич',
        specialty: 'Электромонтер',
        phone: '+7 (913) 222-22-22',
        email: 'zaytsev@vodokanal.ru',
        experience: 8,
        status: 'active',
      },
    ],
  },
]

const statusLabels: Record<string, string> = {
  active: 'Активен',
  vacation: 'В отпуске',
  sick: 'На больничном',
  inactive: 'Неактивна',
}

const statusColors: Record<string, string> = {
  active: styles.statusActive,
  vacation: styles.statusVacation,
  sick: styles.statusSick,
  inactive: styles.statusInactive,
}

export const TeamsPage: React.FC = () => {
  const [expandedTeams, setExpandedTeams] = useState<Set<number>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')

  const toggleTeam = (teamId: number) => {
    setExpandedTeams(prev => {
      const newSet = new Set(prev)
      if (newSet.has(teamId)) {
        newSet.delete(teamId)
      } else {
        newSet.add(teamId)
      }
      return newSet
    })
  }

  const getEmployeeCountBySpecialty = (employees: Employee[]) => {
    const specialties: Record<string, number> = {}
    employees.forEach(emp => {
      specialties[emp.specialty] = (specialties[emp.specialty] || 0) + 1
    })
    return specialties
  }

  // Фильтрация бригад по поиску сотрудников
  const filteredTeams = useMemo(() => {
    if (!searchQuery.trim()) return mockTeams

    const query = searchQuery.toLowerCase()
    return mockTeams
      .map(team => {
        const filteredEmployees = team.employees.filter(
          employee =>
            employee.name.toLowerCase().includes(query) ||
            employee.specialty.toLowerCase().includes(query) ||
            employee.phone.includes(query) ||
            employee.email.toLowerCase().includes(query),
        )

        // Если есть совпадающие сотрудники или название бригады/бригадира
        if (
          filteredEmployees.length > 0 ||
          team.name.toLowerCase().includes(query) ||
          team.supervisor.toLowerCase().includes(query)
        ) {
          return {
            ...team,
            employees:
              filteredEmployees.length > 0 ? filteredEmployees : team.employees,
          }
        }
        return null
      })
      .filter((team): team is Team => team !== null)
  }, [searchQuery])

  return (
    <div className={styles.content}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Управление бригадами</h1>
          <p className={styles.subtitle}>
            Список бригад и сотрудников водоканала по специальностям
          </p>
        </div>
        <div className={styles.searchContainer}>
          <Search
            size={18}
            className={styles.searchIcon}
          />
          <input
            type="text"
            placeholder="Поиск по сотрудникам, бригадам..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.scrollableContent}>
        <div className={styles.sections}>
          {/* Статистика */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <Users size={24} />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{filteredTeams.length}</div>
                <div className={styles.statLabel}>
                  {searchQuery ? 'Найдено бригад' : 'Всего бригад'}
                </div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <Users size={24} />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>
                  {filteredTeams.reduce(
                    (sum, team) => sum + team.employees.length,
                    0,
                  )}
                </div>
                <div className={styles.statLabel}>
                  {searchQuery ? 'Найдено сотрудников' : 'Всего сотрудников'}
                </div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <Wrench size={24} />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>
                  {mockTeams.reduce(
                    (sum, team) => sum + team.activeIncidents,
                    0,
                  )}
                </div>
                <div className={styles.statLabel}>Активных инцидентов</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <Users size={24} />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>
                  {mockTeams.filter(team => team.status === 'active').length}
                </div>
                <div className={styles.statLabel}>Активных бригад</div>
              </div>
            </div>
          </div>

          {/* Таблица бригад */}
          <div className={styles.categorySection}>
            <div className={styles.categoryHeader}>
              <h2 className={styles.categoryTitle}>Список бригад</h2>
            </div>

            <div className={styles.teamsTable}>
              {filteredTeams.length === 0 ? (
                <div className={styles.emptyState}>
                  <Search size={48} />
                  <h3>Ничего не найдено</h3>
                  <p>Попробуйте изменить поисковый запрос</p>
                </div>
              ) : (
                filteredTeams.map(team => {
                  const isExpanded = expandedTeams.has(team.id)
                  const specialties = getEmployeeCountBySpecialty(
                    team.employees,
                  )

                  return (
                    <div
                      key={team.id}
                      className={styles.teamRow}
                    >
                      {/* Основная строка бригады */}
                      <div
                        className={styles.teamHeader}
                        onClick={() => toggleTeam(team.id)}
                      >
                        <div className={styles.expandIcon}>
                          {isExpanded ? (
                            <ChevronDown size={20} />
                          ) : (
                            <ChevronRight size={20} />
                          )}
                        </div>

                        <div className={styles.teamMainInfo}>
                          <div className={styles.teamName}>{team.name}</div>
                          <div className={styles.teamMeta}>
                            <span className={styles.supervisor}>
                              Бригадир: {team.supervisor}
                            </span>
                            <span className={styles.teamPhone}>
                              <Phone size={12} />
                              {team.phone}
                            </span>
                          </div>
                        </div>

                        <div className={styles.teamStats}>
                          <div className={styles.teamStat}>
                            <span className={styles.statLabel}>
                              Сотрудников:
                            </span>
                            <span className={styles.statValue}>
                              {team.employees.length}
                            </span>
                          </div>
                          <div className={styles.teamStat}>
                            <span className={styles.statLabel}>
                              Специальностей:
                            </span>
                            <span className={styles.statValue}>
                              {Object.keys(specialties).length}
                            </span>
                          </div>
                          {team.activeIncidents > 0 && (
                            <div className={styles.activeIncidents}>
                              <Wrench size={14} />
                              {team.activeIncidents}
                            </div>
                          )}
                        </div>

                        <div className={styles.teamActions}>
                          <span
                            className={`${styles.status} ${statusColors[team.status]}`}
                          >
                            {statusLabels[team.status]}
                          </span>
                          <button
                            className={styles.actionButton}
                            onClick={e => {
                              e.stopPropagation()
                              console.log('Edit team', team.id)
                            }}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className={styles.actionButton}
                            onClick={e => {
                              e.stopPropagation()
                              console.log('Delete team', team.id)
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Вложенная таблица сотрудников */}
                      {isExpanded && (
                        <div className={styles.employeesSection}>
                          <div className={styles.employeesHeader}>
                            <h4>Сотрудники бригады</h4>
                            <button className={styles.addEmployeeButton}>
                              <Plus size={14} />
                              Добавить сотрудника
                            </button>
                          </div>

                          <div className={styles.employeesTable}>
                            <div className={styles.employeeTableHeader}>
                              <div className={styles.employeeCol}>ФИО</div>
                              <div className={styles.employeeCol}>
                                Специальность
                              </div>
                              <div className={styles.employeeCol}>Контакты</div>
                              <div className={styles.employeeCol}>Опыт</div>
                              <div className={styles.employeeCol}>Статус</div>
                              <div className={styles.employeeCol}>Действия</div>
                            </div>

                            {team.employees.map(employee => (
                              <div
                                key={employee.id}
                                className={styles.employeeRow}
                              >
                                <div className={styles.employeeCol}>
                                  <div className={styles.employeeName}>
                                    {employee.name}
                                  </div>
                                </div>
                                <div className={styles.employeeCol}>
                                  <div className={styles.specialty}>
                                    <Wrench size={14} />
                                    {employee.specialty}
                                  </div>
                                </div>
                                <div className={styles.employeeCol}>
                                  <div className={styles.contacts}>
                                    <span className={styles.contactItem}>
                                      <Phone size={12} />
                                      {employee.phone}
                                    </span>
                                    <span className={styles.contactItem}>
                                      <Mail size={12} />
                                      {employee.email}
                                    </span>
                                  </div>
                                </div>
                                <div className={styles.employeeCol}>
                                  <span className={styles.experience}>
                                    {employee.experience} лет
                                  </span>
                                </div>
                                <div className={styles.employeeCol}>
                                  <span
                                    className={`${styles.employeeStatus} ${statusColors[employee.status]}`}
                                  >
                                    {statusLabels[employee.status]}
                                  </span>
                                </div>
                                <div className={styles.employeeCol}>
                                  <div className={styles.employeeActions}>
                                    <button
                                      className={styles.actionButton}
                                      onClick={() =>
                                        console.log(
                                          'Edit employee',
                                          employee.id,
                                        )
                                      }
                                    >
                                      <Edit size={14} />
                                    </button>
                                    <button
                                      className={styles.actionButton}
                                      onClick={() =>
                                        console.log(
                                          'Delete employee',
                                          employee.id,
                                        )
                                      }
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Сводка по специальностям */}
                          {/* <div className={styles.specialtiesSummary}>
                          <h5>
                            <Award size={16} />
                            Распределение по специальностям
                          </h5>
                          <div className={styles.specialtiesGrid}>
                            {Object.entries(specialties).map(
                              ([specialty, count]) => (
                                <div
                                  key={specialty}
                                  className={styles.specialtyCard}
                                >
                                  <div className={styles.specialtyIcon}>
                                    <Award size={14} />
                                  </div>
                                  <div className={styles.specialtyContent}>
                                    <span className={styles.specialtyName}>
                                      {specialty}
                                    </span>
                                    <span className={styles.specialtyCount}>
                                      {count} чел.
                                    </span>
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        </div> */}
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
    </div>
  )
}

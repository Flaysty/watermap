import React, { useState } from 'react'
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  X,
  MapPin,
  Wrench,
  Users,
  Phone,
  FileText,
  ChevronRight,
  Calendar,
  Timer,
  Shield,
  Zap,
  Edit3,
} from 'lucide-react'
import { showSimpleToast } from './SimpleToast'
import type { EmergencyAlert, WorkflowStep } from '../types'
import { ElectronicSignature } from '../../electronic-signature/ElectronicSignature'
import styles from '../styles/EmergencyWorkflow.module.scss'

interface EmergencyWorkflowProps {
  alert: EmergencyAlert
  onClose: () => void
  onTakeAction: () => void
  onPostpone: () => void
}

export const EmergencyWorkflow: React.FC<EmergencyWorkflowProps> = ({
  alert,
  onClose,
  onTakeAction,
  onPostpone,
}) => {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('assessment')
  const [assignedTeam, setAssignedTeam] = useState<string>('')
  const [estimatedTime, setEstimatedTime] = useState<string>('')
  const [workNotes, setWorkNotes] = useState<string>('')
  const [taskDescription, setTaskDescription] = useState<string>('')
  const [isEditingTasks, setIsEditingTasks] = useState<boolean>(false)
  const [showSignature, setShowSignature] = useState(false)
  const [isPlanApproved, setIsPlanApproved] = useState(false)
  const [taskSteps, setTaskSteps] = useState([
    'Прибыть на место в течение 15-25 минут',
    'Проверить показания манометров на участке',
    'Локализовать аварийный участок трубопровода',
    'Перекрыть запорную арматуру (задвижки DN200/DN150)',
    'Снизить рабочее давление до 0.2 МПа',
    'Провести визуальный осмотр участка трубопровода',
    'Использовать корреляционный анализатор утечек',
    'Точно определить место повреждения',
    'Выкопать траншею до места повреждения',
    'Обрезать поврежденный участок трубы',
    'Установить ремонтную муфту DN200',
    'Затянуть хомуты с усилием 15-20 Н·м',
    'Проверить герметичность соединения',
    'Засыпать траншею с послойной трамбовкой',
    'Постепенно открыть задвижки',
    'Проверить восстановление давления до нормы',
    'Заполнить акт выполненных работ',
  ])

  const handleSignatureComplete = () => {
    setIsPlanApproved(true)
    setShowSignature(false)
    showSimpleToast('План одобрен и подписан', 'success')
    setTimeout(() => {
      onTakeAction()
    }, 1000)
  }

  const handleSignatureClose = () => {
    setShowSignature(false)
  }
  const workflowSteps = [
    { id: 'assessment', title: 'Оценка ситуации', icon: AlertTriangle },
    { id: 'timeline', title: 'Таймлайн аварии', icon: Clock },
    { id: 'dispatch', title: 'Выбор бригады', icon: Users },
    { id: 'task-assignment', title: 'Постановка задачи', icon: FileText },
  ]

  const availableTeams = [
    {
      id: 'team1',
      name: 'АВБ-1 - Аварийно-восстановительная бригада №1',
      status: 'available',
      eta: '15 мин',
    },
    {
      id: 'team2',
      name: 'АВБ-2 - Специализированная ремонтная бригада',
      status: 'busy',
      eta: '45 мин',
    },
    {
      id: 'team3',
      name: 'АВБ-3 - Технологическая бригада повышенной готовности',
      status: 'available',
      eta: '25 мин',
    },
  ]

  const getCriticalityInfo = (criticality: number) => {
    if (criticality >= 8)
      return {
        level: 'КРИТИЧЕСКАЯ',
        color: '#dc2626',
        description: 'Немедленные действия требуются',
        responseTime: '15 минут',
      }
    if (criticality >= 6)
      return {
        level: 'ВЫСОКАЯ',
        color: '#d97706',
        description: 'Быстрые действия требуются',
        responseTime: '30 минут',
      }
    return {
      level: 'СРЕДНЯЯ',
      color: '#2563eb',
      description: 'Плановые действия',
      responseTime: '60 минут',
    }
  }

  const criticalityInfo = getCriticalityInfo(alert.criticality)

  const updateTaskStep = (index: number, value: string) => {
    setTaskSteps(prev => prev.map((step, i) => (i === index ? value : step)))
  }

  const addTaskStep = () => {
    setTaskSteps(prev => [...prev, ''])
  }

  const removeTaskStep = (index: number) => {
    setTaskSteps(prev => prev.filter((_, i) => i !== index))
  }

  const renderAssessmentStep = () => (
    <div className={styles.stepContent}>
      <div className={styles.alertDetails}>
        <div className={styles.locationCard}>
          <div className={styles.cardHeader}>
            <MapPin size={20} />
            <h3>Локализация объекта</h3>
          </div>
          <p className={styles.address}>{alert.address}</p>
          <div className={styles.coordinates}>
            <span>Геодезические координаты: 55.7558° N, 37.6176° E</span>
          </div>
          <div className={styles.technicalLocation}>
            <div className={styles.locationItem}>
              <span className={styles.locationLabel}>Участок сети:</span>
              <span className={styles.locationValue}>ТУ-12-А</span>
            </div>
            <div className={styles.locationItem}>
              <span className={styles.locationLabel}>Колодец:</span>
              <span className={styles.locationValue}>№К-1247</span>
            </div>
            <div className={styles.locationItem}>
              <span className={styles.locationLabel}>Глубина залегания:</span>
              <span className={styles.locationValue}>2.3 м</span>
            </div>
          </div>
        </div>

        <div className={styles.criticalityCard}>
          <div className={styles.cardHeader}>
            <Shield size={20} />
            <h3>Оценка критичности</h3>
          </div>
          <div className={styles.criticalityInfo}>
            <span
              className={styles.criticalityLevel}
              style={{ color: criticalityInfo.color }}
            >
              {criticalityInfo.level}
            </span>
            <p>{criticalityInfo.description}</p>
            <div className={styles.responseTime}>
              <Timer size={16} />
              <span>
                Нормативное время реагирования: {criticalityInfo.responseTime}
              </span>
            </div>
            <div className={styles.technicalMetrics}>
              <div className={styles.metricItem}>
                <span className={styles.metricLabel}>Индекс критичности:</span>
                <span className={styles.metricValue}>
                  {alert.criticality}/10
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.technicalCard}>
          <div className={styles.cardHeader}>
            <Wrench size={20} />
            <h3>Технические характеристики</h3>
          </div>
          <div className={styles.technicalDetails}>
            <div className={styles.detailRow}>
              <span className={styles.label}>Инженерная система:</span>
              <span className={styles.value}>{alert.system}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>
                Технологическое оборудование:
              </span>
              <span className={styles.value}>{alert.equipment}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Причина:</span>
              <span className={styles.value}>{alert.cause}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Прогнозируемые последствия:</span>
              <span className={styles.value}>{alert.consequence}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Материал трубопровода:</span>
              <span className={styles.value}>Сталь марки Ст20</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Рабочее давление:</span>
              <span className={styles.value}>1.6 МПа</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Диаметр условного прохода:</span>
              <span className={styles.value}>DN200</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Толщина стенки:</span>
              <span className={styles.value}>6.3 мм</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Год ввода в эксплуатацию:</span>
              <span className={styles.value}>1990</span>
            </div>
          </div>
        </div>

        <div className={styles.recommendationsCard}>
          <div className={styles.cardHeader}>
            <FileText size={20} />
            <h3>Технологические рекомендации</h3>
          </div>
          <ul className={styles.recommendationsList}>
            <li>Локализовать аварийный участок трубопровода</li>
            <li>Перекрыть запорную арматуру (задвижки DN200/DN150)</li>
            <li>Снизить рабочее давление до 0.2 МПа</li>
            <li>
              Направить аварийно-восстановительную бригаду с ремонтными муфтами
              и стяжными хомутами
            </li>
            <li>
              Запустить корреляционный анализатор утечек для точного определения
              места повреждения
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.actionButtons}>
        <button
          className={styles.postponeButton}
          onClick={onPostpone}
        >
          <Clock size={16} />
          Отложить на 30 мин
        </button>
        <button
          className={styles.proceedButton}
          onClick={() => setCurrentStep('timeline')}
        >
          Изучить таймлайн
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )

  const renderTimelineStep = () => {
    const equipmentTimeline = [
      {
        id: 1,
        category: 'Трубопровод',
        component: 'Труба ДУ200, сталь',
        hoursToFailure: 2.2,
        status: 'critical',
        location: 'Тверская ул., д. 3, участок 15-20м',
        description: 'Критическое состояние трубопровода, вероятная утечка',
      },
      {
        id: 2,
        category: 'Запорная арматура',
        component: 'Задвижка К-12',
        hoursToFailure: 3.0,
        status: 'critical',
        location: 'Колодец №К-1247, Тверская ул.',
        description: 'Требуется немедленное перекрытие для локализации',
      },
      {
        id: 3,
        category: 'Соединения',
        component: 'Муфта переходная ДУ200/150',
        hoursToFailure: 3.5,
        status: 'critical',
        location: 'Тверская ул., д. 3',
        description: 'Механическое соединение, требуется проверка',
      },
      {
        id: 4,
        category: 'Контрольно-измерительные приборы',
        component: 'Манометр МП-100',
        hoursToFailure: 8.0,
        status: 'warning',
        location: 'Колодец №К-1247, Тверская ул.',
        description: 'Показывает корректные значения падения давления',
      },
      {
        id: 5,
        category: 'Система защиты',
        component: 'Катодная защита КЗ-200',
        hoursToFailure: 12.0,
        status: 'normal',
        location: 'Тверская ул., д. 3, станция КЗ',
        description: 'Работает в штатном режиме',
      },
      {
        id: 6,
        category: 'Канализационные сети',
        component: 'Соединения и вводы в здания',
        hoursToFailure: 13.0,
        status: 'normal',
        location: 'Тверская ул., д. 3',
        description: 'Состояние в пределах нормы',
      },
      {
        id: 7,
        category: 'Канализационные сети',
        component: 'Колодцы и люки',
        hoursToFailure: 19.0,
        status: 'normal',
        location: 'Тверская ул., д. 3',
        description: 'Работают в штатном режиме',
      },
      {
        id: 8,
        category: 'Трубопроводные сети',
        component: 'Трубы и соединения',
        hoursToFailure: 24.0,
        status: 'normal',
        location: 'Тверская ул., д. 3',
        description: 'Общее состояние сети в норме',
      },
    ]

    const maxHours = Math.max(
      ...equipmentTimeline.map(item => item.hoursToFailure),
    )

    return (
      <div className={styles.stepContent}>
        <div className={styles.timelineContent}>
          <h3>Прогностический анализ отказов оборудования</h3>
          <p className={styles.timelineDescription}>
            Математическое моделирование времени до отказа технологических
            компонентов
          </p>

          <div className={styles.timelineChart}>
            <div className={styles.chartHeader}>
              <span className={styles.chartTitle}>
                Временной интервал до критического отказа (часы)
              </span>
            </div>

            <div className={styles.chartContainer}>
              <div className={styles.yAxis}>
                {equipmentTimeline.map((item, index) => (
                  <div
                    key={item.id}
                    className={styles.yAxisLabel}
                  >
                    <span className={styles.itemNumber}>#{item.id}</span>
                    <span className={styles.itemCategory}>{item.category}</span>
                    <span className={styles.itemComponent}>
                      {item.component}
                    </span>
                  </div>
                ))}
              </div>

              <div className={styles.chartArea}>
                <div className={styles.xAxis}>
                  {[0, 3, 6, 9, 12, 15, 18, 21].map(hour => (
                    <div
                      key={hour}
                      className={styles.xAxisTick}
                    >
                      <span className={styles.tickLabel}>{hour}ч</span>
                    </div>
                  ))}
                </div>

                <div className={styles.barsContainer}>
                  {equipmentTimeline.map((item, index) => {
                    const barWidth = (item.hoursToFailure / maxHours) * 100
                    return (
                      <div
                        key={item.id}
                        className={styles.barRow}
                      >
                        <div
                          className={`${styles.bar} ${styles[item.status]}`}
                          style={{ width: `${barWidth}%` }}
                        >
                          <div className={styles.barValue}>
                            {item.hoursToFailure}ч
                          </div>
                        </div>
                        {item.hoursToFailure <= 3 && (
                          <div className={styles.criticalDot}></div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.timelineAnalysis}>
            <h4>Технико-экономический анализ критичности</h4>
            <div className={styles.analysisGrid}>
              <div className={styles.analysisItem}>
                <span className={styles.analysisLabel}>
                  Критичные технологические узлы:
                </span>
                <span className={styles.analysisValue}>
                  {
                    equipmentTimeline.filter(item => item.hoursToFailure <= 4)
                      .length
                  }{' '}
                  из {equipmentTimeline.length} компонентов
                </span>
              </div>
              <div className={styles.analysisItem}>
                <span className={styles.analysisLabel}>
                  Средний показатель надежности (MTBF):
                </span>
                <span className={styles.analysisValue}>
                  {(
                    equipmentTimeline.reduce(
                      (sum, item) => sum + item.hoursToFailure,
                      0,
                    ) / equipmentTimeline.length
                  ).toFixed(1)}{' '}
                  ч
                </span>
              </div>
              <div className={styles.analysisItem}>
                <span className={styles.analysisLabel}>
                  Приоритетный объект ремонта:
                </span>
                <span className={styles.analysisValue}>Труба ДУ200, сталь</span>
              </div>
              <div className={styles.analysisItem}>
                <span className={styles.analysisLabel}>
                  Рекомендуемая стратегия вмешательства:
                </span>
                <span className={styles.analysisValue}>
                  Экстренное техническое вмешательство
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button
            className={styles.backButton}
            onClick={() => setCurrentStep('assessment')}
          >
            Назад
          </button>
          <button
            className={styles.proceedButton}
            onClick={() => setCurrentStep('dispatch')}
          >
            Направить бригаду
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    )
  }

  const renderDispatchStep = () => (
    <div className={styles.stepContent}>
      <div className={styles.dispatchContent}>
        <h3>Выбор аварийно-восстановительной бригады</h3>

        <div className={styles.teamsList}>
          {availableTeams.map(team => (
            <div
              key={team.id}
              className={`${styles.teamCard} ${team.status === 'busy' ? styles.busy : ''} ${assignedTeam === team.name ? styles.selected : ''}`}
              onClick={() => {
                if (team.status === 'available') {
                  setAssignedTeam(team.name)
                  setEstimatedTime(team.eta)
                }
              }}
            >
              <div className={styles.teamInfo}>
                <div className={styles.teamHeader}>
                  <Users size={20} />
                  <span className={styles.teamName}>{team.name}</span>
                  <span className={`${styles.status} ${styles[team.status]}`}>
                    {team.status === 'available' ? 'Доступна' : 'Занята'}
                  </span>
                </div>
                <div className={styles.teamDetails}>
                  <div className={styles.eta}>
                    <Clock size={14} />
                    <span>Время прибытия: {team.eta}</span>
                  </div>
                  <div className={styles.specialization}>
                    <Wrench size={14} />
                    <span>
                      Технологическая специализация: {alert.equipment}
                    </span>
                  </div>
                </div>
              </div>
              {assignedTeam === team.name && (
                <div className={styles.selectedIndicator}>
                  <CheckCircle size={20} />
                  <span>Выбрана</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.actionButtons}>
        <button
          className={styles.backButton}
          onClick={() => setCurrentStep('assessment')}
        >
          Назад
        </button>
        <button
          className={styles.proceedButton}
          onClick={() => setCurrentStep('task-assignment')}
          disabled={!assignedTeam}
        >
          Поставить задачу
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )

  const renderTaskAssignmentStep = () => (
    <div className={styles.stepContent}>
      <div className={styles.taskAssignmentContent}>
        <div className={styles.taskForm}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Техническое задание диспетчера
            </label>
            <textarea
              value={taskDescription}
              onChange={e => setTaskDescription(e.target.value)}
              placeholder="Введите техническое задание для аварийно-восстановительной бригады..."
              className={styles.taskTextarea}
              rows={3}
            />
          </div>

          <div className={styles.taskSteps}>
            <div className={styles.taskStepsHeader}>
              <h4>Технологическая последовательность операций</h4>
              <button
                type="button"
                onClick={() => setIsEditingTasks(!isEditingTasks)}
                className={styles.editButton}
              >
                <Edit3 size={16} />
              </button>
            </div>

            {isEditingTasks ? (
              <div className={styles.stepsList}>
                {taskSteps.map((step, index) => (
                  <div
                    key={index}
                    className={styles.stepItem}
                  >
                    <span className={styles.stepNumber}>{index + 1}.</span>
                    <input
                      type="text"
                      value={step}
                      onChange={e => updateTaskStep(index, e.target.value)}
                      className={styles.stepInput}
                      placeholder="Введите задачу"
                    />
                    <button
                      type="button"
                      onClick={() => removeTaskStep(index)}
                      className={styles.removeButton}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTaskStep}
                  className={styles.addStepButton}
                >
                  + Добавить задачу
                </button>
              </div>
            ) : (
              <div className={styles.stepsListReadOnly}>
                {taskSteps.map((step, index) => (
                  <div
                    key={index}
                    className={styles.stepItemReadOnly}
                  >
                    <span className={styles.stepNumber}>{index + 1}.</span>
                    <span className={styles.stepText}>{step}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.equipmentList}>
            <h4>Технологическое оснащение и расходные материалы</h4>
            <div className={styles.equipmentGrid}>
              <div className={styles.equipmentCategory}>
                <h5>Специализированный инструмент</h5>
                <ul>
                  <li>Землеройный инструмент (лопата штыковая, совковая)</li>
                  <li>Ударно-разрушающий инструмент (лом, кирка)</li>
                  <li>Режущий инструмент (ножовка по металлу)</li>
                  <li>Монтажный инструмент (ключи гаечные, набор)</li>
                  <li>Динамический ключ для запорной арматуры</li>
                  <li>Контрольно-измерительный прибор (маномометр)</li>
                </ul>
              </div>
              <div className={styles.equipmentCategory}>
                <h5>Ремонтно-восстановительные материалы</h5>
                <ul>
                  <li>Ремонтная муфта DN200 (2 ед.)</li>
                  <li>Стяжные хомуты DN200 (4 ед.)</li>
                  <li>Уплотнительные элементы (резиновые прокладки)</li>
                  <li>Герметизирующие составы для трубопроводов</li>
                  <li>Изоляционные материалы (лента)</li>
                  <li>Антикоррозийные защитные покрытия</li>
                </ul>
              </div>
              <div className={styles.equipmentCategory}>
                <h5>Средства индивидуальной и коллективной защиты</h5>
                <ul>
                  <li>Защитные каски (2 ед.)</li>
                  <li>Рабочие перчатки</li>
                  <li>Защитная обувь с металлическим подноском</li>
                  <li>Предупреждающие знаки безопасности</li>
                  <li>Переносные ограждения</li>
                  <li>Аптечка первой медицинской помощи</li>
                </ul>
              </div>
            </div>
          </div>

          <div className={styles.contactInfo}>
            <h4>Оперативная связь и координация</h4>
            <div className={styles.contacts}>
              <div className={styles.contact}>
                <Phone size={16} />
                <span>Диспетчерская служба: +7 (495) 123-45-67</span>
              </div>
              <div className={styles.contact}>
                <Phone size={16} />
                <span>
                  Аварийно-восстановительная бригада: +7 (495) 765-43-21
                </span>
              </div>
              <div className={styles.contact}>
                <Phone size={16} />
                <span>Техническая поддержка: +7 (495) 987-65-43</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.actionButtons}>
        <button
          className={styles.backButton}
          onClick={() => setCurrentStep('dispatch')}
        >
          Назад
        </button>
        <button
          className={styles.completeButton}
          onClick={() => setShowSignature(true)}
          disabled={isPlanApproved}
        >
          {isPlanApproved
            ? '✓ Технологический план утвержден'
            : 'Утвердить технологический план'}
          <CheckCircle size={16} />
        </button>
      </div>
    </div>
  )

  const renderStepContent = () => {
    switch (currentStep) {
      case 'assessment':
        return renderAssessmentStep()
      case 'timeline':
        return renderTimelineStep()
      case 'dispatch':
        return renderDispatchStep()
      case 'task-assignment':
        return renderTaskAssignmentStep()
      default:
        return renderAssessmentStep()
    }
  }

  return (
    <div className={styles.workflowModal}>
      <div className={styles.modalHeader}>
        <div className={styles.headerInfo}>
          <AlertTriangle
            size={24}
            className={styles.alertIcon}
          />
          <div>
            <h2>{alert.equipment} - ВОЗМОЖНАЯ АВАРИЙНАЯ СИТУАЦИЯ</h2>
            <p>{alert.address}</p>
          </div>
        </div>
        <button
          className={styles.closeButton}
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>

      <ol className={styles.workflowSteps}>
        {workflowSteps.map((step, index) => {
          const isActive = step.id === currentStep

          return (
            <li
              key={step.id}
              className={`${styles.step} ${isActive ? styles.active : ''}`}
            >
              <span className={styles.stepNumber}>{index + 1}</span>
              <span className={styles.stepTitle}>{step.title}</span>
            </li>
          )
        })}
      </ol>

      <div className={styles.modalContent}>{renderStepContent()}</div>
      <ElectronicSignature
        isVisible={showSignature}
        onClose={handleSignatureClose}
        onComplete={handleSignatureComplete}
      />
    </div>
  )
}

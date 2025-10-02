import { Copy, Edit3, X } from 'lucide-react'
import type { FC } from 'react'
import { useState } from 'react'
import { Chart } from '../Chart'
import { ElectronicSignature } from '../electronic-signature'
import styles from './ObjectPopup.module.scss'

interface ObjectPopupProps {
  name: string
  description: string
  onClose: () => void
  // Дополнительные данные из событий
  location?: string
  problem?: string
  possibleCauses?: string[]
  recommendedActions?: Array<{
    text: string
    urgency: string
    deadline?: string
  }>
  expectedEffect?: string
  responsible?: string
  deadline?: string
  priority?: 'high' | 'medium' | 'low'
  metric?: {
    label: string
    value: string
    percentage: number
  }
  chartData?: Array<{
    x: number
    y: number
    label?: string
  }>
  chartConfig?: {
    color: string
    title: string
    xAxisLabel: string
    yAxisLabel: string
    legend?: Array<{
      label: string
      color: string
    }>
    multiLineData?: Array<{
      data: { x: number; y: number }[]
      color: string
      label: string
    }>
  }
}

export const ObjectPopup: FC<ObjectPopupProps> = ({
  name,
  description,
  onClose,
  location,
  problem,
  possibleCauses,
  recommendedActions,
  expectedEffect,
  responsible,
  deadline,
  priority,
  metric,
  chartData,
  chartConfig,
}) => {
  const [showSignature, setShowSignature] = useState(false)
  const [isPlanApproved, setIsPlanApproved] = useState(false)

  const handleApprovePlan = () => {
    setShowSignature(true)
  }

  const handleSignatureComplete = () => {
    setIsPlanApproved(true)
    setShowSignature(false)
  }

  const handleSignatureClose = () => {
    setShowSignature(false)
  }
  return (
    <div className={styles.popupCard}>
      <div className={styles.popupHeader}>
        <div>
          <div className={styles.popupTime}>13:59:52</div>
          <div className={styles.popupTitle}>
            {name}
            <span className={styles.popupTag}>
              {priority === 'high'
                ? 'Критическое'
                : priority === 'medium'
                  ? 'Средний приоритет'
                  : 'Низкий приоритет'}
            </span>
          </div>
        </div>
        <button
          className={styles.closeButton}
          onClick={onClose}
        >
          <X size={16} />
        </button>
      </div>

      <div className={styles.popupContent}>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Локация:</span>
          <span className={styles.detailValue}>
            {location ||
              'ул. Новая, д. 10, участок трубы ДУ300, сталь, 1990 г.в.'}
          </span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Статус:</span>
          <span className={styles.detailValue}>{description}</span>
        </div>
        {problem && (
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Проблема:</span>
            <span className={styles.detailValue}>{problem}</span>
          </div>
        )}

        <div className={styles.probabilityInline}>
          <span className={styles.probabilityLabel}>
            {metric?.label || 'Вероятность утечки'}:
          </span>
          <div className={styles.probabilityIndicator}>
            <span className={styles.probabilityValue}>
              {metric?.value || '75%'}
            </span>
            <div className={styles.probabilityBar}>
              <div
                className={styles.probabilityFill}
                style={{ width: `${Math.min(metric?.percentage || 75, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className={styles.chartContainer}>
          <div
            style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}
          >
            {chartConfig?.title || 'График данных'}
          </div>
          <Chart
            data={
              chartData || [
                { x: 4, y: 2.8 },
                { x: 5, y: 2.7 },
                { x: 6, y: 2.6 },
                { x: 7, y: 2.5 },
                { x: 8, y: 2.4 },
                { x: 9, y: 2.2 },
                { x: 10, y: 2.0 },
                { x: 11, y: 1.8 },
                { x: 12, y: 1.5 },
                { x: 13, y: 1.2 },
              ]
            }
            color={chartConfig?.color || '#dc3545'}
            animated={true}
            interactive={true}
            xAxisLabel={chartConfig?.xAxisLabel}
            yAxisLabel={chartConfig?.yAxisLabel}
            multiLineData={chartConfig?.multiLineData}
            showLegend={!!chartConfig?.multiLineData}
          />
        </div>

        {possibleCauses && possibleCauses.length > 0 && (
          <div className={styles.causesSection}>
            <div className={styles.causesTitle}>Возможные причины:</div>
            {possibleCauses.map((cause, index) => {
              // Разделяем причину и признаки, если они есть
              const parts = cause.split('Признаки:')
              const causeText = parts[0].trim()
              const signs = parts[1]?.trim()

              return (
                <div
                  key={index}
                  className={styles.causeItem}
                >
                  <div className={styles.causeText}>{causeText}</div>
                  {signs && (
                    <div className={styles.causeSigns}>Признаки: {signs}</div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {expectedEffect && (
          <div
            className={styles.prognosisSection}
            style={{
              backgroundColor: '#eff6ff',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #dbeafe',
            }}
          >
            <div className={styles.prognosisTitle}>Ожидаемый эффект:</div>
            <div className={styles.prognosisText}>{expectedEffect}</div>
          </div>
        )}
      </div>

      <div className={styles.actionsSection}>
        <div className={styles.actionsHeader}>
          <span className={styles.actionsTitle}>Рекомендуемые действия</span>
          <div className={styles.actionIcons}>
            <button className={styles.actionIcon}>
              <Edit3 size={12} />
            </button>
            <button className={styles.actionIcon}>
              <Copy size={12} />
            </button>
          </div>
        </div>

        <ol className={styles.actionList}>
          {recommendedActions && recommendedActions.length > 0 ? (
            recommendedActions.map((action, index) => (
              <li
                key={index}
                className={styles.actionItem}
              >
                <span className={styles.actionNumber}>{index + 1}</span>
                <span className={styles.actionText}>
                  <span
                    style={{
                      fontWeight: '600',
                      color:
                        action.urgency === 'Срочно' ? '#dc2626' : '#6b7280',
                    }}
                  >
                    #{action.urgency}
                  </span>{' '}
                  {action.text}
                </span>
              </li>
            ))
          ) : (
            <>
              <li className={styles.actionItem}>
                <span className={styles.actionNumber}>1</span>
                <span className={styles.actionText}>
                  Перекрыть задвижку К-12 (автоматическая, выполняется удаленно)
                </span>
              </li>
              <li className={styles.actionItem}>
                <span className={styles.actionNumber}>2</span>
                <span className={styles.actionText}>
                  Перекрыть задвижку К-15 (механическая, требуется выезд
                  бригады)
                </span>
              </li>
              <li className={styles.actionItem}>
                <span className={styles.actionNumber}>3</span>
                <span className={styles.actionText}>
                  Увеличить подачу через резервную линию Р-45 на 20% для
                  поддержания давления в смежных зонах
                </span>
              </li>
              <li className={styles.actionItem}>
                <span className={styles.actionNumber}>4</span>
                <span className={styles.actionText}>
                  Направить бригаду №3 для перекрытия задвижки и осмотра участка
                </span>
              </li>
              <li className={styles.actionItem}>
                <span className={styles.actionNumber}>5</span>
                <span className={styles.actionText}>
                  Уведомить службу 112 о возможных отключениях
                </span>
              </li>
            </>
          )}
        </ol>

        {(responsible || deadline) && (
          <div
            style={{
              marginBottom: '16px',
              padding: '12px',
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              fontSize: '14px',
            }}
          >
            {responsible && (
              <div>
                <strong>Ответственный:</strong> {responsible}
              </div>
            )}
            {deadline && (
              <div>
                <strong>Срок:</strong> {deadline}
              </div>
            )}
          </div>
        )}

        <button
          className={`${styles.approveButton} ${isPlanApproved ? styles.approved : ''}`}
          onClick={handleApprovePlan}
          disabled={isPlanApproved}
        >
          {isPlanApproved ? '✓ План одобрен' : 'Одобрить план'}
        </button>
      </div>

      <ElectronicSignature
        isVisible={showSignature}
        onClose={handleSignatureClose}
        onComplete={handleSignatureComplete}
      />
    </div>
  )
}

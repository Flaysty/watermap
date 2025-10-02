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
}

export const ObjectPopup: FC<ObjectPopupProps> = ({
  name,
  description,
  onClose,
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
            Падение давление на КК-78
            <span className={styles.popupTag}>Критическое</span>
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
            ул. Новая, д. 10, участок трубы ДУ300, сталь, 1990 г.в.
          </span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Время обнаружения:</span>
          <span className={styles.detailValue}>14:30</span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Текущее давление:</span>
          <span className={styles.detailValue}>1.2 атм</span>
        </div>

        <div className={styles.probabilityInline}>
          <span className={styles.probabilityLabel}>Вероятность утечки:</span>
          <div className={styles.probabilityIndicator}>
            <span className={styles.probabilityValue}>75%</span>
            <div className={styles.probabilityBar}>
              <div
                className={styles.probabilityFill}
                style={{ width: '75%' }}
              />
            </div>
          </div>
        </div>

        <div className={styles.chartContainer}>
          <Chart
            data={[
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
            ]}
            color="#dc3545"
            animated={true}
            interactive={true}
          />
        </div>

        <div className={styles.prognosisSection}>
          <div className={styles.prognosisTitle}>Прогноз:</div>
          <div className={styles.prognosisText}>
            Без вмешательства давление упадет до 0,8 атм в течение 30 минут, что
            приведет к отключению воды у 200 абонентов
          </div>
        </div>

        <div className={styles.causesSection}>
          <div className={styles.causesTitle}>Возможные причины:</div>
          <div className={styles.causeItem}>
            <div className={styles.causeText}>
              Предполагаемая утечка на участке между задвижками К-12 и К-15
              (65%)
            </div>
            <div className={styles.causeSigns}>
              Признаки: падение давления только на этом участке, соседние
              участки в норме
            </div>
          </div>
          <div className={styles.causeItem}>
            <div className={styles.causeText}>Самовольный отбор воды (20%)</div>
            <div className={styles.causeSigns}>
              Признаки: аномальный рост расхода в ночное время в этой зоне
            </div>
          </div>
          <div className={styles.causeItem}>
            <div className={styles.causeText}>Засор/закупорка трубы (10%)</div>
            <div className={styles.causeSigns}>
              Признаки: постепенное нарастание сопротивления
            </div>
          </div>
          <div className={styles.causeItem}>
            <div className={styles.causeText}>Ошибка датчика (5%)</div>
            <div className={styles.causeSigns}>
              Требуется проверка оборудования
            </div>
          </div>
        </div>
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
          <li className={styles.actionItem}>
            <span className={styles.actionNumber}>1</span>
            <span className={styles.actionText}>
              Перекрыть задвижку К-12 (автоматическая, выполняется удаленно)
            </span>
          </li>
          <li className={styles.actionItem}>
            <span className={styles.actionNumber}>2</span>
            <span className={styles.actionText}>
              Перекрыть задвижку К-15 (механическая, требуется выезд бригады)
            </span>
          </li>
          <li className={styles.actionItem}>
            <span className={styles.actionNumber}>3</span>
            <span className={styles.actionText}>
              Увеличить подачу через резервную линию Р-45 на 20% для поддержания
              давления в смежных зонах
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
        </ol>

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

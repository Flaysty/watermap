import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import styles from './RoleSelectionPage.module.scss'

type Role = 'technologist' | 'dispatcher' | 'foreman'

interface RoleOption {
  id: Role
  title: string
  description: string
  icon: string
  color: string
  isDisabled?: boolean
  disabledText?: string
}

const roles: RoleOption[] = [
  // {
  //   id: 'technologist',
  //   title: 'Технолог',
  //   description: 'Контроль качества воды и технологических процессов',
  //   icon: '👨‍🔬',
  //   color: '#0ea5e9',
  // },
  {
    id: 'dispatcher',
    title: 'Диспетчер',
    description: 'Мониторинг системы и управление операциями',
    icon: '👨‍💼',
    color: '#10b981',
  },
  {
    id: 'foreman',
    title: 'Бригадир',
    description: 'Координация работ',
    icon: '👷‍♂️',
    color: '#f59e0b',
    isDisabled: true,
    disabledText: 'В разработке',
  },
]

export const RoleSelectionPage = () => {
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleRoleSelect = async (role: Role, isDisabled?: boolean) => {
    if (isDisabled) return

    setSelectedRole(role)
    setIsAnimating(true)

    navigate({ to: '/dashboard' })
  }

  return (
    <div className={styles.container}>
      {/* Контейнер для водных эффектов */}
      <div className={styles.waterEffects}>
        {/* Пузырьки воздуха */}
        <div className={styles.bubble}></div>
        <div className={styles.bubble}></div>
        <div className={styles.bubble}></div>
        <div className={styles.bubble}></div>
        <div className={styles.bubble}></div>
        <div className={styles.bubble}></div>
        <div className={styles.bubble}></div>
        <div className={styles.bubble}></div>
        <div className={styles.bubble}></div>
        <div className={styles.bubble}></div>
        <div className={styles.bubble}></div>
        <div className={styles.bubble}></div>
        <div className={styles.bubble}></div>
        <div className={styles.bubble}></div>
        <div className={styles.bubble}></div>
        <div className={styles.bubble}></div>
      </div>

      {/* Контейнер для мелких частиц */}
      <div className={styles.particles}>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <img
              src="/images/logo.png"
              alt="Карта Водоканала"
              className={styles.logoImage}
            />
            <h1 className={styles.title}>Карта Водоканала</h1>
            <p className={styles.subtitle}>
              Система прогнозирования и предупреждения возникновения аварийных
              ситуаций на водоканале
            </p>
          </div>
        </div>

        <div className={styles.roleSelection}>
          <h2 className={styles.selectionTitle}>Выберите вашу роль</h2>
          <div className={styles.rolesContainer}>
            {roles.map(role => (
              <div
                key={role.id}
                className={`${styles.roleCard} ${
                  selectedRole === role.id ? styles.selected : ''
                } ${isAnimating ? styles.animating : ''} ${
                  role.isDisabled ? styles.disabled : ''
                }`}
                onClick={() => handleRoleSelect(role.id, role.isDisabled)}
                style={{ '--role-color': role.color } as React.CSSProperties}
              >
                {/* Градиентный фон */}
                <div className={styles.roleGradient} />

                {/* Контент карточки */}
                <div className={styles.roleContent}>
                  {/* Иконка */}
                  <div className={styles.roleIcon}>{role.icon}</div>

                  {/* Текст */}
                  <div className={styles.roleText}>
                    <h3 className={styles.roleTitle}>{role.title}</h3>
                    <p className={styles.roleDescription}>{role.description}</p>
                    {role.isDisabled && (
                      <p className={styles.disabledText}>{role.disabledText}</p>
                    )}
                  </div>

                  {/* Стрелка */}
                  {!role.isDisabled && (
                    <div className={styles.roleArrow}>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </div>

                {/* Декоративные элементы */}
                <div className={styles.roleDecoration1} />
                <div className={styles.roleDecoration2} />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            Государственное учреждение водоснабжения
          </p>
        </div>
      </div>
    </div>
  )
}

import clsx from 'clsx'
import { FC, ReactNode, useState } from 'react'
import { MENU_ITEMS } from '~/shared/constants'
import type { MenuItem } from '~/shared/types'
import { Icons } from '~/shared/ui'
import styles from './Sidebar.module.scss'

export const Sidebar: FC = () => {
  const [activeItem, setActiveItem] = useState('map')
  const [isCollapsed, setIsCollapsed] = useState(true)

  // Маппинг иконок для пунктов меню
  const getMenuIcon = (id: string): ReactNode => {
    const iconMap: Record<string, ReactNode> = {
      map: <Icons.Map />,
      water: <Icons.Droplet />,
      layers: <Icons.Layers />,
      teams: <Icons.User />,
      cameras: <Icons.Video />,
      objects: <Icons.Folder />,
      settings: <Icons.Settings />,
    }
    return iconMap[id] || null
  }

  const menuItems: MenuItem[] = MENU_ITEMS.map(item => ({
    id: item.id,
    label: item.label,
    icon: getMenuIcon(item.id),
  }))

  return (
    <div className={clsx(styles.sidebar, { [styles.collapsed]: isCollapsed })}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <img
              src="images/logo.png"
              alt="logo"
            />
          </div>
        </div>
        <button
          className={styles.toggleButton}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <Icons.Chevron
            className={clsx({
              [styles.chevronCollapsed]: isCollapsed,
              [styles.chevronExpanded]: !isCollapsed,
            })}
          />
        </button>
      </div>

      {/* Меню */}
      <nav className={styles.menu}>
        {menuItems.map(item => (
          <button
            key={item.id}
            className={clsx(styles.menuItem, {
              [styles.active]: activeItem === item.id,
            })}
            onClick={() => setActiveItem(item.id)}
            title={isCollapsed ? item.label : undefined}
          >
            <span className={styles.menuIcon}>{item.icon}</span>
            {!isCollapsed && (
              <span className={styles.menuLabel}>{item.label}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Кнопка выхода */}
      <div className={styles.footer}>
        <button
          className={styles.logoutButton}
          title={isCollapsed ? 'Выход' : undefined}
        >
          <Icons.Logout className={styles.logoutIcon} />
          {!isCollapsed && <span className={styles.logoutText}>Выход</span>}
        </button>
      </div>
    </div>
  )
}

import { ReactNode, useState } from 'react'
import { ChevronFirst, ChevronLast } from 'lucide-react'
import { Link as RouterLink } from '@tanstack/react-router'
import { SidebarContext } from '~/widgets/sidebar/lib/sidebar-context'
import { Icons } from '~/shared'

import styles from './SidebarRoot.module.scss'
import clsx from 'clsx'

export function Root({ children }: { children: ReactNode }) {
  const [expanded, setExpanded] = useState(false)
  const [activeId, setActiveId] = useState<string>('map')

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        {/* Шапка */}
        <div className={styles.header}>
          <img
            src="/images/logo.png"
            alt="Logo"
            className={styles.logo}
          />
          <div
            className={clsx(styles.logoText, {
              [styles.logoTextVisible]: expanded,
            })}
          >
            Карта Водоканала
          </div>
          <button
            onClick={() => setExpanded(curr => !curr)}
            className={styles.toggle}
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        {/* Меню */}
        <SidebarContext.Provider value={{ expanded, activeId, setActiveId }}>
          <ul className={styles.menu}>{children}</ul>
        </SidebarContext.Provider>

        {/* Кнопка выхода */}
        <div className={styles.footer}>
          <RouterLink
            to="/"
            className={styles.logoutButton}
            title={expanded ? 'Выход' : undefined}
          >
            <Icons.Logout className={styles.logoutIcon} />
            {expanded && <span className={styles.logoutText}>Выход</span>}
          </RouterLink>
        </div>
      </nav>
    </aside>
  )
}

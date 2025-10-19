import { useContext } from 'react'
import { SidebarContext } from '~/widgets/sidebar/lib/sidebar-context'
import styles from './SidebarItem.module.scss'
import { Link } from '@tanstack/react-router'

export function Item({ id, icon, text }: any) {
  const { expanded, activeId, setActiveId } = useContext(SidebarContext)

  const isActive = activeId == id
  return (
    <Link
      to={id}
      className={`${styles.item} group 
        ${isActive ? styles.active : ''} 
        ${expanded ? styles.expanded : ''}`}
    >
      <span className={styles.icon}>{icon}</span>
      <span className={styles.text}>{text}</span>

      {!expanded && (
        <div
          className={`${styles.tooltip} group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
        >
          {text}
        </div>
      )}
    </Link>
  )
}

import clsx from 'clsx'
import styles from './Icon.module.scss'
import type { FC, ReactNode } from 'react'

export interface IconWrapperProps {
  className?: string
  onClick?: () => void
  children?: ReactNode
}

export const IconWrapper: FC<IconWrapperProps> = ({
  className,
  children,
  ...props
}) => (
  <span
    className={clsx(styles.icon, className)}
    {...props}
  >
    {children}
  </span>
)

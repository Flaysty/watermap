import { IconWrapper } from '../IconWrapper'
import type { ComponentProps } from 'react'

export const ChevronIcon = (props: ComponentProps<typeof IconWrapper>) => (
  <IconWrapper {...props}>
    <svg
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.5286 11.5286C5.26825 11.7889 5.26825 12.2111 5.5286 12.4714C5.78895 12.7318 6.21106 12.7318 6.47141 12.4714L10.4714 8.47141C10.7318 8.21106 10.7318 7.78895 10.4714 7.5286L6.47141 3.5286C6.21106 3.26825 5.78895 3.26825 5.5286 3.5286C5.26825 3.78895 5.26825 4.21106 5.5286 4.47141L9.05719 8L5.5286 11.5286Z"
        fill="currentColor"
      />
    </svg>
  </IconWrapper>
)

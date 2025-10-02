import { IconWrapper } from '../IconWrapper'
import type { ComponentProps } from 'react'

export const FilmTextIcon = (props: ComponentProps<typeof IconWrapper>) => (
  <IconWrapper {...props}>
    <svg
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.5 3.5H13.5C14.0523 3.5 14.5 3.94772 14.5 4.5V11.5C14.5 12.0523 14.0523 12.5 13.5 12.5H2.5C1.94772 12.5 1.5 12.0523 1.5 11.5V4.5C1.5 3.94772 1.94772 3.5 2.5 3.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 7.5H9.5M6.5 9.5H9.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </IconWrapper>
)

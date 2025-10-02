import { IconWrapper } from '../IconWrapper'
import type { ComponentProps } from 'react'

export const LayersIcon = (props: ComponentProps<typeof IconWrapper>) => (
  <IconWrapper {...props}>
    <svg
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.1681 14.4116L10.5948 18.625L19.0216 14.4116"
        stroke="currentColor"
        strokeWidth="1.26401"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.1681 10.1982L10.5948 14.4116L19.0216 10.1982"
        stroke="currentColor"
        strokeWidth="1.26401"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5948 1.77148L2.1681 5.98485L10.5948 10.1982L19.0216 5.98485L10.5948 1.77148Z"
        stroke="currentColor"
        strokeWidth="1.26401"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </IconWrapper>
)

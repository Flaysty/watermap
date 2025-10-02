import { IconWrapper } from '../IconWrapper'
import type { ComponentProps } from 'react'

export const MapIcon = (props: ComponentProps<typeof IconWrapper>) => (
  <IconWrapper {...props}>
    <svg
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_2154_329)">
        <path
          d="M1.32543 5.5388V19.0216L7.22414 15.6509L13.9655 19.0216L19.8642 15.6509V2.16811L13.9655 5.5388L7.22414 2.16811L1.32543 5.5388Z"
          stroke="currentColor"
          strokeWidth="1.26401"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.9655 5.53879V19.0215"
          stroke="currentColor"
          strokeWidth="1.26401"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.22414 2.16811V15.6509"
          stroke="currentColor"
          strokeWidth="1.26401"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_2154_329">
          <rect
            width="20.2241"
            height="20.2241"
            fill="currentColor"
            transform="translate(0.482758 0.482758)"
          />
        </clipPath>
      </defs>
    </svg>
  </IconWrapper>
)

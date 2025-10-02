import { IconWrapper } from '../IconWrapper'
import type { ComponentProps } from 'react'

export const DropletIcon = (props: ComponentProps<typeof IconWrapper>) => (
  <IconWrapper {...props}>
    <svg
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.5948 3.05124L15.3644 7.82077C16.3076 8.76339 16.9501 9.96458 17.2106 11.2724C17.471 12.5802 17.3378 13.9359 16.8277 15.168C16.3176 16.4001 15.4535 17.4532 14.3448 18.1941C13.2361 18.9351 11.9325 19.3306 10.599 19.3306C9.26553 19.3306 7.96198 18.9351 6.85327 18.1941C5.74456 17.4532 4.8805 16.4001 4.3704 15.168C3.86029 13.9359 3.72704 12.5802 3.98752 11.2724C4.24799 9.96458 4.89049 8.76339 5.83373 7.82077L10.5948 3.05124Z"
        stroke="currentColor"
        strokeWidth="1.26401"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </IconWrapper>
)

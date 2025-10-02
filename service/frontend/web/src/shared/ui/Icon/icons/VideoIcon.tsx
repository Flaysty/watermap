import { IconWrapper } from '../IconWrapper'
import type { ComponentProps } from 'react'

export const VideoIcon = (props: ComponentProps<typeof IconWrapper>) => (
  <IconWrapper {...props}>
    <svg
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_2154_337)">
        <path
          d="M19.8642 6.5885L13.9655 10.8019L19.8642 15.0152V6.5885Z"
          stroke="currentColor"
          strokeWidth="1.26401"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.2802 4.90314H3.01078C2.07999 4.90314 1.32543 5.65769 1.32543 6.58848V15.0152C1.32543 15.946 2.07999 16.7006 3.01078 16.7006H12.2802C13.211 16.7006 13.9655 15.946 13.9655 15.0152V6.58848C13.9655 5.65769 13.211 4.90314 12.2802 4.90314Z"
          stroke="currentColor"
          strokeWidth="1.26401"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_2154_337">
          <rect
            width="20.2241"
            height="20.2241"
            fill="currentColor"
            transform="translate(0.482758 0.689789)"
          />
        </clipPath>
      </defs>
    </svg>
  </IconWrapper>
)

import { FC } from 'react'

export const TrendNeutralIcon: FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect
        x="0.242516"
        y="0.464233"
        width="11.1737"
        height="11.1737"
        rx="2.79341"
        fill="#3A78FF"
      />
      <path
        d="M3.5 6H8.5M6 3.5L6 8.5"
        stroke="white"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  )
}

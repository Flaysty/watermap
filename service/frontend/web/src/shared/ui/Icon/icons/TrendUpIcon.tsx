import { FC } from 'react'

export const TrendUpIcon: FC<{ className?: string }> = ({ className }) => {
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
        fill="#CC5F5F"
      />
      <path
        d="M6.15854 8.84448C6.15854 9.0263 6.01115 9.17369 5.82934 9.17369C5.64752 9.17369 5.50013 9.0263 5.50013 8.84448L5.82934 8.84448L6.15854 8.84448ZM5.82934 2.79209L7.73001 6.08416L3.92866 6.08416L5.82934 2.79209ZM5.82934 8.84448L5.50013 8.84448L5.50013 5.75495L5.82934 5.75495L6.15854 5.75495L6.15854 8.84448L5.82934 8.84448Z"
        fill="white"
      />
    </svg>
  )
}

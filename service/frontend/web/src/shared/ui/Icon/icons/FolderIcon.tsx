import { IconWrapper } from '../IconWrapper'
import type { ComponentProps } from 'react'

export const FolderIcon = (props: ComponentProps<typeof IconWrapper>) => (
  <IconWrapper {...props}>
    <svg
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.0216 16.0022C19.0216 16.4492 18.844 16.8779 18.5279 17.1939C18.2119 17.51 17.7832 17.6876 17.3362 17.6876H3.85345C3.40647 17.6876 2.97779 17.51 2.66173 17.1939C2.34566 16.8779 2.1681 16.4492 2.1681 16.0022V4.20482C2.1681 3.75783 2.34566 3.32916 2.66173 3.0131C2.97779 2.69703 3.40647 2.51947 3.85345 2.51947H8.06681L9.75215 5.04749H17.3362C17.7832 5.04749 18.2119 5.22505 18.5279 5.54111C18.844 5.85718 19.0216 6.28585 19.0216 6.73283V16.0022Z"
        stroke="currentColor"
        strokeWidth="1.26401"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </IconWrapper>
)

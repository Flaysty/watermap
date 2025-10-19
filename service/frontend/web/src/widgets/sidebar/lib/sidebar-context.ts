import { createContext, Dispatch, SetStateAction } from 'react'

interface SidebarContextProps {
  expanded: boolean
  activeId: string
  setActiveId: Dispatch<SetStateAction<string>>
}

export const SidebarContext = createContext<SidebarContextProps>({
  expanded: false,
  activeId: 'map',
  setActiveId: () => {},
})

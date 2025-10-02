import { FC } from 'react'
import { Filter } from 'lucide-react'

interface EventsHeaderProps {
  title: string
  onFilterClick?: () => void
}

export const EventsHeader: FC<EventsHeaderProps> = ({
  title,
  onFilterClick,
}) => {
  return (
    <div className={'header'}>
      <h3 className={'title'}>{title}</h3>
      <button
        className={'filtersButton'}
        onClick={onFilterClick}
      >
        <Filter size={14} />
      </button>
    </div>
  )
}

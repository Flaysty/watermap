import { Icons } from '~/shared'

export const MENU_ITEMS = [
  { id: '/dashboard', label: 'Главная', icon: <Icons.Map /> },
  // { id: '/water', label: 'Сеть', icon: <Icons.Droplet /> },
  { id: '/risks', label: 'Аномалии', icon: <Icons.Folder /> },
  { id: '/predictions', label: 'Мониторинг', icon: <Icons.Droplet /> },
  { id: '/teams', label: 'Бригады', icon: <Icons.User /> },
  // { id: '/objects', label: 'Данные', icon: <Icons.Folder /> },
  { id: '/settings', label: 'Настройки', icon: <Icons.Settings /> },
] as const

import type { Address, Camera } from './types'

/**
 * Константы с данными для карты
 */

export const ADDRESSES: Address[] = [
  {
    name: 'РЭВС № 10',
    coords: [37.446566882471224, 55.82591889024101] as [number, number],
    description: 'Тушинская ул., д.11 к.1',
    icon: '/assets/pin.svg',
  },
  {
    name: 'РЭВС № 5',
    coords: [37.406248374223836, 55.71141564439001] as [number, number],
    description: 'Вяземская ул., д. 11, стр. 2',
    icon: '/assets/pin.svg',
  },
  {
    name: 'РЭВС № 1',
    coords: [37.54266033657659, 55.73183866038937] as [number, number],
    description: '1-й Сетуньский пр-д, д. 10 А',
    icon: '/assets/pin.svg',
  },
  {
    name: 'РЭВС № 2',
    coords: [37.527992631041826, 55.81287318979047] as [number, number],
    description: '2-й Амбулаторный пер, д.12 А',
    icon: '/assets/pin.svg',
  },
  {
    name: 'РЭВС № 6',
    coords: [37.70103139837315, 55.863312658679185] as [number, number],
    description: 'ул. Вешних вод, д. 12',
    icon: '/assets/pin.svg',
  },
  {
    name: 'РЭВС № 11',
    coords: [37.7913941263364, 55.817248125363335] as [number, number],
    description: 'ул.Байкальская д.11',
    icon: '/assets/pin.svg',
  },
  {
    name: 'РЭВС № 3',
    coords: [37.83515604774114, 55.76100429496029] as [number, number],
    description: 'Прокатная ул., д. 5 А',
    icon: '/assets/pin.svg',
  },
  {
    name: 'РЭВС № 4',
    coords: [37.750304909101935, 55.68210801665107] as [number, number],
    description: 'Краснодонская ул., д. 13',
    icon: '/assets/pin.svg',
  },
]

export const MOCK_CAMERAS: Camera[] = [
  {
    id: '1',
    title: 'Штабной автобус',
    identifier: '735',
    image: '/images/cams/1.png',
  },
  {
    id: '2',
    title: 'Камера бригады',
    identifier: '1452',
    image: '/images/cams/2.png',
  },
  {
    id: '3',
    title: 'Насосная станция',
    identifier: 'Вавилова 19',
    image: '/images/cams/3.png',
  },
  {
    id: '4',
    title: 'Ярополецкая ГЭС',
    identifier: '',
    image: '/images/cams/4.png',
  },
  {
    id: '5',
    title: 'Камера бригады',
    identifier: '1025',
    image: '/images/cams/5.png',
  },
]

export const MAP_CONFIG = {
  center: [37.6142, 55.7522] as [number, number],
  zoom: 10,
  pitch: 0,
  bearing: -17.6,
  inspectionZoom: 20,
  inspectionBearing: 30,
  animationDuration: 2000,
  resizeDebounceMs: 300, // Увеличиваем дебаунсинг для предотвращения мерцания
} as const

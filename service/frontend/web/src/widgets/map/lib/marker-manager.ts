import maplibregl from 'maplibre-gl'
import type { Address } from '../types'

/**
 * Утилиты для работы с маркерами на карте
 */
export class MarkerManager {
  private map: maplibregl.Map
  private markers: maplibregl.Marker[] = []

  constructor(map: maplibregl.Map) {
    this.map = map
  }

  /**
   * Создание маркеров для адресов
   */
  createMarkers(
    addresses: Address[],
    onMarkerClick: (name: string) => void,
  ): void {
    addresses.forEach(({ name, description, coords, icon }) => {
      const el = document.createElement('div')
      el.className = 'custom-marker'
      el.style.width = '40px'
      el.style.height = '40px'
      el.style.borderRadius = '6px'
      el.style.overflow = 'hidden'
      el.style.boxShadow = '0 0 5px rgba(0,0,0,0.3)'
      el.style.cursor = 'pointer'
      el.style.transition = 'all 0.2s ease'
      el.style.backgroundColor = '#3a78ff'
      el.style.border = '2px solid #fff'

      const marker = new maplibregl.Marker(el).setLngLat(coords).addTo(this.map)
      this.markers.push(marker)

      // Добавляем обработчик клика
      marker.getElement().addEventListener('click', e => {
        e.preventDefault()
        e.stopPropagation()
        onMarkerClick(name)
        this.setActiveMarker(el)
      })

      // Добавляем ховер эффекты
      marker.getElement().addEventListener('mouseenter', () => {
        if (!el.classList.contains('active-marker')) {
          el.style.transform = 'scale(1.3)'
          el.style.boxShadow = '0 0 20px rgba(58, 120, 255, 0.8)'
          el.style.backgroundColor = '#1e40af'
          el.style.border = '3px solid #fff'
        }
      })

      marker.getElement().addEventListener('mouseleave', () => {
        if (!el.classList.contains('active-marker')) {
          el.style.transform = 'scale(1)'
          el.style.boxShadow = '0 0 5px rgba(0,0,0,0.3)'
          el.style.backgroundColor = '#3a78ff'
          el.style.border = '2px solid #fff'
        }
      })
    })
  }

  /**
   * Установка активного маркера
   */
  setActiveMarker(element: HTMLElement): void {
    document
      .querySelectorAll('.custom-marker')
      .forEach(m => m.classList.remove('active-marker'))
    element.classList.add('active-marker')
  }

  /**
   * Снятие активности со всех маркеров
   */
  clearActiveMarkers(): void {
    document
      .querySelectorAll('.custom-marker')
      .forEach(m => m.classList.remove('active-marker'))
  }

  /**
   * Установка активного маркера по индексу
   */
  setActiveMarkerByIndex(index: number): void {
    const markers = document.querySelectorAll('.custom-marker')
    this.clearActiveMarkers()
    if (markers[index]) {
      markers[index].classList.add('active-marker')
    }
  }

  /**
   * Очистка всех маркеров
   */
  clearMarkers(): void {
    this.markers.forEach(marker => marker.remove())
    this.markers = []
  }

  /**
   * Добавляет заданное количество алерт-маркеров
   */
  addRandomAlertMarkers(
    count: number,
    onClick?: (coords: [number, number]) => void,
  ): void {
    const markers = [
      [37.55447028092139, 55.78202247448168],
      [37.63119509795863, 55.80406024411234],
      [37.6156211201128, 55.76022053924569],
      [37.620745730502826, 55.73496190886104],
    ]

    markers.forEach(([lng, lat]) => {
      const el = document.createElement('div')
      el.className = 'alert-marker'
      el.style.cursor = 'pointer'
      el.innerHTML = '<span>!</span>'

      // Клик по алерт-маркеру
      el.addEventListener('click', e => {
        e.preventDefault()
        e.stopPropagation()
        onClick?.([lng, lat])
      })

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([lng, lat])
        .addTo(this.map)

      this.markers.push(marker)
    })
  }
}

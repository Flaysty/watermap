import maplibregl from 'maplibre-gl'
import { ADDRESSES } from '../constants'

/**
 * Утилиты для работы с 3D зданиями на карте
 */
export class Building3DManager {
  private map: maplibregl.Map

  constructor(map: maplibregl.Map) {
    this.map = map
  }

  /**
   * Добавление слоя 3D зданий с особой окраской
   */
  add3DBuildings(): void {
    if (this.map.getStyle().sources['openmaptiles']) {
      this.map.addLayer({
        id: '3d-buildings',
        source: 'openmaptiles',
        'source-layer': 'building',
        filter: ['==', 'extrude', 'true'],
        type: 'fill-extrusion',
        minzoom: 15,
        paint: {
          'fill-extrusion-color': [
            'match',
            ['get', 'name'],
            ...this.getBuildingColors(),
            '#aaa', // Цвет по умолчанию
          ],
          'fill-extrusion-height': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'height'],
          ],
          'fill-extrusion-base': ['get', 'min_height'],
          'fill-extrusion-opacity': 0.6,
        },
      })
    }
  }

  /**
   * Получение цветов для зданий РЭВС
   */
  private getBuildingColors(): (string | string[])[] {
    const colors: (string | string[])[] = []
    
    ADDRESSES.forEach(address => {
      colors.push(address.name, '#3a78ff')
    })
    
    return colors
  }

  /**
   * Настройка видимости слоев карты
   */
  configureLayerVisibility(): void {
    // Отключаем ненужные подписи, включаем только нужные
    this.map.setLayoutProperty('poi-label', 'visibility', 'none')
    this.map.setLayoutProperty('place-city-label', 'visibility', 'visible')
    this.map.setLayoutProperty('transit-label', 'visibility', 'visible')
  }
}

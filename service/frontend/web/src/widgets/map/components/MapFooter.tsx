import { FC, useEffect } from 'react'
import type { MapFooterProps } from '../types'

/**
 * Компонент футера карты с атрибуцией
 */
export const MapFooter: FC<MapFooterProps> = ({ className }) => {
  useEffect(() => {
    // Создаем стили для футера
    const style = document.createElement('style')
    style.textContent = `
      .f4map-footer {
        white-space: nowrap;
        line-height: 16px;
      }
      
      .f4map-footer-text {
        display: inline-block;
        background: rgba(255, 255, 255, 0.8);
        font-size: 10px;
        line-height: 16px;
        color: #000;
        padding-left: 8px;
      }
      
      .f4map-copyright,
      .f4map-osm-contributors {
        margin-right: 12px;
      }
      
      .f4map-link,
      .f4map-osm-contributors-link {
        color: #000;
        text-decoration: none;
        cursor: pointer;
      }
      
      .f4map-link:hover,
      .f4map-osm-contributors-link:hover {
        text-decoration: underline;
      }
      
      /* Скрываем стандартную атрибуцию MapLibre */
      .maplibregl-ctrl-attrib {
        display: none !important;
      }
      
      .maplibregl-ctrl-attrib-inner {
        display: none !important;
      }
    `
    document.head.appendChild(style)

    return () => {
      if (style.parentNode) {
        style.parentNode.removeChild(style)
      }
    }
  }, [])

  return (
    <div className={`f4map-footer ${className || ''}`}>
      <div className="f4map-footer-text">
        <span className="f4map-copyright">
          <a
            className="f4map-link"
            href="https://lights-on.pro"
            target="_blank"
            rel="noopener noreferrer"
          >
            Lights-On&nbsp;©&nbsp;Lights-On
          </a>
        </span>
        <span className="f4map-osm-contributors">
          Map data&nbsp;©&nbsp;
          <a
            className="f4map-osm-contributors-link"
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noopener noreferrer"
          >
            OpenStreetMap contributors
          </a>
        </span>
      </div>
    </div>
  )
}

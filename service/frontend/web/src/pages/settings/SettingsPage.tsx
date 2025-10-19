import React, { useState } from 'react'
import {
  Settings,
  Thermometer,
  Droplets,
  Gauge,
  Zap,
  Shield,
  Save,
  RotateCcw,
  Info,
} from 'lucide-react'
import * as Slider from '@radix-ui/react-slider'
import { Tooltip } from 'react-tooltip'
import styles from './SettingsPage.module.scss'

interface MetricSettings {
  optimalRange: { min: number; max: number }
  sensitivity: number // Чувствительность отклонения (0-100%)
}

interface SettingsData {
  // Пороги оборудования
  temperature: MetricSettings
  waterFlow: MetricSettings
  pressure: MetricSettings
  powerConsumption: MetricSettings
  systemLoad: MetricSettings

  // Производство воды
  waterProduction: MetricSettings
  waterProductionOwn: MetricSettings
  waterSupply: MetricSettings
  waterSales: MetricSettings
  nonRevenueWater: MetricSettings
  nonRevenueWaterShare: MetricSettings
  fuelConsumption: MetricSettings

  // Энергопотребление
  electricityWater: MetricSettings
  electricityWaterSpecific: MetricSettings
  electricityTotal: MetricSettings

  // Водоподготовка
  chlorineConsumption: MetricSettings
  coagulantConsumption: MetricSettings

  // Аварийность и качество
  waterAccidents: MetricSettings
  waterComplaints: MetricSettings

  // Стоки
  wastewaterVolume: MetricSettings
  electricityWastewater: MetricSettings
  electricityWastewaterSpecific: MetricSettings
  blockages: MetricSettings
  wastewaterAccidents: MetricSettings

  // Финансы
  accountsReceivable: MetricSettings
  bankAccounts: MetricSettings
  costPrice: MetricSettings
}

const defaultSettings: SettingsData = {
  // Пороги оборудования
  temperature: {
    optimalRange: { min: 60, max: 75 }, // СанПиН 2.1.4.2496-09
    sensitivity: 10, // Строгий контроль температуры
  },
  waterFlow: {
    optimalRange: { min: 0.15, max: 0.35 }, // Предотвращение застоя и перегрузки
    sensitivity: 15, // Средняя чувствительность
  },
  pressure: {
    optimalRange: { min: 0.3, max: 0.6 }, // СП 30.13330.2016 (МПа)
    sensitivity: 20, // Важный параметр для подачи
  },
  powerConsumption: {
    optimalRange: { min: 60, max: 85 }, // Энергоэффективность
    sensitivity: 25, // Мониторинг энергозатрат
  },
  systemLoad: {
    optimalRange: { min: 50, max: 80 }, // Оптимальная производительность
    sensitivity: 20, // Предотвращение перегрузок
  },

  // Производство воды
  waterProduction: {
    optimalRange: { min: 85, max: 95 },
    sensitivity: 10,
  },
  waterProductionOwn: {
    optimalRange: { min: 5, max: 15 },
    sensitivity: 20,
  },
  waterSupply: {
    optimalRange: { min: 80, max: 90 },
    sensitivity: 15,
  },
  waterSales: {
    optimalRange: { min: 75, max: 85 },
    sensitivity: 12,
  },
  nonRevenueWater: {
    optimalRange: { min: 8, max: 12 },
    sensitivity: 25,
  },
  nonRevenueWaterShare: {
    optimalRange: { min: 5, max: 10 },
    sensitivity: 30,
  },
  fuelConsumption: {
    optimalRange: { min: 70, max: 85 },
    sensitivity: 20,
  },

  // Энергопотребление
  electricityWater: {
    optimalRange: { min: 80, max: 95 },
    sensitivity: 15,
  },
  electricityWaterSpecific: {
    optimalRange: { min: 75, max: 90 },
    sensitivity: 18,
  },
  electricityTotal: {
    optimalRange: { min: 85, max: 95 },
    sensitivity: 12,
  },

  // Водоподготовка
  chlorineConsumption: {
    optimalRange: { min: 60, max: 80 },
    sensitivity: 25,
  },
  coagulantConsumption: {
    optimalRange: { min: 70, max: 85 },
    sensitivity: 22,
  },

  // Аварийность и качество
  waterAccidents: {
    optimalRange: { min: 0, max: 5 },
    sensitivity: 50,
  },
  waterComplaints: {
    optimalRange: { min: 0, max: 3 },
    sensitivity: 40,
  },

  // Стоки
  wastewaterVolume: {
    optimalRange: { min: 90, max: 110 },
    sensitivity: 20,
  },
  electricityWastewater: {
    optimalRange: { min: 75, max: 90 },
    sensitivity: 18,
  },
  electricityWastewaterSpecific: {
    optimalRange: { min: 70, max: 85 },
    sensitivity: 20,
  },
  blockages: {
    optimalRange: { min: 0, max: 8 },
    sensitivity: 35,
  },
  wastewaterAccidents: {
    optimalRange: { min: 0, max: 3 },
    sensitivity: 45,
  },

  // Финансы
  accountsReceivable: {
    optimalRange: { min: 0, max: 10 },
    sensitivity: 30,
  },
  bankAccounts: {
    optimalRange: { min: 80, max: 95 },
    sensitivity: 15,
  },
  costPrice: {
    optimalRange: { min: 70, max: 85 },
    sensitivity: 20,
  },
}

const metricConfigs = [
  // Производство воды
  {
    category: 'Производство воды',
    metrics: [
      {
        key: 'waterProduction' as keyof SettingsData,
        title: 'Объем добычи воды',
        icon: Droplets,
        unit: '%',
        description: 'Нормативные показатели производства',
        min: 0,
        max: 100,
        step: 1,
        regulations: {
          title: 'Нормы водопользования',
          content: (
            <div>
              <p>
                <strong>СанПиН 2.1.4.1074-01:</strong>
              </p>
              <ul>
                <li>• Норма водопотребления: 200-300 л/чел/сут</li>
                <li>• Коэффициент неравномерности: 1,2-1,5</li>
                <li>• Резерв на пожаротушение: 10-15%</li>
              </ul>
              <p>
                <strong>ГОСТ 2874-82:</strong>
              </p>
              <ul>
                <li>• Качество питьевой воды</li>
                <li>• Микробиологические показатели</li>
              </ul>
            </div>
          ),
        },
      },
      {
        key: 'waterProductionOwn' as keyof SettingsData,
        title: 'Добыча воды на собственные нужды',
        icon: Droplets,
        unit: '%',
        description: 'Внутреннее потребление',
        min: 0,
        max: 30,
        step: 1,
      },
      {
        key: 'waterSupply' as keyof SettingsData,
        title: 'Объем подачи воды',
        icon: Droplets,
        unit: '%',
        description: 'Объемы поставки потребителям',
        min: 0,
        max: 100,
        step: 1,
      },
      {
        key: 'waterSales' as keyof SettingsData,
        title: 'Объем реализации воды',
        icon: Droplets,
        unit: '%',
        description: 'Коммерческие объемы',
        min: 0,
        max: 100,
        step: 1,
      },
      {
        key: 'nonRevenueWater' as keyof SettingsData,
        title: 'Объем недоходной воды',
        icon: Droplets,
        unit: '%',
        description: 'Потери и неучтенные объемы',
        min: 0,
        max: 30,
        step: 1,
        regulations: {
          title: 'Нормы потерь воды',
          content: (
            <div>
              <p>
                <strong>Приказ Минстроя №485/пр:</strong>
              </p>
              <ul>
                <li>• Максимальные потери: 20%</li>
                <li>• Целевые потери: 10-15%</li>
                <li>• Утечки в сетях: не более 8%</li>
              </ul>
            </div>
          ),
        },
      },
      {
        key: 'nonRevenueWaterShare' as keyof SettingsData,
        title: 'Доля недоходной воды',
        icon: Droplets,
        unit: '%',
        description: 'Процент потерь от общего объема',
        min: 0,
        max: 20,
        step: 1,
      },
      {
        key: 'fuelConsumption' as keyof SettingsData,
        title: 'Потребление ГСМ',
        icon: Zap,
        unit: '%',
        description: 'Горюче-смазочные материалы',
        min: 0,
        max: 100,
        step: 1,
      },
    ],
  },

  // Энергопотребление
  {
    category: 'Энергопотребление',
    metrics: [
      {
        key: 'electricityWater' as keyof SettingsData,
        title: 'Электроэнергия (вода)',
        icon: Zap,
        unit: '%',
        description: 'Энергопотребление водоснабжения',
        min: 0,
        max: 100,
        step: 1,
        regulations: {
          title: 'Нормы энергопотребления',
          content: (
            <div>
              <p>
                <strong>СП 30.13330.2016:</strong>
              </p>
              <ul>
                <li>• Удельный расход: 0,3-0,5 кВт·ч/м³</li>
                <li>• КПД насосов: не менее 70%</li>
                <li>• Энергоэффективность: класс А</li>
              </ul>
            </div>
          ),
        },
      },
      {
        key: 'electricityWaterSpecific' as keyof SettingsData,
        title: 'Удельное энергопотребление (вода)',
        icon: Zap,
        unit: '%',
        description: 'Энергоэффективность водоснабжения',
        min: 0,
        max: 100,
        step: 1,
      },
      {
        key: 'electricityTotal' as keyof SettingsData,
        title: 'Общее энергопотребление',
        icon: Zap,
        unit: '%',
        description: 'Суммарное потребление электроэнергии',
        min: 0,
        max: 100,
        step: 1,
      },
    ],
  },

  // Водоподготовка
  {
    category: 'Водоподготовка',
    metrics: [
      {
        key: 'chlorineConsumption' as keyof SettingsData,
        title: 'Расход хлора',
        icon: Shield,
        unit: '%',
        description: 'Реагенты для обеззараживания',
        min: 0,
        max: 100,
        step: 1,
        regulations: {
          title: 'Нормы хлорирования',
          content: (
            <div>
              <p>
                <strong>СанПиН 2.1.4.1074-01:</strong>
              </p>
              <ul>
                <li>• Остаточный хлор: 0,3-0,5 мг/л</li>
                <li>• Свободный хлор: 0,1-0,3 мг/л</li>
                <li>• Контактное время: 30 мин</li>
              </ul>
            </div>
          ),
        },
      },
      {
        key: 'coagulantConsumption' as keyof SettingsData,
        title: 'Расход коагулянта',
        icon: Shield,
        unit: '%',
        description: 'Реагенты для очистки воды',
        min: 0,
        max: 100,
        step: 1,
      },
    ],
  },

  // Аварийность и качество
  {
    category: 'Аварийность и качество',
    metrics: [
      {
        key: 'waterAccidents' as keyof SettingsData,
        title: 'Аварии водоснабжения',
        icon: Shield,
        unit: 'шт',
        description: 'Количество аварийных ситуаций',
        min: 0,
        max: 20,
        step: 1,
      },
      {
        key: 'waterComplaints' as keyof SettingsData,
        title: 'Жалобы по воде',
        icon: Shield,
        unit: 'шт',
        description: 'Обращения потребителей',
        min: 0,
        max: 10,
        step: 1,
      },
    ],
  },

  // Стоки
  {
    category: 'Стоки',
    metrics: [
      {
        key: 'wastewaterVolume' as keyof SettingsData,
        title: 'Объем стоков',
        icon: Droplets,
        unit: '%',
        description: 'Объемы водоотведения',
        min: 0,
        max: 150,
        step: 1,
      },
      {
        key: 'electricityWastewater' as keyof SettingsData,
        title: 'Электроэнергия (стоки)',
        icon: Zap,
        unit: '%',
        description: 'Энергопотребление водоотведения',
        min: 0,
        max: 100,
        step: 1,
      },
      {
        key: 'electricityWastewaterSpecific' as keyof SettingsData,
        title: 'Удельное энергопотребление (стоки)',
        icon: Zap,
        unit: '%',
        description: 'Энергоэффективность водоотведения',
        min: 0,
        max: 100,
        step: 1,
      },
      {
        key: 'blockages' as keyof SettingsData,
        title: 'Количество засоров',
        icon: Shield,
        unit: 'шт',
        description: 'Засоры в системе водоотведения',
        min: 0,
        max: 20,
        step: 1,
      },
      {
        key: 'wastewaterAccidents' as keyof SettingsData,
        title: 'Аварии водоотведения',
        icon: Shield,
        unit: 'шт',
        description: 'Аварийные ситуации в стоках',
        min: 0,
        max: 10,
        step: 1,
      },
    ],
  },

  // Финансы
  {
    category: 'Финансы',
    metrics: [
      {
        key: 'accountsReceivable' as keyof SettingsData,
        title: 'Дебиторская задолженность',
        icon: Shield,
        unit: '%',
        description: 'Непогашенные долги',
        min: 0,
        max: 30,
        step: 1,
      },
      {
        key: 'bankAccounts' as keyof SettingsData,
        title: 'Состояние расчетных счетов',
        icon: Shield,
        unit: '%',
        description: 'Ликвидность средств',
        min: 0,
        max: 100,
        step: 1,
      },
      {
        key: 'costPrice' as keyof SettingsData,
        title: 'Себестоимость',
        icon: Shield,
        unit: '%',
        description: 'Экономические показатели',
        min: 0,
        max: 100,
        step: 1,
      },
    ],
  },
]

// Конфигурация для порогов оборудования
const equipmentConfigs = [
  {
    key: 'temperature' as keyof SettingsData,
    title: 'Температура ГВС',
    icon: Thermometer,
    unit: '°C',
    description: 'Нормы СанПиН 2.1.4.2496-09',
    min: 50,
    max: 90,
    step: 1,
    regulations: {
      title: 'Нормы температуры ГВС',
      content: (
        <div>
          <p>
            <strong>СанПиН 2.1.4.2496-09:</strong>
          </p>
          <ul>
            <li>• Оптимальная температура: 60-75°C</li>
            <li>• Минимальная температура: 60°C</li>
            <li>• Максимальная температура: 75°C</li>
            <li>• Предотвращение размножения бактерий</li>
          </ul>
        </div>
      ),
    },
  },
  {
    key: 'waterFlow' as keyof SettingsData,
    title: 'Водопотоки',
    icon: Droplets,
    unit: 'м³/час',
    description: 'Промышленные нормы',
    min: 0.05,
    max: 0.8,
    step: 0.05,
    regulations: {
      title: 'Нормы водопотоков',
      content: (
        <div>
          <p>
            <strong>Технические нормы:</strong>
          </p>
          <ul>
            <li>• Минимальный расход: 0,05 м³/час</li>
            <li>• Оптимальный расход: 0,15-0,35 м³/час</li>
            <li>• Максимальный расход: 0,8 м³/час</li>
            <li>• Предотвращение застоя воды</li>
          </ul>
        </div>
      ),
    },
  },
  {
    key: 'pressure' as keyof SettingsData,
    title: 'Давление в системе',
    icon: Gauge,
    unit: 'МПа',
    description: 'Технические нормы',
    min: 0.1,
    max: 1.0,
    step: 0.05,
    regulations: {
      title: 'Нормы давления',
      content: (
        <div>
          <p>
            <strong>СП 30.13330.2016:</strong>
          </p>
          <ul>
            <li>• Минимальное давление: 0,3 МПа</li>
            <li>• Оптимальное давление: 0,3-0,6 МПа</li>
            <li>• Максимальное давление: 0,6 МПа</li>
            <li>• Обеспечение подачи на верхние этажи</li>
          </ul>
        </div>
      ),
    },
  },
  {
    key: 'powerConsumption' as keyof SettingsData,
    title: 'Потребление энергии',
    icon: Zap,
    unit: '%',
    description: 'Энергоэффективность',
    min: 0,
    max: 100,
    step: 1,
    regulations: {
      title: 'Нормы энергопотребления',
      content: (
        <div>
          <p>
            <strong>ФЗ №261 "Об энергосбережении":</strong>
          </p>
          <ul>
            <li>• Целевое потребление: 60-85%</li>
            <li>• Критическое потребление: &gt;90%</li>
            <li>• Энергоэффективность класса А</li>
            <li>• Мониторинг энергозатрат</li>
          </ul>
        </div>
      ),
    },
  },
  {
    key: 'systemLoad' as keyof SettingsData,
    title: 'Нагрузка системы',
    icon: Shield,
    unit: '%',
    description: 'Производительность',
    min: 0,
    max: 100,
    step: 1,
    regulations: {
      title: 'Нормы нагрузки системы',
      content: (
        <div>
          <p>
            <strong>Технические требования:</strong>
          </p>
          <ul>
            <li>• Оптимальная нагрузка: 50-80%</li>
            <li>• Критическая нагрузка: &gt;85%</li>
            <li>• Резерв мощности: 15-30%</li>
            <li>• Предотвращение перегрузок</li>
          </ul>
        </div>
      ),
    },
  },
]

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SettingsData>(defaultSettings)
  const [activeTab, setActiveTab] = useState<'equipment' | 'metrics'>(
    'equipment',
  )

  const handleRangeChange = (metric: keyof SettingsData, values: number[]) => {
    setSettings(prev => ({
      ...prev,
      [metric]: {
        ...prev[metric],
        optimalRange: {
          min: values[0],
          max: values[1],
        },
      },
    }))
  }

  const handleSensitivityChange = (
    metric: keyof SettingsData,
    values: number[],
  ) => {
    setSettings(prev => ({
      ...prev,
      [metric]: {
        ...prev[metric],
        sensitivity: values[0],
      },
    }))
  }

  const handleSave = () => {
    console.log('Сохранение настроек:', settings)
    alert('Настройки сохранены!')
  }

  const handleReset = () => {
    setSettings(defaultSettings)
  }

  return (
    <div className={styles.content}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Настройки системы</h1>
          <p className={styles.subtitle}>
            Регулировка порогов и параметров мониторинга водоканала
          </p>
        </div>
      </div>

      <div className={styles.scrollableContent}>
        {/* Табы */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'equipment' ? styles.active : ''}`}
            onClick={() => setActiveTab('equipment')}
          >
            Пороги оборудования
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'metrics' ? styles.active : ''}`}
            onClick={() => setActiveTab('metrics')}
          >
            Параметры метрик
          </button>
        </div>

        {/* Контент табов */}
        <div className={styles.tabContent}>
          {activeTab === 'equipment' ? (
            <div className={styles.sections}>
              <div className={styles.categorySection}>
                <div className={styles.categoryHeader}>
                  <h2 className={styles.categoryTitle}>Пороги оборудования</h2>
                </div>
                <div className={styles.categoryMetrics}>
                  {equipmentConfigs.map(config => {
                    const IconComponent = config.icon
                    const currentSettings = settings[config.key]

                    return (
                      <div
                        key={config.key}
                        className={styles.metricCard}
                      >
                        <div className={styles.metricHeader}>
                          <div className={styles.metricTitle}>
                            <IconComponent size={18} />
                            <div>
                              <h4>
                                {config.title}
                                {config.regulations && (
                                  <Info
                                    size={14}
                                    className={styles.infoIcon}
                                    data-tooltip-id={`tooltip-${config.key}`}
                                  />
                                )}
                              </h4>
                              <p>{config.description}</p>
                            </div>
                          </div>
                        </div>

                        <div className={styles.metricContent}>
                          {/* Оптимальный диапазон */}
                          <div className={styles.controlGroup}>
                            <div className={styles.controlHeader}>
                              <span className={styles.controlLabel}>
                                Оптимальный диапазон
                              </span>
                              <span className={styles.rangeValue}>
                                {currentSettings.optimalRange.min} -{' '}
                                {currentSettings.optimalRange.max} {config.unit}
                              </span>
                            </div>

                            <div className={styles.rangeSlider}>
                              <Slider.Root
                                className={styles.sliderRoot}
                                value={[
                                  currentSettings.optimalRange.min,
                                  currentSettings.optimalRange.max,
                                ]}
                                onValueChange={values =>
                                  handleRangeChange(config.key, values)
                                }
                                min={config.min}
                                max={config.max}
                                step={config.step}
                              >
                                <Slider.Track className={styles.sliderTrack}>
                                  <Slider.Range
                                    className={styles.sliderRange}
                                  />
                                </Slider.Track>
                                <Slider.Thumb className={styles.sliderThumb} />
                                <Slider.Thumb className={styles.sliderThumb} />
                              </Slider.Root>
                            </div>
                          </div>

                          {/* Чувствительность отклонения */}
                          <div className={styles.controlGroup}>
                            <div className={styles.controlHeader}>
                              <span className={styles.controlLabel}>
                                Чувствительность
                              </span>
                              <span className={styles.sensitivityValue}>
                                {currentSettings.sensitivity}%
                              </span>
                            </div>

                            <div className={styles.sensitivitySlider}>
                              <Slider.Root
                                className={styles.sliderRoot}
                                value={[currentSettings.sensitivity]}
                                onValueChange={values =>
                                  handleSensitivityChange(config.key, values)
                                }
                                min={0}
                                max={100}
                                step={5}
                              >
                                <Slider.Track className={styles.sliderTrack}>
                                  <Slider.Range
                                    className={styles.sliderRange}
                                  />
                                </Slider.Track>
                                <Slider.Thumb className={styles.sliderThumb} />
                              </Slider.Root>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.sections}>
              {metricConfigs.map(category => (
                <div
                  key={category.category}
                  className={styles.categorySection}
                >
                  <div className={styles.categoryHeader}>
                    <h2 className={styles.categoryTitle}>
                      {category.category}
                    </h2>
                  </div>
                  <div className={styles.categoryMetrics}>
                    {category.metrics.map(config => {
                      const IconComponent = config.icon
                      const currentSettings = settings[config.key]

                      return (
                        <div
                          key={config.key}
                          className={styles.metricCard}
                        >
                          <div className={styles.metricHeader}>
                            <div className={styles.metricTitle}>
                              <IconComponent size={18} />
                              <div>
                                <h4>
                                  {config.title}
                                  {config.regulations && (
                                    <Info
                                      size={14}
                                      className={styles.infoIcon}
                                      data-tooltip-id={`tooltip-${config.key}`}
                                    />
                                  )}
                                </h4>
                                <p>{config.description}</p>
                              </div>
                            </div>
                          </div>

                          <div className={styles.metricContent}>
                            {/* Оптимальный диапазон */}
                            <div className={styles.controlGroup}>
                              <div className={styles.controlHeader}>
                                <span className={styles.controlLabel}>
                                  Оптимальный диапазон
                                </span>
                                <span className={styles.rangeValue}>
                                  {currentSettings.optimalRange.min} -{' '}
                                  {currentSettings.optimalRange.max}{' '}
                                  {config.unit}
                                </span>
                              </div>

                              <div className={styles.rangeSlider}>
                                <Slider.Root
                                  className={styles.sliderRoot}
                                  value={[
                                    currentSettings.optimalRange.min,
                                    currentSettings.optimalRange.max,
                                  ]}
                                  onValueChange={values =>
                                    handleRangeChange(config.key, values)
                                  }
                                  min={config.min}
                                  max={config.max}
                                  step={config.step}
                                >
                                  <Slider.Track className={styles.sliderTrack}>
                                    <Slider.Range
                                      className={styles.sliderRange}
                                    />
                                  </Slider.Track>
                                  <Slider.Thumb
                                    className={styles.sliderThumb}
                                  />
                                  <Slider.Thumb
                                    className={styles.sliderThumb}
                                  />
                                </Slider.Root>
                              </div>
                            </div>

                            {/* Чувствительность отклонения */}
                            <div className={styles.controlGroup}>
                              <div className={styles.controlHeader}>
                                <span className={styles.controlLabel}>
                                  Чувствительность
                                </span>
                                <span className={styles.sensitivityValue}>
                                  {currentSettings.sensitivity}%
                                </span>
                              </div>

                              <div className={styles.sensitivitySlider}>
                                <Slider.Root
                                  className={styles.sliderRoot}
                                  value={[currentSettings.sensitivity]}
                                  onValueChange={values =>
                                    handleSensitivityChange(config.key, values)
                                  }
                                  min={0}
                                  max={100}
                                  step={5}
                                >
                                  <Slider.Track className={styles.sliderTrack}>
                                    <Slider.Range
                                      className={styles.sliderRange}
                                    />
                                  </Slider.Track>
                                  <Slider.Thumb
                                    className={styles.sliderThumb}
                                  />
                                </Slider.Root>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles.footer}>
        <button
          className={styles.resetButton}
          onClick={handleReset}
        >
          <RotateCcw size={16} />
          Сбросить все
        </button>
        <button
          className={styles.saveButton}
          onClick={handleSave}
        >
          <Save size={16} />
          Сохранить изменения
        </button>
      </div>

      {/* Tooltips для нормативных данных */}
      {equipmentConfigs.map(config =>
        config.regulations ? (
          <Tooltip
            key={`tooltip-${config.key}`}
            id={`tooltip-${config.key}`}
            place="top"
            className={styles.tooltip}
          >
            <div className={styles.tooltipContent}>
              <h5>{config.regulations.title}</h5>
              {config.regulations.content}
            </div>
          </Tooltip>
        ) : null,
      )}
      {metricConfigs.map(category =>
        category.metrics.map(config =>
          config.regulations ? (
            <Tooltip
              key={`tooltip-${config.key}`}
              id={`tooltip-${config.key}`}
              place="top"
              className={styles.tooltip}
            >
              <div className={styles.tooltipContent}>
                <h5>{config.regulations.title}</h5>
                {config.regulations.content}
              </div>
            </Tooltip>
          ) : null,
        ),
      )}
    </div>
  )
}

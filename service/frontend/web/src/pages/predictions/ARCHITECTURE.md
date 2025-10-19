# Архитектура страницы прогнозирования

## Структура компонентов

```
PredictionsPage (ui/)
├── CurrentDataSection (widgets/current-data-section/)
│   ├── DataTable (widgets/data-table/)
│   └── ChartsGrid (widgets/charts-grid/)
├── ForecastSection (widgets/forecast-section/)
│   ├── ForecastCharts (widgets/forecast-charts/)
│   └── AnalyticsPanel (widgets/analytics-panel/)
└── AlertsPanel (widgets/alerts-panel/)
```

## Поток данных

```
API (chart-api.ts)
├── fetchChartData() → CurrentDataSection
├── fetchPredictionData() → ForecastSection + AlertsPanel
└── ProcessedData → Компоненты графиков и аналитики
```

## Группировка данных

```
Временные интервалы:
├── По дням (daily)
│   └── Группировка по дате (YYYY-MM-DD)
└── По неделям (weekly)
    └── Группировка по началу недели
```

## Система предупреждений

```
Анализ данных:
├── Температура ГВС → Критические/Предупреждения
├── Потери воды → Предупреждения
├── Потребление → Информационные уведомления
└── Эффективность → Статус системы
```

## Интеграция с Chart.tsx

```
Chart компонент:
├── Пороговые значения (thresholds)
├── Множественные линии (multiLineData)
├── Интерактивные тултипы
└── Анимации и переходы
```

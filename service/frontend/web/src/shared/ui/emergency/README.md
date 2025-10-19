# Emergency Module

Модуль для работы с аварийными ситуациями в системе мониторинга водоканала.

## Структура

```
emergency/
├── components/          # Компоненты
│   ├── EmergencyToast.tsx              # Уведомление об аварии
│   ├── EmergencyWorkflow.tsx           # Воркфлоу обработки аварии
│   ├── EmergencyWorkflowModal.tsx      # Модальное окно воркфлоу
│   └── index.ts
├── styles/             # Стили компонентов
│   ├── EmergencyToast.module.scss
│   ├── EmergencyWorkflow.module.scss
│   └── EmergencyWorkflowModal.module.scss
├── types/              # Типы и интерфейсы
│   └── index.ts
└── index.ts

```

## Компоненты

### EmergencyToast

Компактное уведомление об аварийной ситуации с таймером и кнопками действий.

**Свойства:**

- `alert: EmergencyAlert` - данные об аварии
- `onDismiss: () => void` - закрыть уведомление
- `onTakeAction: () => void` - взять аварию в работу
- `onPostpone: () => void` - отложить обработку
- `onOpenWorkflow: () => void` - открыть воркфлоу

**Функция:**

- `showEmergencyToast(alert, onOpenWorkflow)` - показать уведомление

### EmergencyWorkflow

Многошаговый воркфлоу обработки аварии:

1. Оценка ситуации
2. Таймлайн аварии (графический анализ)
3. Направление бригады
4. Постановка задачи (с электронной подписью)

**Свойства:**

- `alert: EmergencyAlert` - данные об аварии
- `onClose: () => void` - закрыть воркфлоу
- `onTakeAction: () => void` - завершить обработку
- `onPostpone: () => void` - отложить

### EmergencyWorkflowModal

Обертка для воркфлоу в модальном окне.

**Свойства:**

- `isOpen: boolean` - видимость модального окна
- `alert: EmergencyAlert | null` - данные об аварии
- `onClose: () => void` - закрыть модальное окно
- `onTakeAction: () => void` - завершить обработку
- `onPostpone: () => void` - отложить

## Типы

### EmergencyAlert

```typescript
interface EmergencyAlert {
  id: number
  address: string
  cause: string
  system: string
  equipment: string
  consequence: string
  criticality: number
  hoursToFailure: number
  preventionHours: number
  startTime: string
  predictedFailureTime: string
  actionRequired: boolean
  priorityScore: number
  recommendations: string
}
```

### WorkflowStep

```typescript
type WorkflowStep = 'assessment' | 'timeline' | 'dispatch' | 'task-assignment'
```

## Использование

```tsx
import {
  showEmergencyToast,
  EmergencyWorkflowModal,
  type EmergencyAlert
} from '@/shared/ui/emergency'

// Показать уведомление
const alert: EmergencyAlert = { /* ... */ }
showEmergencyToast(alert, () => setIsWorkflowOpen(true))

// Использовать воркфлоу
<EmergencyWorkflowModal
  isOpen={isWorkflowOpen}
  alert={currentAlert}
  onClose={() => setIsWorkflowOpen(false)}
  onTakeAction={handleTakeAction}
  onPostpone={handlePostpone}
/>
```

## Интеграция с хуками

Используйте `useEmergencyAlerts` для управления уведомлениями:

```tsx
import { useEmergencyAlerts } from '@/shared/hooks'

const {
  currentAlert,
  isWorkflowOpen,
  openWorkflow,
  closeWorkflow,
  showNextAlert,
} = useEmergencyAlerts()
```

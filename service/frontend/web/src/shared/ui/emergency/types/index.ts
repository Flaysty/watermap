export interface EmergencyAlert {
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

export type WorkflowStep =
  | 'assessment'
  | 'timeline'
  | 'dispatch'
  | 'task-assignment'

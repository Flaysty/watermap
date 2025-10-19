import { createFileRoute } from '@tanstack/react-router'
import { PredictionsPage } from '~/pages'

export const Route = createFileRoute('/_layout/predictions')({
  component: PredictionsPage,
})

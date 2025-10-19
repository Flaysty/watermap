import { createFileRoute } from '@tanstack/react-router'
import { AppLayout } from '~/pages'

export const Route = createFileRoute('/_layout')({
  component: AppLayout,
})

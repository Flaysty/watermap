import { createFileRoute } from '@tanstack/react-router'
import { RisksPage } from '~/pages/risks'

export const Route = createFileRoute('/_layout/risks')({
  component: RisksPage,
})

import { Routing } from '~/app/Routing'
import { QueryProvider } from '~/shared/api/query-provider'

export const App = () => {
  return (
    <QueryProvider>
      <Routing />
    </QueryProvider>
  )
}

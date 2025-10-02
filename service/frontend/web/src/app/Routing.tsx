import { createRouter, Navigate, RouterProvider } from '@tanstack/react-router'
// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance
const router = createRouter({
  routeTree,
  defaultNotFoundComponent: () => <Navigate to="/" />,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export const Routing = () => {
  return <RouterProvider router={router} />
}

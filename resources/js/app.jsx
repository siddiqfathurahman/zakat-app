import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'

createInertiaApp({
  resolve: name => {
    return import(`./pages/${name}.jsx`)
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />)
  },
})

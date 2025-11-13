import { contextBridge } from 'electron'

if (!process.contextIsolated) {
  throw new Error(
    'Context Isolation is disabled. The preload script requires context isolation to be enabled for security reasons.'
  )
}

try {
  contextBridge.exposeInMainWorld('context', {
    locale: navigator.language
  })
} catch (error) {
  console.error(error)
}

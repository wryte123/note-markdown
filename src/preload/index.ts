import { contextBridge } from 'electron'

if (!process.contextIsolated) {
  throw new Error(
    'Context Isolation is disabled. The preload script requires context isolation to be enabled for security reasons.'
  )
}

try {
  contextBridge.exposeInMainWorld('context', {
    // TODO: Add custom APIs here
  })
} catch (error) {
  console.error(error)
}

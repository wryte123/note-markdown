import { CreateNote, DeleteNote, GetNotes, ReadNote, SaveImage, WriteNote } from '@shared/types'
import { contextBridge, ipcRenderer } from 'electron'

if (!process.contextIsolated) {
  throw new Error(
    'Context Isolation is disabled. The preload script requires context isolation to be enabled for security reasons.'
  )
}

try {
  contextBridge.exposeInMainWorld('context', {
    locale: navigator.language,
    getNotes: (...args: Parameters<GetNotes>) => ipcRenderer.invoke('getNotes', ...args),
    readNote: (...args: Parameters<ReadNote>) => ipcRenderer.invoke('readNote', ...args),
    writeNote: (...args: Parameters<WriteNote>) => ipcRenderer.invoke('writeNote', ...args),
    createNote: (...args: Parameters<CreateNote>) => ipcRenderer.invoke('createNote', ...args),
    deleteNote: (...args: Parameters<DeleteNote>) => ipcRenderer.invoke('deleteNote', ...args),
    saveImage: (...args: Parameters<SaveImage>) => ipcRenderer.invoke('saveImage', ...args)
  })
} catch (error) {
  console.error(error)
}

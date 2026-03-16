import { CreateNote, DeleteNote, GetNotes, ReadNote, SaveImage, WriteNote } from '@shared/types'

declare global {
  interface Window {
    context: {
      locale: string
      getNotes: GetNotes
      readNote: ReadNote
      writeNote: WriteNote
      createNote: CreateNote
      deleteNote: DeleteNote
      saveImage: SaveImage
    }
  }
}

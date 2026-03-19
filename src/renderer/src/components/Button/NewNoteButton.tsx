import { ActionButton, ActionButtonProps } from '@/components'
import { createEmptyNoteAtom } from '@/store'
import { useSetAtom } from 'jotai'
import { LuFilePen } from 'react-icons/lu'

export const NewNoteButton = ({ ...props }: ActionButtonProps) => {
  const createNewNote = useSetAtom(createEmptyNoteAtom)

  const handleCreateNote = async () => {
    await createNewNote()
  }

  return (
    <ActionButton onClick={handleCreateNote} {...props}>
      <LuFilePen className="w-4 h-4" />
    </ActionButton>
  )
}

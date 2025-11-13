import { ActionButton, ActionButtonProps } from '@/components'
import { LuFilePen } from 'react-icons/lu'

export const NewNoteButton = ({ ...props }: ActionButtonProps) => {
  return (
    <ActionButton {...props}>
      <LuFilePen className="w-4 h-4 text-zinc-300" />
    </ActionButton>
  )
}

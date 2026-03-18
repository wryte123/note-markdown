import { fileEncoding } from '@shared/constants'
import { appDirectoryName } from '@shared/constants'
import { NoteInfo } from '@shared/models'
import { CreateNote, DeleteNote, GetNotes, ReadNote, SaveImage, WriteNote } from '@shared/types'
import { dialog } from 'electron'
import { ensureDir, readdir, readFile, remove, stat, writeFile } from 'fs-extra'
import path from 'path'

export const getRootDir = () => {
  return `${process.cwd()}/${appDirectoryName}`
}

export const getNotes: GetNotes = async () => {
  const rootDir = getRootDir()

  await ensureDir(rootDir)

  const notesFileNames = await readdir(rootDir, {
    encoding: fileEncoding,
    withFileTypes: false
  })

  const notes = notesFileNames.filter((fileName) => fileName.endsWith('.md'))

  return Promise.all(notes.map(getNoteInfoFromFileName))
}

export const getNoteInfoFromFileName = async (fileName: string): Promise<NoteInfo> => {
  const fileStats = await stat(`${getRootDir()}/${fileName}`)

  return {
    title: fileName.replace(/\.md$/, ''),
    lastEditTime: fileStats.mtimeMs
  }
}

export const readNote: ReadNote = async (filename) => {
  const rootDir = getRootDir()

  const filePath = path.join(rootDir, `${filename}.md`)
  return readFile(filePath, {
    encoding: fileEncoding
  })
}

export const writeNote: WriteNote = async (filename, content) => {
  const rootDir = getRootDir()

  console.info(`Writing in ${filename}`)

  const filePath = path.join(rootDir, `${filename}.md`)
  await ensureDir(path.dirname(filePath))

  return writeFile(filePath, content, {
    encoding: fileEncoding
  })
}

export const createNote: CreateNote = async () => {
  const rootDir = getRootDir()

  await ensureDir(rootDir)

  const { filePath, canceled } = await dialog.showSaveDialog({
    title: '新建笔记',
    defaultPath: `${rootDir}/未命名.md`,
    buttonLabel: '创建',
    properties: ['showOverwriteConfirmation'],
    showsTagField: false,
    filters: [{ name: 'Markdown', extensions: ['md'] }]
  })

  if (canceled || !filePath) {
    console.info('Note creation canceled')
    return false
  }

  const { name: filename, dir: parentDir } = path.parse(filePath)

  // Normalize paths for comparison (handle Windows vs Unix separators)
  const normalizedParentDir = path.normalize(parentDir).toLowerCase().replace(/\\/g, '/')
  const normalizedRootDir = path.normalize(rootDir).toLowerCase().replace(/\\/g, '/')

  console.info('Parent dir:', normalizedParentDir)
  console.info('Root dir:', normalizedRootDir)
  console.info('Match:', normalizedParentDir === normalizedRootDir)

  if (normalizedParentDir !== normalizedRootDir) {
    await dialog.showMessageBox({
      type: 'error',
      title: '创建失败',
      message: `笔记必须创建在应用目录中\n当前: ${normalizedParentDir}\n期望: ${normalizedRootDir}`
    })

    return false
  }

  console.info(`Creating note ${filename}`)
  await writeFile(filePath, '')

  return filename
}

export const deleteNote: DeleteNote = async (filename) => {
  const rootDir = getRootDir()

  const { response } = await dialog.showMessageBox({
    type: 'warning',
    title: '删除笔记',
    message: `确定要删除「${filename}」吗？`,
    buttons: ['删除', '取消'],
    defaultId: 1,
    cancelId: 1
  })

  if (response === 1) {
    console.info('Delete note canceled')
    return false
  }

  console.info(`Deleting note ${filename}`)
  await remove(`${rootDir}/${filename}.md`)

  return true
}

export const saveImage: SaveImage = async (name, data) => {
  const imagesDir = `${getRootDir()}/images`

  await ensureDir(imagesDir)

  const sanitizedName = name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const uniqueFilename = `${Date.now()}-${sanitizedName}`
  const fullPath = path.join(imagesDir, uniqueFilename)

  await writeFile(fullPath, Buffer.from(data))

  return `notemark://images/${uniqueFilename}`
}

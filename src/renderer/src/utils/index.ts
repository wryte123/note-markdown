import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const dateFormatter = new Intl.DateTimeFormat(window.context.locale, {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'Asia/Shanghai'
})

export const FormatDateFromMs = (ms: number) => {
  return dateFormatter.format(ms)
}

export const cn = (...args: ClassValue[]) => {
  return twMerge(clsx(...args))
}

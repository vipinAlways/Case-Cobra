
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'


function MaxWidthWrapper({className,children}:{
  className?:string
  children:ReactNode
}) {
  return  <div className={cn("h-full mx-auto max-w-screen-xl w-full px-2.5 md:px-20",className)}>{children}</div>
}

export default MaxWidthWrapper
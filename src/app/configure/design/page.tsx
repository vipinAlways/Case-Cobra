import { db } from '@/db'
import { notFound } from 'next/navigation'
import React from 'react'
import DesignConfigurator from './DesignConfigurator'
interface PageProps{
  searchParams:{
    [key:string] :string |string [] |undefined
  }
}

async function page({searchParams}:PageProps) {
  const {id} =searchParams
  
  if (!id || typeof id !== "string")  {
    return notFound()
  }

  const configuration = await db.configuration.findUnique({
    where:{id}
  })

  if (!configuration) {
    return notFound()
  }

  const {imageUrl,width,height} =configuration
  return (
    <div>
       <DesignConfigurator configId={configuration.id} imageDimension={{width,height}} imageUrl = {imageUrl} />
    </div>
  )
}

export default page
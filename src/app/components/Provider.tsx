'use client'
import React, { ReactNode } from 'react'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"//prevent repetition of same request 

const client = new QueryClient()

function Provider({children}:{children:ReactNode}) {
  return (
  <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
}

export default Provider
import {Dialog,DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs"
import Image from "next/image"
import type { Dispatch, SetStateAction } from 'react'
import { buttonVariants } from "./ui/button"

function LoginModal({isOpen,setIsOpen}:{
  isOpen:boolean
 setIsOpen:Dispatch<SetStateAction<boolean>>}) {
  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen} >
      <DialogContent className=" absolute z-[999999999]">
        <DialogHeader>
          <div className="relative mx-auto w-24 h-24 mb-2 flex flex-col ">
            <Image src="/snake-1.png" alt="snake png"  className="object-contain " fill/>
            
          </div>
         <DialogTitle className="text-3xl text-center tracking-tight text-gray-900" >Please Login to Continue</DialogTitle>
         <DialogDescription className="text-base py-2">
          <span className="font-medium text-zinc-900">
            Your configuration was saved
          </span>{''}
          "Please login or Create an account to complete your purchase"
         </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 divide-gray-200 divide-x">
          <LoginLink className={buttonVariants({variant:"outline"})}>Lognin</LoginLink>
          <RegisterLink className={buttonVariants({variant:"default"})}>Sign UP</RegisterLink>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default LoginModal
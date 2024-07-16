'use server'

import { db } from "@/db"
import { CaseColors, CaseFinish, CaseMaterial, PhoneModel } from "@prisma/client"

export type SaveConfigArgs={
    colors:CaseColors,
    finish:CaseFinish,
    material:CaseMaterial,
    model:PhoneModel,
    configId:string
}

export async function saveConfig({colors,finish,material,model,configId}:SaveConfigArgs){
    await db.configuration.update({
       where:{id:configId},
       data:{finish,material,model,colors} 
    })
}
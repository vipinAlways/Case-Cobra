"use client";

import { cn } from "@/lib/utils";
import { CaseColors } from "@prisma/client";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import React, { useEffect, useRef, useState } from "react";

function PhonePreview({
  croppedImageUrl,
  colors,
}: {
  croppedImageUrl: string;
  colors: CaseColors;
}) {
    const ref =useRef<HTMLDivElement>(null)
    const [renderDimension,setrenderDimension]=useState({
        height:0,
        width:0,
    })
    let caseBackgroundColor ='bg-zinc-950'
    if (colors==='blue') {
        caseBackgroundColor='bg-blue-950'
    }
    if (colors==="rose") {
        caseBackgroundColor='bg-rose-950'
    }

    const handleResize=()=>{
        if (!ref.current) {
            return
        }
        const {width,height}=ref.current.getBoundingClientRect()

        setrenderDimension({width,height})
    }
    useEffect(()=>{
        handleResize()
        window.addEventListener("resize",handleResize)

        return ()=>window.removeEventListener("resize",handleResize)
    },[ref.current])


  return <AspectRatio ref={ref} ratio={3000/2001} className="relative">
        <div className="absolute z-20 scale-[1.0352] " style={{
            left:renderDimension.width/2 - renderDimension.width/(1216/121),
            top:renderDimension.height/6.22,
        }}>
            <img width={renderDimension.width/(3000/637)} className={cn("phone-skew relative z-20 rounded-t-[15px] rounded-b-[10px] md:rounded-t-[30px] md:rounded-b-[20px]",caseBackgroundColor)} src={croppedImageUrl} alt="your case" />
        </div>

        <div className="relative h-full w-full z-40 ">
            <img src="/clearPhone.png" className="pointer-events-none h-full w-full antialiased rounded-md" alt="" />
        </div>
  </AspectRatio>;
}

export default PhonePreview;

"use client";
import Phone from "@/app/components/Phone";
import { Button } from "@/app/components/ui/button";
import { BASE_PRICE, PRODUCT_PRICES } from "@/config/products";
import { db } from "@/db";
import { cn, formatePrice } from "@/lib/utils";
import { COLORS, MODELS } from "@/validators/options-validators";
import { Configuration } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Check } from "lucide-react";
import React, { useEffect, useState } from "react";
import Confetti from "react-dom-confetti";
import { createCheckoutSession } from "./action";
import { useRouter } from "next/navigation";

import {useKindeBrowserClient} from '@kinde-oss/kinde-auth-nextjs'
import { useToast } from "@/components/ui/use-toast";
import LoginModal from "@/app/components/LoginModal";

function DesignPreview({ configuration }: { configuration: Configuration }) {
  const [showConfetti, setShowConfetti] = useState(false);
  const router = useRouter()
  const {toast} =useToast()
  const {id} =configuration
  const {user} = useKindeBrowserClient()
  const [isLoginModalOpen, setisLoginModalOpen] = useState<boolean>(false)

  useEffect(() => setShowConfetti(true));

  const { colors, model,finish ,material} = configuration;
  const tw = COLORS.find(
    (supportedColor) => supportedColor.value === colors
  )?.tw;
  const { label: modelLabel } = MODELS.options.find(
    ({ value }) => value === model
  )!;

  let totalPrice = BASE_PRICE
  if (material ==='polycarbonate') totalPrice+=PRODUCT_PRICES.material.polycarbonate

  if(finish ==="textured") totalPrice+= PRODUCT_PRICES.finish.textured

  const {mutate :  createPaymentSession} = useMutation({
    mutationKey:['get-checkout-session'],
    mutationFn:createCheckoutSession,
    onSuccess:({url}:any)=>{
      if (url) router.push(url)
        else throw new Error("unable to retrieve payment URL. ")
    },
    onError:()=>{
      toast({
        title:'something went wrong',
        description:'There was an error in our end.Please try again',
        variant:'destructive'
      })
    }
  })

  const handleCheckout=()=>{
    if (user) {
      //create paymentSession
      createPaymentSession({configId:id})
    }else{
      //need to login
      localStorage.setItem('configurationID',id)
      setisLoginModalOpen(true)
    }
  }
  return (
    <>
      <div className="pointer-events-none select-none absolute inset-0 overflow-hidden flex justify-center">
        <Confetti
          active={showConfetti}
          config={{
            elementCount: 200,
            spread: 200,
            duration: 2000,
            height: "10px",
          }}
        />
      </div>
          <LoginModal isOpen={isLoginModalOpen} setIsOpen={setisLoginModalOpen} />
      <div className="mt-20 flex flex-col items-center md:grid  text-sm sm:grid-cols-12 sm:grid-rows-1 sm:gap-x-6 md:gap-x-8 lg:gap-x-12">
        <div className="sm:col-span-4 md:col-span-3 md:row-span-2 md:row-end-2">
          <Phone
            imgSrc={configuration.croppedImageUrl!}
            className={cn(`bg-${tw}`,'max-w-[150px] md:max-w-full')}
          />
        </div>
        <div className="mt-6 sm:col-span-9 sm:mt-0 md:row-end-1">
          <h3 className="text-3xl font-bold tracking-tight text-gray-900">
            YOUR device is {modelLabel}
          </h3>
          <div className="mt-3 flex items-center gap-1.5 text-base">
            <Check className="h-4 w-4 text-gray-500" /> In stock and ready to
            ship
          </div>
        </div>
        <div className="sm:col-span-12 md:col-span-9 text-balance">
          <div className="grid grid-cols-1 gap-y-8 border-b border-gray-200 py-8 sm:grid-cols-2 sm:gap-x-6 sm:py-6 md:py-10">
            <div>
              <p className="font-medium text-zinc-950">Highlights</p>
              <ol className="mt-3 text-zinc-900 list-disc list-inside">
                <li>Wireless charging compatible</li>
                <li>TPU shock adborption</li>
                <li>Packaging made from recycled materials</li>
                <li>5 year print warranty</li>
              </ol>
            </div>
            <div>
                <p className="font-medium text-zinc-950">Material</p>
                <ol className="mt-3 text-zinc-900 list-disc list-inside">
                    <li>Hiquality durable material</li>
                    <li>Scratch and fingerPrint resistant coating</li>
                </ol>
            </div>
          </div>

          <div className="mt-8">
            <div className=" bg-gray-50 p-6 sm:rounded-lg sm:p-8">
                <div className="flow-root text-sm">
                    <div className="flex items-center justify-between py-1 mt-2">
                      <p className="text-gray-600">Basic price</p>
                      <p className="font-medium text-gray-600">
                        {formatePrice(BASE_PRICE/100)}
                      </p>
                    </div>
                    {finish === 'textured' ?(
                        <div className="flex items-center justify-between py-1 mt-2">
                        <p className="text-gray-600">Textured finish</p>
                        <p className="font-medium text-gray-600">
                          {formatePrice(PRODUCT_PRICES.finish.textured/100)}
                        </p>
                      </div>
                    ):null}
                    {material === 'polycarbonate' ?(
                        <div className="flex items-center justify-between py-1 mt-2">
                        <p className="text-gray-600">Soft polycarbonate material</p>
                        <p className="font-medium text-gray-600">
                          {formatePrice(PRODUCT_PRICES.material.polycarbonate/100)}
                        </p>
                      </div>
                    ):null}

                    <div className="my-2 h-px bg-gray-200"/>

                    <div className="flex items-center justify-between py-2">
                      <p className="font-semibold text-gray-900">
                        total
                      </p>
                        
                      <p className="font-semibold text-gray-900">
                        {formatePrice(totalPrice/100)}
                      </p>
                    </div> 
                </div>
            </div>

            <div className="mt-8 flex justify-end pb-12">
              <Button
              // onClick={()=> createPaymentSession({configId:configuration.id})}
              onClick={()=>handleCheckout()}
              className="px-4 sm:px-6 lg:px-8 bg-green-500"> Check out <ArrowRight className="h-4 w-4 ml-1.5 inline"/></Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DesignPreview;

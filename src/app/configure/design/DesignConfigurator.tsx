import { AspectRatio } from "@/components/ui/aspect-ratio";
import React from "react";
import NextImage from "next/image"
interface DesignConfigurator {
  configId: string;
  imageUrl: string;
  imageDimension: { width: number; height: number };
}

function DesignConfigurator({
  configId,
  imageUrl,
  imageDimension,
}: DesignConfigurator) {
  return (
    <div className="relative mt-20 mb-20 grid grid-cols-3 pb-20">
      <div className=" relative h-[37.5rem] overflow-hidden col-span-2 w-full mac-w-full items-center flex justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
        <div className="relative w-60 bg-opacity-50 pointer-events-none aspect-[896/1831]  ">
          <AspectRatio
            ratio={896 / 1831}
            className="pointer-events-none relative z-50  aspect-[896/1831]"
          >
            <NextImage width={imageDimension.width} height={imageDimension.height} alt="phone image" src='/phone-template.png' className="pointer-events-none z-50 select-none" />
          </AspectRatio>
        </div>
      </div>
    </div>
  );
}

export default DesignConfigurator;

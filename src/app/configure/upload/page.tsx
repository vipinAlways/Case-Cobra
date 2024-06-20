"use client";

import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

import { useUploadThing } from "@/lib/uploading";
import { cn } from "@/lib/utils";
import { Image, Loader2, MousePointerSquareDashed } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Dropzone, { FileRejection } from "react-dropzone";

function page() {
  const [isDrageOver, setisDrageOver] = useState<boolean>(false);
  const [UploadProgress, setUploadProgress] = useState<number>(0);
  
  const router = useRouter();
  const {toast} = useToast();

  const { startUpload ,isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: ([data]) => {
      const configId = data.serverData.configId;
      startTransition(() => {
        router.push(`/configure/design?id=${configId}`);
      });
    },
    onUploadProgress(p) {
      setUploadProgress(p);
    },
  });

  const onDropRejected = (rejectedFile: FileRejection[]) => {
    const [file] = rejectedFile;
    setisDrageOver(false);
    toast({
      title: `${file.file.type} type is not supported`,
      description: "Please choose a PNG , JPEG and JPG",
      variant: "destructive",
    });
  };
  const onDropAccepted = (acceptedFiles: File[]) => {
    startUpload(acceptedFiles, { configId: undefined });
    setisDrageOver(false);
  };
  
  const [isPending, startTransition] = useTransition();
  return (
    <div
      className={cn(
        "relative h-full flex-1 w-full bg-gray-900/5 p-2 ring-1 rounded-xl ring-inset ringfray-900/10 lg:rounded-2xl flex justify-center items-center flex-col",
        { "ring-blue-900/25 bg-blue-900/10": isDrageOver }
      )}
    >
      <div className="relative flex flex-1 flex-col items-center justify-center w-full">
        <Dropzone
          onDropRejected={onDropRejected}
          onDropAccepted={onDropAccepted}
          accept={{
            "image/png": [".png"],
            "image/jpeg": [".jpeg"],
            "image/jpg": [".jpg"],
          }}
          onDragEnter={() => setisDrageOver(true)}
          onDragLeave={() => setisDrageOver(false)}
        >
          {({ getRootProps, getInputProps }) => (
            <div
              className="h-full w-full flex-1 flex flex-col items-center justify-center"
              {...getRootProps()}
            >
              <input type="text" {...getInputProps()} />
              {isDrageOver ? (
                <MousePointerSquareDashed className="h-6 w-6 text-zinc-500 mb-2" />
              ) : isUploading || isPending ? (
                <Loader2 className="animate-spin h-6 w-6 text-zinc-500 mb-2" />
              ) : (
                <Image className="h-6 w-6 text-zinc-500 mb-2 " />
              )}
              <div className="flex flex-col justify-center text-sm mb-2 text-zinc-700 ">
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <p>Uploading...</p>
                    <Progress
                      className="mt-2 w-40 h-2 bg-gray-300"
                      value={UploadProgress}
                    />
                  </div>
                ) : isPending ? (
                  <div className="felx flex-col items-center">
                    <p>Redirecting please wait...</p>
                  </div>
                ) : isDrageOver ? (
                  <p>
                    <span className="font-semibold">Drop file</span>to upload
                  </p>
                ) : (
                  <p>
                    <span className="font-semibold">Click to upload</span> or
                    drag & drop
                  </p>
                )}
              </div>
              {isPending ? null : (
                <p className="text-xs text-zinc-500"> PNG,JPEGAND JPG</p>
              )}
            </div>
          )}
        </Dropzone>
      </div>
    </div>
  );
}

export default page;

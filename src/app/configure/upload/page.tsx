"use client";

import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { useUploadThing } from "@/lib/uploading";
import { cn } from "@/lib/utils";
import { ImageDown, Loader2, MousePointerSquareDashed } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Dropzone, { FileRejection } from "react-dropzone";

function Page() {
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      if (!res || res.length === 0) {
        console.error("❌ No response from server");
        toast({
          title: "Upload failed",
          description: "No response from server",
          variant: "destructive",
        });
        return;
      }

      const serverData = res[0].serverData;

      if (!serverData || !serverData.configId) {
        toast({
          title: "Upload failed",
          description: "No configuration ID received from server",
          variant: "destructive",
        });
        return;
      }

      const configId = serverData.configId;

      startTransition(() => {
        router.push(`/configure/design?id=${configId}`);
      });
    },

    onUploadError: (err) => {
      toast({
        title: "Upload failed",
        description: err.message || "Something went wrong during upload",
        variant: "destructive",
      });
      setUploadProgress(0);
    },

    onUploadProgress: (p) => {
      setUploadProgress(p);
    },
  });

  const onDropRejected = (rejectedFiles: FileRejection[]) => {
    const [file] = rejectedFiles;
    setIsDragOver(false);

    toast({
      title: `${file.file.type} type is not supported`,
      description: "Please choose a PNG, JPEG or JPG file",
      variant: "destructive",
    });
  };

  const onDropAccepted = async (acceptedFiles: File[]) => {
    console.log("📁 Files accepted:", acceptedFiles);
    setIsDragOver(false);

    if (acceptedFiles.length === 0) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("🚀 Starting upload with input object");

      // Try both syntaxes - one should work
      const result = await startUpload(acceptedFiles, { configId: null });
    } catch (error) {
      console.error("❌ Upload start error:", error);

      // Also log the full error object
      console.error("Full error:", JSON.stringify(error, null, 2));

      toast({
        title: "Upload failed to start",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className={cn(
        "relative h-full flex-1 w-full bg-gray-900/5 p-2 ring-1 rounded-xl ring-inset ring-gray-900/10 lg:rounded-2xl flex justify-center items-center flex-col",
        { "ring-blue-900/25 bg-blue-900/10": isDragOver }
      )}
    >
      <div className="relative flex flex-1 flex-col items-center justify-center w-full">
        <Dropzone
          onDropRejected={onDropRejected}
          onDropAccepted={onDropAccepted}
          accept={{
            "image/png": [".png"],
            "image/jpeg": [".jpeg", ".jpg"],
          }}
          onDragEnter={() => setIsDragOver(true)}
          onDragLeave={() => setIsDragOver(false)}
          maxSize={4 * 1024 * 1024} // 4MB max
          multiple={false}
        >
          {({ getRootProps, getInputProps }) => (
            <div
              className="h-full w-full flex-1 flex flex-col items-center justify-center"
              {...getRootProps()}
            >
              <input {...getInputProps()} />

              {isDragOver ? (
                <MousePointerSquareDashed className="h-6 w-6 text-zinc-500 mb-2" />
              ) : isUploading || isPending ? (
                <Loader2 className="animate-spin h-6 w-6 text-zinc-500 mb-2" />
              ) : (
                <ImageDown className="h-6 w-6 text-zinc-500 mb-2" />
              )}

              <div className="flex flex-col justify-center text-sm mb-2 text-zinc-700">
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <p>Uploading...</p>
                    <Progress
                      className="mt-2 w-40 h-2 bg-gray-300"
                      value={uploadProgress}
                    />
                  </div>
                ) : isPending ? (
                  <div className="flex flex-col items-center">
                    <p>Redirecting, please wait...</p>
                  </div>
                ) : isDragOver ? (
                  <p>
                    <span className="font-semibold">Drop file</span> to upload
                  </p>
                ) : (
                  <p>
                    <span className="font-semibold">Click to upload</span> or
                    drag & drop
                  </p>
                )}
              </div>

              {!isPending && (
                <p className="text-xs text-zinc-500">
                  PNG, JPEG or JPG (max 4MB)
                </p>
              )}
            </div>
          )}
        </Dropzone>
      </div>
    </div>
  );
}

export default Page;

// app/api/uploadthing/core.ts
import { db } from "@/db";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import sharp from "sharp";
import { z } from "zod";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ 
    image: { 
      maxFileSize: "4MB",
      maxFileCount: 1,
    } 
  })
    .input(
      z.object({
        configId: z.string().optional(),
      })
    )
    .middleware(async ({ input }) => {
      console.log("Middleware called with input:", input);
      return { input };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for file:", file.url);
      
      try {
        const { configId } = metadata.input;

        // Add timeout to fetch
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

        const res = await fetch(file.url, {
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);

        if (!res.ok) {
          throw new UploadThingError(`Failed to fetch image: ${res.status} ${res.statusText}`);
        }

        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        console.log("Processing image with sharp, buffer size:", buffer.length);

        const imageData = await sharp(buffer).metadata();
        const { width, height } = imageData;

        if (!width || !height) {
          throw new UploadThingError("Invalid image dimensions");
        }

        console.log("Image dimensions:", { width, height });

        if (!configId) {
          console.log("Creating new configuration");
          const configuration = await db.configuration.create({
            data: {
              imageUrl: file.url,
              height,
              width,
            },
          });

          console.log("Configuration created:", configuration.id);
          return { configId: configuration.id };
        }

        console.log("Updating configuration:", configId);
        const updatedConfiguration = await db.configuration.update({
          where: { id: configId },
          data: {
            croppedImageUrl: file.url,
          },
        });

        console.log("Configuration updated:", updatedConfiguration.id);
        return { configId: updatedConfiguration.id };
      } catch (error) {
        console.error("Upload processing error:", error);
        
        if (error instanceof UploadThingError) {
          throw error;
        }
        
        throw new UploadThingError(
          `Failed to process image: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
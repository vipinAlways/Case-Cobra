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
    },
  })
    .input(
      z
        .object({
          configId: z.string().optional().nullable(),
        })
        .default({ configId: null })
    )
    .middleware(async ({ input }) => {
      const configId = input?.configId || null;

      return { configId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        const configId = metadata.configId;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        const res = await fetch(file.url, {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          throw new UploadThingError(
            `Failed to fetch image: ${res.status} ${res.statusText}`
          );
        }

        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const imageData = await sharp(buffer).metadata();
        const { width, height } = imageData;

        if (!width || !height) {
          throw new UploadThingError("Invalid image dimensions");
        }

        if (!configId) {
          const configuration = await db.configuration.create({
            data: {
              imageUrl: file.url,
              height,
              width,
            },
          });

          return { configId: configuration.id };
        }

        const updatedConfiguration = await db.configuration.update({
          where: { id: configId },
          data: {
            croppedImageUrl: file.url,
          },
        });

        return { configId: updatedConfiguration.id };
      } catch (error) {
        if (error instanceof UploadThingError) {
          throw error;
        }

        throw new UploadThingError(
          `Failed to process image: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

import { db } from "@/db";
import sharp from "sharp";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from "zod";
// Use the global fetch available in newer Node versions instead of node-fetch

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .input(
      z.object({
        configId: z.string().optional(),
      })
    )
    .middleware(async ({ input }) => {
      return { input };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        const { configId } = metadata.input;

        const res = await (globalThis as any).fetch(file.url);
        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const imageData = await sharp(buffer).metadata();
        const { width, height } = imageData;

        if (!configId) {
          const configuration = await db.configuration.create({
            data: {
              imageUrl: file.url,
              height: height ?? 500,
              width: width ?? 500,
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
      } catch (e) {
        console.error("uploadthing onUploadComplete error:", e);
        // Return a simple JSON response so the client doesn't receive an HTML error page
        // which UploadThing's client fails to parse.
        return { configId: null };
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

import fs from "fs/promises";
import path from "path";

export const deleteFiles = async (files: string[]) => {
  const uploadDir = path.join(process.cwd(), "uploads");

  await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(uploadDir, file);

      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.warn("File not found or already deleted:", filePath);
      }
    })
  );
};
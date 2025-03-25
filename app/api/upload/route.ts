import { getFileNameAndExtension } from "@/utils";
import { writeFile, mkdir } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

// Importation de la bibliothèque pour générer un UUID (si tu choisis cette option)
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const files: File[] = data.getAll("files") as unknown as File[];

  if (!files || files.length === 0) {
    return NextResponse.json(
      { success: false, message: "No files provided" },
      { status: 400 }
    );
  }

  // Modifier le chemin pour que les fichiers soient stockés dans local D:\tmp\uploads
  // const uploadDir = "/tmp/uploads";

  // Modifier le chemin pour que les fichiers soient stockés dans /public/tmp/
  const uploadDir = path.join(process.cwd(), "public", "tmp");
  await mkdir(uploadDir, { recursive: true }); // Créer le dossier si nécessaire

  const savedFiles: string[] = [];

  try {
    files.forEach(async (file) => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = getFileNameAndExtension(file.name);

      // Générer un nom unique pour chaque fichier en utilisant un timestamp ou un UUID
      const uniqueFileName = `${fileName.name}__${Date.now()}__${uuidv4()}.${
        fileName.extension
      }`;

      const filePath = path.join(uploadDir, uniqueFileName);

      try {
        await writeFile(filePath, buffer);
        console.log(`File saved at: ${filePath}`);

        savedFiles.push(filePath);
      } catch (error) {
        console.log(`Saved error at: ${filePath}`);
      }
    });

    console.log("Error saving files:", savedFiles);
    return NextResponse.json(
      {
        success: true,
        message: "Error saving files",
        files: savedFiles,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving files:", error);
    return NextResponse.json(
      { success: false, message: "Error saving files" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  const tmpDir = path.join(process.cwd(), "public", "tmp");

  try {
    // Lire tous les fichiers dans le répertoire /public/tmp
    const files = await fs.readdir(tmpDir);

    if (files.length === 0) {
      return NextResponse.json(
        { success: false, message: "No files found" },
        { status: 404 }
      );
    }

    // Retourner la liste des fichiers
    return NextResponse.json({
      success: true,
      files: files.map((file) => ({
        name: file,
        path: path.join("/tmp", file), // Créer le chemin relatif vers chaque fichier
      })),
    });
  } catch (error) {
    console.error("Error reading files:", error);
    return NextResponse.json(
      { success: false, message: "Error reading files" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const tmpDir = path.join(process.cwd(), "public", "tmp");

  try {
    // Lire tous les fichiers dans le répertoire /public/tmp
    const files = await fs.readdir(tmpDir);

    if (files.length === 0) {
      return NextResponse.json(
        { success: false, message: "No files to delete" },
        { status: 404 }
      );
    }

    // Supprimer tous les fichiers
    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(tmpDir, file);
        await fs.unlink(filePath); // Supprimer le fichier
        console.log(`Deleted file: ${filePath}`);
      })
    );

    return NextResponse.json({
      success: true,
      message: "All files deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting files:", error);
    return NextResponse.json(
      { success: false, message: "Error deleting files" },
      { status: 500 }
    );
  }
}

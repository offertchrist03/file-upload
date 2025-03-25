import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const tmpDir = path.join(process.cwd(), "public", "tmp");

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ file: string }> }
) {
  const { file } = await params;
  const filePath = path.join(tmpDir, file);

  try {
    // Vérifier si le fichier existe
    await fs.access(filePath);

    // Lire le contenu du fichier (peut être adapté selon le type de fichier)
    const data = await fs.readFile(filePath, "utf-8");

    return NextResponse.json({ success: true, file, content: data });
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return NextResponse.json(
        { success: false, message: `File "${file}" not found` },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Error reading file" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ file: string }> }
) {
  const { file } = await params;
  const filePath = path.join(tmpDir, file);

  try {
    // Vérifier si le fichier existe avant de supprimer
    await fs.access(filePath);
    await fs.unlink(filePath);

    return NextResponse.json({
      success: true,
      message: `File "${file}" deleted successfully`,
    });
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return NextResponse.json(
        { success: false, message: `File "${file}" not found` },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Error deleting file" },
      { status: 500 }
    );
  }
}

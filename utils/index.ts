export function getFileNameAndExtension(fileName: string): {
  name: string;
  extension: string;
} {
  const dotIndex = fileName.lastIndexOf("."); // Trouve le dernier point dans le nom du fichier

  if (dotIndex === -1) {
    // Si il n'y a pas de point dans le nom de fichier, retourner un nom vide et une extension vide
    return { name: fileName, extension: "" };
  }

  const name = fileName.slice(0, dotIndex); // Le nom du fichier sans l'extension
  const extension = fileName.slice(dotIndex + 1); // L'extension sans le point

  return { name, extension };
}

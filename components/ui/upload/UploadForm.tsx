"use client";

import { useState } from "react";

export function UploadForm() {
  const [pending, setPending] = useState(false);
  const [previewFiles, setPreviewFiles] = useState<File[] | null | undefined>(
    null
  );

  // Fonction pour gérer la sélection des fichiers
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (files) {
      setPreviewFiles(Array.from(files)); // Mettre à jour l'état avec les fichiers sélectionnés
    }
  }

  // Fonction d'upload des fichiers
  async function handleUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);

    const formData = new FormData();

    // Récupère les fichiers depuis l'élément de formulaire
    const files = (event.target as HTMLFormElement).elements.namedItem(
      "files"
    ) as HTMLInputElement;

    if (files?.files) {
      for (const file of files.files) {
        formData.append("files", file);
      }
    }

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    console.log(result);

    // Réinitialiser l'état après l'upload
    setPending(false);
    setPreviewFiles(null);
  }

  return (
    <>
      {pending ? (
        <>pending...</>
      ) : (
        <>
          <form onSubmit={handleUpload}>
            <input
              type="file"
              name="files"
              multiple
              onChange={handleFileChange} // On écoute le changement des fichiers
            />
            <button type="submit">Upload</button>
          </form>

          {/* Aperçu des fichiers sélectionnés */}
          {previewFiles && previewFiles.length > 0 && (
            <div>
              <h3>Fichiers sélectionnés :</h3>
              <ul>
                {previewFiles.map((file, index) => (
                  <li key={index}>
                    {file.name} - {file.size} bytes
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </>
  );
}

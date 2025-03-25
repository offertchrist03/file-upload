// File: app/page.tsx

"use client";

import { useState, useEffect } from "react";

// Définir l'interface pour les informations sur le fichier
interface FileInfo {
  name: string;
  path: string;
}

const FileManager = () => {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const incrementCount = () => {
    const newCount = count + 1;
    setCount(newCount);
  };

  // Fonction pour charger la liste des fichiers
  const fetchFiles = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/tmp");

      if (!response.ok) {
        throw new Error("Failed to fetch files");
      }

      const data = await response.json();
      setFiles(data.files); // Mettre à jour l'état avec la liste des fichiers
    } catch (err) {
      setError("Error loading files");
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour supprimer un fichier
  const deleteFile = async (file: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/tmp/${file}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete files");
      }

      // Après avoir supprimé les fichiers, rechargez la liste
      incrementCount();
    } catch (err) {
      setError("Error deleting files");
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour supprimer tous les fichiers
  const deleteFiles = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/tmp", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete files");
      }

      // Après avoir supprimé les fichiers, rechargez la liste
      setFiles([]);
    } catch (err) {
      setError("Error deleting files");
    } finally {
      setLoading(false);
    }
  };

  // Charger les fichiers au chargement du composant
  useEffect(() => {
    fetchFiles();
  }, [count]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold">File Manager</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="mt-4">
        {files.length === 0 ? (
          <p>No files available in the /tmp/ directory.</p>
        ) : (
          <ul>
            {files.map((file) => (
              <li key={file.path} className="py-1">
                <span>{file.name}</span>{" "}
                <span className="text-gray-500">({file.path})</span>
                <button
                  className="bg-red-500"
                  type="button"
                  onClick={() => {
                    deleteFile(file.name);
                  }}
                >
                  delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4">
        <button
          onClick={deleteFiles}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete All Files
        </button>
      </div>
    </div>
  );
};

export default FileManager;

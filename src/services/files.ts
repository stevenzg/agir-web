import { fetchWithAuth } from '@/lib/fetch';
import { API_BASE_URL } from '@/config';

export type FileUploadResponse = {
  filename: string;
  content_type: string;
  url: string;
  size: number;
}

/**
 * Upload a file to Azure Storage
 * @param file File to upload
 * @param directory Optional subdirectory path
 * @returns Information about the uploaded file
 */
export const uploadFile = async (file: File, directory?: string): Promise<FileUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  
  if (directory) {
    formData.append('directory', directory);
  }
  
  const response = await fetchWithAuth(`${API_BASE_URL}/files/upload`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to upload file');
  }
  
  return await response.json();
}

/**
 * Delete a file from Azure Storage
 * @param url URL of the file to delete
 * @returns Whether deletion was successful
 */
export const deleteFile = async (url: string): Promise<boolean> => {
  const response = await fetchWithAuth(`${API_BASE_URL}/files/delete`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });
  
  return response.ok;
} 
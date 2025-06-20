
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export const uploadImageToStorage = async (imageUrl: string, userId: string): Promise<string> => {
  try {
    // Fetch the image from the URL
    const response = await fetch(imageUrl, {
      mode: 'cors'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }
    
    const blob = await response.blob();
    
    // Create a reference to the storage location
    const fileName = `dreams/${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
    const storageRef = ref(storage, fileName);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, blob);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image to storage:', error);
    throw new Error('Failed to upload image to storage');
  }
};

export const deleteImageFromStorage = async (imageUrl: string): Promise<void> => {
  try {
    const storageRef = ref(storage, imageUrl);
    // Note: deleteObject is not available in the current setup
    // This would require additional Firebase Storage permissions
    console.log('Delete operation would be implemented here:', storageRef);
  } catch (error) {
    console.error('Error deleting image from storage:', error);
    throw new Error('Failed to delete image from storage');
  }
};

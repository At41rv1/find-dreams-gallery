
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
  where
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface CommunityImage {
  id: string;
  prompt: string;
  imageUrl: string;
  createdAt: Date;
  userId: string;
  userEmail?: string;
  likes: number;
  likedBy: string[];
}

export const saveGeneratedImage = async (
  imageUrl: string, 
  prompt: string, 
  userId: string, 
  userEmail?: string
) => {
  try {
    const docRef = await addDoc(collection(db, 'generated_images'), {
      imageUrl,
      prompt,
      userId,
      userEmail,
      createdAt: new Date(),
      likes: 0,
      likedBy: []
    });
    console.log('Image saved with ID: ', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving image: ', error);
    throw error;
  }
};

export const getCommunityImages = async (): Promise<CommunityImage[]> => {
  try {
    const q = query(
      collection(db, 'generated_images'), 
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    })) as CommunityImage[];
  } catch (error) {
    console.error('Error getting community images: ', error);
    throw error;
  }
};

export const getUserImages = async (userId: string): Promise<CommunityImage[]> => {
  try {
    const q = query(
      collection(db, 'generated_images'), 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    })) as CommunityImage[];
  } catch (error) {
    console.error('Error getting user images: ', error);
    throw error;
  }
};

export const likeImage = async (imageId: string, userId: string) => {
  try {
    const imageRef = doc(db, 'generated_images', imageId);
    
    // Get current image data to check if already liked
    const imageDoc = await getDocs(query(collection(db, 'generated_images'), where('__name__', '==', imageId)));
    const imageData = imageDoc.docs[0]?.data();
    
    if (imageData?.likedBy?.includes(userId)) {
      // Unlike
      await updateDoc(imageRef, {
        likes: increment(-1),
        likedBy: arrayRemove(userId)
      });
    } else {
      // Like
      await updateDoc(imageRef, {
        likes: increment(1),
        likedBy: arrayUnion(userId)
      });
    }
  } catch (error) {
    console.error('Error liking image: ', error);
    throw error;
  }
};

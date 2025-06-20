
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Heart, Search, Filter, Grid, List, LogIn, User, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getCommunityImages, likeImage } from '@/services/firestoreService';
import { useToast } from "@/hooks/use-toast";
import Auth from './Auth';

interface CommunityImage {
  id: string;
  prompt: string;
  imageUrl: string;
  createdAt: Date;
  userId: string;
  userEmail?: string;
  likes: number;
  likedBy: string[];
}

const Community = () => {
  const [images, setImages] = useState<CommunityImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<CommunityImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAuth, setShowAuth] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadCommunityImages();
  }, []);

  useEffect(() => {
    const filtered = images.filter(image =>
      image.prompt.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredImages(filtered);
  }, [images, searchTerm]);

  const loadCommunityImages = async () => {
    try {
      setLoading(true);
      const communityImages = await getCommunityImages();
      setImages(communityImages);
    } catch (error) {
      console.error('Error loading community images:', error);
      toast({
        title: "Error",
        description: "Failed to load community images",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (imageId: string) => {
    if (!user) {
      setShowAuth(true);
      return;
    }

    try {
      await likeImage(imageId, user.uid);
      setImages(prev => prev.map(img => {
        if (img.id === imageId) {
          const isLiked = img.likedBy.includes(user.uid);
          return {
            ...img,
            likes: isLiked ? img.likes - 1 : img.likes + 1,
            likedBy: isLiked 
              ? img.likedBy.filter(id => id !== user.uid)
              : [...img.likedBy, user.uid]
          };
        }
        return img;
      }));
    } catch (error) {
      console.error('Error liking image:', error);
      toast({
        title: "Error",
        description: "Failed to like image",
        variant: "destructive"
      });
    }
  };

  const handleAuthComplete = () => {
    setShowAuth(false);
  };

  if (showAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 relative overflow-hidden">
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
          <Auth onAuthComplete={handleAuthComplete} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-pink-200/20 to-purple-200/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-float animation-delay-2000"></div>
      </div>

      <div className="relative z-10 px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Dream Community
                </h1>
                <p className="text-gray-600 text-sm sm:text-lg">
                  Discover amazing dreams created by our community
                </p>
              </div>
              
              {/* User/Login Section */}
              <div className="flex justify-center sm:justify-end">
                {user ? (
                  <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                    <User className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700 hidden sm:block">
                      {user.displayName || user.email || 'User'}
                    </span>
                  </div>
                ) : (
                  <Button
                    onClick={() => setShowAuth(true)}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-2 rounded-full shadow-lg transition-all duration-300 flex items-center space-x-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In to Like</span>
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Search and Controls */}
          <Card className="p-4 sm:p-6 mb-6 sm:mb-8 bg-white/90 backdrop-blur-xl border-0 shadow-xl rounded-2xl">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search dreams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/80 border-2 border-pink-100 focus:border-pink-300 rounded-xl h-12"
                />
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  onClick={() => setViewMode('grid')}
                  className="flex-1 sm:flex-none rounded-xl"
                >
                  <Grid className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Grid</span>
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  onClick={() => setViewMode('list')}
                  className="flex-1 sm:flex-none rounded-xl"
                >
                  <List className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">List</span>
                </Button>
              </div>
            </div>
          </Card>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-pink-500 mx-auto mb-4" />
              <p className="text-gray-600">Loading community dreams...</p>
            </div>
          )}

          {/* Images Grid/List */}
          {!loading && (
            <>
              {filteredImages.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg mb-4">No dreams found</p>
                  <p className="text-gray-400">Try a different search term</p>
                </div>
              ) : (
                <div className={
                  viewMode === 'grid' 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6" 
                    : "space-y-4 sm:space-y-6"
                }>
                  {filteredImages.map((image) => (
                    <Card 
                      key={image.id} 
                      className={`group overflow-hidden bg-white/90 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl ${
                        viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''
                      }`}
                    >
                      <div className={`relative overflow-hidden ${
                        viewMode === 'list' ? 'sm:w-1/3 h-48 sm:h-auto' : 'aspect-square'
                      }`}>
                        <img
                          src={image.imageUrl}
                          alt={image.prompt}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      
                      <div className={`p-4 sm:p-6 ${viewMode === 'list' ? 'sm:w-2/3 flex flex-col justify-between' : ''}`}>
                        <div className="mb-4">
                          <p className={`text-gray-700 font-medium leading-relaxed ${
                            viewMode === 'list' ? 'text-base sm:text-lg' : 'text-sm line-clamp-3'
                          }`}>
                            {image.prompt}
                          </p>
                          {image.userEmail && (
                            <p className="text-xs text-gray-500 mt-2">
                              by {image.userEmail}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            {image.createdAt.toLocaleDateString()}
                          </span>
                          <Button
                            onClick={() => handleLike(image.id)}
                            variant="ghost"
                            size="sm"
                            className={`flex items-center space-x-2 rounded-full transition-all duration-300 ${
                              user && image.likedBy.includes(user.uid)
                                ? 'text-pink-500 bg-pink-50 hover:bg-pink-100'
                                : 'text-gray-500 hover:text-pink-500 hover:bg-pink-50'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${
                              user && image.likedBy.includes(user.uid) ? 'fill-current' : ''
                            }`} />
                            <span className="text-sm font-medium">{image.likes}</span>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Community;


import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Heart, Image, Settings as SettingsIcon, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserImages } from '@/services/firestoreService';
import { useToast } from "@/hooks/use-toast";
import Header from './Header';
import type { CommunityImage } from '@/services/firestoreService';

const Settings = () => {
  const [userImages, setUserImages] = useState<CommunityImage[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadUserImages();
    }
  }, [user]);

  const loadUserImages = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const images = await getUserImages(user.uid);
      setUserImages(images);
    } catch (error) {
      console.error('Error loading user images:', error);
      toast({
        title: "Error",
        description: "Failed to load your images",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <Header />
        <div className="pt-20 px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Please Sign In</h1>
            <p className="text-gray-600">You need to be logged in to access settings.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 relative overflow-hidden">
      <Header />
      
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-pink-200/20 to-purple-200/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-float animation-delay-2000"></div>
      </div>

      <div className="relative z-10 pt-20 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Settings
            </h1>
            <p className="text-gray-600 text-sm sm:text-lg">
              Manage your profile and view your dream gallery
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Section */}
            <div className="lg:col-span-1">
              <Card className="p-6 bg-white/90 backdrop-blur-xl border-0 shadow-xl rounded-2xl">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    {user.displayName || 'Dream Creator'}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">
                    {user.email || 'Anonymous User'}
                  </p>
                  
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Image className="w-5 h-5 text-purple-600" />
                          <span className="text-sm font-medium">Images Created</span>
                        </div>
                        <span className="text-lg font-bold text-purple-600">
                          {userImages.length}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Heart className="w-5 h-5 text-pink-600" />
                          <span className="text-sm font-medium">Total Likes</span>
                        </div>
                        <span className="text-lg font-bold text-pink-600">
                          {userImages.reduce((sum, img) => sum + img.likes, 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Gallery Section */}
            <div className="lg:col-span-2">
              <Card className="p-6 bg-white/90 backdrop-blur-xl border-0 shadow-xl rounded-2xl">
                <div className="flex items-center space-x-2 mb-6">
                  <SettingsIcon className="w-6 h-6 text-purple-600" />
                  <h3 className="text-xl font-bold text-gray-800">Your Dream Gallery</h3>
                </div>

                {loading ? (
                  <div className="text-center py-12">
                    <Loader2 className="w-12 h-12 animate-spin text-pink-500 mx-auto mb-4" />
                    <p className="text-gray-600">Loading your dreams...</p>
                  </div>
                ) : userImages.length === 0 ? (
                  <div className="text-center py-12">
                    <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg mb-2">No dreams created yet</p>
                    <p className="text-gray-400">Start creating to see your gallery here</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {userImages.map((image) => (
                      <Card key={image.id} className="group overflow-hidden bg-white/90 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
                        <div className="relative aspect-square overflow-hidden">
                          <img
                            src={image.imageUrl}
                            alt={image.prompt}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="p-4">
                          <p className="text-sm text-gray-700 font-medium line-clamp-2 mb-2">
                            {image.prompt}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{image.createdAt.toLocaleDateString()}</span>
                            <div className="flex items-center space-x-1">
                              <Heart className="w-3 h-3" />
                              <span>{image.likes}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

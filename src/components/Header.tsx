
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, Menu, X, Home, Users, Settings, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Community', href: '/community', icon: Users },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-pink-100/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <Sparkles className="w-8 h-8 text-pink-500 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                <div className="absolute inset-0 w-8 h-8 bg-pink-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
                Find Dreams
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-pink-600 hover:bg-pink-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-pink-50 to-purple-50 rounded-full px-4 py-2">
                    <User className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {user.displayName || user.email || 'User'}
                    </span>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="rounded-full border-pink-200 text-pink-600 hover:bg-pink-50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="text-sm text-gray-600">
                  Welcome, Guest
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              onClick={toggleMobileMenu}
              variant="ghost"
              size="sm"
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={toggleMobileMenu} />
          <div className="fixed top-16 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-pink-100/50 shadow-2xl">
            <div className="px-4 py-6 space-y-4">
              {/* Navigation Links */}
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={toggleMobileMenu}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-pink-600 hover:bg-pink-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {/* User Section */}
              <div className="border-t border-pink-100 pt-4">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl">
                      <User className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          {user.displayName || 'User'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        handleLogout();
                        toggleMobileMenu();
                      }}
                      variant="outline"
                      className="w-full justify-start rounded-xl border-pink-200 text-pink-600 hover:bg-pink-50"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="px-4 py-2">
                    <p className="text-sm text-gray-600">Welcome, Guest</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Sign in to save your dreams and join the community
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;

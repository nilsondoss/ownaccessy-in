import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Coins, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  const publicNavItems = [
  { href: '/', label: 'Home' },
  { href: '/properties', label: 'Properties' },
  { href: '/pricing', label: 'Pricing' }];


  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
    navigate('/');
  };

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isProfileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="https://img1.wsimg.com/isteam/ip/de4264ef-6b56-4f28-84bf-a8c6a43d8552/ChatGPT%20Image%20Jan%209%2C%202026%2C%2012_20_31%20PM%20(1).png" 
              alt="ownaccessy Logo" 
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {publicNavItems.map((item) =>
            <Link
              key={item.href}
              to={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === item.href ?
              'text-foreground' :
              'text-muted-foreground'}`
              }>

                {item.label}
              </Link>
            )}

            {isAuthenticated ?
            <>
                {!isAdmin && user &&
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 rounded-full">
                    <Coins className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold text-primary">{user.tokenBalance}</span>
                  </div>
              }

                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="p-2 hover:bg-accent rounded-full transition-colors"
                    title="Profile Menu">
                    <User className="h-5 w-5" />
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg py-1 z-50">
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}>
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-accent transition-colors text-left">
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </> :

            <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/register">Get Started</Link>
                </Button>
              </>
            }
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:bg-accent rounded-md transition-colors"
            aria-label="Toggle menu">

            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen &&
        <div className="md:hidden border-t border-border py-4">
            <nav className="flex flex-col gap-2">
              {publicNavItems.map((item) =>
            <Link
              key={item.href}
              to={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary py-2 ${
              location.pathname === item.href ?
              'text-foreground' :
              'text-muted-foreground'}`
              }
              onClick={() => setIsMobileMenuOpen(false)}>

                  {item.label}
                </Link>
            )}

              {isAuthenticated ?
            <>
                  {!isAdmin && user &&
              <div className="flex items-center gap-2 py-2">
                      <Coins className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold">{user.tokenBalance} Tokens</span>
                    </div>
              }

                  <Link
                    to="/dashboard"
                    className="text-sm font-medium text-muted-foreground hover:text-primary py-2 transition-colors flex items-center gap-2"
                    onClick={() => setIsMobileMenuOpen(false)}>
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-muted-foreground hover:text-primary py-2 transition-colors flex items-center gap-2 text-left">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </> :

            <>
                  <Button variant="ghost" size="sm" asChild className="justify-start">
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                  <Button size="sm" asChild className="justify-start">
                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                      Get Started
                    </Link>
                  </Button>
                </>
            }
            </nav>
          </div>
        }
      </div>
    </header>);

}
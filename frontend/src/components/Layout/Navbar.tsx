import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon, Upload, Users, Home, LayoutDashboard, FileSpreadsheet, User, LucideIcon, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[9999] glass-nav backdrop-blur-md bg-background/80 border-b border-border/20 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link
            to="/"
            className="flex items-center space-x-3 cursor-pointer nav-link-home"
            style={{
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onClick={(e) => {
              // If we're already on the home page, prevent navigation and just scroll
              if (location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0px) scale(1)';
            }}
          >
            <img
              src="/logo1.png"
              alt="CampusLens Logo"
              className="w-10 h-10 object-contain transition-transform duration-300"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              CampusLens
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink
              to={localStorage.getItem('adminToken') ? "/admin/dashboard" : "/dashboard"}
              icon={LayoutDashboard}
              label="Dashboard"
            />
            {!localStorage.getItem('adminToken') && (
              <NavLink to="/files" icon={FileSpreadsheet} label="Files" />
            )}
            <NavLink to="/developer" icon={User} label="Developer" />
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="glass"
              size="icon"
              onClick={toggleTheme}
              className="relative overflow-hidden"
            >
              {mounted && (
                <div className="transition-all duration-300">
                  {theme === "dark" ? (
                    <SunIcon className="h-4 w-4" />
                  ) : (
                    <MoonIcon className="h-4 w-4" />
                  )}
                </div>
              )}
            </Button>

            {/* Authentication Section */}
            {localStorage.getItem('adminToken') ? (
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-800">
                      <span className="font-semibold text-xs text-blue-700 dark:text-blue-300">AD</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">Admin User</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {localStorage.getItem('adminUsername') || 'admin'}
                        </p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/admin/dashboard" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      localStorage.removeItem('adminToken');
                      localStorage.removeItem('adminUsername');
                      navigate('/admin/login');
                    }} className="text-red-600 focus:text-red-600 cursor-pointer">
                      <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <SignedOut>
                  <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
                    <Button variant="outline" size="sm" className="glass hover:bg-white hover:text-black transition-colors">
                      <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      <span className="hidden sm:inline">Sign in</span>
                      <span className="sm:hidden">Sign in</span>
                    </Button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <div className="relative z-[10001]">
                    <UserButton afterSignOutUrl="/" />
                  </div>

                  {/* Mobile Hamburger Menu */}
                  {isMobile && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-2 transition-all duration-300 hover:bg-accent/50 relative z-[10001]"
                        >
                          <Menu className="h-5 w-5" />
                          <span className="sr-only">Open navigation menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="dropdown-menu-content w-56 mt-2 bg-background/95 backdrop-blur-md border border-border/20 shadow-lg z-[10000]"
                      >
                        <DropdownMenuItem asChild>
                          <Link
                            to="/dashboard"
                            className={cn(
                              "mobile-menu-item flex items-center w-full px-3 py-2 text-sm transition-colors duration-200",
                              location.pathname === "/dashboard"
                                ? "bg-accent text-accent-foreground"
                                : "hover:bg-accent/50 hover:text-accent-foreground"
                            )}
                          >
                            <LayoutDashboard className="h-4 w-4 mr-3" />
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            to="/files"
                            className={cn(
                              "mobile-menu-item flex items-center w-full px-3 py-2 text-sm transition-colors duration-200",
                              location.pathname === "/files"
                                ? "bg-accent text-accent-foreground"
                                : "hover:bg-accent/50 hover:text-accent-foreground"
                            )}
                          >
                            <FileSpreadsheet className="h-4 w-4 mr-3" />
                            Files
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            to="/developer"
                            className={cn(
                              "mobile-menu-item flex items-center w-full px-3 py-2 text-sm transition-colors duration-200",
                              location.pathname === "/developer"
                                ? "bg-accent text-accent-foreground"
                                : "hover:bg-accent/50 hover:text-accent-foreground"
                            )}
                          >
                            <User className="h-4 w-4 mr-3" />
                            Developer
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </SignedIn>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Navigation Link Component
const NavLink = ({ to, icon: Icon, label }: { to: string; icon: LucideIcon; label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
        isActive
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
      )}
    >
      <Icon className="h-4 w-4 mr-2" />
      {label}
    </Link>
  );
};

export default Navbar;
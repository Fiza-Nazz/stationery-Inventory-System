'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingCart,
  FileText,
  BarChart3,
  Menu,
  X,
  Bell,
  Moon,
  Sun,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Box
} from 'lucide-react';

// Types
interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  color: string;
  glowColor: string;
}

interface PageProps {
  activePage: string;
}

// Navigation Items with unique colors
const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    color: 'from-blue-500 to-cyan-500',
    glowColor: 'shadow-blue-500/50'
  },
  {
    name: 'Inventory',
    href: '/inventory',
    icon: Package,
    color: 'from-purple-500 to-pink-500',
    glowColor: 'shadow-purple-500/50'
  },
  {
    name: 'Add Product',
    href: '/inventory/add',
    icon: PlusCircle,
    color: 'from-green-500 to-emerald-500',
    glowColor: 'shadow-green-500/50'
  },
  {
    name: 'Sales / POS',
    href: '/sales',
    icon: ShoppingCart,
    color: 'from-orange-500 to-red-500',
    glowColor: 'shadow-orange-500/50'
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: FileText,
    color: 'from-yellow-500 to-amber-500',
    glowColor: 'shadow-yellow-500/50'
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    color: 'from-indigo-500 to-violet-500',
    glowColor: 'shadow-indigo-500/50'
  }
];

// Sidebar Component
const Sidebar: React.FC<{
  isOpen: boolean;
  toggleSidebar: () => void;
  activePage: string;
  setActivePage: (page: string) => void;
}> = ({ isOpen, toggleSidebar, activePage, setActivePage }) => {
  return (
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : -280,
          transition: { type: 'spring', damping: 25, stiffness: 200 }
        }}
        className="fixed left-0 top-0 h-screen w-[280px] z-50 lg:translate-x-0"
      >
        {/* Glassmorphism Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col p-6">
          {/* Logo Section */}
          <div className="mb-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/50">
                <Box className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">StationPro</h1>
                <p className="text-xs text-slate-400">Inventory Manager</p>
              </div>
            </motion.div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activePage === item.href;

              return (
                <motion.button
                  key={item.href}
                  onClick={() => setActivePage(item.href)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{
                    scale: 1.05,
                    x: 8,
                    transition: { type: 'spring', stiffness: 400 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    w-full group relative flex items-center gap-3 px-4 py-3.5 rounded-xl
                    transition-all duration-300
                    ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}
                  `}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className={`absolute inset-0 rounded-xl bg-gradient-to-r ${item.color} opacity-20`}
                      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    />
                  )}

                  {/* Active Border */}
                  {isActive && (
                    <motion.div
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-transparent via-white to-transparent rounded-r-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                  )}

                  {/* Icon with glow */}
                  <div className={`
                    relative z-10 p-2 rounded-lg bg-gradient-to-br ${item.color}
                    transition-all duration-300
                    ${isActive ? `shadow-lg ${item.glowColor}` : 'shadow-none'}
                    group-hover:shadow-lg group-hover:${item.glowColor}
                  `}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  {/* Text */}
                  <span className={`
                    relative z-10 font-medium transition-colors duration-300
                    ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}
                  `}>
                    {item.name}
                  </span>

                  {/* Hover glow effect */}
                  <div className={`
                    absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100
                    transition-opacity duration-300 blur-xl
                    bg-gradient-to-r ${item.color}
                  `} style={{ zIndex: -1 }} />
                </motion.button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="pt-6 border-t border-white/10">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <Settings className="w-5 h-5 text-slate-400" />
              <span className="text-slate-300 font-medium">Settings</span>
            </motion.button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

// Navbar Component
const Navbar: React.FC<{
  toggleSidebar: () => void;
  isDark: boolean;
  toggleTheme: () => void;
  activePage: string;
}> = ({ toggleSidebar, isDark, toggleTheme, activePage }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const getPageTitle = () => {
    const page = navItems.find(item => item.href === activePage);
    return page ? page.name : 'Dashboard';
  };

  return (
    <nav className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Menu className="w-6 h-6 text-slate-700" />
          </motion.button>

          <div>
            <h2 className="text-2xl font-bold text-slate-800">{getPageTitle()}</h2>
            <p className="text-sm text-slate-500">Welcome back, Admin</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-amber-500" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700" />
            )}
          </motion.button>

          {/* Notifications */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <Bell className="w-5 h-5 text-slate-700" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </motion.button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-4"
                >
                  <h3 className="font-semibold text-slate-800 mb-3">Notifications</h3>
                  <div className="space-y-2">
                    <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                      <p className="text-sm text-slate-700">New inventory added</p>
                      <p className="text-xs text-slate-500 mt-1">5 minutes ago</p>
                    </div>
                    <div className="p-3 rounded-lg bg-green-50 border border-green-100">
                      <p className="text-sm text-slate-700">Sale completed</p>
                      <p className="text-xs text-slate-500 mt-1">1 hour ago</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-3 pl-3 pr-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/30"
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-medium">Admin</span>
              <ChevronDown className="w-4 h-4 text-white" />
            </motion.button>

            {/* Profile Dropdown Menu */}
            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden"
                >
                  <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600">
                    <p className="text-white font-semibold">Admin User</p>
                    <p className="text-white/80 text-sm">admin@stationpro.com</p>
                  </div>
                  <div className="p-2">
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-100 transition-colors text-left">
                      <User className="w-4 h-4 text-slate-600" />
                      <span className="text-slate-700">Profile</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-100 transition-colors text-left">
                      <Settings className="w-4 h-4 text-slate-600" />
                      <span className="text-slate-700">Settings</span>
                    </button>
                    <hr className="my-2 border-slate-200" />
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-red-50 transition-colors text-left">
                      <LogOut className="w-4 h-4 text-red-600" />
                      <span className="text-red-600">Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Main Content Component
const MainContent: React.FC<{ activePage: string }> = ({ activePage }) => {
  return (
    <motion.div
      key={activePage}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-6"
    >
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[
          { label: 'Total Products', value: '1,234', color: 'from-blue-500 to-cyan-500', icon: Package },
          { label: 'Low Stock', value: '23', color: 'from-orange-500 to-red-500', icon: Bell },
          { label: 'Sales Today', value: '$2,450', color: 'from-green-500 to-emerald-500', icon: ShoppingCart },
          { label: 'Revenue', value: '$45.2K', color: 'from-purple-500 to-pink-500', icon: BarChart3 }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative bg-white rounded-2xl p-6 shadow-lg border border-slate-200 overflow-hidden group"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500`} />
              <div className="relative">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                <h3 className="text-3xl font-bold text-slate-800 mt-1">{stat.value}</h3>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Content Area */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8"
      >
        <h3 className="text-2xl font-bold text-slate-800 mb-4">
          {navItems.find(item => item.href === activePage)?.name || 'Dashboard'} Content
        </h3>
        <p className="text-slate-600">
          This is where the main content for the {navItems.find(item => item.href === activePage)?.name || 'Dashboard'} page will be displayed.
          You can integrate your existing pages here.
        </p>
        
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
            <h4 className="font-semibold text-slate-800 mb-2">Quick Actions</h4>
            <p className="text-sm text-slate-600">Add products, create sales, generate reports</p>
          </div>
          <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
            <h4 className="font-semibold text-slate-800 mb-2">Recent Activity</h4>
            <p className="text-sm text-slate-600">View latest transactions and updates</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Main App Component
export default function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activePage, setActivePage] = useState('/dashboard');

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        activePage={activePage}
        setActivePage={setActivePage}
      />

      {/* Main Content Area */}
      <div className="lg:ml-[280px] min-h-screen flex flex-col">
        {/* Navbar */}
        <Navbar
          toggleSidebar={toggleSidebar}
          isDark={isDarkMode}
          toggleTheme={toggleTheme}
          activePage={activePage}
        />

        {/* Page Content */}
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <MainContent activePage={activePage} />
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
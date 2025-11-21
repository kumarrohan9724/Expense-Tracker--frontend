// Layout component (Navbar, Sidebar)
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      {/* Navbar and Sidebar would go here */}
      {children}
    </div>
  );
};

export default Layout;

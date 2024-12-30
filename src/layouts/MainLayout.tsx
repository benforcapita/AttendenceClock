import React from 'react';
import { Header } from '../components/Header';

interface MainLayoutProps {
  children: React.ReactNode;
  onOpenDrawer: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, onOpenDrawer }) => {
  return (
    <div className="bg-gray-900 min-h-screen text-gray-200">
      <Header onOpenDrawer={onOpenDrawer} />
      <div className="container mx-auto p-4 flex flex-col items-center pt-16">
        {children}
      </div>
    </div>
  );
}
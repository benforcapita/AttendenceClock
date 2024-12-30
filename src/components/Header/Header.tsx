import React from 'react';
import { motion } from 'framer-motion';

interface HeaderProps {
  onOpenDrawer: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenDrawer }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onOpenDrawer}
      className="fixed top-4 right-4 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-colors z-50"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
      </svg>
    </motion.button>
  );
};
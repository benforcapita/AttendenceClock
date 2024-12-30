import React from 'react';
import { motion } from 'framer-motion';

interface ClockButtonProps {
  isClockedIn: boolean;
  onToggle: () => void;
}

export const ClockButton: React.FC<ClockButtonProps> = ({ isClockedIn, onToggle }) => {
  const buttonClass = isClockedIn ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600';
  const buttonText = isClockedIn ? 'Clock Out' : 'Clock In';

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onToggle();
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`${buttonClass} text-white font-bold rounded-full w-48 h-48 flex items-center justify-center text-2xl transition-colors shadow-lg`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <motion.span
        key={buttonText}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {buttonText}
      </motion.span>
    </motion.button>
  );
};
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onExport: () => void;
}

export const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, onImport, onExport }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed top-0 right-0 w-80 h-full bg-gray-800 p-6 shadow-lg z-50"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
            <div className="mt-12 space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">Import/Export</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-300">Import CSV</label>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={onImport}
                      className="block w-full text-sm text-gray-400
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-gray-700 file:text-white
                        hover:file:bg-gray-600"
                    />
                  </div>
                  <div>
                    <button
                      onClick={onExport}
                      className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-full font-semibold text-sm"
                    >
                      Export CSV
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
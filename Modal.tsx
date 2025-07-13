import React, { useEffect, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    let timerId: number | undefined;
    if (isOpen) {
      timerId = window.setTimeout(() => {
        setIsMounted(true);
      }, 10); 
    } else {
      setIsMounted(false);
    }
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 bg-black flex items-center justify-center p-4 z-[100] transition-opacity duration-300 ease-out ${
        isMounted ? 'bg-opacity-50 backdrop-blur-sm opacity-100 dark:bg-opacity-70' : 'bg-opacity-0 backdrop-blur-none opacity-0 pointer-events-none'
      }`}
      onClick={onClose} 
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={`bg-card rounded-lg shadow-2xl p-6 w-full max-w-md transform transition-all duration-300 ease-out dark:bg-gray-800 ${
          isMounted ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="modal-title" className="text-2xl font-semibold text-textPrimary dark:text-gray-100">{title}</h2>
          <button
            onClick={onClose}
            className="text-neutral hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
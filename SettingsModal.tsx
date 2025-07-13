
import React, { useState, useEffect } from 'react';
import Modal from './Modal';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentHouseholdName: string;
  onSave: (newName: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, currentHouseholdName, onSave }) => {
  const [name, setName] = useState(currentHouseholdName);

  useEffect(() => {
    setName(currentHouseholdName);
  }, [currentHouseholdName, isOpen]);

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
      onClose();
    } else {
      alert("Household name cannot be empty.");
    }
  };
  
  const inputBaseClasses = "mt-1 block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm";
  const darkInputClasses = "bg-gray-700 text-gray-50 placeholder-gray-400 border-gray-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-50";


  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Household Settings">
      <div className="space-y-4">
        <div>
          <label htmlFor="householdName" className="block text-sm font-medium text-textSecondary dark:text-gray-300">
            Household Name
          </label>
          <input
            type="text"
            id="householdName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`${inputBaseClasses} ${darkInputClasses}`}
            placeholder="E.g., The Champion's Den"
          />
        </div>
        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-neutral bg-gray-100 hover:bg-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 dark:focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-blue-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus:ring-blue-500"
          >
            Save Settings
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SettingsModal;
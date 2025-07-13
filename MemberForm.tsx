
import React, { useState } from 'react';
import { monsterAvatarSeeds, getMonsterAvatarUrl } from '../constants';

interface MemberFormProps {
  onAddMember: (name: string, avatarUrl: string) => void;
  onClose: () => void;
}

const MemberForm: React.FC<MemberFormProps> = ({ onAddMember, onClose }) => {
  const [name, setName] = useState('');
  const [selectedAvatarSeed, setSelectedAvatarSeed] = useState<string>(monsterAvatarSeeds[0]);
  const [avatarType] = useState<string>('pixel-art'); // Or make this selectable

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
        alert("Member name cannot be empty.");
        return;
    }
    onAddMember(name.trim(), getMonsterAvatarUrl(selectedAvatarSeed, avatarType));
    setName(''); 
    setSelectedAvatarSeed(monsterAvatarSeeds[0]);
    onClose(); 
  };
  
  const inputBaseClasses = "mt-1 block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm";
  const darkInputClasses = "bg-gray-700 text-gray-50 placeholder-gray-400 border-gray-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-50";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="memberName" className="block text-sm font-medium text-textSecondary dark:text-gray-300">Member Name*</label>
        <input
          type="text"
          id="memberName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`${inputBaseClasses} ${darkInputClasses}`}
          placeholder="E.g., Jane Doe"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-textSecondary dark:text-gray-300">Choose an Avatar</label>
        <div className="mt-2 grid grid-cols-4 sm:grid-cols-6 gap-3">
          {monsterAvatarSeeds.map(seed => (
            <button
              type="button"
              key={seed}
              onClick={() => setSelectedAvatarSeed(seed)}
              className={`p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800 ${selectedAvatarSeed === seed ? 'ring-2 ring-offset-2 ring-primary dark:ring-offset-gray-800' : ''}`}
              aria-label={`Select avatar ${seed}`}
            >
              <img 
                src={getMonsterAvatarUrl(seed, avatarType)} 
                alt={`Avatar ${seed}`} 
                className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-500 object-cover" 
              />
            </button>
          ))}
        </div>
         <div className="mt-3 text-center">
            <p className="text-sm text-textSecondary dark:text-gray-400">Selected:</p>
            <img src={getMonsterAvatarUrl(selectedAvatarSeed, avatarType)} alt="Selected Avatar" className="w-16 h-16 rounded-full mx-auto mt-1 bg-gray-200 dark:bg-gray-500 object-cover" />
        </div>
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
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-blue-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus:ring-blue-500"
        >
          Add Member
        </button>
      </div>
    </form>
  );
};

export default MemberForm;
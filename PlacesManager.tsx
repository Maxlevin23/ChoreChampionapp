
import React, { useState } from 'react';
import { Place } from '../types';
import { MapPinIcon, PlusIcon, Trash2Icon } from '../constants';

interface PlacesManagerProps {
  places: Place[];
  onAddPlace: (name: string) => void;
  onDeletePlace: (id: string) => void;
}

const PlacesManager: React.FC<PlacesManagerProps> = ({ places, onAddPlace, onDeletePlace }) => {
  const [newPlaceName, setNewPlaceName] = useState('');

  const handleAddPlace = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlaceName.trim()) {
      onAddPlace(newPlaceName.trim());
      setNewPlaceName('');
    }
  };
  
  const inputBaseClasses = "flex-grow px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm";
  const darkInputClasses = "bg-gray-700 text-gray-50 placeholder-gray-400 border-gray-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-50";


  return (
    <div className="p-4 bg-card dark:bg-gray-800 rounded-lg shadow">
      <h3 className="text-xl font-semibold text-textPrimary dark:text-gray-100 mb-3 flex items-center">
        <MapPinIcon size={22} className="mr-2 text-primary dark:text-blue-400" />
        Manage Places
      </h3>
      <form onSubmit={handleAddPlace} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newPlaceName}
          onChange={(e) => setNewPlaceName(e.target.value)}
          placeholder="New place name (e.g., Garage)"
          className={`${inputBaseClasses} ${darkInputClasses}`}
          aria-label="New place name"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-secondary text-white rounded-md shadow-sm hover:bg-emerald-600 dark:bg-emerald-500 dark:hover:bg-emerald-400 transition-colors flex items-center text-sm"
          aria-label="Add new place"
        >
          <PlusIcon size={18} className="mr-1" /> Add
        </button>
      </form>
      {places.length > 0 ? (
        <ul className="space-y-2 max-h-48 overflow-y-auto">
          {places.map(place => (
            <li key={place.id} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
              <span className="text-textSecondary dark:text-gray-300">{place.name}</span>
              <button
                onClick={() => onDeletePlace(place.id)}
                className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-full hover:bg-red-100 dark:hover:bg-red-700/50 transition-colors"
                aria-label={`Delete place ${place.name}`}
              >
                <Trash2Icon size={18} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-textSecondary dark:text-gray-400">No places defined yet. Add some above!</p>
      )}
    </div>
  );
};

export default PlacesManager;
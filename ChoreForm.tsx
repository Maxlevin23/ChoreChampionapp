
import React, { useState, useEffect } from 'react';
import { Chore, Member, Place } from '../types';

// Data structure the form will output
export interface ChoreFormData {
  name: string;
  description: string;
  points: number;
  assignedTo?: string;
  dueDate?: string;
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  placeId?: string;
}

interface ChoreFormProps {
  members: Member[];
  places: Place[];
  onSave: (data: ChoreFormData) => void;
  choreToEdit?: Chore;
  onClose: () => void;
}

const ChoreForm: React.FC<ChoreFormProps> = ({ members, places, onSave, choreToEdit, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [points, setPoints] = useState<number | ''>(10);
  const [assignedTo, setAssignedTo] = useState<string | undefined>(undefined);
  const [dueDate, setDueDate] = useState('');
  const [frequency, setFrequency] = useState<'once' | 'daily' | 'weekly' | 'monthly'>('once');
  const [placeId, setPlaceId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (choreToEdit) {
      setName(choreToEdit.name);
      setDescription(choreToEdit.description);
      setPoints(choreToEdit.points);
      setAssignedTo(choreToEdit.assignedTo);
      setDueDate(choreToEdit.dueDate ? choreToEdit.dueDate.split('T')[0] : '');
      setFrequency(choreToEdit.frequency || 'once');
      setPlaceId(choreToEdit.placeId);
    } else {
      setName('');
      setDescription('');
      setPoints(10);
      setAssignedTo(undefined);
      setDueDate('');
      setFrequency('once');
      setPlaceId(undefined);
    }
  }, [choreToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || points === '' || Number(points) <= 0) {
      alert("Chore name and positive points value are required.");
      return;
    }
    onSave({
      name,
      description,
      points: Number(points),
      assignedTo,
      dueDate: dueDate || undefined,
      frequency,
      placeId
    });
  };

  const inputBaseClasses = "mt-1 block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm";
  const darkInputClasses = "bg-gray-700 text-gray-50 placeholder-gray-400 border-gray-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-50";
  const selectOptionClasses = "bg-gray-700 text-gray-50 dark:bg-gray-600 dark:text-gray-50";


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="choreName" className="block text-sm font-medium text-textSecondary dark:text-gray-300">Chore Name*</label>
        <input
          type="text"
          id="choreName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`${inputBaseClasses} ${darkInputClasses}`}
          required
        />
      </div>
      <div>
        <label htmlFor="choreDescription" className="block text-sm font-medium text-textSecondary dark:text-gray-300">Description</label>
        <textarea
          id="choreDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className={`${inputBaseClasses} ${darkInputClasses}`}
        />
      </div>
      <div>
        <label htmlFor="chorePoints" className="block text-sm font-medium text-textSecondary dark:text-gray-300">Points*</label>
        <input
          type="number"
          id="chorePoints"
          value={points}
          min="1"
          onChange={(e) => setPoints(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
          className={`${inputBaseClasses} ${darkInputClasses}`}
          required
        />
      </div>
      <div>
        <label htmlFor="assignedTo" className="block text-sm font-medium text-textSecondary dark:text-gray-300">Assign To</label>
        <select
          id="assignedTo"
          value={assignedTo || ''}
          onChange={(e) => setAssignedTo(e.target.value || undefined)}
          className={`${inputBaseClasses} ${darkInputClasses}`}
        >
          <option value="" className={selectOptionClasses}>Unassigned</option>
          {members.map(member => (
            <option key={member.id} value={member.id} className={selectOptionClasses}>{member.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="placeId" className="block text-sm font-medium text-textSecondary dark:text-gray-300">Assign to Place</label>
        <select
          id="placeId"
          value={placeId || ''}
          onChange={(e) => setPlaceId(e.target.value || undefined)}
          className={`${inputBaseClasses} ${darkInputClasses}`}
        >
          <option value="" className={selectOptionClasses}>Unassigned</option>
          {places.map(place => (
            <option key={place.id} value={place.id} className={selectOptionClasses}>{place.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-textSecondary dark:text-gray-300">Due Date</label>
        <input
          type="date"
          id="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className={`${inputBaseClasses} ${darkInputClasses} dark:[color-scheme:dark]`} 
        />
      </div>
      <div>
        <label htmlFor="frequency" className="block text-sm font-medium text-textSecondary dark:text-gray-300">Frequency</label>
        <select
          id="frequency"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as 'once' | 'daily' | 'weekly' | 'monthly')}
          className={`${inputBaseClasses} ${darkInputClasses}`}
        >
          <option value="once" className={selectOptionClasses}>Once</option>
          <option value="daily" className={selectOptionClasses}>Daily</option>
          <option value="weekly" className={selectOptionClasses}>Weekly</option>
          <option value="monthly" className={selectOptionClasses}>Monthly</option>
        </select>
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
          {choreToEdit ? 'Save Changes' : 'Add Chore'}
        </button>
      </div>
    </form>
  );
};

export default ChoreForm;
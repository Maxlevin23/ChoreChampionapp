
import React, { useState, useMemo } from 'react';
import { Chore, Member, Place } from '../types';
import ChoreForm, { ChoreFormData } from '../components/ChoreForm';
import Modal from '../components/Modal';
import { PlusIcon, CheckCircleIcon, CircleIcon, Trash2Icon, BellIcon, PencilIcon, getMonsterAvatarUrl, MapPinIcon } from '../constants';
import PlacesManager from '../components/PlacesManager';

interface ChoresPageProps {
  chores: Chore[];
  members: Member[];
  places: Place[];
  onAddChore: (choreData: ChoreFormData) => void;
  onEditChore: (chore: Chore) => void;
  onToggleComplete: (choreId: string) => void;
  onDeleteChore: (choreId: string) => void;
  onSendReminder: (chore: Chore) => void;
  onAddPlace: (name: string) => void;
  onDeletePlace: (id: string) => void;
}

const ChoreCard: React.FC<{
  chore: Chore,
  memberName?: string,
  placeName?: string,
  onToggleComplete: () => void,
  onDelete: () => void,
  onSendReminder: () => void,
  onEdit: () => void,
  isOverdue: boolean
}> =
  ({ chore, memberName, placeName, onToggleComplete, onDelete, onSendReminder, onEdit, isOverdue }) => (
    <div className={`bg-card dark:bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl dark:hover:shadow-gray-700/50 transition-shadow duration-300 border-l-4 ${chore.isCompleted ? 'border-green-500 dark:border-green-400 opacity-70 dark:opacity-80' : isOverdue ? 'border-red-500 dark:border-red-400' : 'border-primary dark:border-blue-500'}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className={`text-xl font-semibold ${chore.isCompleted ? 'line-through text-gray-500 dark:text-gray-400' : 'text-textPrimary dark:text-gray-100'}`}>{chore.name}</h3>
          <p className="text-sm text-textSecondary dark:text-gray-300 mt-1">{chore.description}</p>
        </div>
        <button onClick={onToggleComplete} className="ml-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" aria-label={chore.isCompleted ? "Mark as incomplete" : "Mark as complete"}>
          {chore.isCompleted ? <CheckCircleIcon className="text-green-500 dark:text-green-400" size={28} /> : <CircleIcon className="text-neutral dark:text-gray-400" size={28} />}
        </button>
      </div>
      <div className="mt-3 space-y-1 text-sm text-textSecondary dark:text-gray-300">
        <p>Points: <span className="font-medium text-accent dark:text-amber-400">{chore.points}</span></p>
        {memberName && <p>Assigned to: <span className="font-medium text-primary dark:text-blue-400">{memberName}</span></p>}
        {placeName && <p className="flex items-center"><MapPinIcon size={14} className="mr-1 text-neutral dark:text-gray-500" /> Place: <span className="font-medium text-neutral dark:text-gray-400">{placeName}</span></p>}
        {chore.dueDate && <p className={isOverdue && !chore.isCompleted ? "text-red-600 dark:text-red-400 font-semibold" : ""}>Due: {new Date(chore.dueDate).toLocaleDateString()}</p>}
        {chore.frequency && <p>Frequency: <span className="capitalize">{chore.frequency}</span></p>}
        {chore.isCompleted && chore.completedAt && <p>Completed: {new Date(chore.completedAt).toLocaleString()}</p>}
      </div>
      <div className="mt-4 flex justify-end space-x-2">
        {!chore.isCompleted && chore.assignedTo && (
          <button
            onClick={onSendReminder}
            className="p-2 text-xs font-medium text-white bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500 rounded-md shadow-sm flex items-center transition-colors"
            aria-label="Send Reminder"
          >
            <BellIcon size={14} className="mr-1" /> Reminder
          </button>
        )}
        <button
          onClick={onEdit}
          className="p-2 text-xs font-medium text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-md shadow-sm flex items-center transition-colors"
          aria-label="Edit Chore"
        >
          <PencilIcon size={14} className="mr-1" /> Edit
        </button>
        <button
          onClick={onDelete}
          className="p-2 text-xs font-medium text-white bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500 rounded-md shadow-sm flex items-center transition-colors"
          aria-label="Delete Chore"
        >
          <Trash2Icon size={14} />
        </button>
      </div>
    </div>
  );

const ChoresPage: React.FC<ChoresPageProps> = ({
  chores, members, places,
  onAddChore, onEditChore, onToggleComplete, onDeleteChore, onSendReminder,
  onAddPlace, onDeletePlace
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [choreToEdit, setChoreToEdit] = useState<Chore | undefined>(undefined);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('pending');
  const [searchTerm, setSearchTerm] = useState('');

  const getMemberName = (memberId?: string) => members.find(m => m.id === memberId)?.name || 'Unassigned';
  const getPlaceName = (placeId?: string) => places.find(p => p.id === placeId)?.name;

  const handleOpenAddModal = () => {
    setChoreToEdit(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (chore: Chore) => {
    setChoreToEdit(chore);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setChoreToEdit(undefined);
  };

  const handleFormSave = (data: ChoreFormData) => {
    if (choreToEdit) {
      onEditChore({
        ...choreToEdit,
        ...data,
        points: Number(data.points)
      });
    } else {
      onAddChore(data); // ChoreFormData now matches the input for onAddChore in App.tsx
    }
    handleCloseModal();
  };

  const filteredChores = useMemo(() => {
    return chores
      .filter(chore => {
        if (filter === 'pending') return !chore.isCompleted;
        if (filter === 'completed') return chore.isCompleted;
        return true;
      })
      .filter(chore => chore.name.toLowerCase().includes(searchTerm.toLowerCase()) || chore.description.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [chores, filter, searchTerm]);

  const sortedChores = useMemo(() => {
    return [...filteredChores].sort((a, b) => {
      if (a.isCompleted !== b.isCompleted) {
        return a.isCompleted ? 1 : -1;
      }
      const dueDateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const dueDateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return dueDateA - dueDateB;
    });
  }, [filteredChores]);

  const isChoreOverdue = (chore: Chore): boolean => {
    if (!chore.dueDate || chore.isCompleted) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(chore.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-card dark:bg-gray-800 rounded-lg shadow">
        <h2 className="text-3xl font-semibold text-textPrimary dark:text-gray-100">Chores Dashboard</h2>
        <button
          onClick={handleOpenAddModal}
          className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-primary text-white rounded-md shadow-md hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          <PlusIcon className="mr-2" /> Add New Chore
        </button>
      </div>
      
      <PlacesManager places={places} onAddPlace={onAddPlace} onDeletePlace={onDeletePlace} />

      <div className="p-4 bg-card dark:bg-gray-800 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Search chores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
            aria-label="Search chores"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'pending' | 'completed')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            aria-label="Filter chores"
          >
            <option value="all" className="dark:bg-gray-700">All Chores</option>
            <option value="pending" className="dark:bg-gray-700">Pending</option>
            <option value="completed" className="dark:bg-gray-700">Completed</option>
          </select>
        </div>
      </div>

      {sortedChores.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedChores.map(chore => (
            <ChoreCard
              key={chore.id}
              chore={chore}
              memberName={getMemberName(chore.assignedTo)}
              placeName={getPlaceName(chore.placeId)}
              onToggleComplete={() => onToggleComplete(chore.id)}
              onDelete={() => onDeleteChore(chore.id)}
              onSendReminder={() => onSendReminder(chore)}
              onEdit={() => handleOpenEditModal(chore)}
              isOverdue={isChoreOverdue(chore)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-card dark:bg-gray-800 rounded-lg shadow">
          <img src={getMonsterAvatarUrl('empty-set', 'pixel-art')} alt="No chores" className="mx-auto mb-4 rounded-md opacity-70 w-40 h-40" />
          <p className="text-xl text-textSecondary dark:text-gray-400">No chores match your current filters. Time for a break or add some new ones!</p>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={choreToEdit ? "Edit Chore" : "Add New Chore"}>
        <ChoreForm
          members={members}
          places={places}
          onSave={handleFormSave}
          choreToEdit={choreToEdit}
          onClose={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default ChoresPage;
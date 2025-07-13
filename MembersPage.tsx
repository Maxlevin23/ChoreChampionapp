
import React, { useState } from 'react';
import { Member } from '../types';
import MemberForm from '../components/MemberForm';
import Modal from '../components/Modal';
import { PlusIcon, UsersIcon, TrophyIcon, getMonsterAvatarUrl } from '../constants';

interface MembersPageProps {
  members: Member[];
  onAddMember: (name: string, avatarUrl: string) => void;
}

const MemberCard: React.FC<{ member: Member }> = ({ member }) => (
  <div className="bg-card dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl dark:hover:shadow-gray-700/50 transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center">
    <img src={member.avatarUrl} alt={member.name} className="w-24 h-24 rounded-full mb-4 border-4 border-primary dark:border-blue-500 shadow-md bg-gray-200 dark:bg-gray-700 object-cover" />
    <h3 className="text-xl font-semibold text-textPrimary dark:text-gray-100">{member.name}</h3>
    <div className="mt-2 flex items-center text-accent dark:text-amber-400">
      <TrophyIcon size={20} className="mr-1" />
      <p className="text-lg font-bold">{member.points} Points</p>
    </div>
  </div>
);

const MembersPage: React.FC<MembersPageProps> = ({ members, onAddMember }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-card dark:bg-gray-800 rounded-lg shadow">
        <h2 className="text-3xl font-semibold text-textPrimary dark:text-gray-100">Household Members</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-primary text-white rounded-md shadow-md hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          <PlusIcon className="mr-2" /> Add New Member
        </button>
      </div>

      {members.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {members.map(member => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-card dark:bg-gray-800 rounded-lg shadow">
          {/* Using one of the monster avatars as a placeholder for the empty state */}
          <img src={getMonsterAvatarUrl('team-empty', 'bottts')} alt="No members" className="w-32 h-32 mx-auto mb-4 opacity-50" />
          <p className="text-xl text-textSecondary dark:text-gray-400">No members yet. Add some to get started!</p>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Member">
        <MemberForm onAddMember={onAddMember} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default MembersPage;
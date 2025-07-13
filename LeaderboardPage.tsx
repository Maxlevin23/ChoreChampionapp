
import React, { useMemo } from 'react';
import { Member, Chore } from '../types'; // Added Chore type
import { TrophyIcon } from '../constants';

interface LeaderboardPageProps {
  members: Member[];
  chores: Chore[]; // Added chores prop
}

interface MemberWithChoreCount extends Member {
  completedChoresCount: number;
}

const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ members, chores }) => {
  const rankedMembersWithChoreCount = useMemo(() => {
    const membersWithPointsAndCounts = members.map(member => {
      const completedChoresCount = chores.filter(
        chore => chore.isCompleted && chore.assignedTo === member.id
      ).length;
      return { ...member, points: member.points || 0, completedChoresCount };
    });
    return membersWithPointsAndCounts.sort((a, b) => b.points - a.points);
  }, [members, chores]);

  const getRankColor = (rank: number) => {
    if (rank === 0) return 'bg-yellow-400 text-yellow-800 dark:bg-yellow-500 dark:text-yellow-900';
    if (rank === 1) return 'bg-gray-300 text-gray-700 dark:bg-gray-400 dark:text-gray-800';
    if (rank === 2) return 'bg-amber-600 text-amber-100 dark:bg-yellow-700 dark:text-yellow-100';
    return 'bg-primary text-white dark:bg-blue-500 dark:text-white';
  };

  const getTrophyColor = (rank: number): string | undefined => {
    if (rank === 0) return '#FFD700'; // Gold
    if (rank === 1) return '#C0C0C0'; // Silver
    if (rank === 2) return '#CD7F32'; // Bronze
    return undefined;
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-card dark:bg-gray-800 rounded-lg shadow text-center">
        <TrophyIcon size={50} className="mx-auto mb-4 text-accent dark:text-amber-400" />
        <h2 className="text-3xl font-bold text-textPrimary dark:text-gray-100">Leaderboard</h2>
        <p className="text-textSecondary dark:text-gray-300 mt-1">See who's conquering the chores!</p>
      </div>

      {rankedMembersWithChoreCount.length > 0 ? (
        <div className="bg-card dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {rankedMembersWithChoreCount.map((member, index) => {
              const trophyColor = getTrophyColor(index);
              return (
                <li key={member.id} className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center space-x-4 ${index < 3 ? 'font-semibold':''}`}>
                  <span className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${getRankColor(index)} shadow-sm shrink-0`}>
                    {index + 1}
                  </span>
                  <img src={member.avatarUrl} alt={member.name} className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 object-cover shrink-0" />
                  <div className="flex-grow min-w-0"> {/* Added min-w-0 for better flexbox handling of long names */}
                    <p className="text-lg text-textPrimary dark:text-gray-100 flex items-center truncate">
                      <span className="truncate">{member.name}</span>
                      {trophyColor && <TrophyIcon size={20} color={trophyColor} className="ml-2 shrink-0" />}
                    </p>
                    <p className="text-xs text-textSecondary dark:text-gray-400">
                      {member.completedChoresCount} chore{member.completedChoresCount === 1 ? '' : 's'} completed
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                     <p className="text-xl font-bold text-accent dark:text-amber-400">{member.points}</p>
                     <p className="text-sm text-textSecondary dark:text-gray-400">Points</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="text-center py-10 bg-card dark:bg-gray-800 rounded-lg shadow">
           <TrophyIcon size={60} className="mx-auto mb-4 text-neutral dark:text-gray-500 opacity-50" />
          <p className="text-xl text-textSecondary dark:text-gray-400">No members on the leaderboard yet. Add members and complete chores to see the scores!</p>
        </div>
      )}
    </div>
  );
};

export default LeaderboardPage;

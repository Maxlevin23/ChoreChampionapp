
import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Chore, Member, ChatMessage, NavItem, Place } from './types';
import { PlusIcon, UsersIcon, TrophyIcon, MessageSquareIcon, HomeIcon, SunIcon, MoonIcon, SettingsIcon, defaultPlaces } from './constants';
import ChoresPage from './pages/ChoresPage';
import MembersPage from './pages/MembersPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ChatPage from './pages/ChatPage';
import usePersistentState from './hooks/usePersistentState';
import { useTheme } from './hooks/useTheme';
import { geminiGenerateChoreReminder } from './services/geminiService';
import SettingsModal from './components/SettingsModal';
import { ChoreFormData } from './components/ChoreForm';


const App: React.FC = () => {
  const [members, setMembers] = usePersistentState<Member[]>('choreChampionMembers', []);
  const [chores, setChores] = usePersistentState<Chore[]>('choreChampionChores', []);
  const [chatMessages, setChatMessages] = usePersistentState<ChatMessage[]>('choreChampionChatMessages', []);
  const [isLoadingGemini, setIsLoadingGemini] = useState(false);
  const [theme, toggleTheme] = useTheme();

  const [householdName, setHouseholdName] = usePersistentState<string>('choreChampionHouseholdName', 'My Household');
  const [places, setPlaces] = usePersistentState<Place[]>('choreChampionPlaces', defaultPlaces);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const location = useLocation();

  const addMember = (name: string, avatarUrl: string) => {
    const newMember: Member = {
      id: Date.now().toString(),
      name,
      avatarUrl: avatarUrl,
      points: 0,
    };
    setMembers(prev => [...prev, newMember]);
  };

  const addChore = (choreData: ChoreFormData) => {
    const newChore: Chore = {
      id: Date.now().toString(),
      name: choreData.name,
      description: choreData.description,
      points: choreData.points,
      assignedTo: choreData.assignedTo,
      dueDate: choreData.dueDate,
      frequency: choreData.frequency,
      placeId: choreData.placeId,
      isCompleted: false,
    };
    setChores(prev => [...prev, newChore]);
  };

  const editChore = (updatedChoreData: Chore) => {
    setChores(prevChores => {
      const originalChore = prevChores.find(c => c.id === updatedChoreData.id);
      if (!originalChore) return prevChores;

      const newChoresList = prevChores.map(c =>
        c.id === updatedChoreData.id ? updatedChoreData : c
      );

      if (updatedChoreData.isCompleted) {
        const pointsChanged = originalChore.points !== updatedChoreData.points;
        const assigneeChanged = originalChore.assignedTo !== updatedChoreData.assignedTo;

        if (pointsChanged || assigneeChanged) {
          setMembers(prevMembers => {
            let newMembers = [...prevMembers];

            // Deduct old points from original assignee if they existed
            if (originalChore.assignedTo) {
              newMembers = newMembers.map(member => {
                if (member.id === originalChore.assignedTo) {
                  return { ...member, points: Math.max(0, (member.points || 0) - originalChore.points) };
                }
                return member;
              });
            }

            // Add new points to new assignee if they exist
            if (updatedChoreData.assignedTo) {
              newMembers = newMembers.map(member => {
                if (member.id === updatedChoreData.assignedTo) {
                  return { ...member, points: Math.max(0, (member.points || 0) + updatedChoreData.points) };
                }
                return member;
              });
            }
            return newMembers;
          });
        }
      }
      return newChoresList;
    });
  };

  const toggleChoreCompletion = (choreId: string) => {
    setChores(prevChores =>
      prevChores.map(chore => {
        if (chore.id === choreId) {
          const wasCompleted = chore.isCompleted;
          const updatedChore = {
            ...chore,
            isCompleted: !chore.isCompleted,
            completedAt: !chore.isCompleted ? new Date().toISOString() : undefined
          };

          setMembers(prevMembers =>
            prevMembers.map(member => {
              if (member.id === updatedChore.assignedTo) {
                const pointsChange = wasCompleted ? -updatedChore.points : updatedChore.points;
                return { ...member, points: Math.max(0, (member.points || 0) + pointsChange) };
              }
              return member;
            })
          );
          return updatedChore;
        }
        return chore;
      })
    );
  };

  const deleteChore = (choreId: string) => {
    const choreToDelete = chores.find(c => c.id === choreId);
    if (choreToDelete && choreToDelete.isCompleted && choreToDelete.assignedTo) {
      setMembers(prevMembers =>
        prevMembers.map(member => {
          if (member.id === choreToDelete.assignedTo) {
            return { ...member, points: Math.max(0, (member.points || 0) - choreToDelete.points) };
          }
          return member;
        })
      );
    }
    setChores(prev => prev.filter(chore => chore.id !== choreId));
  };

  const addChatMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    setChatMessages(prev => [
      ...prev,
      { ...message, id: Date.now().toString(), timestamp: new Date().toISOString() },
    ]);
  }, [setChatMessages]);


  const sendAutomatedReminder = useCallback(async (chore: Chore) => {
    const member = members.find(m => m.id === chore.assignedTo);
    if (!member) return;

    addChatMessage({
      sender: 'System',
      text: `Generating reminder for ${member.name} about "${chore.name}"...`,
      type: 'system',
    });
    setIsLoadingGemini(true);
    try {
      const reminderText = await geminiGenerateChoreReminder(chore.name, member.name);
      addChatMessage({
        sender: 'System',
        text: `Reminder for ${member.name}: ${reminderText}`,
        type: 'reminder',
      });

      if (Notification.permission === "granted") {
        new Notification("Chore Reminder!", {
          body: `${member.name}, don't forget: ${chore.name}! ${reminderText}`,
          icon: '/logo.png' // Assuming you might have a logo.png in public folder
        });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            new Notification("Chore Reminder!", {
              body: `${member.name}, don't forget: ${chore.name}! ${reminderText}`,
            });
          }
        });
      }
    } catch (error) {
      console.error("Error generating reminder:", error);
      addChatMessage({
        sender: 'System',
        text: `Could not generate reminder for ${chore.name}. Standard reminder: ${member.name}, please complete "${chore.name}".`,
        type: 'error',
      });
    } finally {
      setIsLoadingGemini(false);
    }
  }, [members, addChatMessage, setIsLoadingGemini]);

  useEffect(() => {
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  }, []);

  // Household and Places Management
  const updateHouseholdName = (newName: string) => {
    setHouseholdName(newName);
  };

  const addPlace = (name: string) => {
    if (!name.trim()) return;
    const newPlace: Place = {
      id: Date.now().toString(),
      name: name.trim(),
    };
    setPlaces(prev => [...prev, newPlace]);
  };

  const deletePlace = (placeId: string) => {
    setPlaces(prev => prev.filter(p => p.id !== placeId));
    // Unassign this place from any chores
    setChores(prevChores => 
      prevChores.map(chore => 
        chore.placeId === placeId ? { ...chore, placeId: undefined } : chore
      )
    );
  };

  const navItems: NavItem[] = [
    { path: '/', label: 'Chores', icon: <HomeIcon /> },
    { path: '/members', label: 'Members', icon: <UsersIcon /> },
    { path: '/leaderboard', label: 'Leaderboard', icon: <TrophyIcon /> },
    { path: '/chat', label: 'Chat', icon: <MessageSquareIcon /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary via-blue-400 to-secondary dark:from-blue-700 dark:via-blue-600 dark:to-emerald-700">
      <header className="bg-white/80 backdrop-blur-md shadow-lg p-4 sticky top-0 z-50 dark:bg-gray-800/80 dark:border-b dark:border-gray-700">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary dark:text-blue-400">{householdName}</h1>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <nav className="hidden md:flex space-x-2">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-all duration-200 ease-in-out
                    ${location.pathname === item.path
                      ? 'bg-primary text-white shadow-md scale-105 dark:bg-blue-500 dark:text-white'
                      : 'text-neutral dark:text-gray-400 hover:bg-primary/10 hover:text-primary dark:hover:bg-gray-700 dark:hover:text-blue-400'}`}
                >
                  {React.cloneElement(item.icon, { className: location.pathname === item.path ? 'text-white' : 'text-inherit' })}
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-full text-neutral dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-500"
            >
              {theme === 'light' ? <MoonIcon size={22}/> : <SunIcon size={22} />}
            </button>
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              aria-label="Open settings"
              className="p-2 rounded-full text-neutral dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-500"
            >
              <SettingsIcon size={22}/>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 flex-grow">
        <Routes>
          <Route path="/" element={
            <ChoresPage
              chores={chores}
              members={members}
              places={places}
              onAddChore={addChore}
              onEditChore={editChore}
              onToggleComplete={toggleChoreCompletion}
              onDeleteChore={deleteChore}
              onSendReminder={sendAutomatedReminder}
              onAddPlace={addPlace}
              onDeletePlace={deletePlace}
            />} 
          />
          <Route path="/members" element={<MembersPage members={members} onAddMember={addMember} />} />
          <Route path="/leaderboard" element={<LeaderboardPage members={members} chores={chores} />} />
          <Route path="/chat" element={<ChatPage messages={chatMessages} onSendMessage={addChatMessage} isLoadingGemini={isLoadingGemini} />} />
        </Routes>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-t-lg border-t border-gray-200 dark:bg-gray-800/90 dark:border-gray-700 flex justify-around p-2 z-50">
        {navItems.map(item => (
          <Link
            key={item.path + "-mobile"}
            to={item.path}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200
              ${location.pathname === item.path ? 'text-primary dark:text-blue-400 scale-110' : 'text-neutral dark:text-gray-400 hover:text-primary dark:hover:text-blue-400'}`}
          >
            {React.cloneElement(item.icon, { className: 'w-6 h-6 mb-1' })}
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="md:hidden h-16"></div> {/* Spacer for bottom nav */}

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        currentHouseholdName={householdName}
        onSave={updateHouseholdName}
      />
    </div>
  );
};

export default App;

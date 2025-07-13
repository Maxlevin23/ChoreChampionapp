
import React from 'react';
import { IconProps } from './constants'; // Import IconProps

export interface Member {
  id: string;
  name: string;
  avatarUrl: string;
  points: number;
}

export interface Place {
  id: string;
  name: string;
}

export interface Chore {
  id: string;
  name: string;
  description: string;
  points: number;
  assignedTo?: string; // Member ID
  dueDate?: string; // ISO string
  isCompleted: boolean;
  completedAt?: string; // ISO string
  frequency?: 'once' | 'daily' | 'weekly' | 'monthly'; 
  placeId?: string; // Place ID
}

export interface ChatMessage {
  id: string;
  sender: string; // 'System' or Member Name/ID
  text: string;
  timestamp: string; // ISO string
  type: 'message' | 'reminder' | 'system' | 'error';
}

export interface NavItem {
  path: string;
  label: string;
  icon: React.ReactElement<IconProps>; // Use specific IconProps
}
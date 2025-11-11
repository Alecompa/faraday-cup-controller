'use client';

import { CupState } from '@/lib/state';
import { Circle, Activity } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface StatusDisplayProps {
  currentState: CupState;
  lastCommandTime: number | null;
  isConnected: boolean;
}

export default function StatusDisplay({
  currentState,
  lastCommandTime,
  isConnected,
}: StatusDisplayProps) {
  const getStateColor = (state: CupState) => {
    switch (state) {
      case 'open':
        return 'text-green-500';
      case 'closed':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStateText = (state: CupState) => {
    switch (state) {
      case 'open':
        return 'OPEN';
      case 'closed':
        return 'CLOSED';
      default:
        return 'UNKNOWN';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          System Status
        </h2>
        <div className="flex items-center gap-2">
          <Activity className={`w-5 h-5 ${isConnected ? 'text-green-500' : 'text-red-500'}`} />
          <span className={`text-sm font-medium ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Circle className={`w-12 h-12 ${getStateColor(currentState)} fill-current`} />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Faraday Cup State</p>
            <p className={`text-2xl font-bold ${getStateColor(currentState)}`}>
              {getStateText(currentState)}
            </p>
          </div>
        </div>

        {lastCommandTime && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Last Command</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
              {formatDistanceToNow(lastCommandTime, { addSuffix: true })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


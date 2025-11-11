'use client';

import { format } from 'date-fns';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface HistoryEntry {
  state: 'open' | 'closed' | 'unknown';
  timestamp: number;
  success: boolean;
  error?: string;
}

interface HistoryDisplayProps {
  history: HistoryEntry[];
}

export default function HistoryDisplay({ history }: HistoryDisplayProps) {
  if (history.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Command History
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No commands executed yet
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Command History
      </h2>

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {history
          .slice()
          .reverse()
          .map((entry, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
            >
              <div className="flex items-center gap-3">
                {entry.success ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {entry.state.toUpperCase()}
                  </p>
                  {entry.error && (
                    <p className="text-xs text-red-500 mt-1">{entry.error}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                {format(entry.timestamp, 'HH:mm:ss')}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}


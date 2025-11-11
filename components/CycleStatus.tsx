'use client';

import { CycleExecution } from '@/lib/state';
import { Play, Pause, Square, Clock, CheckCircle2 } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

interface CycleStatusProps {
  execution: CycleExecution | null;
  onPause: () => Promise<void>;
  onResume: () => Promise<void>;
  onStop: () => Promise<void>;
}

export default function CycleStatus({
  execution,
  onPause,
  onResume,
  onStop,
}: CycleStatusProps) {
  if (!execution) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Cycle Status
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No cycle program running
        </p>
      </div>
    );
  }

  const progress =
    (execution.completedSteps /
      (execution.totalSteps * execution.totalRepeats)) *
    100;

  const timeUntilNext = execution.nextActionTime - Date.now();
  const minutesUntilNext = Math.max(0, Math.floor(timeUntilNext / 1000 / 60));
  const secondsUntilNext = Math.max(0, Math.floor((timeUntilNext / 1000) % 60));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Cycle Status
        </h2>
        <div className="flex items-center gap-2">
          {execution.isRunning && !execution.isPaused && (
            <span className="flex items-center gap-1 text-green-500 text-sm font-medium">
              <Play className="w-4 h-4" />
              Running
            </span>
          )}
          {execution.isPaused && (
            <span className="flex items-center gap-1 text-yellow-500 text-sm font-medium">
              <Pause className="w-4 h-4" />
              Paused
            </span>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* Program Name */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Program</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {execution.programName}
          </p>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">Progress</p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {Math.round(progress)}%
            </p>
          </div>
          <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Cycle Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Current Repeat</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {execution.currentRepeat} / {execution.totalRepeats}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Current Step</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {execution.currentStep} / {execution.totalSteps}
            </p>
          </div>
        </div>

        {/* Completed Steps */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Completed Steps</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            {execution.completedSteps} / {execution.totalSteps * execution.totalRepeats}
          </p>
        </div>

        {/* Time Info */}
        {!execution.isPaused && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>Next action in:</span>
              <span className="font-mono font-semibold text-gray-900 dark:text-white">
                {minutesUntilNext}m {secondsUntilNext}s
              </span>
            </div>
          </div>
        )}

        {/* Running Time */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Running Time</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {formatDistanceToNow(execution.startTime, { addSuffix: false })}
          </p>
        </div>

        {/* Controls */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-2">
            {!execution.isPaused ? (
              <button
                onClick={onPause}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-md transition-colors"
              >
                <Pause className="w-4 h-4" />
                Pause
              </button>
            ) : (
              <button
                onClick={onResume}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md transition-colors"
              >
                <Play className="w-4 h-4" />
                Resume
              </button>
            )}
            <button
              onClick={onStop}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md transition-colors"
            >
              <Square className="w-4 h-4" />
              Stop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


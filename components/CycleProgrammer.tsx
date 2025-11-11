'use client';

import { useState } from 'react';
import { CycleStep, CycleProgram } from '@/lib/state';
import { Plus, Trash2, Save, Play } from 'lucide-react';

interface CycleProgrammerProps {
  onStartProgram: (program: CycleProgram) => Promise<void>;
  disabled?: boolean;
}

export default function CycleProgrammer({
  onStartProgram,
  disabled = false,
}: CycleProgrammerProps) {
  const [programName, setProgramName] = useState('My Program');
  const [repeatCount, setRepeatCount] = useState(1);
  const [steps, setSteps] = useState<CycleStep[]>([
    { id: '1', state: 'open', durationMinutes: 60 },
    { id: '2', state: 'closed', durationMinutes: 60 },
  ]);

  const addStep = () => {
    const newStep: CycleStep = {
      id: Date.now().toString(),
      state: 'open',
      durationMinutes: 60,
    };
    setSteps([...steps, newStep]);
  };

  const removeStep = (id: string) => {
    if (steps.length > 1) {
      setSteps(steps.filter((step) => step.id !== id));
    }
  };

  const updateStep = (id: string, updates: Partial<CycleStep>) => {
    setSteps(
      steps.map((step) => (step.id === id ? { ...step, ...updates } : step))
    );
  };

  const handleStartProgram = async () => {
    const program: CycleProgram = {
      id: Date.now().toString(),
      name: programName,
      steps,
      repeat: repeatCount,
    };
    await onStartProgram(program);
  };

  const totalDuration = steps.reduce((acc, step) => acc + step.durationMinutes, 0);
  const totalDurationWithRepeats = totalDuration * repeatCount;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Cycle Programmer
      </h2>

      <div className="space-y-4">
        {/* Program Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Program Name
          </label>
          <input
            type="text"
            value={programName}
            onChange={(e) => setProgramName(e.target.value)}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
          />
        </div>

        {/* Repeat Count */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Repeat Cycles
          </label>
          <input
            type="number"
            min="1"
            value={repeatCount}
            onChange={(e) => setRepeatCount(parseInt(e.target.value) || 1)}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
          />
        </div>

        {/* Steps */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Steps
            </label>
            <button
              onClick={addStep}
              disabled={disabled}
              className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-md transition-colors disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              Add Step
            </button>
          </div>

          <div className="space-y-3">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
              >
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-8">
                  {index + 1}.
                </span>

                <select
                  value={step.state}
                  onChange={(e) =>
                    updateStep(step.id, { state: e.target.value as 'open' | 'closed' })
                  }
                  disabled={disabled}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed"
                >
                  <option value="open">OPEN</option>
                  <option value="closed">CLOSED</option>
                </select>

                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    value={step.durationMinutes}
                    onChange={(e) =>
                      updateStep(step.id, {
                        durationMinutes: parseInt(e.target.value) || 0,
                      })
                    }
                    disabled={disabled}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    minutes
                  </span>
                </div>

                {steps.length > 1 && (
                  <button
                    onClick={() => removeStep(step.id)}
                    disabled={disabled}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Duration Summary */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Duration per cycle:</span>
            <span className="font-medium">
              {totalDuration} min ({(totalDuration / 60).toFixed(1)} hours)
            </span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-1">
            <span>Total duration ({repeatCount}x):</span>
            <span className="font-medium">
              {totalDurationWithRepeats} min ({(totalDurationWithRepeats / 60).toFixed(1)}{' '}
              hours)
            </span>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartProgram}
          disabled={disabled}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-semibold rounded-md transition-colors disabled:cursor-not-allowed"
        >
          <Play className="w-5 h-5" />
          Start Program
        </button>
      </div>
    </div>
  );
}


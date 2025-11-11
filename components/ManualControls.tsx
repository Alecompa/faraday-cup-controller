'use client';

import { useState } from 'react';
import { Unlock, Lock, Loader2 } from 'lucide-react';

interface ManualControlsProps {
  onOpen: () => Promise<void>;
  onClose: () => Promise<void>;
  disabled?: boolean;
}

export default function ManualControls({
  onOpen,
  onClose,
  disabled = false,
}: ManualControlsProps) {
  const [loading, setLoading] = useState<'open' | 'close' | null>(null);

  const handleOpen = async () => {
    setLoading('open');
    try {
      await onOpen();
    } finally {
      setLoading(null);
    }
  };

  const handleClose = async () => {
    setLoading('close');
    try {
      await onClose();
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Manual Controls
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handleOpen}
          disabled={disabled || loading !== null}
          className="flex flex-col items-center justify-center gap-3 p-6 rounded-lg bg-green-500 hover:bg-green-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-semibold transition-colors duration-200 disabled:cursor-not-allowed"
        >
          {loading === 'open' ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : (
            <Unlock className="w-8 h-8" />
          )}
          <span>OPEN CUP</span>
        </button>

        <button
          onClick={handleClose}
          disabled={disabled || loading !== null}
          className="flex flex-col items-center justify-center gap-3 p-6 rounded-lg bg-red-500 hover:bg-red-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-semibold transition-colors duration-200 disabled:cursor-not-allowed"
        >
          {loading === 'close' ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : (
            <Lock className="w-8 h-8" />
          )}
          <span>CLOSE CUP</span>
        </button>
      </div>
    </div>
  );
}


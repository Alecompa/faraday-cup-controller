'use client';

import { useState, useEffect } from 'react';
import StatusDisplay from '@/components/StatusDisplay';
import ManualControls from '@/components/ManualControls';
import CycleProgrammer from '@/components/CycleProgrammer';
import CycleStatus from '@/components/CycleStatus';
import { CupState, CycleExecution, CycleProgram } from '@/lib/state';
import { Activity, Zap } from 'lucide-react';

interface SystemState {
  currentState: CupState;
  lastCommand: string | null;
  lastCommandTime: number | null;
  cycleExecution: CycleExecution | null;
}

export default function Home() {
  const [systemState, setSystemState] = useState<SystemState>({
    currentState: 'unknown',
    lastCommand: null,
    lastCommandTime: null,
    cycleExecution: null,
  });
  const [isConnected, setIsConnected] = useState(true);
  const [currentProgram, setCurrentProgram] = useState<CycleProgram | null>(null);
  const [debugMode, setDebugMode] = useState(false);

  // Check debug mode and initialize state on mount
  useEffect(() => {
    const initialize = async () => {
      // Check debug mode
      try {
        const response = await fetch('/api/debug');
        if (response.ok) {
          const data = await response.json();
          setDebugMode(data.debugMode);
        }
      } catch (error) {
        console.error('Failed to check debug mode:', error);
      }

      // Initialize relay state (polls actual device if not in debug mode)
      try {
        const initResponse = await fetch('/api/init', {
          method: 'POST',
        });
        if (initResponse.ok) {
          console.log('Relay state initialized');
        }
      } catch (error) {
        console.error('Failed to initialize relay state:', error);
      }
    };
    
    initialize();
  }, []);

  // Fetch status periodically
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/cup/status');
        if (response.ok) {
          const data = await response.json();
          setSystemState({
            currentState: data.currentState,
            lastCommand: data.lastCommand,
            lastCommandTime: data.lastCommandTime,
            cycleExecution: data.cycleExecution,
          });
          setIsConnected(true);
        } else {
          setIsConnected(false);
        }
      } catch (error) {
        console.error('Failed to fetch status:', error);
        setIsConnected(false);
      }
    };

    // Fetch immediately
    fetchStatus();

    // Then fetch every 2 seconds
    const interval = setInterval(fetchStatus, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleOpenCup = async () => {
    try {
      const response = await fetch('/api/cup/open', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to open cup');
      }
    } catch (error) {
      console.error('Error opening cup:', error);
      alert('Failed to open cup. Check console for details.');
    }
  };

  const handleCloseCup = async () => {
    try {
      const response = await fetch('/api/cup/close', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to close cup');
      }
    } catch (error) {
      console.error('Error closing cup:', error);
      alert('Failed to close cup. Check console for details.');
    }
  };

  const handleStartProgram = async (program: CycleProgram) => {
    try {
      setCurrentProgram(program);
      const response = await fetch('/api/cycle/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(program),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to start program');
      }
    } catch (error: any) {
      console.error('Error starting program:', error);
      alert(`Failed to start program: ${error.message}`);
      setCurrentProgram(null);
    }
  };

  const handlePauseCycle = async () => {
    try {
      const response = await fetch('/api/cycle/pause', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to pause cycle');
      }
    } catch (error) {
      console.error('Error pausing cycle:', error);
      alert('Failed to pause cycle. Check console for details.');
    }
  };

  const handleResumeCycle = async () => {
    if (!currentProgram) {
      alert('Cannot resume: program data not available');
      return;
    }

    try {
      const response = await fetch('/api/cycle/resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentProgram),
      });
      if (!response.ok) {
        throw new Error('Failed to resume cycle');
      }
    } catch (error) {
      console.error('Error resuming cycle:', error);
      alert('Failed to resume cycle. Check console for details.');
    }
  };

  const handleStopCycle = async () => {
    try {
      const response = await fetch('/api/cycle/stop', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to stop cycle');
      }
      setCurrentProgram(null);
    } catch (error) {
      console.error('Error stopping cycle:', error);
      alert('Failed to stop cycle. Check console for details.');
    }
  };

  const isCycleRunning = systemState.cycleExecution?.isRunning ?? false;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500 rounded-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Faraday Cup Controller
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Experiment Control Interface
                </p>
              </div>
            </div>
            {debugMode && (
              <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-lg">
                <Activity className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <div>
                  <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">
                    DEBUG MODE
                  </p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400">
                    Using simulated commands
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <StatusDisplay
              currentState={systemState.currentState}
              lastCommandTime={systemState.lastCommandTime}
              isConnected={isConnected}
            />

            <ManualControls
              onOpen={handleOpenCup}
              onClose={handleCloseCup}
              disabled={isCycleRunning}
            />

            <CycleStatus
              execution={systemState.cycleExecution}
              onPause={handlePauseCycle}
              onResume={handleResumeCycle}
              onStop={handleStopCycle}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <CycleProgrammer
              onStartProgram={handleStartProgram}
              disabled={isCycleRunning}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Faraday Cup Controller v1.0 - Experiment Control System</p>
      </footer>
    </main>
  );
}


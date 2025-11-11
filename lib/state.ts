// Server-side state management for Faraday Cup Controller
export type CupState = 'open' | 'closed' | 'unknown';

export interface CycleStep {
  id: string;
  state: CupState;
  durationMinutes: number;
}

export interface CycleProgram {
  id: string;
  name: string;
  steps: CycleStep[];
  repeat: number;
}

export interface CycleExecution {
  programId: string;
  programName: string;
  currentStep: number;
  currentRepeat: number;
  totalSteps: number;
  totalRepeats: number;
  startTime: number;
  nextActionTime: number;
  isRunning: boolean;
  isPaused: boolean;
  completedSteps: number;
}

interface StateData {
  currentState: CupState;
  lastCommand: string | null;
  lastCommandTime: number | null;
  cycleExecution: CycleExecution | null;
  history: Array<{
    state: CupState;
    timestamp: number;
    success: boolean;
    error?: string;
  }>;
}

// In-memory state (in production, you might want to use a database)
let state: StateData = {
  currentState: 'unknown',
  lastCommand: null,
  lastCommandTime: null,
  cycleExecution: null,
  history: [],
};

export function getState(): StateData {
  return { ...state };
}

export function updateState(newState: Partial<StateData>): void {
  state = { ...state, ...newState };
}

export function addToHistory(entry: StateData['history'][0]): void {
  state.history.push(entry);
  // Keep only last 100 entries
  if (state.history.length > 100) {
    state.history = state.history.slice(-100);
  }
}

export function clearHistory(): void {
  state.history = [];
}


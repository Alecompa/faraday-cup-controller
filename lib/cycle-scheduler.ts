// Cycle Scheduler - handles programmed sequences
import { CycleProgram, CycleExecution, getState, updateState, CupState } from './state';
import { sendCommand } from './faraday-controller';

let cycleTimeout: NodeJS.Timeout | null = null;

export function startCycleProgram(program: CycleProgram): { success: boolean; error?: string } {
  // Check if a cycle is already running
  const currentExecution = getState().cycleExecution;
  if (currentExecution?.isRunning) {
    return { success: false, error: 'A cycle program is already running' };
  }

  // Initialize cycle execution
  const execution: CycleExecution = {
    programId: program.id,
    programName: program.name,
    currentStep: 0,
    currentRepeat: 1,
    totalSteps: program.steps.length,
    totalRepeats: program.repeat,
    startTime: Date.now(),
    nextActionTime: Date.now(),
    isRunning: true,
    isPaused: false,
    completedSteps: 0,
  };

  updateState({ cycleExecution: execution });

  // Start executing the cycle
  executeCycleStep(program);

  return { success: true };
}

async function executeCycleStep(program: CycleProgram): Promise<void> {
  const state = getState();
  const execution = state.cycleExecution;

  if (!execution || !execution.isRunning || execution.isPaused) {
    return;
  }

  // Check if we've completed all repeats
  if (execution.currentRepeat > execution.totalRepeats) {
    stopCycleProgram();
    return;
  }

  // Get current step
  const stepIndex = execution.currentStep;
  if (stepIndex >= program.steps.length) {
    // Move to next repeat
    const newExecution: CycleExecution = {
      ...execution,
      currentStep: 0,
      currentRepeat: execution.currentRepeat + 1,
    };
    updateState({ cycleExecution: newExecution });
    
    // Check if we're done
    if (newExecution.currentRepeat > newExecution.totalRepeats) {
      stopCycleProgram();
      return;
    }
    
    // Continue with next repeat
    executeCycleStep(program);
    return;
  }

  const step = program.steps[stepIndex];

  // Send command
  const result = await sendCommand(step.state);

  if (!result.success) {
    console.error(`Failed to execute step: ${result.error}`);
    // Continue anyway (you might want to handle this differently)
  }

  // Update execution state
  const updatedExecution: CycleExecution = {
    ...execution,
    currentStep: stepIndex + 1,
    nextActionTime: Date.now() + step.durationMinutes * 60 * 1000,
    completedSteps: execution.completedSteps + 1,
  };
  updateState({ cycleExecution: updatedExecution });

  // Schedule next step
  if (step.durationMinutes > 0) {
    cycleTimeout = setTimeout(() => {
      executeCycleStep(program);
    }, step.durationMinutes * 60 * 1000);
  } else {
    // Execute immediately if duration is 0
    executeCycleStep(program);
  }
}

export function pauseCycleProgram(): { success: boolean; error?: string } {
  const execution = getState().cycleExecution;
  
  if (!execution) {
    return { success: false, error: 'No cycle program is running' };
  }

  if (execution.isPaused) {
    return { success: false, error: 'Cycle program is already paused' };
  }

  // Clear timeout
  if (cycleTimeout) {
    clearTimeout(cycleTimeout);
    cycleTimeout = null;
  }

  // Update state
  updateState({
    cycleExecution: {
      ...execution,
      isPaused: true,
    },
  });

  return { success: true };
}

export function resumeCycleProgram(program: CycleProgram): { success: boolean; error?: string } {
  const execution = getState().cycleExecution;
  
  if (!execution) {
    return { success: false, error: 'No cycle program is running' };
  }

  if (!execution.isPaused) {
    return { success: false, error: 'Cycle program is not paused' };
  }

  // Update state
  updateState({
    cycleExecution: {
      ...execution,
      isPaused: false,
    },
  });

  // Resume execution
  executeCycleStep(program);

  return { success: true };
}

export function stopCycleProgram(): void {
  // Clear timeout
  if (cycleTimeout) {
    clearTimeout(cycleTimeout);
    cycleTimeout = null;
  }

  // Clear execution state
  updateState({ cycleExecution: null });
}

export function getCycleStatus(): CycleExecution | null {
  return getState().cycleExecution;
}


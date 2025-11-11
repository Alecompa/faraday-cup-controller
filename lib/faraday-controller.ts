// Faraday Cup Controller - handles communication with the device
import axios from 'axios';
import { type CupState, getState, updateState, addToHistory } from './state';

export type { CupState };

const DEBUG_MODE = process.env.DEBUG_MODE === 'true';
const DEVICE_URL = process.env.DEVICE_URL || 'http://192.168.0.30';
const REQUEST_TIMEOUT = 10000; // 10 seconds

// Debug mode: simulate device responses without actual network calls
async function sendFakeCommand(state: CupState): Promise<{ success: boolean; error?: string }> {
  console.log(`[DEBUG MODE] Simulating command: ${state.toUpperCase()}`);
  
  // Simulate network delay (100-300ms)
  const delay = Math.random() * 200 + 100;
  await new Promise(resolve => setTimeout(resolve, delay));
  
  // 95% success rate in debug mode (occasionally simulate failures for testing)
  const shouldSucceed = Math.random() > 0.05;
  
  if (shouldSucceed) {
    updateState({
      currentState: state,
      lastCommand: state,
      lastCommandTime: Date.now(),
    });
    
    addToHistory({
      state,
      timestamp: Date.now(),
      success: true,
    });
    
    console.log(`[DEBUG MODE] ✅ Command ${state.toUpperCase()} successful`);
    return { success: true };
  } else {
    const error = 'Simulated error for testing';
    addToHistory({
      state,
      timestamp: Date.now(),
      success: false,
      error,
    });
    
    console.log(`[DEBUG MODE] ❌ Command ${state.toUpperCase()} failed (simulated)`);
    return { success: false, error };
  }
}

export async function sendCommand(state: CupState): Promise<{ success: boolean; error?: string }> {
  // Use fake commands in debug mode
  if (DEBUG_MODE) {
    return sendFakeCommand(state);
  }
  
  // Real device communication
  const url = state === 'open' ? `${DEVICE_URL}/on/1` : `${DEVICE_URL}/off/1`;
  
  try {
    const response = await axios.get(url, { timeout: REQUEST_TIMEOUT });
    
    if (response.status === 200) {
      updateState({
        currentState: state,
        lastCommand: state,
        lastCommandTime: Date.now(),
      });
      
      addToHistory({
        state,
        timestamp: Date.now(),
        success: true,
      });
      
      return { success: true };
    } else {
      const error = `Failed with status ${response.status}`;
      addToHistory({
        state,
        timestamp: Date.now(),
        success: false,
        error,
      });
      return { success: false, error };
    }
  } catch (error: any) {
    const errorMessage = error.message || 'Unknown error';
    addToHistory({
      state,
      timestamp: Date.now(),
      success: false,
      error: errorMessage,
    });
    return { success: false, error: errorMessage };
  }
}

export async function openCup(): Promise<{ success: boolean; error?: string }> {
  return sendCommand('open');
}

export async function closeCup(): Promise<{ success: boolean; error?: string }> {
  return sendCommand('closed');
}

export function getCurrentState(): CupState {
  return getState().currentState;
}

export function isDebugMode(): boolean {
  return DEBUG_MODE;
}

// Poll the actual relay state from the device
export async function pollRelayState(channel: number = 1): Promise<{ success: boolean; state?: CupState; error?: string }> {
  // In debug mode, return current state without polling
  if (DEBUG_MODE) {
    console.log('[DEBUG MODE] Skipping relay state poll (using simulated state)');
    return { success: true, state: getState().currentState };
  }

  const url = `${DEVICE_URL}/state/${channel}`;
  
  try {
    const response = await axios.get(url, { timeout: REQUEST_TIMEOUT });
    
    if (response.status === 200) {
      // The relay returns a bitmask where each bit represents a channel
      // For channel 1: 0 = off/closed, 1 = on/open
      const stateBitmask = response.data.return_value || response.data;
      const channelMask = 1 << (channel - 1); // Bit position for this channel
      const isOn = (stateBitmask & channelMask) !== 0;
      
      const state: CupState = isOn ? 'open' : 'closed';
      
      // Update the state if it changed
      const currentState = getState().currentState;
      if (currentState !== state) {
        console.log(`[POLL] Relay state changed: ${currentState} → ${state}`);
        updateState({
          currentState: state,
          lastCommand: state,
          lastCommandTime: Date.now(),
        });
      }
      
      return { success: true, state };
    } else {
      const error = `Failed to poll state: ${response.status}`;
      console.error(error);
      return { success: false, error };
    }
  } catch (error: any) {
    const errorMessage = error.message || 'Unknown error polling relay';
    console.error(`[POLL ERROR] ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
}

// Initialize the state by polling the relay
export async function initializeState(channel: number = 1): Promise<void> {
  console.log('[INIT] Initializing relay state...');
  const result = await pollRelayState(channel);
  
  if (result.success && result.state) {
    console.log(`[INIT] Initial relay state: ${result.state}`);
  } else {
    console.log('[INIT] Could not determine initial state, defaulting to unknown');
    updateState({ currentState: 'unknown' });
  }
}

// Start periodic polling (call this once on server startup)
let pollingInterval: NodeJS.Timeout | null = null;

export function startStatePolling(intervalMs: number = 10000, channel: number = 1): void {
  if (pollingInterval) {
    console.log('[POLL] Stopping existing polling interval');
    stopStatePolling();
  }
  
  if (DEBUG_MODE) {
    console.log('[DEBUG MODE] State polling disabled (using simulated state)');
    return;
  }
  
  console.log(`[POLL] Starting state polling every ${intervalMs}ms`);
  
  // Poll immediately
  pollRelayState(channel);
  
  // Then poll periodically
  pollingInterval = setInterval(() => {
    pollRelayState(channel);
  }, intervalMs);
}

export function stopStatePolling(): void {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
    console.log('[POLL] State polling stopped');
  }
}


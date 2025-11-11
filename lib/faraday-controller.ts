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


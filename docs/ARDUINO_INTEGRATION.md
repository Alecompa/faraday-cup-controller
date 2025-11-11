# Arduino Relay Integration

## Overview

The Faraday Cup Controller interfaces with an Arduino-based relay controller via Ethernet. The Arduino runs the `RelayServer.ino` sketch which exposes a REST API for controlling and monitoring the relay.

## Arduino Hardware Setup

### Components
- Arduino board (e.g., Arduino Uno)
- Ethernet Shield
- Multi-Channel Relay Module (I2C address: 0x11)
- Relay controls Faraday Cup mechanism

### Network Configuration
- **MAC Address**: `2C:F7:F1:08:36:DC`
- **IP Address**: `192.168.0.30` (DHCP)
- **Port**: 80 (HTTP)

## REST API Endpoints

The Arduino exposes the following endpoints via the aREST library:

### 1. Get Channel State
```
GET http://192.168.0.30/state/1
```

**Response:**
```json
{
  "return_value": <bitmask>,
  "id": "arduino",
  "name": "relay",
  "connected": true
}
```

The `return_value` is a bitmask where each bit represents a channel:
- Channel 1 (Faraday Cup): Bit 0 (value & 1)
  - `0` = OFF (Closed)
  - `1` = ON (Open)

### 2. Turn Channel On (Open Cup)
```
GET http://192.168.0.30/on/1
```

Opens the Faraday Cup by turning relay channel 1 ON.

**Response:**
```json
{
  "return_value": <bitmask>,
  "id": "arduino",
  "name": "relay",
  "connected": true
}
```

### 3. Turn Channel Off (Close Cup)
```
GET http://192.168.0.30/off/1
```

Closes the Faraday Cup by turning relay channel 1 OFF.

**Response:**
```json
{
  "return_value": <bitmask>,
  "id": "arduino",
  "name": "relay",
  "connected": true
}
```

## Web Application Integration

### State Polling

The web application now includes automatic state polling:

1. **Initialization** (`/api/init`):
   - Called when the app first loads
   - Polls the Arduino to get the current relay state
   - Sets the initial state (open/closed/unknown)

2. **Periodic Polling**:
   - Polls the Arduino every 10 seconds
   - Detects if the relay state changed externally
   - Updates the UI automatically

3. **Debug Mode**:
   - When `DEBUG_MODE=true`, polling is disabled
   - Uses simulated state instead

### State Detection

The polling system reads the relay bitmask:

```typescript
// Channel 1 mask (bit 0)
const channelMask = 1 << (channel - 1); // = 1 for channel 1
const isOn = (stateBitmask & channelMask) !== 0;
const state = isOn ? 'open' : 'closed';
```

### Logging

Console logs show polling activity:

```
[INIT] Initializing relay state...
[INIT] Initial relay state: closed
[POLL] Starting state polling every 10000ms
[POLL] Relay state changed: closed → open
```

## Configuration

### Device URL

Configure in `lib/faraday-controller.ts`:

```typescript
const DEVICE_URL = process.env.DEVICE_URL || 'http://192.168.0.30';
```

Or via environment variable:

```bash
DEVICE_URL=http://192.168.0.30 npm run dev
```

### Polling Interval

Default: 10 seconds (10000ms)

To change, modify in `app/api/init/route.ts`:

```typescript
startStatePolling(5000); // Poll every 5 seconds
```

### Channel Number

Default: Channel 1

To use a different channel, modify the calls in:
- `app/api/init/route.ts`
- `app/api/poll/route.ts`

```typescript
await initializeState(2); // Use channel 2
```

## API Endpoints (Web App)

### Initialize State
```
POST /api/init
```

Initializes relay state and starts periodic polling.

**Response:**
```json
{
  "success": true,
  "message": "State initialized and polling started"
}
```

### Manual Poll
```
GET /api/poll
```

Manually polls the relay state (useful for debugging).

**Response:**
```json
{
  "success": true,
  "state": "open"
}
```

## Troubleshooting

### Connection Issues

**Problem**: Cannot connect to Arduino
**Solutions**:
1. Verify Arduino is powered on
2. Check Ethernet cable connection
3. Ping the device: `ping 192.168.0.30`
4. Check Arduino serial monitor for IP address
5. Verify network firewall settings

### State Not Updating

**Problem**: UI shows "unknown" or incorrect state
**Solutions**:
1. Check browser console for polling errors
2. Verify `/api/poll` endpoint returns correct state
3. Check Arduino serial monitor for relay commands
4. Manually test Arduino endpoints with curl:
   ```bash
   curl http://192.168.0.30/state/1
   ```

### Polling Too Frequent

**Problem**: Too many requests to Arduino
**Solution**: Increase polling interval in `app/api/init/route.ts`

### Debug Mode Confusion

**Problem**: Polling not working in debug mode
**Expected**: Polling is intentionally disabled in debug mode
**Solution**: Set `DEBUG_MODE=false` to enable real device polling

## Testing

### Test Arduino Endpoints

```bash
# Get current state
curl http://192.168.0.30/state/1

# Open cup
curl http://192.168.0.30/on/1

# Close cup
curl http://192.168.0.30/off/1
```

### Test Web App Endpoints

```bash
# Initialize state
curl -X POST http://localhost:3000/api/init

# Manual poll
curl http://localhost:3000/api/poll

# Get system status
curl http://localhost:3000/api/cup/status
```

## Arduino Code Notes

### Relay Library Functions

From `RelayServer.ino`:

```cpp
// Get state bitmask of all channels
int getChannelState(String params) {
  return relay.getChannelState();
}

// Turn channel on (1-4)
int setChannelOn(String params) {
  const int channel = params.toInt();
  relay.turn_on_channel(channel);
  return relay.getChannelState();
}

// Turn channel off (1-4)
int setChannelOff(String params) {
  const int channel = params.toInt();
  relay.turn_off_channel(channel);
  return relay.getChannelState();
}
```

### Important Notes

1. **Channel validation** is only implemented for `off` command (lines 98-101)
2. Channel numbers are 1-based (1, 2, 3, 4)
3. The relay module supports up to 4 channels
4. State is returned as a bitmask after each command

## Future Enhancements

Potential improvements:

1. **Add channel validation** to `setChannelOn` function
2. **Multiple channel support** in web interface
3. **WebSocket updates** for real-time state changes
4. **State history** tracking in database
5. **Alert system** for unexpected state changes
6. **Retry logic** for failed polling attempts

## References

- Arduino aREST Library: https://github.com/marcoschwartz/aREST
- Multi-Channel Relay: https://wiki.seeedstudio.com/Grove-4-Channel_SPDT_Relay/
- Ethernet Shield: https://www.arduino.cc/en/Main/ArduinoEthernetShield

---

**Last Updated**: November 11, 2025
**Arduino Firmware Version**: Check serial output on startup


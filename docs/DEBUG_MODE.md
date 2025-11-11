# Debug Mode Guide

## What is Debug Mode?

Debug mode allows you to test the Faraday Cup Controller **without needing the actual device**. It simulates all device commands with fake responses, perfect for:

- 🧪 Testing the interface
- 🔄 Trying out cycle programs
- 🎓 Learning how the system works
- 🐛 Debugging issues without hardware

## How It Works

When debug mode is enabled:
- ✅ All commands are simulated (no network calls to the device)
- ✅ Commands complete in 100-300ms (simulated network delay)
- ✅ 95% success rate (occasionally fails to test error handling)
- ✅ Console logs show "[DEBUG MODE]" prefix
- ✅ Yellow "DEBUG MODE" badge appears in the header

## Enabling/Disabling Debug Mode

### Option 1: Environment Variable (Recommended)

Edit `.env.development`:
```bash
# Enable debug mode
DEBUG_MODE=true

# Disable debug mode (use real device)
DEBUG_MODE=false
```

Then restart the server.

### Option 2: Different Files for Different Environments

The project includes:
- `.env.development` - Used with `npm run dev` (default: DEBUG_MODE=true)
- `.env.production` - Used with `npm run build && npm start` (default: DEBUG_MODE=false)

## Current Status

🟢 **Debug Mode is ENABLED**

You can now test the application without the actual Faraday cup device!

## Testing with Debug Mode

### Quick Test (Manual Controls)

1. Start the server: `npm run dev`
2. Open http://localhost:3000
3. Look for the yellow "DEBUG MODE" badge in the header
4. Click "OPEN CUP" - watch it simulate opening
5. Click "CLOSE CUP" - watch it simulate closing
6. Check browser console for "[DEBUG MODE]" logs

### Test a Fast Cycle

1. In Cycle Programmer:
   - Program Name: "Test Cycle"
   - Repeat Cycles: 2
   - Step 1: OPEN for 0.5 minutes (30 seconds)
   - Step 2: CLOSED for 0.5 minutes (30 seconds)
2. Click "Start Program"
3. Watch the cycle execute in real-time!
4. Total duration: 2 minutes

### Test Pause/Resume/Stop

1. Start a cycle program
2. Wait for it to begin
3. Click "Pause" - watch it pause
4. Click "Resume" - watch it continue
5. Click "Stop" - watch it stop completely

## Console Output

When debug mode is active, you'll see logs like:

```
[DEBUG MODE] Simulating command: OPEN
[DEBUG MODE] ✅ Command OPEN successful

[DEBUG MODE] Simulating command: CLOSED
[DEBUG MODE] ✅ Command CLOSED successful

[DEBUG MODE] Simulating command: OPEN
[DEBUG MODE] ❌ Command OPEN failed (simulated)
```

## Switching to Real Device

When you're ready to use the actual device:

1. Edit `.env.development`:
   ```bash
   DEBUG_MODE=false
   DEVICE_URL=http://192.168.0.30  # Or your device's IP
   ```

2. Restart the server:
   ```bash
   # Press Ctrl+C to stop
   npm run dev
   ```

3. The yellow "DEBUG MODE" badge will disappear
4. Commands will now be sent to the real device

## Visual Indicator

When debug mode is active, you'll see this banner in the header:

```
┌─────────────────────┐
│ ⚠️  DEBUG MODE      │
│ Using simulated     │
│ commands            │
└─────────────────────┘
```

## Advantages of Debug Mode

- ✅ No hardware required
- ✅ Instant testing
- ✅ Safe experimentation
- ✅ Fast development
- ✅ Error simulation
- ✅ Consistent behavior

## Tips

1. **Always use debug mode first** when testing new features
2. **Test with short durations** (0.1-1 minute) for fast feedback
3. **Watch the console** for detailed debug logs
4. **Test error handling** (5% of commands fail randomly)
5. **Switch to real device** only when ready for actual experiments

## Troubleshooting

**Q: I don't see the "DEBUG MODE" badge**
- Check `.env.development` has `DEBUG_MODE=true`
- Restart the dev server
- Clear browser cache and refresh

**Q: Commands are failing**
- This is normal! Debug mode simulates 5% failure rate
- Try the command again
- Check console for "[DEBUG MODE] ❌" messages

**Q: How do I know if it's using the real device?**
- No "DEBUG MODE" badge = real device
- Console logs won't have "[DEBUG MODE]" prefix
- Commands take actual network time (not simulated)

---

**Current Configuration**: Debug mode is **ENABLED** ✅

Ready to test! 🚀


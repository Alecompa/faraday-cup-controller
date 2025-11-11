# 🚀 Faraday Cup Controller - Quick Start with Debug Mode

## ✅ Server is Running!

Your development server is now running with **DEBUG MODE ENABLED**.

## 🌐 Access the Application

Open your web browser and navigate to:

### **http://localhost:3000**

## 🎯 What is Debug Mode?

Debug mode allows you to test the entire application **without the actual Faraday cup device**!

### Features:
- ✅ All commands are simulated (no real device needed)
- ✅ Fast responses (100-300ms simulated delay)
- ✅ 95% success rate (occasional failures to test error handling)
- ✅ Yellow "DEBUG MODE" badge visible in the header
- ✅ Console logs show [DEBUG MODE] prefix

## 🧪 Quick Test Instructions

### 1. Manual Control Test
1. Open http://localhost:3000
2. Look for the yellow **"DEBUG MODE"** badge in the header
3. Click the green **"OPEN CUP"** button
4. Wait a moment - the status will update to OPEN
5. Click the red **"CLOSE CUP"** button
6. Status will update to CLOSED

### 2. Fast Cycle Test (Recommended!)
1. In the **Cycle Programmer** section (right side):
   - Program Name: "Quick Test"
   - Repeat Cycles: **2**
   - Step 1: **OPEN** for **0.5** minutes (30 seconds)
   - Step 2: **CLOSED** for **0.5** minutes (30 seconds)
2. Click **"Start Program"**
3. Watch the **Cycle Status** panel appear (left side)
4. Observe:
   - Progress bar filling up
   - Countdown timer
   - Current step and repeat numbers
5. Try the controls:
   - Click **"Pause"** to pause
   - Click **"Resume"** to continue
   - Click **"Stop"** to stop completely

**Total test duration: 2 minutes!** ⏱️

### 3. Watch the Console
Open your browser's Developer Tools (F12) and check the Console tab:

```
[DEBUG MODE] Simulating command: OPEN
[DEBUG MODE] ✅ Command OPEN successful
[DEBUG MODE] Simulating command: CLOSED
[DEBUG MODE] ✅ Command CLOSED successful
```

## 📊 What You'll See

```
┌─────────────────────────────────────────────────────┐
│ ⚡ Faraday Cup Controller    ⚠️ DEBUG MODE          │
│    Experiment Control Interface  Using simulated    │
└─────────────────────────────────────────────────────┘

Left Side:                       Right Side:
├─ System Status                 ├─ Cycle Programmer
│  • Current State: OPEN          │  • Program Name
│  • Connection: ✓ OK            │  • Repeat Cycles
│  • Last Command: 10s ago       │  • Step Configuration
│                                 │  • [Start Program]
├─ Manual Controls               │
│  [OPEN CUP] [CLOSE CUP]        │
│                                 │
└─ Cycle Status (when running)   │
   • Progress: [████████▒] 80%   │
   • Step: 2/2, Repeat: 4/5      │
   • Next in: 12m 34s             │
   • [Pause] [Stop]               │
```

## 🔧 Scripts Available

### Debug Mode (Current)
```bash
npm run dev
# Server runs with simulated commands
```

### Real Device Mode
```bash
npm run dev:real
# Server connects to actual device at 192.168.0.30
```

## 🎨 Features to Try

### ✅ Status Monitoring
- Real-time updates every 2 seconds
- Color-coded states (green=open, red=closed)
- Connection status indicator

### ✅ Manual Controls
- One-click open/close
- Loading indicators
- Instant feedback

### ✅ Cycle Programming
- Custom program names
- Multiple steps with different durations
- Add/remove steps dynamically
- Configurable repeat counts
- Duration preview in minutes and hours

### ✅ Cycle Execution
- Visual progress bar
- Countdown to next action
- Step and repeat tracking
- Pause/resume/stop controls
- Running time display

## 🛑 Stopping the Server

To stop the development server:
1. Go to the terminal where it's running
2. Press **Ctrl+C**

## 📝 Next Steps

### For Testing
1. ✅ Try different cycle programs
2. ✅ Test pause/resume/stop
3. ✅ Try very short durations (0.1 minutes) for fast testing
4. ✅ Watch the console logs

### For Production Use
1. When ready to use the real device, edit `package.json`:
   ```json
   "dev": "DEBUG_MODE=false DEVICE_URL=http://YOUR_DEVICE_IP next dev"
   ```
2. Or use: `npm run dev:real`
3. Verify device connectivity first
4. The yellow DEBUG MODE badge will disappear

## 📚 Documentation

- **README.md** - Complete documentation
- **QUICKSTART.md** - Getting started guide
- **FEATURES.md** - Detailed feature list
- **DEBUG_MODE.md** - Debug mode details
- **PROJECT_SUMMARY.md** - Project overview

## 🆘 Troubleshooting

**Page not loading?**
- Wait 10-15 seconds for initial compilation
- Refresh the browser
- Check terminal for errors

**Don't see DEBUG MODE badge?**
- Environment variable might not be set
- Check the script in `package.json`
- Restart the server

**Commands not working?**
- Check browser console for errors
- Look for [DEBUG MODE] logs
- Verify the server is running

## 🎉 You're All Set!

The application is ready to use in debug mode. No actual hardware required!

**Open http://localhost:3000 and start testing!** 🚀

---

**Server Status**: ✅ RUNNING
**Mode**: 🟡 DEBUG (Simulated Commands)
**Port**: 3000
**URL**: http://localhost:3000


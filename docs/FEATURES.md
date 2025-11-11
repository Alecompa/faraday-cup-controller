# Faraday Cup Controller - Features Overview

## 🎯 Core Features

### 1. Real-Time Status Monitoring

**Location**: Top-left panel

**Displays**:
- Current state of the Faraday cup (OPEN/CLOSED/UNKNOWN)
- Visual indicator with color coding:
  - 🟢 Green = OPEN
  - 🔴 Red = CLOSED
  - ⚫ Gray = UNKNOWN
- Connection status to the device
- Time since last command was sent

**Updates**: Automatically every 2 seconds

---

### 2. Manual Control Interface

**Location**: Middle-left panel

**Controls**:
- **OPEN CUP** button (green)
  - Sends command to open the Faraday cup
  - Shows loading spinner during execution
  - Disabled when a cycle is running

- **CLOSE CUP** button (red)
  - Sends command to close the Faraday cup
  - Shows loading spinner during execution
  - Disabled when a cycle is running

**Safety**: Manual controls are automatically disabled during automated cycles

---

### 3. Cycle Programmer

**Location**: Right panel

**Configuration Options**:

#### Program Settings
- **Program Name**: Custom name for your cycle sequence
- **Repeat Cycles**: Number of times to repeat the entire sequence (1-999+)

#### Step Configuration
Each step includes:
- **State**: OPEN or CLOSED
- **Duration**: Time in minutes (0 for immediate execution)
- **Actions**:
  - ➕ Add new steps
  - 🗑️ Remove steps (minimum 1 step required)

#### Helpful Displays
- Duration per single cycle
- Total duration including all repeats
- Automatic time conversion (minutes → hours)

#### Example Configurations

**Hourly Alternating (Original Script)**:
```
Step 1: OPEN for 60 minutes
Step 2: CLOSED for 60 minutes
Repeat: 4 times
Total: 8 hours
```

**Fast Testing**:
```
Step 1: OPEN for 1 minute
Step 2: CLOSED for 1 minute
Repeat: 3 times
Total: 6 minutes
```

**Custom Complex Sequence**:
```
Step 1: OPEN for 30 minutes
Step 2: CLOSED for 15 minutes
Step 3: OPEN for 45 minutes
Step 4: CLOSED for 30 minutes
Repeat: 2 times
Total: 4 hours
```

---

### 4. Cycle Execution Monitor

**Location**: Bottom-left panel (appears when cycle is running)

**Real-Time Information**:

#### Progress Tracking
- Visual progress bar (0-100%)
- Current repeat number (e.g., 2/4)
- Current step within repeat (e.g., 1/2)
- Total completed steps

#### Timing Information
- ⏱️ Countdown to next action (minutes:seconds)
- Total running time
- Program start time

#### Status Indicators
- 🟢 Running (actively executing)
- ⏸️ Paused (waiting for resume)

#### Control Buttons
- **PAUSE**: Temporarily pause execution
  - Current step completes first
  - Countdown timer freezes
  
- **RESUME**: Continue from where paused
  - Resumes countdown timer
  - Continues with next step

- **STOP**: Completely stop the cycle
  - Cannot be resumed
  - Returns to idle state

---

## 🎨 User Interface Features

### Visual Design
- **Modern Gradient Background**: Subtle gray gradient
- **Card-Based Layout**: Clean, organized panels
- **Color-Coded Status**: Instant visual feedback
- **Professional Icons**: Using Lucide React icon library
- **Responsive Grid**: Adapts to different screen sizes

### Dark Mode Support
- Automatically detects system preference
- Seamless light/dark theme switching
- Optimized contrast for readability
- Custom scrollbar styling

### Interactive Elements
- Hover effects on buttons
- Loading spinners for async operations
- Smooth transitions and animations
- Disabled state styling

### Typography
- Clear hierarchy with font sizes
- Consistent spacing
- Easy-to-read fonts
- Monospace for timing displays

---

## 🔧 Technical Features

### Backend Architecture

#### State Management
- Server-side state tracking
- Maintains current cup state
- Stores last 100 command history entries
- Tracks active cycle execution

#### API Endpoints
```
POST /api/cup/open        - Open cup
POST /api/cup/close       - Close cup
GET  /api/cup/status      - Get current status
POST /api/cycle/start     - Start cycle program
POST /api/cycle/pause     - Pause cycle
POST /api/cycle/resume    - Resume cycle
POST /api/cycle/stop      - Stop cycle
```

#### Cycle Scheduler
- Non-blocking execution
- Accurate timing with setTimeout
- Pause/resume support
- Multi-repeat handling
- Automatic cleanup on completion

### Frontend Architecture

#### React Components
- **StatusDisplay**: Real-time system status
- **ManualControls**: Direct cup control
- **CycleProgrammer**: Program creation interface
- **CycleStatus**: Execution monitoring
- **HistoryDisplay**: Command history (bonus feature)

#### State Management
- React hooks for local state
- Polling for server sync (2-second interval)
- Optimistic UI updates

#### TypeScript
- Full type safety
- Shared types across frontend/backend
- IntelliSense support

---

## 🚀 Advanced Features

### Error Handling
- Network error detection
- Failed command retry feedback
- Connection status monitoring
- User-friendly error messages

### Safety Features
- Mutual exclusion (manual controls disabled during cycles)
- Validation of cycle programs
- Confirmation of state changes
- Timeout protection (10-second HTTP timeout)

### Flexibility
- Configurable step durations (0 to unlimited minutes)
- Unlimited steps per program
- Unlimited repeat count
- Custom program names

### Development Features
- Hot module replacement
- TypeScript autocomplete
- Linting support
- Development/production builds

---

## 📊 Comparison with Original Python Script

| Feature | Python Script | Web Interface |
|---------|--------------|---------------|
| Control Interface | Terminal commands | Beautiful web UI |
| Timing | Fixed 1 hour | Customizable per step |
| Monitoring | Terminal output | Real-time dashboard |
| Flexibility | Hard-coded cycles | Dynamic programming |
| Multi-user | Single session | Web-accessible |
| Pause/Resume | Not available | Fully supported |
| Progress Tracking | Basic console | Visual progress bar |
| Remote Access | No | Yes (via browser) |
| State Persistence | No | Server-side tracking |

---

## 🔮 Future Enhancement Ideas

**Not yet implemented, but could be added**:

1. **Database Integration**: Persistent state across restarts
2. **User Authentication**: Multi-user access control
3. **Schedule Planning**: Start cycles at specific times
4. **Email Notifications**: Alerts when cycles complete
5. **Data Logging**: Export cycle history to CSV
6. **Multiple Devices**: Control several Faraday cups
7. **WebSocket Updates**: Real-time updates without polling
8. **Mobile App**: Native iOS/Android applications
9. **Graph Visualization**: Timeline view of cycles
10. **Preset Programs**: Save and load favorite configurations

---

## 💡 Usage Tips

1. **Testing**: Start with short durations (1-2 minutes) to test your setup
2. **Long Cycles**: For overnight experiments, verify device connectivity first
3. **Monitoring**: Keep the browser tab open to see real-time updates
4. **Network**: Ensure stable network connection for reliable operation
5. **Safety**: Always verify the cup state before starting experiments

---

## 🎓 Learning Resources

**Next.js**: [nextjs.org](https://nextjs.org)
**React**: [react.dev](https://react.dev)
**TypeScript**: [typescriptlang.org](https://www.typescriptlang.org)
**Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)

---

Enjoy your enhanced Faraday Cup control experience! 🎉


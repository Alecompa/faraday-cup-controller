# Faraday Cup Controller

A modern, web-based interface for controlling Faraday Cup experiments. Built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 🎛️ **Manual Control**: Open and close the Faraday cup with simple button controls
- 🔄 **Cycle Programming**: Create custom cycle programs with multiple steps and configurable timings
- 📊 **Real-time Status**: Monitor the current state of the Faraday cup and system connectivity
- ⏱️ **Cycle Execution**: Track cycle progress with detailed timing information
- 📝 **Command History**: View the history of all commands sent to the device
- 🌓 **Dark Mode**: Automatic dark mode support based on system preferences
- 💻 **Responsive Design**: Beautiful UI that works on desktop and mobile devices

## Prerequisites

- Node.js 18.x or later
- npm or yarn
- Access to the Faraday cup device (default: `http://192.168.0.30`)

## Installation

1. Clone or navigate to the project directory:

```bash
cd faraday-cup-controller
```

2. Install dependencies:

```bash
npm install
```

## Configuration

The device URL is configured in `lib/faraday-controller.ts`. By default, it's set to:

```typescript
const DEVICE_URL = 'http://192.168.0.30';
```

To change this, edit the `DEVICE_URL` constant in that file.

## Running the Application

### Development Mode

Start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Production Mode

Build and start the production server:

```bash
npm run build
npm start
```

## Usage

### Manual Controls

1. **Open Cup**: Click the green "OPEN CUP" button to send an open command
2. **Close Cup**: Click the red "CLOSE CUP" button to send a close command

Manual controls are disabled when a cycle program is running.

### Cycle Programming

1. **Program Name**: Give your cycle program a descriptive name
2. **Repeat Cycles**: Set how many times the entire sequence should repeat
3. **Configure Steps**:
   - Choose the state (OPEN or CLOSED) for each step
   - Set the duration in minutes for each step
   - Add or remove steps as needed
4. **Start Program**: Click "Start Program" to begin execution

The cycle programmer displays:
- Duration per cycle
- Total duration (accounting for repeats)

### Cycle Execution

While a cycle is running, you can:

- **Pause**: Temporarily pause the cycle (the current step will complete first)
- **Resume**: Continue a paused cycle
- **Stop**: Completely stop the cycle program

The cycle status display shows:
- Current progress percentage
- Current repeat number and step number
- Total completed steps
- Time until next action
- Running time since start

### System Status

The status display shows:
- Current state of the Faraday cup (OPEN, CLOSED, or UNKNOWN)
- Connection status to the device
- Time since last command

## API Endpoints

The application provides the following REST API endpoints:

- `POST /api/cup/open` - Open the Faraday cup
- `POST /api/cup/close` - Close the Faraday cup
- `GET /api/cup/status` - Get current system status
- `POST /api/cycle/start` - Start a cycle program (requires JSON body with program)
- `POST /api/cycle/pause` - Pause the running cycle
- `POST /api/cycle/resume` - Resume a paused cycle (requires JSON body with program)
- `POST /api/cycle/stop` - Stop the running cycle

## Project Structure

```
faraday-cup-controller/
├── app/
│   ├── api/              # API routes
│   │   ├── cup/          # Cup control endpoints
│   │   └── cycle/        # Cycle control endpoints
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main page
├── components/           # React components
│   ├── CycleProgrammer.tsx
│   ├── CycleStatus.tsx
│   ├── HistoryDisplay.tsx
│   ├── ManualControls.tsx
│   └── StatusDisplay.tsx
├── lib/                  # Core logic
│   ├── cycle-scheduler.ts   # Cycle execution logic
│   ├── faraday-controller.ts # Device communication
│   └── state.ts          # State management
└── controller.py         # Original Python script (for reference)
```

## Technical Details

### State Management

The application uses server-side in-memory state management. Key features:

- Tracks current cup state and command history
- Manages cycle execution state
- Stores up to 100 historical entries

**Note**: State is lost when the server restarts. For production use, consider implementing persistent storage (e.g., database).

### Cycle Scheduler

The cycle scheduler:
- Executes steps sequentially with configurable delays
- Supports pause/resume functionality
- Tracks progress through multiple repeats
- Automatically stops when all cycles complete

### Real-time Updates

The frontend polls the server every 2 seconds to update the UI with the latest status information.

## Migration from Python Script

The original Python script (`controller.py`) has been fully integrated into this web application:

- **URL Configuration**: Same device URLs (`/on/1` and `/off/1`)
- **Cycle Logic**: Enhanced with more flexibility
- **Timing**: Configurable per-step instead of fixed 1-hour intervals
- **Monitoring**: Real-time status updates and progress tracking

## Troubleshooting

### Cannot Connect to Device

- Verify the device is accessible at the configured URL
- Check network connectivity
- Ensure the device is powered on and responding

### Cycle Not Starting

- Ensure no other cycle is already running
- Check that all step durations are valid numbers
- Verify at least one step is configured

### Page Not Loading

- Ensure all dependencies are installed (`npm install`)
- Check that no other service is using port 3000
- Review browser console for errors

## Development

To modify the application:

1. **Add new features**: Create components in `components/`
2. **Modify API**: Edit routes in `app/api/`
3. **Update logic**: Modify files in `lib/`
4. **Styling**: Use Tailwind CSS classes or edit `app/globals.css`

## License

This project is provided as-is for experimental control purposes.

## Support

For issues or questions, please refer to the project documentation or contact your system administrator.


# Quick Start Guide

Get up and running with the Faraday Cup Controller in 3 easy steps!

## Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Axios for HTTP requests
- date-fns for date formatting
- lucide-react for beautiful icons

## Step 2: Start the Development Server

```bash
npm run dev
```

The server will start on [http://localhost:3000](http://localhost:3000)

## Step 3: Open in Your Browser

Navigate to [http://localhost:3000](http://localhost:3000) and you'll see:

- **Status Display**: Shows current state of the Faraday cup
- **Manual Controls**: Open/Close buttons for immediate control
- **Cycle Programmer**: Create and run automated sequences
- **Cycle Status**: Monitor running cycles in real-time

## Your First Cycle Program

1. In the **Cycle Programmer** section:
   - Keep the default "My Program" name (or change it)
   - Set "Repeat Cycles" to 1
   - Configure the steps:
     - Step 1: OPEN for 60 minutes
     - Step 2: CLOSED for 60 minutes

2. Click **"Start Program"**

3. Watch the progress in the **Cycle Status** section!

## Manual Control

Want to quickly test the system?

1. Click the green **"OPEN CUP"** button
2. Wait a few seconds
3. Click the red **"CLOSE CUP"** button

The status will update automatically!

## Tips

- ✅ Manual controls are disabled when a cycle is running
- ✅ You can pause/resume cycles at any time
- ✅ The interface updates every 2 seconds automatically
- ✅ All durations are in minutes (can be 0 for immediate execution)
- ✅ Dark mode is supported automatically based on your system preferences

## Configuration

To change the device URL, edit `lib/faraday-controller.ts`:

```typescript
const DEVICE_URL = 'http://192.168.0.30';  // Change this
```

## Production Deployment

When ready for production:

```bash
npm run build
npm start
```

This will create an optimized build and run it on port 3000.

## Troubleshooting

**Can't connect to device?**
- Check that the device is powered on
- Verify the IP address is correct
- Ensure you're on the same network

**Port 3000 already in use?**
- Stop other services using port 3000
- Or change the port: `PORT=3001 npm run dev`

**Need help?**
- Check the full README.md for detailed documentation
- Review the browser console for error messages
- Check the terminal output for server errors

Enjoy controlling your Faraday Cup! ⚡


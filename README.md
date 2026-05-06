# HabitTracker

A minimalistic habit tracking application built with **React Native** and **Expo**. This app helps you build consistency by tracking your daily habits with a sleek, native interface and persistent local storage.

## Features

- **Daily Habit Tracking**: Easily view and toggle habits for the current day.
- **SQLite Persistence**: All your habits and completions are stored locally using `expo-sqlite`, ensuring your data stays on your device.
- **Smart Reminders**: Set custom reminder times for each habit to keep you on track.
- **Heatmap Visualization**: Track your long-term consistency with an integrated contribution-style heatmap.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Expo Go](https://expo.dev/go) app on your iOS or Android device (for development)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/snehachetani/habit-tracker.git
   cd habit-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

Start the Expo development server:

```bash
npx expo start
```

- **Mobile**: Scan the QR code with your camera (iOS) or Expo Go app (Android).
- **iOS Simulator**: Press `i`.
- **Android Emulator**: Press `a`.

## Tech Stack

- **Framework**: [Expo](https://expo.dev/) (React Native)
- **Navigation**: Expo Router (File-based)
- **Database**: `expo-sqlite`
- **Icons**: `lucide-react-native`, `MaterialCommunityIcons`
- **Animations**: `react-native-reanimated`

## Project Structure

- `app/`: Contains the main application routes and layouts.
- `components/`: Reusable UI components (HabitItem, Heatmap, etc.).
- `hooks/`: Custom React hooks for business logic (`useHabits`).
- `db/`: Database schema and initialization logic.
- `constants/`: Theme and configuration constants.

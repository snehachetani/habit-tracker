import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

// Only set the notification handler if we are NOT in Expo Go (to avoid SDK 53+ crashes)
if (Constants.appOwnership !== 'expo') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export async function requestPermissions() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  return finalStatus === 'granted';
}

export async function scheduleHabitReminder(habitId: number, habitName: string, timeStr: string) {
  if (Constants.appOwnership === 'expo') {
    console.warn('Notifications are not supported in Expo Go (SDK 53+). Use a development build for reminders.');
    return;
  }

  const [hours, minutes] = timeStr.split(':').map(Number);
  
  if (isNaN(hours) || isNaN(minutes)) return;

  await Notifications.scheduleNotificationAsync({
    identifier: `habit-${habitId}`,
    content: {
      title: "Time for your habit!",
      body: `Don't forget to: ${habitName}`,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      hour: hours,
      minute: minutes,
      repeats: true,
    },
  });
}

export async function cancelHabitReminder(habitId: number) {
  if (Constants.appOwnership === 'expo') return;
  await Notifications.cancelScheduledNotificationAsync(`habit-${habitId}`);
}

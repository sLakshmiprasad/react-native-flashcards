import {Notifications, Permissions} from 'expo'
import {View, StyleSheet, AsyncStorage} from 'react-native'

const NOTIFICATION_KEY = 'FlashCards:notifications'

export function clearLocalNotification() {
  return AsyncStorage
    .removeItem(NOTIFICATION_KEY)
    .then(Notifications.cancelAllScheduledNotificationsAsync)
}

function createNotification() {
  return {
    title: 'Take the quiz!',
    body: "👋 don't forget to take the quiz today!",
    android: {
      sound: true,
      priority: 'high',
      sticky: false,
      vibrate: true
    }
  }
}

export function setLocalNotification() {
  console.log("setting notification");
  Permissions.getAsync(Permissions.NOTIFICATIONS)

  AsyncStorage
    .getItem(NOTIFICATION_KEY)
    .then(JSON.parse)
    .then((data) => {
      if (data === null) {
        console.log("data is null ")
        Permissions
          .askAsync(Permissions.NOTIFICATIONS)
          .then(({status}) => {
            if (status === 'granted') {
              Notifications.cancelAllScheduledNotificationsAsync()

              let tomorrow = new Date()
              tomorrow.setDate(tomorrow.getDate() + 1)
              tomorrow.setHours(20)
              tomorrow.setMinutes(0)

              Notifications.scheduleLocalNotificationAsync(createNotification(), {
                time: tomorrow,
                repeat: 'day'
              })

              AsyncStorage.setItem(NOTIFICATION_KEY, JSON.stringify(true))
            }
          })
      }
    })
}
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-messaging.js')

const firebaseConfig = {
  apiKey: 'AIzaSyAAnU7MX4wb340QPfB2a-nUnK11oDNxCcw',
  authDomain: 'appshopfe.firebaseapp.com',
  projectId: 'appshopfe',
  storageBucket: 'appshopfe.firebasestorage.app',
  messagingSenderId: '373356481988',
  appId: '1:373356481988:web:e1e8f068bc1fb55de0e891',
  measurementId: 'G-FXKNH9DW69'
}
// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig)
// eslint-disable-next-line no-undef
const messaging = firebase.messaging()

messaging.onBackgroundMessage(payload => {
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: './logo.png'
  }
  self.registration.showNotification(notificationTitle, notificationOptions)
})

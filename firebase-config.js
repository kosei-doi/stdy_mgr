// Firebase設定ファイル
// 統合アプリでは両方のFirebaseプロジェクトに接続可能

// @tabler用のFirebase設定
const firebaseConfig = {
  apiKey: "AIzaSyA2M27QaMYPaWK5A1-b2wwvICq5KNcTZt8",
  authDomain: "planer-275c4.firebaseapp.com",
  databaseURL: "https://planer-275c4-default-rtdb.firebaseio.com",
  projectId: "planer-275c4",
  storageBucket: "planer-275c4.firebasestorage.app",
  messagingSenderId: "752551364905",
  appId: "1:752551364905:web:07673595f83cea2c618f38",
  measurementId: "G-12R593XP3D",
};

// Firebase初期化
if (typeof firebase !== 'undefined') {
  firebase.initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');
} else {
  console.warn('Firebase not loaded');
}

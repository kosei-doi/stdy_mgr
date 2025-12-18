// Firebase設定ファイル
// 統合アプリでは両方のFirebaseプロジェクトに接続可能

// @tabler用のFirebase設定 - 更新済み: 新しいデータベースを使用
const firebaseConfig = {
  apiKey: "AIzaSyDhYTiWflm90SZTySJMDlBpGu7WHzkUaL4",
  authDomain: "manager-8ac68.firebaseapp.com",
  databaseURL: "https://manager-8ac68-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "manager-8ac68",
  storageBucket: "manager-8ac68.firebasestorage.app",
  messagingSenderId: "978586727124",
  appId: "1:978586727124:web:34e5fe89cc51f35b37c141",
  measurementId: "G-XPC0DXSBNZ"
};

// Firebase初期化
if (typeof firebase !== 'undefined') {
  firebase.initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully with new database');
} else {
  console.warn('Firebase not loaded');
}

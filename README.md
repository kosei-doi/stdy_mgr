# 統合時間割アプリ

@tablerのタスク管理機能と@platformの進捗管理機能を統合した、包括的な学習管理アプリケーションです。

## 特徴

### 📚 統合された機能
- **タスク管理** (@tablerから) - 課題の追加、期限管理、完了追跡
- **進捗管理** (@platformから) - 理解度カウント
- **時間割表示** - 科目ごとの進捗とタスク数を一覧表示
- **統計表示** - 全体進捗、現在週数の表示

### 🎨 デザイン
- @tablerのカラフルなグラデーションとアニメーション効果
- 科目ごとの背景色設定
- レスポンシブデザイン（PC・スマートフォン対応）
- スムーズなアニメーション遷移

### 🔥 Firebase連携
- Firebase Realtime Databaseとのリアルタイム同期
- オフライン時はローカルで動作
- データの永続化とバックアップ

## セットアップ

### 1. ファイル構成

```
/Users/user/dev/combi/
├── index.html          # 統合版UI
├── app.js              # 統合ロジック
├── styles.css          # 統合スタイル
├── firebase-config.js  # Firebase設定
├── data/
│   └── classDays.js   # 授業日データ
└── README.md          # このファイル
```

### 2. Firebase設定

#### 既存のFirebaseプロジェクトを使用する場合

`firebase-config.js`を編集して、実際のFirebase設定を入力してください：

```javascript
window.tablerFirebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

#### 新しいFirebaseプロジェクトを作成する場合

1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. 「プロジェクトを追加」をクリック
3. プロジェクト名を入力（例: integrated-timetable-app）
4. Google Analyticsは任意
5. プロジェクトを作成

#### Realtime Databaseの設定

1. Firebaseコンソールで「構築」→「Realtime Database」を選択
2. 「データベースを作成」をクリック
3. ロケーションを選択（例: asia-southeast1）
4. セキュリティルールを設定：

```json
{
  "rules": {
    "tabler": {
      ".read": true,
      ".write": true
    },
    "subjects": {
      ".read": true,
      ".write": true
    }
  }
}
```

**注意**: 上記は開発用です。本番環境では認証を追加してください。

### 3. 動作確認

1. ブラウザで `index.html` を開く
2. コンソールに「Firebase Realtime Database が有効です」と表示されることを確認
3. 時間割が表示され、セルをクリックしてモーダルが開くことを確認

## 使用方法

### 時間割の表示

- 各セルに科目名、進捗バー、進捗テキスト、学習時間、タスク数が表示されます
- 現在の曜日・時限がハイライトされます
- 科目ごとに異なる背景色が設定されています

### タスク管理

1. 時間割のセルをクリック
2. 「タスク管理」タブで課題を追加
3. 課題タイプ（演習課題、予習課題、追加演習）を選択
4. 期限を設定（前日、当日、後日、次週のボタンで簡単設定）
5. レベルと使用物を選択して追加

### 進捗管理

1. 時間割のセルをクリック
2. 「理解した！」ボタンで理解度を+1
3. 「戻す」ボタンで理解度を-1

### タスク一覧

- 「タスク」タブで全タスクを確認
- チェックボックスでタスクの完了/未完了を切り替え
- 期限に応じた色分け表示
- 完了したタスクは下部に表示

## データ構造

### Firebase Realtime Database

```
{
  "tabler": {
    "timetable": [
      ["CS", "", "", "", ""],
      ["", "実験", "線形代数", "", "ALC"],
      // ... 時間割データ
    ],
    "tasks": {
      "taskId": {
        "period": "1限",
        "day": "月",
        "title": "CS",
        "content": "課題内容",
        "dueDate": "2025-01-15",
        "items": ["pc", "notebook"],
        "level": 1,
        "taskType": "演習課題",
        "completed": false,
        "createdAt": 1642248000000
      }
    }
  },
  "subjects": {
    "mon-1": {
      "id": "mon-1",
      "name": "CS",
      "progress": 3,
      "lastUpdated": "2025-01-15T10:30:00.000Z"
    }
  }
}
```

## 科目マッピング

統合アプリでは以下の科目がサポートされています：

### 共通科目
- CS, Cプロ, 線形代数, 微分積分, 電磁気学A, 実験, ALC, 力学A, 生命科学A

### @tabler固有科目
- 中国語IA, 中国語IB, 憲法IB, 電生

### @platform固有科目
- 化学, 科学と芸術, 身体論, 電基礎

## カスタマイズ

### 科目の追加・変更

`app.js`の`subjectsMaster`配列を編集して科目を追加・変更できます：

```javascript
const subjectsMaster = [
  { id: 'mon-1', name: 'CS', dayOfWeek: '月曜日', slot: 1, dataId: 'mon-1' },
  // 新しい科目を追加
  { id: 'new-subject', name: '新科目', dayOfWeek: '火曜日', slot: 2, dataId: 'new-subject' },
];
```

### 背景色の変更

`app.js`の`subjectColors`オブジェクトを編集して科目の背景色を変更できます：

```javascript
const subjectColors = {
  'CS': '#E3F2FD',
  '新科目': '#FFE0B2', // 新しい色を追加
};
```

### 授業日の変更

`data/classDays.js`を編集して授業日を変更できます：

```javascript
var classDays = [
  '2025-10-06','2025-10-13', // 授業日を追加・変更
  // ...
];
```

## トラブルシューティング

### Firebaseに接続できない

- `firebase-config.js`の設定が正しいか確認
- Firebaseコンソールでデータベースが作成されているか確認
- ブラウザのコンソール（F12キー）でエラーメッセージを確認

### データが保存されない

- Firebaseのセキュリティルールで書き込みが許可されているか確認
- ブラウザのコンソールでエラーメッセージを確認

### 時間割が表示されない

- `data/classDays.js`が正しく読み込まれているか確認
- ブラウザのコンソールでJavaScriptエラーがないか確認

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 貢献

バグ報告や機能要望は、GitHubのIssueでお知らせください。

## 更新履歴

### v1.0.0 (2025-01-15)
- @tablerと@platformの統合完了
- タスク管理と進捗管理の両機能を実装
- Firebase Realtime Databaseとの連携
- レスポンシブデザインの実装

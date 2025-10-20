// 統合アプリ: @tablerのタスク管理 + @platformの進捗管理

// 科目マスター定義（@tablerと@platformを統合）
const subjectsMaster = [
  // 1限
  { id: 'mon-1', name: '', dayOfWeek: '月曜日', slot: 1, dataId: 'mon-1' },
  { id: 'tue-1', name: '', dayOfWeek: '火曜日', slot: 1, dataId: 'tue-1' },
  { id: 'wed-1', name: '', dayOfWeek: '水曜日', slot: 1, dataId: 'wed-1' },
  { id: 'thu-1', name: 'CS', dayOfWeek: '木曜日', slot: 1, dataId: 'CS' },
  { id: 'fri-1', name: '微分積分', dayOfWeek: '金曜日', slot: 1, dataId: '微分積分' },
  
  // 2限
  { id: 'mon-2', name: 'Cプロ', dayOfWeek: '月曜日', slot: 2, dataId: 'Cプロ' },
  { id: 'tue-2', name: '実験', dayOfWeek: '火曜日', slot: 2, dataId: '実験' },
  { id: 'wed-2', name: '線形代数', dayOfWeek: '水曜日', slot: 2, dataId: '線形代数' },
  { id: 'thu-2', name: '', dayOfWeek: '木曜日', slot: 2, dataId: 'thu-2' },
  { id: 'fri-2', name: 'ALC', dayOfWeek: '金曜日', slot: 2, dataId: 'ALC' },
  
  // 3限
  { id: 'mon-3', name: '中国語IA', dayOfWeek: '月曜日', slot: 3, dataId: '中国語IA' },
  { id: 'tue-3', name: '実験', dayOfWeek: '火曜日', slot: 3, dataId: '実験' },
  { id: 'wed-3', name: '', dayOfWeek: '水曜日', slot: 3, dataId: 'wed-3' },
  { id: 'thu-3', name: '憲法IB', dayOfWeek: '木曜日', slot: 3, dataId: '憲法IB' },
  { id: 'fri-3', name: '電磁気学A', dayOfWeek: '金曜日', slot: 3, dataId: '電磁気学A' },
  
  // 4限
  { id: 'mon-4', name: '生命科学A', dayOfWeek: '月曜日', slot: 4, dataId: '生命科学A' },
  { id: 'tue-4', name: '実験', dayOfWeek: '火曜日', slot: 4, dataId: '実験' },
  { id: 'wed-4', name: '', dayOfWeek: '水曜日', slot: 4, dataId: 'wed-4' },
  { id: 'thu-4', name: '中国語IB', dayOfWeek: '木曜日', slot: 4, dataId: '中国語IB' },
  { id: 'fri-4', name: '電磁気学A', dayOfWeek: '金曜日', slot: 4, dataId: '電磁気学A' },
  
  // 5限
  { id: 'mon-5', name: '', dayOfWeek: '月曜日', slot: 5, dataId: 'mon-5' },
  { id: 'tue-5', name: '実験', dayOfWeek: '火曜日', slot: 5, dataId: '実験' },
  { id: 'wed-5', name: '力学A', dayOfWeek: '水曜日', slot: 5, dataId: '力学A' },
  { id: 'thu-5', name: '電生', dayOfWeek: '木曜日', slot: 5, dataId: '電生' },
  { id: 'fri-5', name: '', dayOfWeek: '金曜日', slot: 5, dataId: 'fri-5' }
];

// 科目名マッピング（@tabler → @platform）
const subjectMapping = {
  'CS': 'CS',
  'Cプロ': 'Cプロ',
  '線形代数': '線形代数',
  '微分積分': '微分積分',
  'ALC': 'ALC',
  '電磁気学A': '電磁気学A',
  '力学A': '力学A',
  '生命科学A': '生命科学A',
  '実験': '実験',
  '中国語IA': '中国語IA',
  '憲法IB': '憲法IB',
  '電生': '電生',
  '化学': '化学',
  '科学と芸術': '科学と芸術',
  '身体論': '身体論',
  '電基礎': '電基礎'
};

// ランダムカラー生成関数
function generateRandomColor() {
  const colors = [
    '#E3F2FD', // 水色
    '#F3E5F5', // ラベンダー
    '#FFF8E1', // クリーム
    '#E0F7FA', // ターコイズ
    '#F1F8E9', // ミントグリーン
    '#FCE4EC', // ピンク
    '#EDE7F6', // ライトパープル
    '#FFF3E0', // アプリコット
    '#E8F5E9', // セージグリーン
    '#E1F5FE', // スカイブルー
    '#E8EAF6', // ライトブルー
    '#FFF9C4', // イエロー
    '#FCE4EC', // ローズ
    '#E8F5E8', // ライム
    '#F3E5F5', // オーキッド
    '#E0F2F1', // ティール
    '#FFF3E0', // オレンジ
    '#F1F8E9', // グリーン
    '#E3F2FD', // ブルー
    '#FCE4EC'  // ピンク
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// 科目ごとの背景色を定義（薄い色で見やすく）
const subjectColors = {
  'CS': '#FFE6E8', // コンピュータサイエンス - 薄いピンク
  '微分積分': '#E6F7E6', // 数学 - 薄いグリーン
  'Cプロ': '#E6F2FF', // プログラミング - 薄いブルー
  '実験': '#FFF9E6', // 実験 - 薄いイエロー
  '線形代数': '#FFE6D6', // 数学 - 薄いオレンジ
  '中国語IA': '#F0E6FF', // 語学 - 薄いパープル
  '中国語IB': '#FFE6F0', // 語学 - 薄いマゼンタ
  '憲法IB': '#E6F7F0', // 法学 - 薄いティール
  '電磁気学A': '#FFE6E6', // 物理学 - 薄いレッド
  '電生': '#E6F7E6', // 電気・生物 - 薄いライム
  '生命科学A': '#E6F2FF', // 生物学 - 薄いスカイブルー
  '力学A': '#FFF0E6', // 物理学 - 薄いゴールド
  'ALC': '#F0E6FF', // 語学 - 薄いバイオレット
  '化学': '#E6F7F0', // 化学 - 薄いアクア
  '科学と芸術': '#FFE6FF', // 科学と芸術 - 薄いフクシア
  '身体論': '#E6E6FF', // 身体論 - 薄いインディゴ
  '電基礎': '#FFE6E6', // 電気基礎 - 薄いローズ
  '生命科学': '#F0FFE6'  // 生命科学 - 薄いライムグリーン
};

// 科目に色を割り当てる関数（@tablerの固定色を使用）
function assignColorToSubject(subjectName) {
  return subjectColors[subjectName] || '#F5F5F5'; // デフォルト色
}


// 初期時間割データ（@tablerから正しく継承）
const initialTimetableData = [
  ['', '', '', 'CS', '微分積分'],     // 1限
  ['Cプロ', '実験', '線形代数', '', 'ALC'],  // 2限
  ['中国語IA', '実験', '', '憲法IB', '電磁気学A'],  // 3限
  ['生命科学A', '実験', '', '中国語IB', '電磁気学A'],  // 4限
  ['', '実験', '力学A', '電生', '']   // 5限
];

// グローバル変数
let subjectsData = null;
let isFirebaseEnabled = false;
let modalState = { name: null, slot: null, dataId: null };

// Firebase接続チェック（v11対応）
function checkFirebase() {
  try {
    if (typeof window.firebase !== 'undefined' && window.firebase.db) {
      isFirebaseEnabled = true;
      console.log('Firebase v11 Realtime Database が有効です');
      return true;
    }
  } catch (e) {
    console.warn('Firebase が利用できません。ローカルモードで動作します。', e);
  }
  isFirebaseEnabled = false;
  return false;
}

// 時間割データを初期化する関数（v11対応）
function initializeTimetable() {
  if (!isFirebaseEnabled) return;
  
  const timetableRef = window.firebase.ref(window.firebase.db, "tabler/timetable");
  window.firebase.get(timetableRef).then((snapshot) => {
    if (!snapshot.exists()) {
      window.firebase.set(timetableRef, initialTimetableData);
    }
  });
}

// 時間割データを読み込む関数（v11対応）
function loadTimetable() {
  if (!isFirebaseEnabled) return;
  
  const timetableRef = window.firebase.ref(window.firebase.db, "tabler/timetable");
  window.firebase.onValue(timetableRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      generateTimetable(data);
    }
  });
}

// タスクを保存する関数（v11対応）
function saveTask(period, day, title, taskData) {
  if (!isFirebaseEnabled) return;
  
  const tasksRef = window.firebase.ref(window.firebase.db, "tabler/tasks");
  const newTaskRef = window.firebase.push(tasksRef);
  window.firebase.set(newTaskRef, {
    period: period,
    day: day,
    title: title,
    content: taskData.content,
    dueDate: taskData.dueDate,
    taskType: taskData.taskType,
    createdAt: Date.now()
  });
}

// タスクを読み込む関数（v11対応）
function loadTasks() {
  if (!isFirebaseEnabled) {
    // Firebaseが無効な場合は空のタスクデータを設定
    window.tasks = {};
    displayTasks({});
    updateTaskNumbers({});
    return;
  }
  
  const tasksRef = window.firebase.ref(window.firebase.db, "tabler/tasks");
  window.firebase.onValue(tasksRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      window.tasks = data;
      displayTasks(data);
      updateTaskNumbers(data);
    } else {
      // データが存在しない場合
      window.tasks = {};
      displayTasks({});
      updateTaskNumbers({});
    }
  });
}

// 進捗データを読み込む関数
function loadSubjects() {
  return new Promise((resolve) => {
    if (subjectsData !== null) {
      resolve(subjectsData);
      return;
    }
    
    if (isFirebaseEnabled) {
      const subjectsRef = window.firebase.ref(window.firebase.db, 'subjects');
      window.firebase.get(subjectsRef)
        .then((snapshot) => {
          const data = snapshot.val();
          if (data) {
            // Firebaseから読み込んだデータにdataIdフィールドがない場合は科目名を使用
            subjectsData = Object.values(data).map(subject => ({
              // totalTime を破棄
              id: subject.id || subject.dataId || subject.name,
              name: subject.name,
              dataId: subject.dataId || subject.name || subject.id,
              progress: subject.progress || 0,
              lastUpdated: subject.lastUpdated || null
            }));
            console.log('Firebaseから科目データを読み込みました:', subjectsData);
            console.log('科目数:', subjectsData.length);
            subjectsData.forEach(subject => {
              console.log(`- ${subject.name} (id: ${subject.id}, dataId: ${subject.dataId})`);
            });
          } else {
            subjectsData = getUniqueSubjects().map(s => ({ 
              id: s.id, 
              name: s.name, 
              dataId: s.dataId,
              progress: 0, 
              lastUpdated: null 
            }));
            console.log('初期科目データを作成');
            saveSubjects(subjectsData);
          }
          resolve(subjectsData);
        })
        .catch((error) => {
          console.error('Firebaseからの読み込みに失敗:', error);
          subjectsData = getUniqueSubjects().map(s => ({ 
            id: s.id, 
            name: s.name, 
            dataId: s.dataId,
            progress: 0, 
            lastUpdated: null 
          }));
          console.log('初期科目データを作成（エラー時）:', subjectsData);
          resolve(subjectsData);
        });
    } else {
      subjectsData = getUniqueSubjects().map(s => ({ 
        id: s.id, 
        name: s.name, 
        dataId: s.dataId,
        progress: 0, 
        totalTime: 0, 
        lastUpdated: null 
      }));
      console.log('初期科目データを作成（ローカル）');
      resolve(subjectsData);
    }
  });
}

// 進捗データを保存する関数
function saveSubjects(subjects) {
  subjectsData = subjects;
  console.log('科目データを更新:', subjectsData);
  
  if (isFirebaseEnabled) {
    const subjectsRef = window.firebase.ref(window.firebase.db, 'subjects');
    window.firebase.set(subjectsRef, subjectsData)
      .then(() => {
        console.log('Firebaseに保存しました');
      })
      .catch((error) => {
        console.error('Firebaseへの保存に失敗:', error);
      });
  }
}

// ユニークな科目リストを取得
function getUniqueSubjects() {
  const uniqueSubjects = [];
  const seenDataIds = new Set();
  const seenNames = new Set();
  
  // subjectsMasterから取得
  subjectsMaster.forEach(s => {
    if (!seenDataIds.has(s.dataId) && s.name && s.name.trim() !== '') {
      seenDataIds.add(s.dataId);
      seenNames.add(s.name);
      uniqueSubjects.push({ id: s.dataId, name: s.name, dataId: s.dataId });
    }
  });
  
  // 現在の時間割データから動的に科目を追加
  if (window.currentTimetableData) {
    window.currentTimetableData.forEach((period, periodIndex) => {
      period.forEach((subjectName, dayIndex) => {
        if (subjectName && subjectName.trim() !== '' && !seenNames.has(subjectName)) {
          // より安全なdataId生成
          const dataId = `${subjectName.replace(/[^a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, '-')}`;
          if (!seenDataIds.has(dataId)) {
            seenDataIds.add(dataId);
            seenNames.add(subjectName);
            uniqueSubjects.push({ id: dataId, name: subjectName, dataId: dataId });
          }
        }
      });
    });
  }
  
  console.log('=== ユニーク科目リスト ===');
  console.log('科目数:', uniqueSubjects.length);
  uniqueSubjects.forEach(subject => {
    console.log(`- ${subject.name} (${subject.dataId})`);
  });
  return uniqueSubjects;
}

// 授業日データを取得
function getClassDays() {
  return typeof classDays !== 'undefined' ? classDays : [];
}

function getClassDaysByWeekday(weekday) {
  return getClassDays().filter(d => d.dayOfWeek === weekday);
}

function getTodayISO() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getCurrentWeekForSubject(subjectName, todayISO = getTodayISO()) {
  // subjectsMasterから検索
  let subject = subjectsMaster.find(s => s.name === subjectName);
  
  // subjectsMasterに見つからない場合は、現在の時間割データから検索
  if (!subject && window.currentTimetableData) {
    const days = ['月', '火', '水', '木', '金'];
    const periods = ['1限', '2限', '3限', '4限', '5限'];
    
    for (let periodIndex = 0; periodIndex < periods.length; periodIndex++) {
      for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
        if (window.currentTimetableData[periodIndex] && 
            window.currentTimetableData[periodIndex][dayIndex] === subjectName) {
          subject = {
            name: subjectName,
            dayOfWeek: getDayOfWeek(days[dayIndex]),
            slot: periodIndex + 1
          };
          break;
        }
      }
      if (subject) break;
    }
  }
  
  if (!subject) {
    console.log(`⚠️ 科目が見つかりません: ${subjectName}`);
    return 1;
  }
  
  // その科目の授業日を取得
  const allDays = getClassDaysByWeekday(subject.dayOfWeek);
  const pastDays = allDays.filter(d => d.date <= todayISO);
  const weekCount = Math.max(pastDays.length, 1);
  
  console.log(`📅 ${subjectName} (${subject.dayOfWeek}): ${weekCount}週目`);
  console.log(`📅 全授業日数: ${allDays.length}, 過去授業日数: ${pastDays.length}`);
  console.log(`📅 今日: ${todayISO}`);
  console.log(`📅 過去の授業日:`, pastDays.map(d => d.date));
  
  return weekCount;
}

// 時間割を生成する関数（統合版 - @tablerの機能を正しく継承）
function generateTimetable(timetableData) {
  // 現在の時間割データを保存
  window.currentTimetableData = timetableData;
  
  console.log('=== 時間割データ ===');
  console.log('timetableData:', timetableData);
  
  const timetable = document.getElementById('timetable');
  timetable.innerHTML = '';

  // ヘッダーを追加
  const days = ['月', '火', '水', '木', '金'];
  const headerCell = document.createElement('div');
  headerCell.className = 'cell header';
  timetable.appendChild(headerCell);

  // 現在の曜日と時間を取得（@tablerから継承）
  const now = new Date();
  const currentDay = ['日', '月', '火', '水', '木', '金', '土'][now.getDay()];
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinute;

  days.forEach(day => {
    const cell = document.createElement('div');
    cell.className = 'cell header';
    if (day === currentDay) {
      cell.classList.add('current-day-header');
    }
    cell.textContent = day;
    timetable.appendChild(cell);
  });

  const periods = [
    { name: '1限', time: '8:50-10:30' },
    { name: '2限', time: '10:40-12:20' },
    { name: '3限', time: '13:10-14:50' },
    { name: '4限', time: '15:50-16:45' },
    { name: '5限', time: '17:00-18:40' }
  ];

  // 各限の時間範囲を分に変換（@tablerから継承）
  const periodTimes = periods.map(period => {
    const [start, end] = period.time.split('-');
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);
    return {
      start: startHour * 60 + startMinute,
      end: endHour * 60 + endMinute
    };
  });

  periods.forEach((period, periodIndex) => {
    // 時間ラベル
    const timeCell = document.createElement('div');
    timeCell.className = 'cell time';
    const periodName = document.createElement('div');
    periodName.className = 'period-name';
    periodName.textContent = period.name;
    const periodTime = document.createElement('div');
    periodTime.className = 'period-time';
    periodTime.textContent = period.time;
    timeCell.appendChild(periodName);
    timeCell.appendChild(periodTime);
    timetable.appendChild(timeCell);

        // 各曜日のセル
        days.forEach((day, dayIndex) => {
          const cell = document.createElement('div');
          cell.className = 'cell';
          cell.setAttribute('data-period', period.name);
          cell.setAttribute('data-day', day);
          
          // 現在の曜日と時間に基づいてクラスを追加（@tablerから継承）
          if (day === currentDay) {
            const periodTime = periodTimes[periodIndex];
            if (currentTime >= periodTime.start && currentTime <= periodTime.end) {
              cell.classList.add('current-period');
            }
          }
      
      const subjectName = timetableData[periodIndex][dayIndex];
      
      if (subjectName) {
        const title = document.createElement('div');
        title.className = 'title';
        title.textContent = subjectName;
        
        // 科目に応じた背景色を設定（@tablerの固定色を使用）
        const color = assignColorToSubject(subjectName);
        cell.style.backgroundColor = color;
        
        cell.appendChild(title);

        // 進捗バーを追加
        const progressWrap = document.createElement('div');
        progressWrap.className = 'progress';
        const bar = document.createElement('div');
        bar.className = 'progress-bar';
        bar.id = `bar-${period.name}-${day}`;
        progressWrap.appendChild(bar);
        cell.appendChild(progressWrap);

        // 進捗テキストを追加
        const progressText = document.createElement('div');
        progressText.className = 'progress-text';
        progressText.id = `text-${period.name}-${day}`;
        cell.appendChild(progressText);

          // 学習時間表示は削除

        cell.addEventListener('click', () => {
          showTaskModal(period.name, day, subjectName);
        });
      }
      
      timetable.appendChild(cell);
    });
  });
  
  // 時間割生成後にタスク数バッジを再表示
  if (window.tasks) {
    console.log('🔄 時間割生成後にタスク数バッジを再表示');
    updateTaskNumbers(window.tasks);
  }
}

// タスク数を計算して更新する関数
function updateTaskNumbers(tasks) {
  console.log('🔢 updateTaskNumbers呼び出し:', tasks);
  const taskCounts = {};
  const earliestDueDates = {};
  
  // タスク数を集計（完了していないタスクのみ）
  Object.values(tasks).forEach(task => {
    if (!task.completed) {
      const key = `${task.period}_${task.day}_${task.title}`;
      taskCounts[key] = (taskCounts[key] || 0) + 1;
      
      // 最も早い期限を記録
      if (!earliestDueDates[key] || new Date(task.dueDate) < new Date(earliestDueDates[key])) {
        earliestDueDates[key] = task.dueDate;
      }
    }
  });
  
  console.log('🔢 タスク数集計結果:', taskCounts);

  // 時間割の各セルのタスク数を更新
  const cells = document.querySelectorAll('.cell:not(.header):not(.time)');
  console.log('🔢 処理対象セル数:', cells.length);
  
  cells.forEach((cell, index) => {
    const title = cell.querySelector('.title')?.textContent;
    console.log(`🔢 セル${index}:`, cell, 'タイトル:', title);
    if (title) {
      const period = cell.getAttribute('data-period');
      const day = cell.getAttribute('data-day');
      const key = `${period}_${day}_${title}`;
      const count = taskCounts[key] || 0;
      
      console.log(`🔢 セル処理: ${title} (${period} ${day}) - タスク数: ${count}`);

      // 既存の数値表示を削除
      const existingCircle = cell.querySelector('.number-circle');
      if (existingCircle) {
        existingCircle.remove();
      }

      // タスク数が0より大きい場合のみ表示
      if (count > 0) {
        console.log(`🔢 タスク数バッジを作成: ${title} - ${count}個`);
        const numberCircle = document.createElement('div');
        numberCircle.className = 'number-circle';
        numberCircle.textContent = count;
        numberCircle.style.display = 'flex'; // 明示的にdisplayを設定
        console.log(`🔢 バッジ要素を作成:`, numberCircle);
        
        // 期限に応じて色を設定
        const dueDate = earliestDueDates[key];
        if (dueDate) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const taskDate = new Date(dueDate);
          taskDate.setHours(0, 0, 0, 0);
          const weekLater = new Date(today);
          weekLater.setDate(weekLater.getDate() + 7);

          if (taskDate < today) {
            numberCircle.classList.add('due-date-overdue');
          } else if (taskDate.getTime() === today.getTime()) {
            numberCircle.classList.add('due-date-today');
          } else if (taskDate.getTime() === new Date(today.getTime() + 86400000).getTime()) {
            numberCircle.classList.add('due-date-tomorrow');
          } else if (taskDate <= weekLater) {
            numberCircle.classList.add('due-date-week');
          } else {
            numberCircle.classList.add('due-date-future');
          }
        }

        numberCircle.addEventListener('click', (e) => {
          e.stopPropagation();
          showTaskPopup(period, day, title);
        });
        cell.appendChild(numberCircle);
        console.log(`🔢 バッジをセルに追加完了: ${title}`, cell);
      }
    }
  });
}

// 時間割の進捗バーを更新する関数
function updateTimetableProgressBars() {
  const subjects = subjectsData || [];
  console.log('=== 進捗バー更新 ===');
  console.log('subjectsData:', subjects);

  // 各セルに対して処理
  const cells = document.querySelectorAll('.cell:not(.header):not(.time)');
  cells.forEach(cell => {
    const title = cell.querySelector('.title')?.textContent;
    if (title) {
      const period = cell.getAttribute('data-period');
      const day = cell.getAttribute('data-day');
      
      // 対応するdataIdを検索
      let subject = subjectsMaster.find(s => 
        s.name === title && 
        s.dayOfWeek === getDayOfWeek(day) && 
        s.slot === getSlotNumber(period)
      );
      
      // subjectsMasterに見つからない場合は、動的に作成
      if (!subject) {
        // より安全なdataId生成（日本語対応）
        const dataId = `${title.replace(/[^a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, '-')}`;
        subject = {
          id: dataId,
          name: title,
          dayOfWeek: getDayOfWeek(day),
          slot: getSlotNumber(period),
          dataId: dataId
        };
      }
      
      if (subject) {
        // より柔軟な検索：id、dataId、nameで検索
        let s = subjects.find(sub => 
          sub.id === subject.dataId || 
          sub.dataId === subject.dataId || 
          sub.name === subject.name
        );
        
        // CS科目の特別な検索
        if (!s && title === 'CS') {
          console.log('🔍 CS科目の特別検索を実行');
          s = subjects.find(sub => 
            sub.name === 'CS' || 
            sub.dataId === 'CS' || 
            sub.id === 'CS' ||
            sub.id === 'mon-1'
          );
          if (s) {
            console.log('🎯 CS科目を特別検索で発見:', s);
          }
        }
        
        if (!s) {
          // 科目データが存在しない場合は作成
          console.log(`📝 新しい科目データを作成: ${title} (${subject.dataId})`);
          s = {
            id: subject.dataId,
            name: subject.name,
            dataId: subject.dataId,
            progress: 0,
            totalTime: 0,
            lastUpdated: new Date().toISOString()
          };
          subjects.push(s);
          saveSubjects(subjects);
        }
        
        if (s) {
          console.log(`✅ 進捗更新: ${title} (${subject.dataId}) - 進捗: ${s.progress}`);
          console.log(`📊 科目データ詳細:`, s);
          console.log(`🔍 検索条件: title="${title}", subject.dataId="${subject.dataId}"`);
          console.log(`🔍 見つかった科目: id="${s.id}", dataId="${s.dataId}", name="${s.name}"`);
          const denom = getCurrentWeekForSubject(s.name);
          console.log(`📅 週数計算: ${s.name} = ${denom}週`);
          const pct = Math.max(0, Math.min(100, Math.floor((denom ? (s.progress / denom) : 0) * 100)));
          console.log(`📈 進捗率: ${s.progress}/${denom} = ${pct}%`);
          
          const bar = cell.querySelector('.progress-bar');
          const text = cell.querySelector('.progress-text');
          const timeDisplay = null;
          
          if (bar) {
            bar.style.width = `${pct}%`;
            bar.className = `progress-bar ${computeProgressColorClass(pct)}`;
          }
          if (text) {
            text.textContent = `${s.progress || 0}/${denom}`;
          }
          // 学習時間表示は削除
        }
      } else {
        console.log(`❌ subjectsMasterで見つかりません: ${title} (${period} ${day})`);
      }
    }
  });
}

// ヘルパー関数
function getDayOfWeek(shortDay) {
  const dayMap = { '月': '月曜日', '火': '火曜日', '水': '水曜日', '木': '木曜日', '金': '金曜日' };
  return dayMap[shortDay];
}

function getSlotNumber(period) {
  const slotMap = { '1限': 1, '2限': 2, '3限': 3, '4限': 4, '5限': 5 };
  return slotMap[period];
}

function computeProgressColorClass(pct) {
  if (pct === 0) return 'pct-0';
  if (pct < 25) return 'pct-1';
  if (pct < 50) return 'pct-2';
  if (pct < 75) return 'pct-3';
  return 'pct-4';
}

// 学習時間関連の機能は削除

// 全体統計を更新する関数
function updateSummaryStats() {
  const subjects = subjectsData || [];
  
  // 全体進捗を計算
  let totalProgress = 0;
  let totalRequired = 0;
  
  console.log('📊 updateSummaryStats開始');
  console.log('📊 subjectsData:', subjects);
  
  getUniqueSubjects().forEach(uniqueSubject => {
    // より柔軟な検索：id、dataId、nameで検索
    const subject = subjects.find(s => 
      s.id === uniqueSubject.id || 
      s.dataId === uniqueSubject.dataId || 
      s.name === uniqueSubject.name
    );
    
    const currentWeek = getCurrentWeekForSubject(uniqueSubject.name);
    const progress = subject ? subject.progress || 0 : 0;
    
    console.log(`📊 ${uniqueSubject.name}: 進捗=${progress}, 週数=${currentWeek}`);
    
    totalProgress += progress;
    totalRequired += currentWeek;
  });
  
  const overallProgressPercent = totalRequired > 0 ? Math.round((totalProgress / totalRequired) * 100) : 0;
  
  // 表示を更新
  const overallProgressEl = document.getElementById('overallProgress');
  if (overallProgressEl) {
    overallProgressEl.textContent = `${overallProgressPercent}%`;
  }
  
  console.log(`📊 全体進捗更新: ${totalProgress}/${totalRequired} = ${overallProgressPercent}%`);
}

// 週数表示を更新する関数
function updateWeekDisplay() {
  const weekdays = ['月曜日','火曜日','水曜日','木曜日','金曜日'];
  let maxWeek = 0;
  
  weekdays.forEach(day => {
    const days = getClassDaysByWeekday(day);
    const completedDays = days.filter(d => d.date <= getTodayISO());
    const currentWeek = completedDays.length;
    maxWeek = Math.max(maxWeek, currentWeek);
  });
  
  const displayElement = document.getElementById('currentWeekDisplay');
  if (displayElement) {
    displayElement.textContent = `第${maxWeek}週`;
  }
}

// モーダル表示関数（統合版）
function showTaskModal(period, day, title) {
  const modal = document.getElementById('taskModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalSubtitle = document.getElementById('modalSubtitle');

  modalTitle.textContent = title;
  modalSubtitle.textContent = `${period} ${day}`; // @tablerの形式に合わせる
  modal.style.display = 'block';

  // 対応するdataIdを検索
  const slotNum = getSlotNumber(period);
  const dayOfWeek = getDayOfWeek(day);
  let cellSubject = subjectsMaster.find(s => 
    s.name === title && 
    s.dayOfWeek === dayOfWeek && 
    s.slot === slotNum
  );
  
  // subjectsMasterに見つからない場合は、動的に作成
  if (!cellSubject) {
    // より安全なdataId生成（日本語対応）
    const dataId = `${title.replace(/[^a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, '-')}`;
    cellSubject = {
      id: dataId,
      name: title,
      dayOfWeek: dayOfWeek,
      slot: slotNum,
      dataId: dataId
    };
  }
  
  modalState = { name: title, slot: slotNum, dataId: cellSubject?.dataId };
  
  // モーダルが表示された後に日付を設定
  setTimeout(() => {
    console.log('📅 日付設定を実行:', period, day);
    setDate('nextWeek');
  }, 100);
  
  // 進捗管理の進捗を更新（少し遅延させてデータ読み込みを待つ）
  setTimeout(() => {
    if (cellSubject) {
      console.log('📊 モーダル進捗更新を実行:', cellSubject.dataId);
      updateModalProgress(cellSubject.dataId);
    }
  }, 200);
  
  // フォームをリセット
  document.getElementById('taskForm').reset();
  document.querySelector('.task-type-btn.active').classList.remove('active');
  document.querySelector('.task-type-btn[data-type="演習課題"]').classList.add('active');
}

// モーダル内タブ切り替え（削除済み）
// 統合モーダルではタブ機能は不要

// モーダルの進捗を更新（プログレスバー部分は削除）
function updateModalProgress(dataId) {
  if (!dataId) {
    console.log('❌ updateModalProgress: dataIdが空です');
    return;
  }
  
  const subjects = subjectsData || [];
  console.log('📊 updateModalProgress: 科目データ検索中', dataId);
  console.log('📊 利用可能な科目:', subjects.map(s => ({ name: s.name, dataId: s.dataId })));
  
  const s = subjects.find(x => x.dataId === dataId);
  
  if (s) {
    const currentProgress = s.progress || 0;
    const denom = getCurrentWeekForSubject(s.name);
    
    console.log(`📊 進捗更新: ${s.name} - 進捗: ${currentProgress}, 週数: ${denom}`);
    
    // カスタム入力をリセット
    const customInput = document.getElementById('customTimeInput');
    if (customInput) {
      customInput.value = '';
    }
  } else {
    console.log('❌ updateModalProgress: 科目データが見つかりません', dataId);
  }
}

// 日付を設定する関数（@tablerから）
function setDate(type) {
  const modalSubtitle = document.getElementById('modalSubtitle').textContent;
  console.log('📅 setDate呼び出し:', type, 'modalSubtitle:', modalSubtitle);
  const [period, day] = modalSubtitle.split(' ');
  console.log('📅 解析結果:', period, day);
  
  const dayMap = { '月': 1, '火': 2, '水': 3, '木': 4, '金': 5 };
  const subjectDay = dayMap[day];
  console.log('📅 科目の曜日:', subjectDay);
  
  const today = new Date();
  const jstToday = new Date(today.getTime() + (9 * 60 * 60 * 1000));
  const currentDay = jstToday.getDay();
  
  let daysUntilNextClass;
  if (currentDay === 0) {
    daysUntilNextClass = subjectDay;
  } else if (currentDay === 6) {
    daysUntilNextClass = subjectDay + 1;
  } else {
    daysUntilNextClass = subjectDay - currentDay;
  }
  
  const deadline = new Date(jstToday);
  switch (type) {
    case 'previous':
      deadline.setDate(jstToday.getDate() + daysUntilNextClass - 1);
      break;
    case 'current':
      deadline.setDate(jstToday.getDate() + daysUntilNextClass);
      break;
    case 'next':
      deadline.setDate(jstToday.getDate() + daysUntilNextClass + 1);
      break;
    case 'nextWeek':
      deadline.setDate(jstToday.getDate() + daysUntilNextClass + 6);
      break;
  }
  
  const year = deadline.getFullYear();
  const month = String(deadline.getMonth() + 1).padStart(2, '0');
  const date = String(deadline.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${date}`;
  
  console.log('📅 計算された日付:', formattedDate);
  console.log('📅 日付入力フィールドに設定');
  document.getElementById('taskDate').value = formattedDate;
}

// タスク一覧を表示する関数（@tablerから）
function displayTasks(tasks) {
  const activeTasksContainer = document.getElementById('active-tasks');
  const completedTasksContainer = document.getElementById('completed-tasks');
  activeTasksContainer.innerHTML = '';
  completedTasksContainer.innerHTML = '';

  const sortedTasks = Object.entries(tasks).sort(([, a], [, b]) => {
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  sortedTasks.forEach(([taskId, task]) => {
    const taskElement = createTaskElement(taskId, task);
    if (task.completed) {
      completedTasksContainer.appendChild(taskElement);
    } else {
      activeTasksContainer.appendChild(taskElement);
    }
  });
}

// タスク要素を作成する関数（@tablerから）
function createTaskElement(taskId, task) {
  const div = document.createElement('div');
  div.className = 'task-item';
  if (task.completed) {
    div.classList.add('completed');
  }

  if (task.taskType) {
    div.classList.add(`task-type-${task.taskType}`);
  }

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task-checkbox';
  checkbox.checked = task.completed || false;
  checkbox.addEventListener('change', () => {
    updateTaskCompletion(taskId, checkbox.checked);
  });

  const content = document.createElement('div');
  content.className = 'task-content';

  const title = document.createElement('div');
  title.className = 'task-title';
  title.textContent = `${task.title} (${task.period} ${task.day})`;

  const details = document.createElement('div');
  details.className = 'task-details';
  details.textContent = task.content || '';

  const meta = document.createElement('div');
  meta.className = 'task-meta';

  const dueDate = document.createElement('span');
  dueDate.className = 'due-date';
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const taskDate = new Date(task.dueDate);
  taskDate.setHours(0, 0, 0, 0);

  if (taskDate < today) {
    dueDate.classList.add('due-date-overdue');
  } else if (taskDate.getTime() === today.getTime()) {
    dueDate.classList.add('due-date-today');
  } else if (taskDate.getTime() === new Date(today.getTime() + 86400000).getTime()) {
    dueDate.classList.add('due-date-tomorrow');
  } else if (taskDate <= new Date(today.getTime() + 7 * 86400000)) {
    dueDate.classList.add('due-date-week');
  }

  dueDate.textContent = `期限: ${formatDueDate(task.dueDate)}`;

  meta.appendChild(dueDate);
  content.appendChild(title);
  content.appendChild(details);
  content.appendChild(meta);

  div.appendChild(checkbox);
  div.appendChild(content);

  return div;
}

// タスクの完了状態を更新する関数
function updateTaskCompletion(taskId, completed) {
  if (!isFirebaseEnabled) return;
  
  const taskRef = window.firebase.ref(window.firebase.db, `tabler/tasks/${taskId}`);
  window.firebase.set(taskRef, {
    ...window.tasks[taskId],
    completed: completed,
    completedAt: completed ? Date.now() : null
  });
}

// 期限の表示形式を変更する関数
function formatDueDate(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const taskDate = new Date(date);
  taskDate.setHours(0, 0, 0, 0);

  if (taskDate < today) {
    return '期限切れ';
  } else if (taskDate.getTime() === today.getTime()) {
    return '今日';
  } else if (taskDate.getTime() === tomorrow.getTime()) {
    return '明日';
  } else {
    const diffDays = Math.floor((taskDate - today) / (1000 * 60 * 60 * 24));
    return `${diffDays}日後`;
  }
}

// タスク一覧ポップアップを表示する関数
function showTaskPopup(period, day, title) {
  console.log('🔴 showTaskPopup呼び出し:', period, day, title);
  
  // 既存のポップアップを削除
  const existingPopup = document.querySelector('.task-popup');
  if (existingPopup) {
    existingPopup.remove();
  }
  
  const popup = document.createElement('div');
  popup.className = 'task-popup';
  popup.innerHTML = `
    <div class="task-popup-content">
      <div class="task-popup-header">
        <h2>${title}</h2>
        <p>${period} ${day}</p>
      </div>
      <div class="task-popup-list" id="taskPopupList"></div>
    </div>
  `;

  document.body.appendChild(popup);
  popup.style.display = 'block';

  const taskList = document.getElementById('taskPopupList');
  const tasks = Object.entries(window.tasks || {})
    .filter(([, task]) => 
      !task.completed && 
      task.period === period && 
      task.day === day && 
      task.title === title
    )
    .sort(([, a], [, b]) => new Date(a.dueDate) - new Date(b.dueDate));

  console.log('🔴 フィルタリングされたタスク:', tasks);

  if (tasks.length === 0) {
    taskList.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">タスクがありません</p>';
  } else {
    tasks.forEach(([taskId, task]) => {
      const taskElement = createTaskElement(taskId, task);
      taskList.appendChild(taskElement);
    });
  }

  // ポップアップ外クリックで閉じる
  popup.addEventListener('click', (e) => {
    if (e.target === popup) {
      console.log('🔴 ポップアップ外クリックで閉じます');
      popup.remove();
    }
  });

  // ESCキーで閉じる
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      console.log('🔴 ESCキーでポップアップを閉じます');
      popup.remove();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);
}

// イベントリスナー設定
function wireEvents() {
  // タブ切り替え
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });
      document.getElementById(`${tab.dataset.tab}-tab`).classList.add('active');
    });
  });

  // モーダル内タブ切り替え（削除済み）
  // 統合モーダルではタブ機能は不要

  // タスクフォーム送信
  document.getElementById('taskForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const taskContent = document.getElementById('taskContent').value;
    const selectedTaskType = document.querySelector('.task-type-btn.active')?.dataset.type;
    
    const taskData = {
      content: taskContent || (selectedTaskType ? selectedTaskType : '演習課題'),
      dueDate: document.getElementById('taskDate').value,
      taskType: taskContent ? null : selectedTaskType
    };

    const modalTitle = document.getElementById('modalTitle').textContent;
    const modalSubtitle = document.getElementById('modalSubtitle').textContent;
    const [period, day] = modalSubtitle.split(' ');

    saveTask(period, day, modalTitle, taskData);
    
    document.getElementById('taskModal').style.display = 'none';
    this.reset();
    document.querySelector('[data-type="演習課題"]').classList.add('active');
  });

  // 理解したボタン
  document.getElementById('understandBtn').addEventListener('click', async () => {
    const subjects = subjectsData || await loadSubjects();
    // より柔軟な検索：id、dataId、nameで検索
    let s = subjects.find(x => 
      x.dataId === modalState.dataId || 
      x.id === modalState.dataId || 
      x.name === modalState.name
    );
    
    if (!s && modalState.dataId) {
      // 科目データが存在しない場合は作成
      console.log(`📝 新しい科目データを作成: ${modalState.name} (${modalState.dataId})`);
      s = {
        id: modalState.dataId,
        name: modalState.name,
        dataId: modalState.dataId,
        progress: 0,
        totalTime: 0,
        lastUpdated: new Date().toISOString()
      };
      subjects.push(s);
    }
    
    if (s) {
      s.progress = (s.progress || 0) + 1;
      s.lastUpdated = new Date().toISOString();
      saveSubjects(subjects);
      updateTimetableProgressBars();
      updateSummaryStats();
      // モーダルの進捗バーも更新
      updateModalProgress(s.dataId);
      document.getElementById('taskModal').style.display = 'none';
      console.log(`✅ ${s.name} の理解度を増加: ${s.progress}回`);
    }
  });

  // 戻すボタン
  document.getElementById('ununderstandBtn').addEventListener('click', async () => {
    const subjects = subjectsData || await loadSubjects();
    // より柔軟な検索：id、dataId、nameで検索
    let s = subjects.find(x => 
      x.dataId === modalState.dataId || 
      x.id === modalState.dataId || 
      x.name === modalState.name
    );
    
    if (s && s.progress > 0) {
      s.progress = Math.max(0, (s.progress || 0) - 1);
      s.lastUpdated = new Date().toISOString();
      saveSubjects(subjects);
      updateTimetableProgressBars();
      updateSummaryStats();
      // モーダルの進捗バーも更新
      updateModalProgress(s.dataId);
      document.getElementById('taskModal').style.display = 'none';
      console.log(`↩️ ${s.name} の理解度を減少: ${s.progress}回`);
    } else if (s && s.progress === 0) {
      alert('理解度は既に0回です。これ以上減らすことはできません。');
    } else {
      alert('科目データが見つかりません。');
    }
  });

  // 学習時間関連のイベントリスナーは削除済み

  // 課題タイプボタンの切り替え
  document.querySelectorAll('.task-type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.task-type-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // キャンセルボタン
  const cancelBtn = document.getElementById('cancelModalBtn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      console.log('🔴 キャンセルボタンがクリックされました');
      document.getElementById('taskModal').style.display = 'none';
    });
  }
  
  // モーダル外クリックで閉じる
  window.addEventListener('click', function(e) {
    const modal = document.getElementById('taskModal');
    if (e.target === modal) {
      console.log('🔴 モーダル外クリックで閉じます');
      modal.style.display = 'none';
    }
  });

  // ESCキーでモーダルを閉じる
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      console.log('🔴 ESCキーでモーダルを閉じます');
      document.getElementById('taskModal').style.display = 'none';
    }
  });

}

// 学習時間関連の機能は削除済み

// 初期化関数
async function boot() {
  console.log('🚀 統合アプリを初期化中...');
  
  // 現在の日付を確認
  const today = new Date();
  const todayISO = getTodayISO();
  console.log('📅 現在の日付:', todayISO);
  console.log('📅 現在の日付オブジェクト:', today);
  
  // Firebase接続チェック
  checkFirebase();
  
  // データを読み込み
  await loadSubjects();
  
  console.log('📊 === 読み込み完了 ===');
  console.log('subjectsData:', subjectsData);
  console.log('subjectsData.length:', subjectsData?.length || 0);
  
  // CS科目のデータを特別に確認
  let csSubject = subjectsData?.find(s => s.name === 'CS' || s.dataId === 'CS');
  if (csSubject) {
    console.log('🎯 CS科目データ発見:', csSubject);
    console.log('🎯 CS科目の進捗:', csSubject.progress);
    console.log('🎯 CS科目の学習時間:', csSubject.totalTime);
  } else {
    console.log('⚠️ CS科目データが見つかりません - 作成します');
    console.log('🔍 全科目データ:', subjectsData?.map(s => ({ name: s.name, dataId: s.dataId, id: s.id })));
    
    // CS科目のデータを作成
    const newCSSubject = {
      id: 'CS',
      name: 'CS',
      dataId: 'CS',
      progress: 0,
      totalTime: 0,
      lastUpdated: new Date().toISOString()
    };
    
    if (!subjectsData) {
      subjectsData = [];
    }
    subjectsData.push(newCSSubject);
    saveSubjects(subjectsData);
    console.log('✅ CS科目データを作成しました:', newCSSubject);
  }
  
  // 月曜日の授業日を確認
  const mondayDays = getClassDaysByWeekday('月曜日');
  console.log('📅 月曜日の全授業日:', mondayDays.map(d => d.date));
  const pastMondayDays = mondayDays.filter(d => d.date <= todayISO);
  console.log('📅 月曜日の過去授業日:', pastMondayDays.map(d => d.date));
  console.log('📅 月曜日の週数:', pastMondayDays.length);
  
  // 時間割を初期化・読み込み
  initializeTimetable();
  loadTimetable();
  loadTasks();
  
  // 少し待ってからUI更新（Firebaseデータの読み込みを待つ）
  setTimeout(() => {
    console.log('🔄 UI更新開始...');
    
    // 時間割を再生成して色を更新
    if (window.currentTimetableData) {
      console.log('🎨 時間割の色を更新中...');
      generateTimetable(window.currentTimetableData);
    }
    
    updateTimetableProgressBars();
    updateWeekDisplay();
    updateSummaryStats();
    
    // タスク数バッジを再表示
    if (window.tasks) {
      console.log('🔄 boot関数でタスク数バッジを再表示');
      updateTaskNumbers(window.tasks);
    }
    
    console.log('✅ UI更新完了');
    
    // CS科目の最終確認
    const finalCSSubject = subjectsData?.find(s => s.name === 'CS' || s.dataId === 'CS');
    if (finalCSSubject) {
      console.log('🎯 最終確認 - CS科目データ:', finalCSSubject);
    } else {
      console.log('❌ 最終確認 - CS科目データが見つかりません');
    }
  }, 1000);
  
  // イベントリスナー設定
  wireEvents();
  
  console.log('🎉 === 初期化完了 ===');
}

// 時間割の色を強制更新する関数
function refreshTimetableColors() {
  if (window.currentTimetableData) {
    console.log('🎨 時間割の色を強制更新中...');
    generateTimetable(window.currentTimetableData);
    updateTimetableProgressBars();
    
    // タスク数バッジを再表示
    if (window.tasks) {
      console.log('🔄 refreshTimetableColorsでタスク数バッジを再表示');
      updateTaskNumbers(window.tasks);
    }
  }
}

// テスト用タスクを追加する関数
function addTestTask() {
  if (!window.tasks) {
    window.tasks = {};
  }
  
  const testTask = {
    period: '1限',
    day: '木',
    title: 'CS',
    content: 'テストタスク',
    dueDate: '2024-12-31',
    taskType: '演習課題',
    completed: false,
    createdAt: Date.now()
  };
  
  const taskId = 'test-' + Date.now();
  window.tasks[taskId] = testTask;
  
  console.log('🧪 テストタスクを追加:', testTask);
  updateTaskNumbers(window.tasks);
}

// グローバルに関数を公開
window.setDate = setDate;
window.refreshTimetableColors = refreshTimetableColors;
window.addTestTask = addTestTask;

// DOMContentLoadedで初期化
document.addEventListener('DOMContentLoaded', boot);

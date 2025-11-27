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

// 科目ごとの背景色を定義（ほんの少し濃い色で見やすく）
const subjectColors = {
  'CS': '#FEF0F0', // コンピュータサイエンス - ほんの少し濃いピンク
  '微分積分': '#F0FEF0', // 数学 - ほんの少し濃いグリーン
  'Cプロ': '#F0F8FF', // プログラミング - ほんの少し濃いブルー
  '実験': '#FFFEF0', // 実験 - ほんの少し濃いイエロー
  '線形代数': '#FFF0E6', // 数学 - ほんの少し濃いオレンジ
  '中国語IA': '#F8F0FF', // 語学 - ほんの少し濃いパープル
  '中国語IB': '#FEF0F8', // 語学 - ほんの少し濃いマゼンタ
  '憲法IB': '#F0FEF8', // 法学 - ほんの少し濃いティール
  '電磁気学A': '#FEF0F0', // 物理学 - ほんの少し濃いレッド
  '電生': '#F0FEF0', // 電気・生物 - ほんの少し濃いライム
  '生命科学A': '#F0F8FF', // 生物学 - ほんの少し濃いスカイブルー
  '力学A': '#FFF8F0', // 物理学 - ほんの少し濃いゴールド
  'ALC': '#F8F0FF', // 語学 - ほんの少し濃いバイオレット
  '化学': '#F0FEF8', // 化学 - ほんの少し濃いアクア
  '科学と芸術': '#FEF0FF', // 科学と芸術 - ほんの少し濃いフクシア
  '身体論': '#F0F0FF', // 身体論 - ほんの少し濃いインディゴ
  '電基礎': '#FEF0F0', // 電気基礎 - ほんの少し濃いローズ
  '生命科学': '#F8FEF0'  // 生命科学 - ほんの少し濃いライムグリーン
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
let displayMode = 'progress'; // 'progress' | 'evaluation'
let evaluationsData = null;
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

// 完了タスクの自動削除関数（1ヶ月以上経過した完了タスクを削除）
function cleanupOldCompletedTasks(tasks) {
  if (!isFirebaseEnabled || !tasks) return;
  
  const now = Date.now();
  const oneMonthInMs = 30 * 24 * 60 * 60 * 1000; // 30日をミリ秒に変換
  const tasksToDelete = [];
  
  // 削除対象のタスクIDを収集
  Object.entries(tasks).forEach(([taskId, task]) => {
    if (task.completed && task.completedAt) {
      const completedAt = task.completedAt;
      const ageInMs = now - completedAt;
      
      if (ageInMs > oneMonthInMs) {
        tasksToDelete.push(taskId);
      }
    }
  });
  
  // 削除対象のタスクをFirebaseから削除
  if (tasksToDelete.length > 0) {
    console.log(`🗑️ ${tasksToDelete.length}個の古い完了タスクを削除中...`);
    tasksToDelete.forEach(taskId => {
      const taskRef = window.firebase.ref(window.firebase.db, `tabler/tasks/${taskId}`);
      window.firebase.remove(taskRef).catch((error) => {
        console.error(`タスク ${taskId} の削除に失敗:`, error);
      });
    });
  }
}

// タスクを読み込む関数（v11対応）
function loadTasks() {
  if (!isFirebaseEnabled) {
    // Firebaseが無効な場合は空のタスクデータを設定
    window.tasks = {};
    displayTasks({});
    updateTaskNumbers({});
    updateIncompleteTasksCount({});
    return;
  }
  
  const tasksRef = window.firebase.ref(window.firebase.db, "tabler/tasks");
  window.firebase.onValue(tasksRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      // 古い完了タスクを自動削除
      cleanupOldCompletedTasks(data);
      
      window.tasks = data;
      displayTasks(data);
      updateTaskNumbers(data);
      updateIncompleteTasksCount(data);
    } else {
      // データが存在しない場合
      window.tasks = {};
      displayTasks({});
      updateTaskNumbers({});
      updateIncompleteTasksCount({});
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

// ユニークな科目リストを取得（Firebaseデータベースベース）
function getUniqueSubjects() {
  const subjects = subjectsData || [];
  
  // Firebaseデータベースに実際に存在する科目のみを返す
  const uniqueSubjects = subjects.map(subject => ({
    id: subject.id,
    name: subject.name,
    dataId: subject.dataId
  }));
  
  return uniqueSubjects;
}
function getEvaluationByName(name) {
  if (!evaluationsData) return null;
  // 同義マッピング
  const aliasMap = {
    '電磁気学A': '電磁気',
    '電磁気': '電磁気',
    '電基礎': '電電電気',
    '電電電気': '電電電気',
    '力学A': '力学',
    '力学': '力学'
  };
  const key = aliasMap[name] || name;
  const list = evaluationsData.subjects || [];
  // displayName 優先 → subjectId でも照合
  return list.find(s => s.displayName === key || s.subjectId === key) || null;
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
    return 1;
  }
  
  // その科目の授業日を取得
  const allDays = getClassDaysByWeekday(subject.dayOfWeek);
  const pastDays = allDays.filter(d => d.date <= todayISO);
  const weekCount = Math.max(pastDays.length, 1);
  
  return weekCount;
}

// 時間割を生成する関数（統合版 - @tablerの機能を正しく継承）
function generateTimetable(timetableData) {
  // 現在の時間割データを保存
  window.currentTimetableData = timetableData;
  
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
    { name: '4限', time: '15:05-16:45' },
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

        // セル内の進捗要素（バーとテキスト）を生成
        const progressWrap = document.createElement('div');
        progressWrap.className = 'progress';
        const bar = document.createElement('div');
        bar.className = 'progress-bar';
        bar.id = `bar-${period.name}-${day}`;
        progressWrap.appendChild(bar);
        cell.appendChild(progressWrap);

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
    updateTaskNumbers(window.tasks);
  }
}

// 評価情報の読み込みと表示
let evaluationsLoaded = false;
async function loadEvaluationsIfNeeded() {
  if (evaluationsLoaded) return;
  try {
    const res = await fetch('data/evaluations.json', { cache: 'no-cache' });
    if (!res.ok) return;
    const data = await res.json();
    renderEvaluations(data);
    evaluationsLoaded = true;
  } catch (_) {}
}

function renderEvaluations(data) {
  const container = document.getElementById('evaluationsContainer');
  if (!container || !data || !Array.isArray(data.subjects)) return;
  const subjects = data.subjects;
  container.innerHTML = subjects.map(sub => {
    const comps = (sub.components || []).map(c => {
      const wt = c.weightType === 'points' ? `${c.weight}点` : `${c.weight}%`;
      const cnt = c.count ? ` x ${c.count}` : '';
      const note = c.note ? ` <span class="eval-note">(${c.note})</span>` : '';
      return `<li class="eval-item"><span class="eval-type">${c.type}${cnt}</span><span class="eval-weight">${wt}</span>${note}</li>`;
    }).join('');
    const total = sub.totalPoints ? `<div class="eval-total">合計: ${sub.totalPoints}点</div>` : '';
    return `
      <section class="evaluation-card">
        <h3 class="evaluation-title">${sub.displayName || sub.subjectId}</h3>
        <ul class="evaluation-list">${comps}</ul>
        ${total}
      </section>
    `;
  }).join('');
}

// タスク数を計算して更新する関数
function updateTaskNumbers(tasks) {
  const taskAggregates = {};
  
  const taskTypePriority = {
    'Assignment': 3,
    'Report': 2,
    'Test': 1
  };

  const normalizeTaskType = (type) => {
    const map = {
      'Assignment': 'Assignment',
      'assignment': 'Assignment',
      '課題': 'Assignment',
      'Report': 'Report',
      'report': 'Report',
      'レポート': 'Report',
      'Test': 'Test',
      'test': 'Test',
      'テスト': 'Test'
    };
    return map[type] || null;
  };

  const getDueTime = (dueDate) => {
    if (!dueDate) return Infinity;
    const time = new Date(dueDate).getTime();
    return Number.isNaN(time) ? Infinity : time;
  };
  
  Object.values(tasks).forEach(task => {
    if (task.completed) return;
    
    const key = `${task.period}_${task.day}_${task.title}`;
    if (!taskAggregates[key]) {
      taskAggregates[key] = {
        count: 0,
        type: 'Assignment',
        dueTime: Infinity,
        dueRaw: null
      };
    }

    const aggregate = taskAggregates[key];
    aggregate.count += 1;

    const normalizedType = normalizeTaskType(task.taskType) || 'Assignment';
    const taskDueTime = getDueTime(task.dueDate);

    if (taskDueTime < aggregate.dueTime) {
      aggregate.dueTime = taskDueTime;
      aggregate.dueRaw = task.dueDate;
      aggregate.type = normalizedType;
    } else if (taskDueTime === aggregate.dueTime) {
      const currentPriority = taskTypePriority[aggregate.type] || 0;
      const newPriority = taskTypePriority[normalizedType] || 0;
      if (newPriority > currentPriority) {
        aggregate.type = normalizedType;
      }
    } else if (!aggregate.dueRaw) {
      aggregate.type = normalizedType;
    }
  });

  const cells = document.querySelectorAll('.cell:not(.header):not(.time)');
  
  cells.forEach(cell => {
    const title = cell.querySelector('.title')?.textContent;
    if (title) {
      const period = cell.getAttribute('data-period');
      const day = cell.getAttribute('data-day');
      const key = `${period}_${day}_${title}`;
      const aggregate = taskAggregates[key];
      const count = aggregate?.count || 0;
      const priorityType = aggregate?.type || 'Assignment';

      // 既存の数値表示を削除
      const existingCircle = cell.querySelector('.number-circle');
      if (existingCircle) {
        existingCircle.remove();
      }

      // タスク数が0より大きい場合のみ表示
      if (count > 0) {
        const numberCircle = document.createElement('div');
        numberCircle.className = 'number-circle';
        numberCircle.textContent = count;
        numberCircle.style.display = 'flex';
        
        // タスクタイプに応じて形状を設定
        if (priorityType === 'Test') {
          numberCircle.classList.add('shape-star');
        } else if (priorityType === 'Report') {
          numberCircle.classList.add('shape-square');
        } else {
          // Assignmentはデフォルトの円形
          numberCircle.classList.add('shape-circle');
        }
        
        // 期限に応じて色を設定
        const dueDate = aggregate?.dueRaw;
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
      }
    }
  });
  
  // 未完了タスク数を更新
  updateIncompleteTasksCount(tasks);
}

// 時間割の進捗バーを更新する関数
function updateTimetableProgressBars() {
  const subjects = subjectsData || [];

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
          s = subjects.find(sub => 
            sub.name === 'CS' || 
            sub.dataId === 'CS' || 
            sub.id === 'CS' ||
            sub.id === 'mon-1'
          );
        }
        
        if (!s) {
          // 科目データが存在しない場合は作成
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
        
        // 既存の評価チップをクリア
        const existingChips = cell.querySelector('.eval-chips');
        if (existingChips) existingChips.remove();

        const bar = cell.querySelector('.progress-bar');
        const text = cell.querySelector('.progress-text');

        if (displayMode === 'evaluation') {
          // 評価表示: プログレスUIは常に非表示
          if (bar) bar.style.display = 'none';
          if (text) text.style.display = 'none';
          // 評価チップをタイトル名（または科目名）で表示
          const evalName = (s && s.name) ? s.name : title;
          const evalInfo = getEvaluationByName(evalName);
          if (evalInfo && Array.isArray(evalInfo.components)) {
            const chips = document.createElement('div');
            chips.className = 'eval-chips';
            evalInfo.components.slice(0, 3).forEach(c => {
              const chip = document.createElement('div');
              chip.className = 'eval-chip';
              const weight = c.weightType === 'points' ? `${c.weight}点` : `${c.weight}%`;
              chip.innerHTML = `${c.type}<span class=\"w\">${weight}</span>`;
              chips.appendChild(chip);
            });
            cell.appendChild(chips);
          }
        } else if (s) {
          // 進捗表示
          const denom = getCurrentWeekForSubject(s.name);
          const pct = Math.max(0, Math.min(100, Math.floor((denom ? (s.progress / denom) : 0) * 100)));
          if (bar) {
            bar.style.display = '';
            bar.style.width = `${pct}%`;
            bar.className = `progress-bar ${computeProgressColorClass(pct)}`;
          }
          if (text) {
            text.style.display = '';
            text.textContent = `${s.progress || 0}/${denom}`;
          }
        } else {
          // データなし時の進捗表示: バーとテキストを初期化
          if (bar) {
            bar.style.display = '';
            bar.style.width = `0%`;
            bar.className = `progress-bar ${computeProgressColorClass(0)}`;
          }
          if (text) {
            const denom = getCurrentWeekForSubject(title);
            text.style.display = '';
            text.textContent = `0/${denom}`;
          }
        }
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
  
  // 全体進捗を計算（各科目の進捗と週数を合計）
  let totalProgress = 0;
  let totalRequired = 0;
  
  getUniqueSubjects().forEach(uniqueSubject => {
    // より柔軟な検索：id、dataId、nameで検索
    const subject = subjects.find(s => 
      s.id === uniqueSubject.id || 
      s.dataId === uniqueSubject.dataId || 
      s.name === uniqueSubject.name
    );
    
    const currentWeek = getCurrentWeekForSubject(uniqueSubject.name);
    const progress = subject ? subject.progress || 0 : 0;
    
    totalProgress += progress;
    totalRequired += currentWeek;
  });
  
  const overallProgressPercent = totalRequired > 0 ? Math.round((totalProgress / totalRequired) * 100) : 0;
  
  // 表示を更新
  const overallProgressEl = document.getElementById('overallProgress');
  if (overallProgressEl) {
    overallProgressEl.textContent = `${overallProgressPercent}%`;
  }
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

// 未完了タスク数を更新する関数
function updateIncompleteTasksCount(tasks) {
  const tasksData = tasks || window.tasks || {};
  let incompleteCount = 0;
  
  Object.values(tasksData).forEach(task => {
    if (!task.completed) {
      incompleteCount++;
    }
  });
  
  const incompleteTasksEl = document.getElementById('incompleteTasksCount');
  if (incompleteTasksEl) {
    incompleteTasksEl.textContent = incompleteCount;
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
    setDate('nextWeek');
  }, 100);
  
  // 進捗管理の進捗を更新（少し遅延させてデータ読み込みを待つ）
  setTimeout(() => {
    if (cellSubject) {
      updateModalProgress(cellSubject.dataId);
    }
  }, 200);
  
  // フォームをリセット
  document.getElementById('taskForm').reset();
  document.querySelector('.task-type-btn.active').classList.remove('active');
  document.querySelector('.task-type-btn[data-type="課題"]').classList.add('active');
}

// モーダル内タブ切り替え（削除済み）
// 統合モーダルではタブ機能は不要

// モーダルの進捗を更新（プログレスバー部分は削除）
function updateModalProgress(dataId) {
  if (!dataId) {
    return;
  }
  
  const subjects = subjectsData || [];
  const s = subjects.find(x => x.dataId === dataId);
  
  if (s) {
    const currentProgress = s.progress || 0;
    const denom = getCurrentWeekForSubject(s.name);
    
    // カスタム入力をリセット
    const customInput = document.getElementById('customTimeInput');
    if (customInput) {
      customInput.value = '';
    }
  }
}

// 日付を設定する関数（@tablerから）
function setDate(type) {
  const modalSubtitle = document.getElementById('modalSubtitle').textContent;
  const [period, day] = modalSubtitle.split(' ');
  
  const dayMap = { '月': 1, '火': 2, '水': 3, '木': 4, '金': 5 };
  const subjectDay = dayMap[day];
  
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
    // チェックボックス自体の中心座標を使用
    const cbRect = checkbox.getBoundingClientRect();
    const cx = cbRect.left + cbRect.width / 2;
    const cy = cbRect.top + cbRect.height / 2;
    const opts = { x: cx, y: cy };
    updateTaskCompletion(taskId, checkbox.checked, opts);
    // 視覚フィードバック
    const item = div;
    if (checkbox.checked) {
      item.classList.add('completed-animate');
      setTimeout(() => item.classList.remove('completed-animate'), 450);
    }
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
function updateTaskCompletion(taskId, completed, opts) {
  if (!isFirebaseEnabled) return;
  
  const taskRef = window.firebase.ref(window.firebase.db, `tabler/tasks/${taskId}`);
  window.firebase.set(taskRef, {
    ...window.tasks[taskId],
    completed: completed,
    completedAt: completed ? Date.now() : null
  }).then(() => {
    // タスク完了時に古い完了タスクをクリーンアップ
    if (completed) {
      // 少し遅延させてからクリーンアップ（現在のタスクの更新を待つ）
      setTimeout(() => {
        if (window.tasks) {
          cleanupOldCompletedTasks(window.tasks);
        }
      }, 1000);
      
      const x = opts?.x;
      const y = opts?.y;
      playCelebrateAnimation(x, y, ['#3b82f6', '#60a5fa', '#0ea5e9', '#38bdf8']);
    }
  });
}

function playCelebrateAnimation(x, y, palette) {
  const container = document.createElement('div');
  container.className = 'celebrate';
  const isNum = (v) => typeof v === 'number' && !Number.isNaN(v);
  const vx = isNum(x) ? x : (window.innerWidth / 2);
  const vy = isNum(y) ? y : (window.innerHeight * 0.22);
  container.style.left = `${vx}px`;
  container.style.top = `${vy}px`;
  container.style.transform = 'translate(-50%, -50%)';
  const burst = document.createElement('div');
  burst.className = 'burst';
  container.appendChild(burst);
  const colors = palette || ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  const count = 18;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const angle = (Math.PI * 2 * i) / count;
    const dist = 56 + Math.random() * 36;
    p.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
    p.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
    p.style.background = colors[i % colors.length];
    p.style.animationDelay = `${Math.random() * 140}ms`;
    burst.appendChild(p);
  }
  document.body.appendChild(container);
  setTimeout(() => container.remove(), 950);
}

function triggerButtonRipple(btn, clientX, clientY) {
  if (!btn) return;
  const rect = btn.getBoundingClientRect();
  const x = (clientX ?? (rect.left + rect.width / 2));
  const y = (clientY ?? (rect.top + rect.height / 2));
  const span = document.createElement('span');
  span.className = 'ripple';
  span.style.left = `${x - rect.left}px`;
  span.style.top = `${y - rect.top}px`;
  btn.appendChild(span);
  setTimeout(() => span.remove(), 700);
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
      popup.remove();
    }
  });

  // ESCキーで閉じる
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
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

      if (tab.dataset.tab === 'evaluations') {
        loadEvaluationsIfNeeded();
      }
    });
  });

  // 表示モードトグル
  const modeSegment = document.getElementById('modeSegment');
  if (modeSegment) {
    const segButtons = modeSegment.querySelectorAll('.seg-btn');
    const setMode = async (mode) => {
      displayMode = mode;
      // active切り替え
      segButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.mode === mode));
      modeSegment.classList.toggle('evaluation-selected', mode === 'evaluation');
      // Bodyクラスで強制表示
      if (mode === 'evaluation') {
        document.body.classList.add('evaluation-mode');
      } else {
        document.body.classList.remove('evaluation-mode');
      }
      if (mode === 'evaluation' && !evaluationsData) {
        try {
          const res = await fetch('data/evaluations.json', { cache: 'no-cache' });
          if (res.ok) evaluationsData = await res.json();
        } catch (_) {}
      }
      updateTimetableProgressBars();
    };
    segButtons.forEach(btn => {
      btn.addEventListener('click', () => setMode(btn.dataset.mode));
    });
    // 初期状態反映
    setMode(displayMode);
  }

  // モーダル内タブ切り替え（削除済み）
  // 統合モーダルではタブ機能は不要

  // タスクフォーム送信
  document.getElementById('taskForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const taskContent = document.getElementById('taskContent').value;
    const selectedTaskType = document.querySelector('.task-type-btn.active')?.dataset.type;
    
    const taskData = {
      content: taskContent || (selectedTaskType ? selectedTaskType : '課題'),
      dueDate: document.getElementById('taskDate').value,
      taskType: taskContent ? null : selectedTaskType
    };

    const modalTitle = document.getElementById('modalTitle').textContent;
    const modalSubtitle = document.getElementById('modalSubtitle').textContent;
    const [period, day] = modalSubtitle.split(' ');

    saveTask(period, day, modalTitle, taskData);
    
    document.getElementById('taskModal').style.display = 'none';
    this.reset();
    document.querySelector('[data-type="課題"]').classList.add('active');
  });

  // 理解したボタン
  const understandBtn = document.getElementById('understandBtn');
  understandBtn.addEventListener('click', async (e) => {
    triggerButtonRipple(understandBtn, e.clientX, e.clientY);
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
      // お祝い演出（ボタン位置で/フォールバックはボタン中央）
      const btnRect = understandBtn.getBoundingClientRect();
      const px = e.clientX || (btnRect.left + btnRect.width / 2);
      const py = e.clientY || (btnRect.top + btnRect.height / 2);
      playCelebrateAnimation(px, py, ['#10b981', '#34d399', '#6ee7b7', '#22c55e']);
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
    // 時間割を再生成して色を更新
    if (window.currentTimetableData) {
      generateTimetable(window.currentTimetableData);
    }
    
    updateTimetableProgressBars();
    updateWeekDisplay();
    updateSummaryStats();
    
    // タスク数バッジを再表示
    if (window.tasks) {
      updateTaskNumbers(window.tasks);
      updateIncompleteTasksCount(window.tasks);
    }
    
    // CS科目の最終確認
    const finalCSSubject = subjectsData?.find(s => s.name === 'CS' || s.dataId === 'CS');
  }, 1000);
  
  // イベントリスナー設定
  wireEvents();

  // 初期モードのCSSを反映
  if (displayMode === 'evaluation') {
    document.body.classList.add('evaluation-mode');
  } else {
    document.body.classList.remove('evaluation-mode');
  }
  
}

// 時間割の色を強制更新する関数
function refreshTimetableColors() {
  if (window.currentTimetableData) {
    generateTimetable(window.currentTimetableData);
    updateTimetableProgressBars();
    
    // タスク数バッジを再表示
    if (window.tasks) {
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
    taskType: '課題',
    completed: false,
    createdAt: Date.now()
  };
  
  const taskId = 'test-' + Date.now();
  window.tasks[taskId] = testTask;
  
  updateTaskNumbers(window.tasks);
}

// データベースをクリーンアップする関数
function cleanupDatabase() {
  if (!isFirebaseEnabled) {
    console.log('Firebaseが無効なため、ローカルデータをクリーンアップします');
    if (subjectsData) {
      // 空のnameを削除し、重複を除去
      const cleanedData = [];
      const seenNames = new Set();
      
      subjectsData.forEach(subject => {
        if (subject.name && subject.name.trim() !== '' && !seenNames.has(subject.name)) {
          seenNames.add(subject.name);
          cleanedData.push(subject);
        }
      });
      
      subjectsData = cleanedData;
      console.log('ローカルデータをクリーンアップしました');
    }
    return;
  }
  
  console.log('Firebaseデータベースをクリーンアップ中...');
  
  // Firebaseから全科目データを取得
  const subjectsRef = window.firebase.ref(window.firebase.db, 'subjects');
  window.firebase.get(subjectsRef)
    .then((snapshot) => {
      const data = snapshot.val();
      if (data) {
        const cleanedData = {};
        const seenNames = new Set();
        let removedCount = 0;
        
        Object.values(data).forEach(subject => {
          // 空のnameや重複を除去
          if (subject.name && subject.name.trim() !== '' && !seenNames.has(subject.name)) {
            seenNames.add(subject.name);
            // より適切なdataIdを生成
            const cleanDataId = subject.name.replace(/[^a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, '-');
            cleanedData[cleanDataId] = {
              id: cleanDataId,
              name: subject.name,
              dataId: cleanDataId,
              progress: subject.progress || 0,
              lastUpdated: subject.lastUpdated || new Date().toISOString()
            };
          } else {
            removedCount++;
            console.log(`削除対象: ${subject.name || '(空の名前)'}`);
          }
        });
        
        // クリーンアップされたデータを保存
        window.firebase.set(subjectsRef, cleanedData)
          .then(() => {
            console.log(`${removedCount}個の重複・空エントリを削除しました`);
            console.log(`残った科目数: ${Object.keys(cleanedData).length}`);
            // ローカルデータも更新
            subjectsData = Object.values(cleanedData);
            // UIを更新
            updateTimetableProgressBars();
            updateSummaryStats();
          })
          .catch((error) => {
            console.error('Firebaseへの保存に失敗:', error);
          });
      }
    })
    .catch((error) => {
      console.error('Firebaseからの読み込みに失敗:', error);
    });
}

// グローバルに関数を公開
window.setDate = setDate;
window.refreshTimetableColors = refreshTimetableColors;
window.addTestTask = addTestTask;
window.cleanupDatabase = cleanupDatabase;

// DOMContentLoadedで初期化
document.addEventListener('DOMContentLoaded', boot);

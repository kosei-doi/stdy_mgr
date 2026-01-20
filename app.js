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

// ============================================
// Step1: 学期管理機能
// ============================================
// グローバル変数: 学期管理
let semestersData = []; // 学期データ配列
let currentSemesterId = null; // 選択中の学期ID

// 学期データ構造: { id, name, startDate, endDate, classDays, timetable, createdAt }
// id: 一意のID（タイムスタンプベース）
// name: 学期名（例: "2025年度 秋学期"）
// startDate: 開始日（YYYY-MM-DD形式）
// endDate: 終了日（YYYY-MM-DD形式）
// classDays: 授業日の配列（YYYY-MM-DD形式の文字列配列）
// timetable: 時間割データ（5x5の2次元配列、[period][day]）
// createdAt: 作成日時（タイムスタンプ）

// 学期データを読み込む関数
function loadSemesters() {
  return new Promise((resolve) => {
    if (isFirebaseEnabled) {
      // Firebaseから読み込み
      const semestersRef = window.firebase.ref(window.firebase.db, 'semesters');
      window.firebase.get(semestersRef)
        .then((snapshot) => {
          const data = snapshot.val();
          if (data) {
            semestersData = Object.values(data);
            // 既存データにclassDaysやtimetableがない場合は初期化
            semestersData.forEach(semester => {
              if (!semester.classDays) {
                semester.classDays = generateDefaultClassDays(semester.startDate, semester.endDate);
              }
              if (!semester.timetable) {
                semester.timetable = JSON.parse(JSON.stringify(initialTimetableData));
              }
            });
            // デフォルト学期が存在しない場合は作成
            if (semestersData.length === 0) {
              createDefaultSemester();
            }
          } else {
            createDefaultSemester();
          }
          // 選択中の学期を復元（localStorageから）
          const savedSemesterId = localStorage.getItem('currentSemesterId');
          if (savedSemesterId && semestersData.find(s => s.id === savedSemesterId)) {
            currentSemesterId = savedSemesterId;
          } else if (semestersData.length > 0) {
            currentSemesterId = semestersData[0].id;
            localStorage.setItem('currentSemesterId', currentSemesterId);
          }
          resolve(semestersData);
        })
        .catch((error) => {
          console.error('Firebaseからの学期データ読み込みに失敗:', error);
          loadSemestersFromLocalStorage();
          resolve(semestersData);
        });
    } else {
      // localStorageから読み込み
      loadSemestersFromLocalStorage();
      resolve(semestersData);
    }
  });
}

// localStorageから学期データを読み込む関数
function loadSemestersFromLocalStorage() {
  try {
    const stored = localStorage.getItem('semestersData');
    if (stored) {
      semestersData = JSON.parse(stored);
      // 既存データにclassDaysやtimetableがない場合は初期化
      semestersData.forEach(semester => {
        if (!semester.classDays) {
          semester.classDays = generateDefaultClassDays(semester.startDate, semester.endDate);
        }
        if (!semester.timetable) {
          semester.timetable = JSON.parse(JSON.stringify(initialTimetableData));
        }
      });
    } else {
      createDefaultSemester();
    }
    // 選択中の学期を復元
    const savedSemesterId = localStorage.getItem('currentSemesterId');
    if (savedSemesterId && semestersData.find(s => s.id === savedSemesterId)) {
      currentSemesterId = savedSemesterId;
    } else if (semestersData.length > 0) {
      currentSemesterId = semestersData[0].id;
      localStorage.setItem('currentSemesterId', currentSemesterId);
    }
  } catch (error) {
    console.error('localStorageからの学期データ読み込みに失敗:', error);
    createDefaultSemester();
  }
}

// デフォルト学期を作成する関数
function createDefaultSemester() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  
  // 現在の月から学期を推定（4-9月: 春学期、10-3月: 秋学期）
  let semesterName, startDate, endDate;
  if (month >= 4 && month <= 9) {
    semesterName = `${year}年度 春学期`;
    startDate = `${year}-04-01`;
    endDate = `${year}-09-30`;
  } else {
    semesterName = month >= 10 ? `${year}年度 秋学期` : `${year-1}年度 秋学期`;
    if (month >= 10) {
      startDate = `${year}-10-01`;
      endDate = `${year+1}-03-31`;
    } else {
      startDate = `${year-1}-10-01`;
      endDate = `${year}-03-31`;
    }
  }
  
  // デフォルトの授業日を生成（月〜金のみ、祝日は除外）
  const classDays = generateDefaultClassDays(startDate, endDate);
  
  // 空の時間割（5限×5曜日）
  const emptyTimetable = [
    ['', '', '', '', ''],  // 1限
    ['', '', '', '', ''],  // 2限
    ['', '', '', '', ''],  // 3限
    ['', '', '', '', ''],  // 4限
    ['', '', '', '', '']   // 5限
  ];
  
  const defaultSemester = {
    id: `semester_${Date.now()}`,
    name: semesterName,
    startDate: startDate,
    endDate: endDate,
    classDays: classDays,
    timetable: emptyTimetable,
    createdAt: Date.now()
  };
  
  semestersData = [defaultSemester];
  currentSemesterId = defaultSemester.id;
  saveSemesters();
  localStorage.setItem('currentSemesterId', currentSemesterId);
}

// ローカル時間で日付文字列を生成する関数（YYYY-MM-DD形式）
function formatDateLocal(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// デフォルトの授業日を生成する関数（月〜金のみ）
function generateDefaultClassDays(startDate, endDate) {
  const classDays = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  const current = new Date(start);
  
  // 時間をリセットして日付のみで比較
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  current.setHours(0, 0, 0, 0);
  
  while (current <= end) {
    const dayOfWeek = current.getDay();
    // 月曜日(1)〜金曜日(5)のみ
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      const dateStr = formatDateLocal(current);
      classDays.push(dateStr);
    }
    current.setDate(current.getDate() + 1);
  }
  
  return classDays;
}

// 学期データを保存する関数
function saveSemesters() {
  if (isFirebaseEnabled) {
    // Firebaseに保存
    const semestersRef = window.firebase.ref(window.firebase.db, 'semesters');
    // オブジェクト形式に変換
    const semestersObj = {};
    semestersData.forEach(semester => {
      semestersObj[semester.id] = semester;
    });
    window.firebase.set(semestersRef, semestersObj)
      .catch((error) => {
        console.error('Firebaseへの学期データ保存に失敗:', error);
        // フォールバック: localStorageにも保存
        localStorage.setItem('semestersData', JSON.stringify(semestersData));
      });
  } else {
    // localStorageに保存
    localStorage.setItem('semestersData', JSON.stringify(semestersData));
  }
}

// 学期を追加する関数
function addSemester(name, startDate, endDate) {
  // デフォルトの授業日を生成
  const classDays = generateDefaultClassDays(startDate, endDate);
  // 空の時間割（5限×5曜日）
  const emptyTimetable = [
    ['', '', '', '', ''],  // 1限
    ['', '', '', '', ''],  // 2限
    ['', '', '', '', ''],  // 3限
    ['', '', '', '', ''],  // 4限
    ['', '', '', '', '']   // 5限
  ];
  
  const newSemester = {
    id: `semester_${Date.now()}`,
    name: name,
    startDate: startDate,
    endDate: endDate,
    classDays: classDays,
    timetable: emptyTimetable,
    createdAt: Date.now()
  };
  semestersData.push(newSemester);
  saveSemesters();
  return newSemester;
}

// 学期を更新する関数
function updateSemester(semesterId, updates) {
  const index = semestersData.findIndex(s => s.id === semesterId);
  if (index !== -1) {
    const semester = semestersData[index];
    // 開始日・終了日が変更された場合、授業日を再生成
    if (updates.startDate || updates.endDate) {
      const startDate = updates.startDate || semester.startDate;
      const endDate = updates.endDate || semester.endDate;
      // 既存の授業日を保持しつつ、新しい範囲の日付を追加
      const newClassDays = generateDefaultClassDays(startDate, endDate);
      // 既存の授業日とマージ（重複を除去）
      const existingDays = semester.classDays || [];
      const mergedDays = [...new Set([...existingDays, ...newClassDays])]
        .filter(date => date >= startDate && date <= endDate)
        .sort();
      updates.classDays = mergedDays;
    }
    semestersData[index] = { ...semester, ...updates };
    saveSemesters();
    return semestersData[index];
  }
  return null;
}

// 学期を削除する関数
function deleteSemester(semesterId) {
  const index = semestersData.findIndex(s => s.id === semesterId);
  if (index !== -1) {
    semestersData.splice(index, 1);
    saveSemesters();
    // 削除した学期が選択中だった場合、最初の学期を選択
    if (currentSemesterId === semesterId) {
      if (semestersData.length > 0) {
        currentSemesterId = semestersData[0].id;
        localStorage.setItem('currentSemesterId', currentSemesterId);
      } else {
        currentSemesterId = null;
        localStorage.removeItem('currentSemesterId');
        // 学期がなくなった場合はデフォルト学期を作成
        createDefaultSemester();
      }
    }
    return true;
  }
  return false;
}

// 選択中の学期を取得する関数
function getCurrentSemester() {
  if (!currentSemesterId) return null;
  return semestersData.find(s => s.id === currentSemesterId) || null;
}

// 学期選択UIを生成する関数（削除: ヘッダーのセレクトボックスは不要）
// 学期の選択は管理画面の学期カードから行えます
function renderSemesterSelector() {
  // 既存のセレクトボックスを削除（念のため）
  const existingSelector = document.getElementById('semesterSelector');
  if (existingSelector) {
    existingSelector.remove();
  }
  // セレクトボックスは表示しない
}

// 学期変更時のコールバック関数
function onSemesterChanged() {
  // 選択中の学期に紐づくデータのみ表示する処理
  const currentSemester = getCurrentSemester();
  console.log('学期が変更されました:', currentSemester);
  
  // 時間割を再読み込み
  loadTimetable();
  
  // 学期一覧を再表示
  renderSemestersList();
}

// 学期一覧を表示する関数
function renderSemestersList() {
  const semestersList = document.getElementById('semestersList');
  if (!semestersList) return;
  
  semestersList.innerHTML = '';
  
  if (semestersData.length === 0) {
    semestersList.innerHTML = '<p class="empty-message">No semesters registered</p>';
    return;
  }
  
  semestersData.forEach(semester => {
    const semesterCard = document.createElement('div');
    semesterCard.className = 'semester-card';
    if (semester.id === currentSemesterId) {
      semesterCard.classList.add('active');
    }
    
    semesterCard.innerHTML = `
      <div class="semester-card-header">
        <h3 class="semester-name">${semester.name}</h3>
        ${semester.id === currentSemesterId ? '<span class="current-badge">Current</span>' : ''}
      </div>
      <div class="semester-card-body">
        <div class="semester-info">
          <span class="info-label">Start Date:</span>
          <span class="info-value">${semester.startDate}</span>
        </div>
        <div class="semester-info">
          <span class="info-label">End Date:</span>
          <span class="info-value">${semester.endDate}</span>
        </div>
      </div>
      <div class="semester-card-actions">
        <button class="btn btn-small btn-select" data-semester-id="${semester.id}">Select</button>
        <button class="btn btn-small btn-classdays" data-semester-id="${semester.id}">Class Days</button>
        <button class="btn btn-small btn-timetable" data-semester-id="${semester.id}">Timetable</button>
        <button class="btn btn-small btn-delete" data-semester-id="${semester.id}">Delete</button>
      </div>
    `;
    
    // 選択ボタン
    const selectBtn = semesterCard.querySelector('.btn-select');
    selectBtn.addEventListener('click', () => {
      currentSemesterId = semester.id;
      localStorage.setItem('currentSemesterId', currentSemesterId);
      renderSemesterSelector();
      
      // 学期切り替え時にタスクと進捗を再読み込み
      loadTasks();
      loadSubjects().then(() => {
        updateTimetableProgressBars();
        updateSummaryStats();
      });
      onSemesterChanged();
    });
    
    // 授業日管理ボタン
    const classDaysBtn = semesterCard.querySelector('.btn-classdays');
    classDaysBtn.addEventListener('click', () => {
      currentSemesterId = semester.id;
      localStorage.setItem('currentSemesterId', currentSemesterId);
      renderSemesterSelector();
      showClassDaysManagement();
    });
    
    // 時間割管理ボタン
    const timetableBtn = semesterCard.querySelector('.btn-timetable');
    timetableBtn.addEventListener('click', () => {
      currentSemesterId = semester.id;
      localStorage.setItem('currentSemesterId', currentSemesterId);
      renderSemesterSelector();
      showTimetableManagement();
    });
    
    // 削除ボタン
    const deleteBtn = semesterCard.querySelector('.btn-delete');
    deleteBtn.addEventListener('click', () => {
      if (confirm(`Delete semester "${semester.name}"?`)) {
        deleteSemester(semester.id);
        renderSemestersList();
        renderSemesterSelector();
      }
    });
    
    semestersList.appendChild(semesterCard);
  });
}

// 授業日管理画面を表示する関数（モーダル）
function showClassDaysManagement() {
  const modal = document.getElementById('classDaysModal');
  if (!modal) return;
  
  const currentSemester = getCurrentSemester();
  
  if (!currentSemester) {
    alert('Please select a semester');
    return;
  }
  
  // 学期情報を表示（シンプル版）
  renderSemesterInfoSimple(currentSemester);
  
  // カレンダーを表示（学期の開始日から、または現在の月から）
  const startDate = new Date(currentSemester.startDate);
  const today = new Date();
  const semesterStart = new Date(currentSemester.startDate);
  const semesterEnd = new Date(currentSemester.endDate);
  
  // 現在の月が学期の範囲内なら現在の月を、そうでなければ開始月を表示
  // 月の1日を基準にする
  if (today >= semesterStart && today <= semesterEnd) {
    currentCalendarMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  } else if (today < semesterStart) {
    currentCalendarMonth = new Date(semesterStart.getFullYear(), semesterStart.getMonth(), 1);
  } else {
    // 学期終了後は、終了月から表示月数を引いた月の1日を基準にする
    const endMonth = new Date(semesterEnd.getFullYear(), semesterEnd.getMonth(), 1);
    currentCalendarMonth = new Date(endMonth.getFullYear(), endMonth.getMonth() - (monthsCount - 1), 1);
  }
  
  // カレンダーコントロールを再設定（モーダルが開かれるたびに再設定）
  setupCalendarControls();
  
  // カレンダーを表示
  renderClassDaysCalendar(currentCalendarMonth);
  
  // モーダルを表示
  modal.style.display = 'block';
  
  // 閉じるボタン
  const closeBtn = document.getElementById('closeClassDaysModal');
  if (closeBtn) {
    closeBtn.onclick = () => {
      modal.style.display = 'none';
    };
  }
  
  // モーダル外クリックで閉じる
  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  };
  
  // ESCキーで閉じる
  const handleEscape = (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
      modal.style.display = 'none';
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);
}

// 学期情報を表示する関数（シンプル版）
function renderSemesterInfoSimple(semester) {
  const infoEl = document.getElementById('semesterInfo');
  if (!infoEl) return;
  
  infoEl.innerHTML = `
    <span class="semester-name-simple">${semester.name}</span>
    <span class="semester-dates-simple">${semester.startDate} - ${semester.endDate}</span>
    <button id="editDatesBtn" class="btn-edit-dates-simple">Edit</button>
  `;
  
  // 編集ボタンのイベントリスナー
  const editDatesBtn = document.getElementById('editDatesBtn');
  if (editDatesBtn) {
    editDatesBtn.addEventListener('click', () => {
      showDateEditForm(semester);
    });
  }
}

// 学期情報を表示する関数（管理画面用）
function renderSemesterInfo(semester) {
  const infoEl = document.getElementById('semesterInfo');
  if (!infoEl) return;
  
  infoEl.innerHTML = `
    <div class="semester-info-item">
      <span class="info-label">Semester:</span>
      <span class="info-value">${semester.name}</span>
    </div>
    <div class="semester-info-item">
      <span class="info-label">Period:</span>
      <span class="info-value">${semester.startDate} - ${semester.endDate}</span>
      <button id="editDatesBtn" class="btn-edit-dates">Edit</button>
    </div>
  `;
  
  // 編集ボタンのイベントリスナー
  const editDatesBtn = document.getElementById('editDatesBtn');
  if (editDatesBtn) {
    editDatesBtn.addEventListener('click', () => {
      showDateEditForm(semester);
    });
  }
}

// 日付編集フォームを表示する関数
function showDateEditForm(semester) {
  const editForm = document.getElementById('semesterDateEdit');
  const infoEl = document.getElementById('semesterInfo');
  
  if (!editForm || !infoEl) return;
  
  // 最新の学期データを取得
  const currentSemester = getCurrentSemester();
  if (!currentSemester) {
    alert('No semester selected');
    return;
  }
  
  // フォームに現在の値を設定
  const startDateInput = document.getElementById('editStartDate');
  const endDateInput = document.getElementById('editEndDate');
  
  if (startDateInput) startDateInput.value = currentSemester.startDate;
  if (endDateInput) endDateInput.value = currentSemester.endDate;
  
  // フォームを表示、情報を非表示
  infoEl.style.display = 'none';
  editForm.style.display = 'flex';
  
  // 保存ボタン
  const saveBtn = document.getElementById('saveDatesBtn');
  if (saveBtn) {
    // 既存のイベントリスナーを削除
    const newSaveBtn = saveBtn.cloneNode(true);
    saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
    
    newSaveBtn.addEventListener('click', () => {
      const currentSemester = getCurrentSemester();
      if (currentSemester) {
        saveSemesterDates(currentSemester);
      } else {
        alert('学期が選択されていません');
      }
    });
  }
  
  // キャンセルボタン
  const cancelBtn = document.getElementById('cancelDatesBtn');
  if (cancelBtn) {
    // 既存のイベントリスナーを削除
    const newCancelBtn = cancelBtn.cloneNode(true);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
    
    newCancelBtn.addEventListener('click', () => {
      cancelDateEdit();
    });
  }
}

// 学期の日付を保存する関数
function saveSemesterDates(semester) {
  const startDateInput = document.getElementById('editStartDate');
  const endDateInput = document.getElementById('editEndDate');
  
  if (!startDateInput || !endDateInput) return;
  
  const newStartDate = startDateInput.value;
  const newEndDate = endDateInput.value;
  
  if (!newStartDate || !newEndDate) {
    alert('Please enter both start and end dates');
    return;
  }
  
  if (newStartDate > newEndDate) {
    alert('The start date must be earlier than the end date');
    return;
  }
  
  // 学期を更新
  const updatedSemester = updateSemester(semester.id, {
    startDate: newStartDate,
    endDate: newEndDate
  });
  
  if (!updatedSemester) {
    alert('Failed to update semester');
    return;
  }
  
  // フォームを非表示、情報を再表示
  cancelDateEdit();
  
  // 更新された学期オブジェクトを使って再表示
  renderSemesterInfoSimple(updatedSemester);
  renderClassDaysCalendar(currentCalendarMonth);
}

// 日付編集をキャンセルする関数
function cancelDateEdit() {
  const editForm = document.getElementById('semesterDateEdit');
  const infoEl = document.getElementById('semesterInfo');
  
  if (editForm) editForm.style.display = 'none';
  if (infoEl) {
    // モーダル内か管理画面内かで表示方法を変える
    const modal = document.getElementById('classDaysModal');
    if (modal && modal.style.display === 'block') {
      infoEl.style.display = 'flex';
    } else {
      infoEl.style.display = 'flex';
    }
  }
}

// 授業日統計を表示する関数
function renderClassDaysStats(semester) {
  const statsEl = document.getElementById('classdaysStats');
  if (!statsEl) return;
  
  const classDays = semester.classDays || [];
  const startDate = new Date(semester.startDate);
  const endDate = new Date(semester.endDate);
  
  // 学期内の平日数を計算
  let weekdaysCount = 0;
  const current = new Date(startDate);
  while (current <= endDate) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      weekdaysCount++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  const classDaysCount = classDays.length;
  const holidaysCount = weekdaysCount - classDaysCount;
  
  statsEl.innerHTML = `
    <div class="stat-item">
      <span class="stat-value">${classDaysCount}</span>
      <span class="stat-label">Class Days</span>
    </div>
    <div class="stat-item">
      <span class="stat-value">${holidaysCount}</span>
      <span class="stat-label">Holidays</span>
    </div>
    <div class="stat-item">
      <span class="stat-value">${weekdaysCount}</span>
      <span class="stat-label">Total Weekdays</span>
    </div>
  `;
}

// 時間割管理画面を表示する関数（モーダル）
function showTimetableManagement() {
  const modal = document.getElementById('timetableModal');
  if (!modal) return;
  
  const currentSemester = getCurrentSemester();
  if (!currentSemester) {
    alert('Please select a semester');
    return;
  }
  
  // 時間割データのコピーを作成（編集用）
  const timetableCopy = JSON.parse(JSON.stringify(currentSemester.timetable || JSON.parse(JSON.stringify(initialTimetableData))));
  modal.dataset.timetableData = JSON.stringify(timetableCopy);
  
  renderTimetableEditor();
  
  // 保存ボタン
  const saveBtn = document.getElementById('saveTimetableBtn');
  if (saveBtn) {
    saveBtn.onclick = () => {
      saveTimetableChanges();
    };
  }
  
  // キャンセルボタン
  const cancelBtn = document.getElementById('cancelTimetableBtn');
  if (cancelBtn) {
    cancelBtn.onclick = () => {
      modal.style.display = 'none';
    };
  }
  
  // モーダルを表示
  modal.style.display = 'block';
  
  // 閉じるボタン
  const closeBtn = document.getElementById('closeTimetableModal');
  if (closeBtn) {
    closeBtn.onclick = () => {
      modal.style.display = 'none';
    };
  }
  
  // モーダル外クリックで閉じる
  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  };
  
  // ESCキーで閉じる
  const handleEscape = (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
      modal.style.display = 'none';
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);
}

// 時間割の変更を保存する関数
function saveTimetableChanges() {
  const modal = document.getElementById('timetableModal');
  const editor = document.getElementById('timetableEditor');
  if (!modal || !editor) return;
  
  const currentSemester = getCurrentSemester();
  if (!currentSemester) return;
  
  // 入力フィールドから時間割データを取得
  const inputs = editor.querySelectorAll('.timetable-input');
  const timetable = JSON.parse(JSON.stringify(initialTimetableData));
  
  inputs.forEach(input => {
    const periodIndex = parseInt(input.dataset.periodIndex);
    const dayIndex = parseInt(input.dataset.dayIndex);
    if (!isNaN(periodIndex) && !isNaN(dayIndex)) {
      timetable[periodIndex][dayIndex] = input.value.trim();
    }
  });
  
  // 学期の時間割を更新
  currentSemester.timetable = timetable;
  saveSemesters();
  
  // 時間割を再読み込み（表示を更新）
  loadTimetable();
  
  // モーダルを閉じる
  modal.style.display = 'none';
}

// 時間割エディタを表示する関数
function renderTimetableEditor() {
  const editor = document.getElementById('timetableEditor');
  if (!editor) return;
  
  const currentSemester = getCurrentSemester();
  if (!currentSemester) {
    editor.innerHTML = '<p class="empty-message">学期を選択してください</p>';
    return;
  }
  
  // モーダルから一時データを取得、なければ学期のデータを使用
  const modal = document.getElementById('timetableModal');
  let timetable;
  if (modal && modal.dataset.timetableData) {
    timetable = JSON.parse(modal.dataset.timetableData);
  } else {
    timetable = currentSemester.timetable || JSON.parse(JSON.stringify(initialTimetableData));
  }
  const days = ['月', '火', '水', '木', '金'];
  const periods = ['1限', '2限', '3限', '4限', '5限'];
  
  editor.innerHTML = '';
  
  // ヘッダー行
  const headerRow = document.createElement('div');
  headerRow.className = 'timetable-editor-header';
  const emptyCell = document.createElement('div');
  emptyCell.className = 'timetable-editor-cell header';
  headerRow.appendChild(emptyCell);
  days.forEach(day => {
    const cell = document.createElement('div');
    cell.className = 'timetable-editor-cell header';
    cell.textContent = day;
    headerRow.appendChild(cell);
  });
  editor.appendChild(headerRow);
  
  // 時間割本体
  periods.forEach((period, periodIndex) => {
    const row = document.createElement('div');
    row.className = 'timetable-editor-row';
    
    // 時限ラベル
    const periodCell = document.createElement('div');
    periodCell.className = 'timetable-editor-cell period-label';
    periodCell.textContent = period;
    row.appendChild(periodCell);
    
    // 各曜日のセル
    days.forEach((day, dayIndex) => {
      const cell = document.createElement('div');
      cell.className = 'timetable-editor-cell editable';
      
      const input = document.createElement('input');
      input.type = 'text';
      input.value = timetable[periodIndex][dayIndex] || '';
      input.placeholder = '科目名';
      input.className = 'timetable-input';
      input.dataset.periodIndex = periodIndex;
      input.dataset.dayIndex = dayIndex;
      // changeイベントでは一時的なデータに保存（保存ボタンで確定）
      input.addEventListener('input', () => {
        timetable[periodIndex][dayIndex] = input.value.trim();
      });
      
      cell.appendChild(input);
      row.appendChild(cell);
    });
    
    editor.appendChild(row);
  });
}

// 学期追加モーダルを表示する関数
function showSemesterAddModal() {
  let modal = document.getElementById('semesterModal');
  if (!modal) {
    createSemesterModal();
    // モーダル作成後、再度取得
    modal = document.getElementById('semesterModal');
  }
  
  if (!modal) {
    console.error('学期モーダルの作成に失敗しました');
    return;
  }
  
  const modalTitle = document.getElementById('semesterModalTitle');
  const semesterForm = document.getElementById('semesterForm');
  const semesterIdInput = document.getElementById('semesterId');
  const semesterYearInput = document.getElementById('semesterYear');
  const semesterTypeInput = document.getElementById('semesterType');
  
  if (modalTitle) modalTitle.textContent = '学期を追加';
  if (semesterForm) semesterForm.reset();
  if (semesterIdInput) semesterIdInput.value = '';
  
  // デフォルト値を設定
  if (semesterYearInput) {
    const currentYear = new Date().getFullYear();
    semesterYearInput.value = currentYear;
  }
  if (semesterTypeInput) {
    semesterTypeInput.value = '';
  }
  
  modal.style.display = 'block';
}

// 学期編集モーダルを表示する関数
function showSemesterEditModal(semester) {
  let modal = document.getElementById('semesterModal');
  if (!modal) {
    createSemesterModal();
    // モーダル作成後、再度取得
    modal = document.getElementById('semesterModal');
  }
  
  if (!modal) {
    console.error('学期モーダルの作成に失敗しました');
    return;
  }
  
  const modalTitle = document.getElementById('semesterModalTitle');
  const semesterForm = document.getElementById('semesterForm');
  const semesterIdInput = document.getElementById('semesterId');
  const semesterYearInput = document.getElementById('semesterYear');
  const semesterTypeInput = document.getElementById('semesterType');
  const semesterStartDateInput = document.getElementById('semesterStartDate');
  const semesterEndDateInput = document.getElementById('semesterEndDate');
  
  modalTitle.textContent = '学期を編集';
  if (semesterIdInput) semesterIdInput.value = semester.id;
  
  // 学期名から年度と学期タイプを解析
  const nameMatch = semester.name.match(/(\d+)年度\s*(春|夏|秋|冬)学期/);
  if (nameMatch && semesterYearInput && semesterTypeInput) {
    const year = parseInt(nameMatch[1]);
    const typeName = nameMatch[2];
    const typeMap = { '春': 'spring', '夏': 'summer', '秋': 'fall', '冬': 'winter' };
    
    semesterYearInput.value = year;
    semesterTypeInput.value = typeMap[typeName] || '';
  }
  
  if (semesterStartDateInput) semesterStartDateInput.value = semester.startDate;
  if (semesterEndDateInput) semesterEndDateInput.value = semester.endDate;
  
  modal.style.display = 'block';
}

// 年度と学期タイプから開始日・終了日を取得する関数
function getSemesterDates(year, semesterType) {
  switch (semesterType) {
    case 'spring':
      return {
        startDate: `${year}-04-01`,
        endDate: `${year}-09-30`
      };
    case 'summer':
      return {
        startDate: `${year}-07-01`,
        endDate: `${year}-08-31`
      };
    case 'fall':
      return {
        startDate: `${year}-10-01`,
        endDate: `${year + 1}-03-31`
      };
    case 'winter':
      return {
        startDate: `${year}-12-01`,
        endDate: `${year + 1}-02-28`
      };
    default:
      return null;
  }
}

// 学期管理モーダルを作成する関数
function createSemesterModal() {
  const modal = document.createElement('div');
  modal.id = 'semesterModal';
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2 id="semesterModalTitle">Add Semester</h2>
      </div>
      <form id="semesterForm">
        <input type="hidden" id="semesterId">
        <div class="form-group">
          <label for="semesterYear">Academic Year</label>
          <input type="number" id="semesterYear" required min="2000" max="2100" placeholder="2025" class="year-input">
        </div>
        <div class="form-group">
          <label for="semesterType">Semester</label>
          <select id="semesterType" required>
            <option value="">Select</option>
            <option value="spring">Spring Semester</option>
            <option value="summer">Summer Semester</option>
            <option value="fall">Fall Semester</option>
            <option value="winter">Winter Semester</option>
          </select>
        </div>
        <div class="form-group">
          <label for="semesterStartDate">Start Date</label>
          <input type="date" id="semesterStartDate" required>
        </div>
        <div class="form-group">
          <label for="semesterEndDate">End Date</label>
          <input type="date" id="semesterEndDate" required>
        </div>
        <div class="modal-actions">
          <button type="button" id="cancelSemesterBtn" class="btn">Cancel</button>
          <button type="submit" class="btn primary">Save</button>
        </div>
      </form>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // 年度入力フィールドに現在年をデフォルト値として設定
  const yearInput = document.getElementById('semesterYear');
  if (yearInput) {
    const currentYear = new Date().getFullYear();
    yearInput.value = currentYear;
  }
  
  // 学期タイプが変更されたときに日付を自動設定
  const semesterTypeSelect = document.getElementById('semesterType');
  const yearInputEl = document.getElementById('semesterYear');
  const startDateInput = document.getElementById('semesterStartDate');
  const endDateInput = document.getElementById('semesterEndDate');
  
  function updateSemesterDates() {
    const year = parseInt(yearInputEl?.value);
    const semesterType = semesterTypeSelect?.value;
    
    if (!year || !semesterType) return;
    
    const dates = getSemesterDates(year, semesterType);
    if (dates && startDateInput && endDateInput) {
      startDateInput.value = dates.startDate;
      endDateInput.value = dates.endDate;
    }
  }
  
  if (semesterTypeSelect) {
    semesterTypeSelect.addEventListener('change', updateSemesterDates);
  }
  if (yearInputEl) {
    yearInputEl.addEventListener('input', updateSemesterDates);
    yearInputEl.addEventListener('change', updateSemesterDates);
  }
  
  // フォーム送信
  const form = document.getElementById('semesterForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const semesterId = document.getElementById('semesterId').value;
    const year = parseInt(document.getElementById('semesterYear').value);
    const semesterType = document.getElementById('semesterType').value;
    const startDate = document.getElementById('semesterStartDate').value;
    const endDate = document.getElementById('semesterEndDate').value;
    
    // Generate semester name
    const semesterTypeNames = {
      'spring': 'Spring Semester',
      'summer': 'Summer Semester',
      'fall': 'Fall Semester',
      'winter': 'Winter Semester'
    };
    const name = `${year} ${semesterTypeNames[semesterType]}`;
    
    if (semesterId) {
      // 編集
      updateSemester(semesterId, { name, startDate, endDate });
    } else {
      // 追加
      addSemester(name, startDate, endDate);
    }
    
    modal.style.display = 'none';
    renderSemestersList();
    renderSemesterSelector();
  });
  
  // キャンセルボタン
  const cancelBtn = document.getElementById('cancelSemesterBtn');
  cancelBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
  
  // モーダル外クリックで閉じる
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
  
  // ESCキーで閉じる
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
      modal.style.display = 'none';
    }
  });
}

// グローバル変数: カレンダーの現在の月
let currentCalendarMonth = new Date();
let monthsCount = 3; // 表示する月数（デフォルト3ヶ月）

// 管理画面を初期化する関数
function initializeManageTab() {
  // 学期追加ボタン
  const addSemesterBtn = document.getElementById('addSemesterBtn');
  if (addSemesterBtn) {
    addSemesterBtn.addEventListener('click', () => {
      showSemesterAddModal();
    });
  }
  
  // 学期一覧を表示
  renderSemestersList();
  
  // カレンダーコントロール（イベントリスナーは後で設定）
  setupCalendarControls();
}

// カレンダーコントロールを設定する関数
let prevMonthHandler = null;
let nextMonthHandler = null;
let todayHandler = null;

function setupCalendarControls() {
  const prevMonthBtn = document.getElementById('prevMonthBtn');
  const nextMonthBtn = document.getElementById('nextMonthBtn');
  const todayBtn = document.getElementById('todayBtn');
  
  // 既存のイベントリスナーを削除
  if (prevMonthBtn && prevMonthHandler) {
    prevMonthBtn.removeEventListener('click', prevMonthHandler);
  }
  if (nextMonthBtn && nextMonthHandler) {
    nextMonthBtn.removeEventListener('click', nextMonthHandler);
  }
  if (todayBtn && todayHandler) {
    todayBtn.removeEventListener('click', todayHandler);
  }
  
  // 新しいイベントリスナーを作成
  prevMonthHandler = () => {
    // 月の1日を基準に、monthsCountヶ月前に移動
    const newMonth = new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() - monthsCount, 1);
    currentCalendarMonth = newMonth;
    renderClassDaysCalendar(currentCalendarMonth);
  };
  
  nextMonthHandler = () => {
    // 月の1日を基準に、monthsCountヶ月後に移動
    const newMonth = new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() + monthsCount, 1);
    currentCalendarMonth = newMonth;
    renderClassDaysCalendar(currentCalendarMonth);
  };
  
  todayHandler = () => {
    // 今日の月の1日を基準にする
    const today = new Date();
    currentCalendarMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    renderClassDaysCalendar(currentCalendarMonth);
  };
  
  // イベントリスナーを追加
  if (prevMonthBtn) {
    prevMonthBtn.addEventListener('click', prevMonthHandler);
  }
  if (nextMonthBtn) {
    nextMonthBtn.addEventListener('click', nextMonthHandler);
  }
  if (todayBtn) {
    todayBtn.addEventListener('click', todayHandler);
  }
}

// 授業日カレンダーを表示する関数（複数月対応）
function renderClassDaysCalendar(startMonth) {
  const calendar = document.getElementById('classDaysCalendar');
  const monthDisplay = document.getElementById('currentMonthDisplay');
  
  if (!calendar) {
    console.error('カレンダー要素が見つかりません');
    return;
  }
  
  const currentSemester = getCurrentSemester();
  if (!currentSemester) {
    calendar.innerHTML = '<p class="empty-message">学期を選択してください</p>';
    if (monthDisplay) monthDisplay.textContent = '';
    return;
  }
  
  // 月がDateオブジェクトでない場合は変換
  if (!(startMonth instanceof Date)) {
    startMonth = new Date(startMonth);
  }
  
  // 月表示を更新
  if (monthDisplay) {
    const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    if (monthsCount === 1) {
      monthDisplay.textContent = `${startMonth.getFullYear()}年${monthNames[startMonth.getMonth()]}`;
    } else {
      // 最後の月を計算（月の1日を基準に計算）
      const endMonth = new Date(startMonth.getFullYear(), startMonth.getMonth() + monthsCount - 1, 1);
      monthDisplay.textContent = `${startMonth.getFullYear()}年${monthNames[startMonth.getMonth()]} 〜 ${endMonth.getFullYear()}年${monthNames[endMonth.getMonth()]}`;
    }
  }
  
  // 学期の開始日・終了日を取得
  const startDate = new Date(currentSemester.startDate);
  const endDate = new Date(currentSemester.endDate);
  const classDays = currentSemester.classDays || [];
  
  calendar.innerHTML = '';
  
  // 複数のカレンダーを横並びで表示
  const calendarsContainer = document.createElement('div');
  calendarsContainer.className = 'calendars-container';
  
  for (let m = 0; m < monthsCount; m++) {
    // 月の1日を基準に、mヶ月後の月を作成
    const month = new Date(startMonth.getFullYear(), startMonth.getMonth() + m, 1);
    
    const monthCalendar = document.createElement('div');
    monthCalendar.className = 'month-calendar';
    
    // 月のタイトル
    const monthTitle = document.createElement('div');
    monthTitle.className = 'month-title';
    const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    monthTitle.textContent = `${month.getFullYear()}年${monthNames[month.getMonth()]}`;
    monthCalendar.appendChild(monthTitle);
    
    // 曜日ヘッダー（授業数表示付き）
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const weekdayNumbers = [0, 1, 2, 3, 4, 5, 6]; // 日曜日=0, 月曜日=1, ...
    
    // 各曜日の学期合計授業数を計算
    const weekdayClassCounts = {};
    const semesterStart = new Date(currentSemester.startDate);
    const semesterEnd = new Date(currentSemester.endDate);
    
    // 学期内の各曜日の授業日数を計算
    weekdayNumbers.forEach(weekdayNum => {
      if (weekdayNum >= 1 && weekdayNum <= 5) { // 月〜金のみ
        let count = 0;
        const current = new Date(semesterStart);
        current.setHours(0, 0, 0, 0);
        const end = new Date(semesterEnd);
        end.setHours(23, 59, 59, 999);
        while (current <= end) {
          if (current.getDay() === weekdayNum) {
            const dateStr = formatDateLocal(current);
            if (classDays.includes(dateStr)) {
              count++;
            }
          }
          current.setDate(current.getDate() + 1);
        }
        weekdayClassCounts[weekdayNum] = count;
      }
    });
    
    const headerRow = document.createElement('div');
    headerRow.className = 'calendar-header';
    weekdays.forEach((day, index) => {
      const cell = document.createElement('div');
      cell.className = 'calendar-header-cell';
      
      const dayLabel = document.createElement('div');
      dayLabel.className = 'weekday-label';
      dayLabel.textContent = day;
      cell.appendChild(dayLabel);
      
      // 月〜金のみ授業数を表示
      if (weekdayNumbers[index] >= 1 && weekdayNumbers[index] <= 5) {
        const countLabel = document.createElement('div');
        countLabel.className = 'weekday-count';
        countLabel.textContent = `${weekdayClassCounts[weekdayNumbers[index]] || 0}回`;
        cell.appendChild(countLabel);
      }
      
      headerRow.appendChild(cell);
    });
    monthCalendar.appendChild(headerRow);
    
    // カレンダーの最初の日（月の最初の日曜日）
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
    const firstSunday = new Date(firstDay);
    firstSunday.setDate(firstDay.getDate() - firstDay.getDay());
    
    // カレンダーの最後の日（月の最後の土曜日）
    const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    const lastSaturday = new Date(lastDay);
    lastSaturday.setDate(lastDay.getDate() + (6 - lastDay.getDay()));
    
    // カレンダー本体
    const current = new Date(firstSunday);
    while (current <= lastSaturday) {
      const weekRow = document.createElement('div');
      weekRow.className = 'calendar-week';
      
      for (let i = 0; i < 7; i++) {
        const dateStr = formatDateLocal(current);
        const isInMonth = current.getMonth() === month.getMonth();
        const isInSemester = dateStr >= currentSemester.startDate && dateStr <= currentSemester.endDate;
        const dayOfWeek = current.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        
        // 学期内の平日かどうか
        const isWeekdayInSemester = isInSemester && !isWeekend;
        
        // 授業日かどうか（classDaysに含まれている = 授業日、含まれていない = 休み）
        const isClassDay = isWeekdayInSemester ? classDays.includes(dateStr) : false;
        const isHoliday = isWeekdayInSemester && !isClassDay;
        
        const cell = document.createElement('div');
        cell.className = 'calendar-day';
        if (!isInMonth) cell.classList.add('other-month');
        if (!isInSemester) cell.classList.add('out-of-semester');
        if (isWeekend) cell.classList.add('weekend');
        if (isClassDay) cell.classList.add('class-day');
        if (isHoliday) cell.classList.add('holiday');
        
        cell.textContent = current.getDate();
        cell.dataset.date = dateStr;
        
        // 学期内の平日のみクリック可能
        if (isWeekdayInSemester) {
          cell.addEventListener('click', () => {
            toggleHoliday(dateStr);
          });
          cell.style.cursor = 'pointer';
        } else if (!isInSemester) {
          cell.style.cursor = 'not-allowed';
        }
        
        weekRow.appendChild(cell);
        current.setDate(current.getDate() + 1);
      }
      
      monthCalendar.appendChild(weekRow);
    }
    
    calendarsContainer.appendChild(monthCalendar);
  }
  
  calendar.appendChild(calendarsContainer);
}

// 休みの切り替え関数（授業日 ↔ 休み）
function toggleHoliday(dateStr) {
  const currentSemester = getCurrentSemester();
  if (!currentSemester) return;
  
  const classDays = currentSemester.classDays || [];
  const index = classDays.indexOf(dateStr);
  
  if (index === -1) {
    // 授業日に戻す（休みを解除）
    classDays.push(dateStr);
    classDays.sort();
  } else {
    // 休みにする（授業日から除外）
    classDays.splice(index, 1);
  }
  
  currentSemester.classDays = classDays;
  saveSemesters();
  
  // カレンダーを再表示
  renderClassDaysCalendar(currentCalendarMonth);
}

// 曜日の休みを一括設定/解除する関数
function setWeekdayHolidayForCurrentMonth(weekday, month, setHoliday) {
  const currentSemester = getCurrentSemester();
  if (!currentSemester) return;
  
  const classDays = currentSemester.classDays || [];
  const startDate = new Date(currentSemester.startDate);
  const endDate = new Date(currentSemester.endDate);
  
  // 月の最初と最後の日
  const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
  const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  
  // 学期の範囲内で、指定された曜日の日付を取得
  const current = new Date(Math.max(monthStart, startDate));
  const end = new Date(Math.min(monthEnd, endDate));
  
  const datesToProcess = [];
  current.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  while (current <= end) {
    if (current.getDay() === weekday) {
      const dateStr = formatDateLocal(current);
      datesToProcess.push(dateStr);
    }
    current.setDate(current.getDate() + 1);
  }
  
  // 一括設定/解除
  datesToProcess.forEach(dateStr => {
    const index = classDays.indexOf(dateStr);
    if (setHoliday) {
      // 休みに設定: 授業日から除外
      if (index !== -1) classDays.splice(index, 1);
    } else {
      // 休みを解除: 授業日に戻す
      if (index === -1) classDays.push(dateStr);
    }
  });
  
  classDays.sort();
  currentSemester.classDays = classDays;
  saveSemesters();
  
  // カレンダーを再表示
  renderClassDaysCalendar(month);
}

// 全ての平日を授業日に戻す関数（休みを全て解除）
function resetAllWeekdays() {
  const currentSemester = getCurrentSemester();
  if (!currentSemester) return;
  
  // 全ての平日を授業日に設定
  const classDays = generateDefaultClassDays(currentSemester.startDate, currentSemester.endDate);
  currentSemester.classDays = classDays;
  
  saveSemesters();
  
  // カレンダーを再表示
  renderClassDaysCalendar(currentCalendarMonth);
}
// ============================================
// Step1: 学期管理機能（ここまで）
// ============================================

// Firebase接続チェック（v11対応）
// ※ 同期停止のため、常にローカルモードで動作させる
function checkFirebase() {
  // カレンダーマネージャーのクラウド同期を無効化
  isFirebaseEnabled = false;
  console.info('Firebase sync is disabled. Running in local-only mode.');
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
  // Step2: 選択中の学期の時間割を読み込む
  const currentSemester = getCurrentSemester();
  if (currentSemester && currentSemester.timetable) {
    generateTimetable(currentSemester.timetable);
    return;
  }
  
  // フォールバック: Firebaseから読み込み（既存の動作）
  if (!isFirebaseEnabled) {
    // localStorageからも読み込めない場合はデフォルトを使用
    generateTimetable(initialTimetableData);
    return;
  }
  
  const timetableRef = window.firebase.ref(window.firebase.db, "tabler/timetable");
  window.firebase.onValue(timetableRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      generateTimetable(data);
    } else {
      generateTimetable(initialTimetableData);
    }
  });
}

// タスクを保存する関数（v11対応）
function saveTask(period, day, title, taskData) {
  if (!isFirebaseEnabled) return;
  
  // 現在の学期IDを取得
  const semesterId = currentSemesterId || null;
  
  const tasksRef = window.firebase.ref(window.firebase.db, "tabler/tasks");
  const newTaskRef = window.firebase.push(tasksRef);
  window.firebase.set(newTaskRef, {
    period: period,
    day: day,
    title: title,
    content: taskData.content,
    dueDate: taskData.dueDate,
    taskType: taskData.taskType || 'Assignment', // default value
    semesterId: semesterId, // 学期IDを追加
    createdAt: Date.now()
  });
}

// タスクを更新する関数（v11対応）
function updateTask(taskId, taskData) {
  if (!isFirebaseEnabled) {
    // Firebaseが無効な場合はローカルのみ更新
    if (window.tasks && window.tasks[taskId]) {
      window.tasks[taskId] = {
        ...window.tasks[taskId],
        ...taskData,
        updatedAt: Date.now()
      };
      displayTasks(window.tasks);
      updateTaskNumbers(window.tasks);
      updateIncompleteTasksCount(window.tasks);
    }
    return;
  }
  
  const taskRef = window.firebase.ref(window.firebase.db, `tabler/tasks/${taskId}`);
  const existingTask = window.tasks && window.tasks[taskId] ? window.tasks[taskId] : {};
  
  const updatedTask = {
    ...existingTask,
    ...taskData,
    taskType: taskData.taskType || existingTask?.taskType || 'Assignment', // default value
    updatedAt: Date.now()
  };
  
  // Firebaseに更新を書き込む
  window.firebase.set(taskRef, updatedTask).then(() => {
    // ローカルのタスクデータも更新
    if (!window.tasks) {
      window.tasks = {};
    }
    window.tasks[taskId] = updatedTask;
    // UIを更新
    displayTasks(window.tasks);
    updateTaskNumbers(window.tasks);
    updateIncompleteTasksCount(window.tasks);
  }).catch((error) => {
    console.error('タスクの更新に失敗しました:', error);
    alert('タスクの更新に失敗しました。');
  });
}

// モーダルを閉じる共通関数
function closeModal() {
  const modal = document.getElementById('taskModal');
  if (modal) {
    modal.style.display = 'none';
    // 編集モードをリセット
    delete modal.dataset.editMode;
    delete modal.dataset.taskId;
  }
}

// モーダルをリセットする関数（追加モード用）
function resetModalToAddMode() {
  const modal = document.getElementById('taskModal');
  const progressSection = document.querySelector('.progress-section');
  const sectionDivider = document.querySelector('.section-divider');
  const taskSection = document.getElementById('taskSection');
  const submitButton = document.getElementById('taskSubmitBtn');
  
  // Reset edit mode
  delete modal.dataset.editMode;
  delete modal.dataset.taskId;
  
  // Show progress section
  if (progressSection) progressSection.style.display = '';
  if (sectionDivider) sectionDivider.style.display = '';
  if (taskSection) taskSection.style.display = 'block';
  
  // Reset submit button text
  if (submitButton) submitButton.textContent = 'Add Task';
  
  // Reset form
  const taskForm = document.getElementById('taskForm');
  if (taskForm) {
    taskForm.reset();
    // Reset task type buttons
    document.querySelectorAll('.task-type-btn').forEach(btn => btn.classList.remove('active'));
    const defaultBtn = document.querySelector('.task-type-btn[data-type="Assignment"]');
    if (defaultBtn) defaultBtn.classList.add('active');
  }
}

// タスク編集モーダルを表示する関数（showTaskModalと同じロジックを使用）
function showEditTaskModal(taskId, task) {
  const modal = document.getElementById('taskModal');
  
  // 既にモーダルが開いている場合は一度閉じてから編集モードで開き直す
  if (modal && modal.style.display === 'block') {
    closeModal();
    resetModalToAddMode();
    // 少し待ってから編集モードで開き直す（アニメーション完了を待つ）
    setTimeout(() => {
      showEditTaskModalInternal(taskId, task);
    }, 200);
    return;
  }
  
  showEditTaskModalInternal(taskId, task);
}

// タスク編集モーダルの内部実装
function showEditTaskModalInternal(taskId, task) {
  const modal = document.getElementById('taskModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalSubtitle = document.getElementById('modalSubtitle');

  // 編集モードに設定
  modal.dataset.editMode = 'true';
  modal.dataset.taskId = taskId;

  // モーダルヘッダーを設定
  modalTitle.textContent = task.title || 'Edit Task';
  modalSubtitle.textContent = `${task.period || ''} ${task.day || ''}`;
  
  // 進捗管理セクションを非表示
  const progressSection = document.querySelector('.progress-section');
  const sectionDivider = document.querySelector('.section-divider');
  if (progressSection) progressSection.style.display = 'none';
  if (sectionDivider) sectionDivider.style.display = 'none';
  
  // タスクセクションを表示
  const taskSection = document.getElementById('taskSection');
  if (taskSection) taskSection.style.display = 'block';
  
  // Update submit button text
  const submitButton = document.getElementById('taskSubmitBtn');
  if (submitButton) submitButton.textContent = 'Update Task';
  
  // モーダルを表示
  modal.style.display = 'block';

  // 対応するdataIdを検索（showTaskModalと同じロジック）
  const slotNum = getSlotNumber(task.period);
  const dayOfWeek = getDayOfWeek(task.day);
  let cellSubject = subjectsMaster.find(s => 
    s.name === task.title && 
    s.dayOfWeek === dayOfWeek && 
    s.slot === slotNum
  );
  
  // subjectsMasterに見つからない場合は、動的に作成
  if (!cellSubject) {
    // より安全なdataId生成（日本語対応）
    const dataId = `${task.title.replace(/[^a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, '-')}`;
    cellSubject = {
      id: dataId,
      name: task.title,
      dayOfWeek: dayOfWeek,
      slot: slotNum,
      dataId: dataId
    };
  }
  
  modalState = { name: task.title, slot: slotNum, dataId: cellSubject?.dataId };
  
  // モーダルが表示された後に日付を設定
  setTimeout(() => {
    // 既存の日付を設定
    const taskDateInput = document.getElementById('taskDate');
    if (taskDateInput && task.dueDate) {
      taskDateInput.value = task.dueDate;
    }
  }, 100);
  
  // 進捗管理の進捗を更新（少し遅延させてデータ読み込みを待つ）
  setTimeout(() => {
    if (cellSubject) {
      updateModalProgress(cellSubject.dataId);
    }
  }, 200);
  
  // フォームに既存の値を設定
  const taskContentInput = document.getElementById('taskContent');
  const taskDateInput = document.getElementById('taskDate');
  if (taskContentInput) taskContentInput.value = task.content || '';
  if (taskDateInput && task.dueDate) taskDateInput.value = task.dueDate;

  // タスクタイプボタンを設定
  document.querySelectorAll('.task-type-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.type === task.taskType) {
      btn.classList.add('active');
    }
  });
  
  // デフォルトで「課題」を選択
  if (!task.taskType) {
    document.querySelector('.task-type-btn.active')?.classList.remove('active');
    document.querySelector('.task-type-btn[data-type="課題"]').classList.add('active');
  }
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
      
      // 選択中の学期のタスクのみフィルタリング
      const filteredTasks = {};
      if (currentSemesterId) {
        Object.entries(data).forEach(([taskId, task]) => {
          // semesterIdが一致するか、semesterIdが未設定の古いタスクは表示しない
          if (task.semesterId === currentSemesterId) {
            filteredTasks[taskId] = task;
          }
        });
      }
      
      window.tasks = filteredTasks;
      displayTasks(filteredTasks);
      updateTaskNumbers(filteredTasks);
      updateIncompleteTasksCount(filteredTasks);
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
    if (!currentSemesterId) {
      // 学期が選択されていない場合は空のデータを返す
      subjectsData = [];
      resolve(subjectsData);
      return;
    }
    
    if (isFirebaseEnabled) {
      // 学期ごとの進捗データを読み込む
      const subjectsRef = window.firebase.ref(window.firebase.db, `subjects/${currentSemesterId}`);
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
              semesterId: currentSemesterId,
              lastUpdated: subject.lastUpdated || null
            }));
          } else {
            // データが存在しない場合は、現在の時間割から科目を取得
            const currentSemester = getCurrentSemester();
            if (currentSemester && currentSemester.timetable) {
              subjectsData = getUniqueSubjects().map(s => ({ 
                id: s.id, 
                name: s.name, 
                dataId: s.dataId,
                progress: 0,
                semesterId: currentSemesterId,
                lastUpdated: null 
              }));
              saveSubjects(subjectsData);
            } else {
              subjectsData = [];
            }
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
            semesterId: currentSemesterId,
            lastUpdated: null 
          }));
          resolve(subjectsData);
        });
    } else {
      // localStorageの場合も学期ごとに管理
      const currentSemester = getCurrentSemester();
      if (currentSemester && currentSemester.timetable) {
        subjectsData = getUniqueSubjects().map(s => ({ 
          id: s.id, 
          name: s.name, 
          dataId: s.dataId,
          progress: 0,
          semesterId: currentSemesterId,
          totalTime: 0, 
          lastUpdated: null 
        }));
      } else {
        subjectsData = [];
      }
      resolve(subjectsData);
    }
  });
}

// 進捗データを保存する関数
function saveSubjects(subjects) {
  subjectsData = subjects;
  
  if (!currentSemesterId) {
    console.warn('学期が選択されていないため、進捗データを保存できません');
    return;
  }
  
  if (isFirebaseEnabled) {
    // 学期ごとに進捗データを保存
    const subjectsRef = window.firebase.ref(window.firebase.db, `subjects/${currentSemesterId}`);
    window.firebase.set(subjectsRef, subjectsData)
      .then(() => {
      })
      .catch((error) => {
        console.error('Firebaseへの保存に失敗:', error);
      });
  } else {
    // localStorageの場合も学期ごとに保存
    const key = `subjects_${currentSemesterId}`;
    localStorage.setItem(key, JSON.stringify(subjectsData));
  }
}

// ユニークな科目リストを取得（Firebaseデータベースベース）
function getUniqueSubjects() {
  // 現在の学期の時間割から科目を取得
  const currentSemester = getCurrentSemester();
  if (!currentSemester || !currentSemester.timetable) {
    return [];
  }
  
  const uniqueSubjectsMap = new Map();
  const timetable = currentSemester.timetable;
  const days = ['月', '火', '水', '木', '金'];
  
  // 時間割から科目を抽出
  for (let periodIndex = 0; periodIndex < timetable.length; periodIndex++) {
    for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
      const subjectName = timetable[periodIndex] && timetable[periodIndex][dayIndex];
      if (subjectName && subjectName.trim() !== '') {
        // 既に存在する場合はスキップ
        if (!uniqueSubjectsMap.has(subjectName)) {
          // subjectsMasterから検索
          const subject = subjectsMaster.find(s => s.name === subjectName);
          if (subject) {
            uniqueSubjectsMap.set(subjectName, {
              id: subject.id,
              name: subject.name,
              dataId: subject.dataId
            });
          } else {
            // subjectsMasterに見つからない場合は、動的に作成
            const dataId = subjectName.replace(/[^a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, '-');
            uniqueSubjectsMap.set(subjectName, {
              id: dataId,
              name: subjectName,
              dataId: dataId
            });
          }
        }
      }
    }
  }
  
  return Array.from(uniqueSubjectsMap.values());
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
  // Step2: 選択中の学期の授業日を返す
  const currentSemester = getCurrentSemester();
  if (currentSemester && currentSemester.classDays) {
    return currentSemester.classDays.map(date => ({
      date: date,
      dayOfWeek: ['日','月','火','水','木','金','土'][new Date(date).getDay()] + '曜日'
    }));
  }
  // 学期データがない場合は空配列を返す
  return [];
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
  
  // 既存の時間割をクリア（重複したイベントリスナーを防ぐ）
  const timetable = document.getElementById('timetable');
  if (timetable) {
    timetable.innerHTML = '';
  }

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
// evaluations.json を削除したため、現在は空の一覧だけを表示する
let evaluationsLoaded = false;
async function loadEvaluationsIfNeeded() {
  if (evaluationsLoaded) return;
  renderEvaluations({ subjects: [] });
  evaluationsLoaded = true;
}

function renderEvaluations(data = { subjects: [] }) {
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
            semesterId: currentSemesterId, // 学期IDを設定
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
  const weekdays = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
  let maxWeek = 0;
  
  weekdays.forEach(day => {
    const days = getClassDaysByWeekday(day);
    const completedDays = days.filter(d => d.date <= getTodayISO());
    const currentWeek = completedDays.length;
    maxWeek = Math.max(maxWeek, currentWeek);
  });
  
  const displayElement = document.getElementById('currentWeekDisplay');
  if (displayElement) {
    displayElement.textContent = `Week ${maxWeek}`;
  }
}

// 未完了タスク数を更新する関数
function updateIncompleteTasksCount(tasks) {
  const tasksData = tasks || window.tasks || {};
  let incompleteCount = 0;
  
  // 通常のタスク数をカウント
  Object.values(tasksData).forEach(task => {
    if (!task.completed) {
      incompleteCount++;
    }
  });
  
  // 進捗不足の合計数を加算（各教科の不足分を合計）
  const progressDeficitTasks = generateProgressDeficitTasks();
  const totalDeficit = progressDeficitTasks.reduce((sum, task) => sum + task.deficit, 0);
  incompleteCount += totalDeficit;
  
  const incompleteTasksEl = document.getElementById('incompleteTasksCount');
  if (incompleteTasksEl) {
    incompleteTasksEl.textContent = incompleteCount;
  }
}

// モーダル表示関数（統合版）
function showTaskModal(period, day, title) {
  const modal = document.getElementById('taskModal');
  
  // 既にモーダルが開いている場合は何もしない（2重で開くのを防ぐ）
  if (modal && modal.style.display === 'block') {
    return;
  }
  
  const modalTitle = document.getElementById('modalTitle');
  const modalSubtitle = document.getElementById('modalSubtitle');

  // モーダルを追加モードにリセット
  resetModalToAddMode();
  
  // モーダルヘッダーを設定
  if (modalTitle) modalTitle.textContent = title;
  if (modalSubtitle) modalSubtitle.textContent = `${period} ${day}`;
  
  // モーダルを表示
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
  const taskForm = document.getElementById('taskForm');
  if (taskForm) {
    taskForm.reset();
    document.querySelectorAll('.task-type-btn').forEach(btn => btn.classList.remove('active'));
    const defaultBtn = document.querySelector('.task-type-btn[data-type="課題"]');
    if (defaultBtn) defaultBtn.classList.add('active');
  }
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
  
  const dayMap = { '月': '月曜日', '火': '火曜日', '水': '水曜日', '木': '木曜日', '金': '金曜日' };
  const weekday = dayMap[day];
  
  if (!weekday) {
    console.error('曜日が正しく取得できませんでした:', day);
    return;
  }
  
  // 該当する曜日の授業日を取得
  const classDays = getClassDaysByWeekday(weekday);
  if (classDays.length === 0) {
    console.error('授業日が見つかりませんでした:', weekday);
    return;
  }
  
  const todayISO = getTodayISO();
  
  // 今日以降の授業日を取得
  const futureClassDays = classDays.filter(d => d.date >= todayISO).sort((a, b) => a.date.localeCompare(b.date));
  
  let targetDate;
  switch (type) {
    case 'previous':
      // 前回の授業日（今日より前の最後の授業日）
      const pastClassDays = classDays.filter(d => d.date < todayISO).sort((a, b) => b.date.localeCompare(a.date));
      targetDate = pastClassDays.length > 0 ? pastClassDays[0].date : futureClassDays[0]?.date;
      break;
    case 'current':
      // 今回の授業日（今日以降の最初の授業日）
      targetDate = futureClassDays[0]?.date || classDays[classDays.length - 1].date;
      break;
    case 'next':
      // 次の授業日
      targetDate = futureClassDays[1]?.date || futureClassDays[0]?.date || classDays[classDays.length - 1].date;
      break;
    case 'nextWeek':
      // 来週の授業日（7日後以降の最初の授業日）
      const nextWeekDate = new Date(todayISO);
      nextWeekDate.setDate(nextWeekDate.getDate() + 7);
      const nextWeekISO = formatDateLocal(nextWeekDate);
      const nextWeekClassDays = classDays.filter(d => d.date >= nextWeekISO).sort((a, b) => a.date.localeCompare(b.date));
      targetDate = nextWeekClassDays[0]?.date || futureClassDays[futureClassDays.length - 1]?.date || classDays[classDays.length - 1].date;
      break;
    default:
      targetDate = futureClassDays[0]?.date || classDays[classDays.length - 1].date;
  }
  
  if (targetDate) {
    document.getElementById('taskDate').value = targetDate;
  }
}

// 進捗不足タスクを生成する関数
function generateProgressDeficitTasks() {
  const progressDeficitTasks = [];
  const subjects = subjectsData || [];
  
  getUniqueSubjects().forEach(uniqueSubject => {
    // より柔軟な検索：id、dataId、nameで検索
    const subject = subjects.find(s => 
      s.id === uniqueSubject.id || 
      s.dataId === uniqueSubject.dataId || 
      s.name === uniqueSubject.name
    );
    
    const currentWeek = getCurrentWeekForSubject(uniqueSubject.name);
    const progress = subject ? subject.progress || 0 : 0;
    const deficit = currentWeek - progress;
    
    // 不足分がある場合のみタスクとして追加
    if (deficit > 0 && uniqueSubject.name && uniqueSubject.name.trim() !== '') {
      progressDeficitTasks.push({
        subjectName: uniqueSubject.name,
        currentWeek: currentWeek,
        progress: progress,
        deficit: deficit
      });
    }
  });
  
  // 不足分（deficit）が大きい順にソート
  progressDeficitTasks.sort((a, b) => b.deficit - a.deficit);
  
  return progressDeficitTasks;
}

// 科目名からdataIdを取得する関数
function getDataIdFromSubjectName(subjectName) {
  const subject = subjectsMaster.find(s => s.name === subjectName);
  if (subject) {
    return subject.dataId;
  }
  // subjectsMasterに見つからない場合は、科目名をそのままdataIdとして使用
  return subjectName.replace(/[^a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, '-');
}

// 進捗を更新する共通関数
async function updateProgressForSubject(subjectName, increment = 1) {
  if (!currentSemesterId) {
    console.warn('学期が選択されていないため、進捗を更新できません');
    return false;
  }
  
  const subjects = subjectsData || await loadSubjects();
  const dataId = getDataIdFromSubjectName(subjectName);
  
  // より柔軟な検索：id、dataId、nameで検索
  let s = subjects.find(x => 
    x.dataId === dataId || 
    x.id === dataId || 
    x.name === subjectName
  );
  
  if (!s) {
    // 科目データが存在しない場合は作成
    s = {
      id: dataId,
      name: subjectName,
      dataId: dataId,
      progress: 0,
      totalTime: 0,
      semesterId: currentSemesterId, // 学期IDを設定
      lastUpdated: new Date().toISOString()
    };
    subjects.push(s);
  }
  
  if (s) {
    const oldProgress = s.progress || 0;
    const newProgress = Math.max(0, oldProgress + increment);
    
    // 進捗が実際に変更されたか確認
    if (newProgress === oldProgress && increment < 0) {
      // 進捗が0で減らそうとした場合
      return false;
    }
    
    s.progress = newProgress;
    s.semesterId = currentSemesterId; // 学期IDを確実に設定
    s.lastUpdated = new Date().toISOString();
    saveSubjects(subjects);
    updateTimetableProgressBars();
    updateSummaryStats();
    // 未完了タスク数を更新（進捗不足タスク数が変わる可能性があるため）
    if (window.tasks) {
      updateIncompleteTasksCount(window.tasks);
    }
    return true;
  }
  return false;
}

// 進捗不足タスク要素を作成する関数
function createProgressDeficitTaskElement(task) {
  const div = document.createElement('div');
  div.className = 'task-item progress-deficit-task';
  
  // チェックボックスの代わりにスペーサーを配置
  const spacer = document.createElement('div');
  spacer.className = 'task-checkbox-spacer';
  
  const content = document.createElement('div');
  content.className = 'task-content';
  
  // タイトル
  const title = document.createElement('div');
  title.className = 'task-title';
  title.textContent = `${task.subjectName} (${task.progress}/${task.currentWeek})`;
  
  // 詳細（ボタンを配置）
  const details = document.createElement('div');
  details.className = 'task-details';
  
  // ボタンコンテナ
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'progress-buttons';
  
  // Add "Understood" button
  const understandBtn = document.createElement('button');
  understandBtn.className = 'btn progress-understand-btn';
  understandBtn.textContent = 'Understood';
  understandBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    triggerButtonRipple(understandBtn, e.clientX, e.clientY);
    
    const success = await updateProgressForSubject(task.subjectName, 1);
    
    if (success) {
      // お祝い演出
      const btnRect = understandBtn.getBoundingClientRect();
      const px = e.clientX || (btnRect.left + btnRect.width / 2);
      const py = e.clientY || (btnRect.top + btnRect.height / 2);
      playCelebrateAnimation(px, py, ['#10b981', '#34d399', '#6ee7b7', '#22c55e']);
      
      // タスク一覧を再表示（進捗が更新されたので不足分も変わる）
      if (window.tasks) {
        displayTasks(window.tasks);
      }
    }
  });
  
  // Add "Undo" button
  const ununderstandBtn = document.createElement('button');
  ununderstandBtn.className = 'btn progress-ununderstand-btn';
  ununderstandBtn.textContent = 'Undo';
  ununderstandBtn.disabled = task.progress === 0;
  ununderstandBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    triggerButtonRipple(ununderstandBtn, e.clientX, e.clientY);
    
    const success = await updateProgressForSubject(task.subjectName, -1);
    
    if (success) {
      // タスク一覧を再表示（進捗が更新されたので不足分も変わる）
      if (window.tasks) {
        displayTasks(window.tasks);
      }
    } else {
      alert('理解度は既に0回です。これ以上減らすことはできません。');
    }
  });
  
  buttonContainer.appendChild(understandBtn);
  buttonContainer.appendChild(ununderstandBtn);
  details.appendChild(buttonContainer);
  
  // メタ情報（通常のタスクと同じ構造）
  const meta = document.createElement('div');
  meta.className = 'task-meta';
  
  // プログレスバー
  const progressWrap = document.createElement('div');
  progressWrap.className = 'progress';
  const progressBar = document.createElement('div');
  progressBar.className = 'progress-bar';
  
  // 進捗率を計算
  const progressPercent = task.currentWeek > 0 ? Math.max(0, Math.min(100, Math.floor((task.progress / task.currentWeek) * 100))) : 0;
  progressBar.style.width = `${progressPercent}%`;
  progressBar.className = `progress-bar ${computeProgressColorClass(progressPercent)}`;
  
  progressWrap.appendChild(progressBar);
  
  content.appendChild(title);
  content.appendChild(progressWrap);
  content.appendChild(details);
  content.appendChild(meta);
  
  div.appendChild(spacer);
  div.appendChild(content);
  
  return div;
}

// タスク一覧を表示する関数（@tablerから）
function displayTasks(tasks) {
  const activeTasksContainer = document.getElementById('active-tasks');
  const completedTasksContainer = document.getElementById('completed-tasks');
  activeTasksContainer.innerHTML = '';
  completedTasksContainer.innerHTML = '';

  // 進捗不足タスクを生成
  const progressDeficitTasks = generateProgressDeficitTasks();
  
  // 通常のタスクを取得
  const sortedTasks = Object.entries(tasks).sort(([, a], [, b]) => {
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  const activeTasks = sortedTasks.filter(([, task]) => !task.completed);
  const completedTasks = sortedTasks.filter(([, task]) => task.completed);

  // 進捗不足タスクと通常のタスクを横並びで表示するコンテナを作成
  if (progressDeficitTasks.length > 0 || activeTasks.length > 0) {
    const tasksGrid = document.createElement('div');
    tasksGrid.className = 'tasks-grid';

    // 進捗不足タスクのカラム
    const progressColumn = document.createElement('div');
    progressColumn.className = 'tasks-column progress-column';
    
    if (progressDeficitTasks.length > 0) {
      const sectionHeader = document.createElement('div');
      sectionHeader.className = 'progress-deficit-section-header';
      sectionHeader.textContent = '進捗不足';
      progressColumn.appendChild(sectionHeader);
      
      progressDeficitTasks.forEach(task => {
        const taskElement = createProgressDeficitTaskElement(task);
        progressColumn.appendChild(taskElement);
      });
    }

    // 通常のタスクのカラム
    const tasksColumn = document.createElement('div');
    tasksColumn.className = 'tasks-column regular-column';
    
    if (activeTasks.length > 0) {
      const sectionHeader = document.createElement('div');
      sectionHeader.className = 'tasks-section-header';
      sectionHeader.textContent = 'タスク';
      tasksColumn.appendChild(sectionHeader);
      
      activeTasks.forEach(([taskId, task]) => {
        const taskElement = createTaskElement(taskId, task);
        tasksColumn.appendChild(taskElement);
      });
    }

    tasksGrid.appendChild(progressColumn);
    tasksGrid.appendChild(tasksColumn);
    activeTasksContainer.appendChild(tasksGrid);
  }

  // 完了したタスクを表示
  completedTasks.forEach(([taskId, task]) => {
    const taskElement = createTaskElement(taskId, task);
    completedTasksContainer.appendChild(taskElement);
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

  dueDate.textContent = `Due: ${formatDueDate(task.dueDate)}`;

  // Add edit button
  const editBtn = document.createElement('button');
  editBtn.className = 'task-edit-btn';
  editBtn.textContent = 'Edit';
  editBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    // ポップアップがあれば閉じる
    const existingPopup = document.querySelector('.task-popup');
    if (existingPopup && existingPopup.closePopup) {
      existingPopup.closePopup();
    }
    showEditTaskModal(taskId, task);
  });

  meta.appendChild(dueDate);
  meta.appendChild(editBtn);
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

// Format due date label
function formatDueDate(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const taskDate = new Date(date);
  taskDate.setHours(0, 0, 0, 0);

  if (taskDate < today) {
    return 'Overdue';
  } else if (taskDate.getTime() === today.getTime()) {
    return 'Today';
  } else if (taskDate.getTime() === tomorrow.getTime()) {
    return 'Tomorrow';
  } else {
    const diffDays = Math.floor((taskDate - today) / (1000 * 60 * 60 * 24));
    return `In ${diffDays} days`;
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

  // 閉じる関数
  const closePopup = () => {
    popup.remove();
    document.removeEventListener('keydown', handleEscape);
  };

  // ポップアップ外クリックで閉じる
  popup.addEventListener('click', (e) => {
    if (e.target === popup) {
      closePopup();
    }
  });

  // ESCキーで閉じる
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      closePopup();
    }
  };
  document.addEventListener('keydown', handleEscape);

  // 編集ボタンが押されたときにポップアップを閉じるために、グローバルに閉じる関数を保存
  popup.closePopup = closePopup;
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
      
      // Step1: 管理タブが選択されたときに学期一覧を再表示
      if (tab.dataset.tab === 'manage') {
        renderSemestersList();
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
    
    const modal = document.getElementById('taskModal');
    const isEditMode = modal.dataset.editMode === 'true';
    const taskId = modal.dataset.taskId;
    
    const taskContent = document.getElementById('taskContent').value;
    const selectedTaskType = document.querySelector('.task-type-btn.active')?.dataset.type;

    // タスクタイプの決定ロジック
  let taskType = 'Assignment'; // default value
    if (selectedTaskType) {
      // ボタンで選択されている場合はそれを使用
      taskType = selectedTaskType;
    } else if (isEditMode && taskId && window.tasks && window.tasks[taskId]) {
      // If in edit mode and no button selected, use existing task type
      taskType = window.tasks[taskId].taskType || 'Assignment';
    }
    
    // content と taskType を独立して扱う
    const taskData = {
      content: taskContent || '',
      dueDate: document.getElementById('taskDate').value,
      taskType: taskType
    };

    if (isEditMode && taskId) {
      // 編集モード
      updateTask(taskId, taskData);
    } else {
      // 追加モード
      const modalTitle = document.getElementById('modalTitle').textContent;
      const modalSubtitle = document.getElementById('modalSubtitle').textContent;
      const [period, day] = modalSubtitle.split(' ');

      saveTask(period, day, modalTitle, taskData);
    }
    
    // モーダルを閉じる
    closeModal();
    
    // 追加モードにリセット
    resetModalToAddMode();
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
      closeModal();
      resetModalToAddMode();
    });
  }
  
  // モーダル外クリックで閉じる
  window.addEventListener('click', function(e) {
    const modal = document.getElementById('taskModal');
    if (e.target === modal) {
      closeModal();
      resetModalToAddMode();
    }
  });

  // ESCキーでモーダルを閉じる
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('taskModal');
      if (modal && modal.style.display === 'block') {
        closeModal();
        resetModalToAddMode();
      }
    }
  });

}

// 学習時間関連の機能は削除済み

// 初期化関数
async function boot() {
  
  // 現在の日付を確認
  const today = new Date();
  const todayISO = getTodayISO();
  
  // Firebase接続チェック
  checkFirebase();
  
  // Step1: 学期データを読み込み
  await loadSemesters();
  renderSemesterSelector();
  
  // 学期が選択されている場合、タスクと進捗を読み込み
  if (currentSemesterId) {
    loadTasks();
    await loadSubjects();
  }
  
  // Step1: 管理画面を初期化
  initializeManageTab();
  
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




// グローバルに関数を公開
window.setDate = setDate;

// DOMContentLoadedで初期化
document.addEventListener('DOMContentLoaded', boot);

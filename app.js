// Integrated app: @tabler task management + @platform progress management
// Data model: Subject ID as Single Source of Truth

/**
 * @typedef {Object} Semester
 * @property {string} id - 学期ID (例: "sem_173...")
 * @property {string} name - 学期名
 * @property {string} startDate - 開始日 (YYYY-MM-DD)
 * @property {string} endDate - 終了日 (YYYY-MM-DD)
 * @property {string[]} classDays - 授業日の配列
 * @property {string[][]} timetable - 5x5の2次元配列。中身は Subject の ID（空きコマは "" または null）
 * @property {number} createdAt - 作成タイムスタンプ
 */

/**
 * @typedef {Object} Subject
 * @property {string} id - 科目ID (例: "sub_173...")
 * @property {string} semesterId - 所属する学期のID
 * @property {string} name - 科目名
 * @property {string} color - 背景色 (例: "#FF5733")
 * @property {number} progress - 進捗 (0-100)
 * @property {Object|null} [evaluation] - 外部評価データ(シラバス等)のオブジェクトを直接保持
 */

/**
 * @typedef {Object} Task
 * @property {string} id - タスクID
 * @property {string} semesterId - 所属する学期のID
 * @property {string} subjectId - 紐づく科目のID
 * @property {"Assignment"|"Report"|"Test"} type - タスクの種類
 * @property {string} content - タスクの詳細
 * @property {string} dueDate - 期限 (YYYY-MM-DD)
 * @property {boolean} completed - 完了状態
 */

// 新規 Subject 作成時の色割り当て用パレット（薄いパステル、目に優しい）
const SUBJECT_COLOR_PALETTE = [
  '#FDEAEA', '#FDF4E3', '#F2F8E1', '#E4F9F5', '#E3F2FD',
  '#F3E5F5', '#FFF0F5', '#FFF8E1', '#E8F5E9', '#E0F7FA',
  '#EDE7F6', '#FCE4EC', '#FBE9E7', '#F1F8E9', '#E1F5FE'
];

// Global variables
/** @type {{[subjectId: string]: Subject}} */
let subjectsById = {};
let isFirebaseEnabled = false;
let evaluationsData = null;
/** @type {{ subjectId: string|null, period: string, day: string }} */
let modalState = { subjectId: null, period: '', day: '' };

// ============================================
// Step1: Semester Management Feature
// ============================================
// Global variables: Semester management
let semestersData = []; // Array of semester data
let currentSemesterId = null; // Currently selected semester ID

// Empty timetable template (5 periods x 5 weekdays, subject IDs only)
function createEmptyTimetable() {
  return [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', '']
  ];
}

function persistCurrentSemesterId() {
  try {
    if (currentSemesterId) {
      localStorage.setItem('currentSemesterId', currentSemesterId);
    } else {
      localStorage.removeItem('currentSemesterId');
    }
  } catch (error) {
    // Ignore storage failures
  }
  if (isFirebaseEnabled && window.firebase?.db) {
    const currentRef = window.firebase.ref(window.firebase.db, 'tabler/currentSemesterId');
    window.firebase.set(currentRef, currentSemesterId || null).catch(() => {});
  }
}

function setCurrentSemesterId(semesterId) {
  currentSemesterId = semesterId || null;
  persistCurrentSemesterId();
}

// Function to load semester data
function loadSemesters() {
  return new Promise((resolve) => {
    if (isFirebaseEnabled) {
      // Load from Firebase
      const semestersRef = window.firebase.ref(window.firebase.db, 'semesters');
      window.firebase.get(semestersRef)
        .then((snapshot) => {
          const data = snapshot.val();
          if (data) {
            semestersData = Object.values(data);
            // Initialize if existing data doesn't have classDays or timetable
            semestersData.forEach(semester => {
              if (!semester.classDays) {
                semester.classDays = generateDefaultClassDays(semester.startDate, semester.endDate);
              }
              if (!semester.timetable) {
                semester.timetable = createEmptyTimetable();
              }
            });
            // Create default semester if none exists
            if (semestersData.length === 0) {
              createDefaultSemester();
            }
          } else {
            createDefaultSemester();
          }
          const currentRef = window.firebase.ref(window.firebase.db, 'tabler/currentSemesterId');
          return window.firebase.get(currentRef).then((currentSnapshot) => {
            const firebaseSemesterId = currentSnapshot.val();
            if (firebaseSemesterId && semestersData.find(s => s.id === firebaseSemesterId)) {
              currentSemesterId = firebaseSemesterId;
            } else {
              const savedSemesterId = localStorage.getItem('currentSemesterId');
              if (savedSemesterId && semestersData.find(s => s.id === savedSemesterId)) {
                currentSemesterId = savedSemesterId;
              } else if (semestersData.length > 0) {
                currentSemesterId = semestersData[0].id;
              } else {
                currentSemesterId = null;
              }
            }
            persistCurrentSemesterId();
            resolve(semestersData);
          }).catch(() => {
            const savedSemesterId = localStorage.getItem('currentSemesterId');
            if (savedSemesterId && semestersData.find(s => s.id === savedSemesterId)) {
              currentSemesterId = savedSemesterId;
            } else if (semestersData.length > 0) {
              currentSemesterId = semestersData[0].id;
            } else {
              currentSemesterId = null;
            }
            persistCurrentSemesterId();
            resolve(semestersData);
          });
        })
        .catch((error) => {
          console.error('Failed to load semester data from Firebase:', error);
          loadSemestersFromLocalStorage();
          resolve(semestersData);
        });
    } else {
      // Load from localStorage
      loadSemestersFromLocalStorage();
      resolve(semestersData);
    }
  });
}

// Function to load semester data from localStorage
function loadSemestersFromLocalStorage() {
  try {
    const stored = localStorage.getItem('semestersData');
    if (stored) {
      semestersData = JSON.parse(stored);
      // Initialize if existing data doesn't have classDays or timetable
      semestersData.forEach(semester => {
        if (!semester.classDays) {
          semester.classDays = generateDefaultClassDays(semester.startDate, semester.endDate);
        }
        if (!semester.timetable) {
          semester.timetable = createEmptyTimetable();
        }
      });
    } else {
      createDefaultSemester();
    }
    const savedSemesterId = localStorage.getItem('currentSemesterId');
    if (savedSemesterId && semestersData.find(s => s.id === savedSemesterId)) {
      currentSemesterId = savedSemesterId;
    } else if (semestersData.length > 0) {
      currentSemesterId = semestersData[0].id;
    } else {
      currentSemesterId = null;
    }
    persistCurrentSemesterId();
  } catch (error) {
    console.error('Failed to load semester data from localStorage:', error);
    createDefaultSemester();
  }
}

// Function to create default semester
function createDefaultSemester() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  
  // Estimate semester from current month (Apr-Sep: Spring, Oct-Mar: Fall)
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
  
  // Generate default class days (Mon-Fri only, excluding holidays)
  const classDays = generateDefaultClassDays(startDate, endDate);
  
  // Empty timetable (5 periods × 5 weekdays)
  const emptyTimetable = [
    ['', '', '', '', ''],  // Period 1
    ['', '', '', '', ''],  // Period 2
    ['', '', '', '', ''],  // Period 3
    ['', '', '', '', ''],  // Period 4
    ['', '', '', '', '']   // Period 5
  ];
  
  const defaultSemester = {
    id: `sem_${Date.now()}`,
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
  persistCurrentSemesterId();
}

// Function to generate date string in local time (YYYY-MM-DD format)
function formatDateLocal(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Function to generate default class days (Mon-Fri only)
function generateDefaultClassDays(startDate, endDate) {
  const classDays = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  const current = new Date(start);
  
  // Reset time to compare dates only
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  current.setHours(0, 0, 0, 0);
  
  while (current <= end) {
    const dayOfWeek = current.getDay();
    // Monday(1) to Friday(5) only
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      const dateStr = formatDateLocal(current);
      classDays.push(dateStr);
    }
    current.setDate(current.getDate() + 1);
  }
  
  return classDays;
}

// Function to save semester data
function saveSemesters() {
  if (isFirebaseEnabled) {
    // Save to Firebase
    const semestersRef = window.firebase.ref(window.firebase.db, 'semesters');
    // Convert to object format
    const semestersObj = {};
    semestersData.forEach(semester => {
      semestersObj[semester.id] = semester;
    });
    window.firebase.set(semestersRef, semestersObj)
      .catch((error) => {
        console.error('Failed to save semester data to Firebase:', error);
        // Fallback: also save to localStorage
        localStorage.setItem('semestersData', JSON.stringify(semestersData));
      });
  } else {
    // Save to localStorage
    localStorage.setItem('semestersData', JSON.stringify(semestersData));
  }
}

// Function to add semester
function addSemester(name, startDate, endDate) {
  // Generate default class days
  const classDays = generateDefaultClassDays(startDate, endDate);
  // Empty timetable (5 periods × 5 weekdays)
  const emptyTimetable = [
    ['', '', '', '', ''],  // Period 1
    ['', '', '', '', ''],  // Period 2
    ['', '', '', '', ''],  // Period 3
    ['', '', '', '', ''],  // Period 4
    ['', '', '', '', '']   // Period 5
  ];
  
  const newSemester = {
    id: `sem_${Date.now()}`,
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

// Function to update semester
function updateSemester(semesterId, updates) {
  const index = semestersData.findIndex(s => s.id === semesterId);
  if (index !== -1) {
    const semester = semestersData[index];
    // Preserve existing class day/holiday selections within overlap
    if (updates.startDate || updates.endDate) {
      const startDate = updates.startDate || semester.startDate;
      const endDate = updates.endDate || semester.endDate;
      const existingDays = semester.classDays || [];
      const oldStart = semester.startDate;
      const oldEnd = semester.endDate;
      // Keep prior selections within new range, only add defaults for new dates
      const preservedDays = existingDays.filter(date => date >= startDate && date <= endDate);
      const newDefaultDays = generateDefaultClassDays(startDate, endDate)
        .filter(date => date < oldStart || date > oldEnd);
      const mergedDays = [...new Set([...preservedDays, ...newDefaultDays])].sort();
      updates.classDays = mergedDays;
    }
    semestersData[index] = { ...semester, ...updates };
    saveSemesters();
    return semestersData[index];
  }
  return null;
}

// Function to delete semester
function deleteSemester(semesterId) {
  const index = semestersData.findIndex(s => s.id === semesterId);
  if (index !== -1) {
    semestersData.splice(index, 1);
    saveSemesters();
    // Select first semester if deleted semester was selected
    if (currentSemesterId === semesterId) {
      if (semestersData.length > 0) {
        currentSemesterId = semestersData[0].id;
        persistCurrentSemesterId();
      } else {
        currentSemesterId = null;
        persistCurrentSemesterId();
        // Create default semester if no semesters remain
        createDefaultSemester();
      }
    }
    return true;
  }
  return false;
}

// Function to get currently selected semester
function getCurrentSemester() {
  if (!currentSemesterId) return null;
  return semestersData.find(s => s.id === currentSemesterId) || null;
}

// Function to generate semester selection UI (removed: header select box not needed)
// Semester selection can be done from semester cards in the management screen
function renderSemesterSelector() {
  // Remove existing select box (just in case)
  const existingSelector = document.getElementById('semesterSelector');
  if (existingSelector) {
    existingSelector.remove();
  }
  // Don't display select box
}

// Callback function when semester is changed
function onSemesterChanged() {
  // Process to display only data associated with selected semester
  const currentSemester = getCurrentSemester();
  console.log('Semester has been changed:', currentSemester);
  
  // Reload timetable
  loadTimetable();
  
  // Redisplay semester list
  renderSemestersList();
}

// Function to display semester list
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
    
    // Select button
    const selectBtn = semesterCard.querySelector('.btn-select');
    selectBtn.addEventListener('click', () => {
      setCurrentSemesterId(semester.id);
      renderSemesterSelector();
      
      // Reload tasks and progress when switching semesters
      loadTasks();
      loadSubjects().then(() => {
        updateTimetableProgressBars();
        updateSummaryStats();
      });
      onSemesterChanged();
    });
    
    // Class days management button
    const classDaysBtn = semesterCard.querySelector('.btn-classdays');
    classDaysBtn.addEventListener('click', () => {
      setCurrentSemesterId(semester.id);
      renderSemesterSelector();
      showClassDaysManagement();
    });
    
    // Timetable management button
    const timetableBtn = semesterCard.querySelector('.btn-timetable');
    timetableBtn.addEventListener('click', () => {
      setCurrentSemesterId(semester.id);
      renderSemesterSelector();
      showTimetableManagement();
    });
    
    // Delete button
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

// Function to display class days management screen (modal)
function showClassDaysManagement() {
  const modal = document.getElementById('classDaysModal');
  if (!modal) return;
  
  const currentSemester = getCurrentSemester();
  
  if (!currentSemester) {
    alert('Please select a semester');
    return;
  }
  
  // Display semester info (simple version)
  renderSemesterInfoSimple(currentSemester);
  
  // Display calendar (from semester start date or current month)
  const startDate = new Date(currentSemester.startDate);
  const today = new Date();
  const semesterStart = new Date(currentSemester.startDate);
  const semesterEnd = new Date(currentSemester.endDate);
  
  // Display current month if within semester range, otherwise display start month
  // Use the 1st of the month as reference
  if (today >= semesterStart && today <= semesterEnd) {
    currentCalendarMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  } else if (today < semesterStart) {
    currentCalendarMonth = new Date(semesterStart.getFullYear(), semesterStart.getMonth(), 1);
  } else {
    // After semester ends, use the 1st of the month that is monthsCount months before the end month
    const endMonth = new Date(semesterEnd.getFullYear(), semesterEnd.getMonth(), 1);
    currentCalendarMonth = new Date(endMonth.getFullYear(), endMonth.getMonth() - (monthsCount - 1), 1);
  }
  
  // Reset calendar controls (reset every time modal is opened)
  setupCalendarControls();
  
  // Display calendar
  renderClassDaysCalendar(currentCalendarMonth);
  
  // Display modal
  modal.style.display = 'block';
  
  // Close button
  const closeBtn = document.getElementById('closeClassDaysModal');
  if (closeBtn) {
    closeBtn.onclick = () => {
      modal.style.display = 'none';
    };
  }
  
  // Close on click outside modal
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

// Function to display semester info (simple version)
function renderSemesterInfoSimple(semester) {
  const infoEl = document.getElementById('semesterInfo');
  if (!infoEl) return;
  
  infoEl.innerHTML = `
    <span class="semester-name-simple">${semester.name}</span>
    <span class="semester-dates-simple">${semester.startDate} - ${semester.endDate}</span>
    <button id="editDatesBtn" class="btn-edit-dates-simple">Edit</button>
  `;
  
  // Event listener for edit button
  const editDatesBtn = document.getElementById('editDatesBtn');
  if (editDatesBtn) {
    editDatesBtn.addEventListener('click', () => {
      showDateEditForm(semester);
    });
  }
}

// Function to display semester info (for management screen)
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
  
  // Event listener for edit button
  const editDatesBtn = document.getElementById('editDatesBtn');
  if (editDatesBtn) {
    editDatesBtn.addEventListener('click', () => {
      showDateEditForm(semester);
    });
  }
}

// Function to display date edit form
function showDateEditForm(semester) {
  const editForm = document.getElementById('semesterDateEdit');
  const infoEl = document.getElementById('semesterInfo');
  
  if (!editForm || !infoEl) return;
  
  // Get latest semester data
  const currentSemester = getCurrentSemester();
  if (!currentSemester) {
    alert('No semester selected');
    return;
  }
  
  // Set current values in form
  const startDateInput = document.getElementById('editStartDate');
  const endDateInput = document.getElementById('editEndDate');
  
  if (startDateInput) startDateInput.value = currentSemester.startDate;
  if (endDateInput) endDateInput.value = currentSemester.endDate;
  
  // Display form, hide info
  infoEl.style.display = 'none';
  editForm.style.display = 'flex';
  
  // Save button
  const saveBtn = document.getElementById('saveDatesBtn');
  if (saveBtn) {
    // Remove existing event listeners
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
  
  // Cancel button
  const cancelBtn = document.getElementById('cancelDatesBtn');
  if (cancelBtn) {
    // Remove existing event listeners
    const newCancelBtn = cancelBtn.cloneNode(true);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
    
    newCancelBtn.addEventListener('click', () => {
      cancelDateEdit();
    });
  }
}

// Function to save semester dates
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
  
  // Update semester
  const updatedSemester = updateSemester(semester.id, {
    startDate: newStartDate,
    endDate: newEndDate
  });
  
  if (!updatedSemester) {
    alert('Failed to update semester');
    return;
  }
  
  // Hide form, redisplay info
  cancelDateEdit();
  
  // Redisplay using updated semester object
  renderSemesterInfoSimple(updatedSemester);
  renderClassDaysCalendar(currentCalendarMonth);
}

// Function to cancel date edit
function cancelDateEdit() {
  const editForm = document.getElementById('semesterDateEdit');
  const infoEl = document.getElementById('semesterInfo');
  
  if (editForm) editForm.style.display = 'none';
  if (infoEl) {
    // Change display method depending on whether in modal or management screen
    const modal = document.getElementById('classDaysModal');
    if (modal && modal.style.display === 'block') {
      infoEl.style.display = 'flex';
    } else {
      infoEl.style.display = 'flex';
    }
  }
}

// Function to display class days statistics
function renderClassDaysStats(semester) {
  const statsEl = document.getElementById('classdaysStats');
  if (!statsEl) return;
  
  const classDays = semester.classDays || [];
  const startDate = new Date(semester.startDate);
  const endDate = new Date(semester.endDate);
  
  // Calculate number of weekdays within semester
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

// Function to display timetable management screen (modal)
async function showTimetableManagement() {
  const modal = document.getElementById('timetableModal');
  if (!modal) return;
  
  const currentSemester = getCurrentSemester();
  if (!currentSemester) {
    alert('Please select a semester');
    return;
  }
  await loadSubjects(); // Ensure subjects are loaded for getSubjectById in editor
  
  const timetableCopy = JSON.parse(JSON.stringify(currentSemester.timetable || createEmptyTimetable()));
  modal.dataset.timetableData = JSON.stringify(timetableCopy);
  
  renderTimetableEditor();
  
  // Save button
  const saveBtn = document.getElementById('saveTimetableBtn');
  if (saveBtn) {
    saveBtn.onclick = () => {
      saveTimetableChanges();
    };
  }
  
  // Cancel button
  const cancelBtn = document.getElementById('cancelTimetableBtn');
  if (cancelBtn) {
    cancelBtn.onclick = () => {
      modal.style.display = 'none';
    };
  }
  
  // Display modal
  modal.style.display = 'block';
  
  // Close button
  const closeBtn = document.getElementById('closeTimetableModal');
  if (closeBtn) {
    closeBtn.onclick = () => {
      modal.style.display = 'none';
    };
  }
  
  // Close on click outside modal
  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  };
  
  // Close on ESC key
  const handleEscape = (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
      modal.style.display = 'none';
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);
}

// Function to save timetable changes
function saveTimetableChanges() {
  const modal = document.getElementById('timetableModal');
  const editor = document.getElementById('timetableEditor');
  if (!modal || !editor) return;
  
  const currentSemester = getCurrentSemester();
  if (!currentSemester) return;
  
  const inputs = editor.querySelectorAll('.timetable-input');
  const timetable = createEmptyTimetable();
  const usedSubjectIds = new Set();
  
  inputs.forEach(input => {
    const periodIndex = parseInt(input.dataset.periodIndex);
    const dayIndex = parseInt(input.dataset.dayIndex);
    if (isNaN(periodIndex) || isNaN(dayIndex)) return;
    const name = input.value.trim();
    if (name) {
      const sub = getOrCreateSubjectByName(currentSemester.id, name);
      if (sub) {
        timetable[periodIndex][dayIndex] = sub.id;
        usedSubjectIds.add(sub.id);
      }
    }
  });
  
  // 時間割から外れた科目を subjectsById から削除し、その科目に紐づくタスクも削除
  const deletedSubjectIds = [];
  Object.keys(subjectsById).forEach(id => {
    const s = subjectsById[id];
    if (s.semesterId === currentSemester.id && !usedSubjectIds.has(id)) {
      deletedSubjectIds.push(id);
      delete subjectsById[id];
    }
  });

  // 削除した科目に紐づくタスクを window.tasks と Firebase から削除
  if (deletedSubjectIds.length > 0 && window.tasks) {
    const idsToDelete = new Set(deletedSubjectIds);
    const taskIdsToRemove = Object.entries(window.tasks)
      .filter(([, task]) => task.subjectId && idsToDelete.has(task.subjectId))
      .map(([taskId]) => taskId);
    taskIdsToRemove.forEach(taskId => {
      delete window.tasks[taskId];
      if (isFirebaseEnabled && window.firebase?.db) {
        const taskRef = window.firebase.ref(window.firebase.db, `tabler/tasks/${taskId}`);
        window.firebase.remove(taskRef).catch((err) => console.error('Failed to delete task:', err));
      }
    });
    displayTasks(window.tasks);
    updateTaskNumbers(window.tasks);
    updateIncompleteTasksCount(window.tasks);
  }
  
  currentSemester.timetable = timetable;
  saveSubjects();
  saveSemesters();
  
  loadTimetable();
  modal.style.display = 'none';
}

// Function to display timetable editor
function renderTimetableEditor() {
  const editor = document.getElementById('timetableEditor');
  if (!editor) return;
  
  const currentSemester = getCurrentSemester();
  if (!currentSemester) {
    editor.innerHTML = '<p class="empty-message">学期を選択してください</p>';
    return;
  }
  
  // Get temporary data from modal, or use semester data if not available
  const modal = document.getElementById('timetableModal');
  let timetable;
  if (modal && modal.dataset.timetableData) {
    timetable = JSON.parse(modal.dataset.timetableData);
  } else {
    timetable = currentSemester.timetable || createEmptyTimetable();
  }
  const days = ['月', '火', '水', '木', '金'];
  const periods = ['1限', '2限', '3限', '4限', '5限'];
  
  editor.innerHTML = '';
  
  // Header row
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
  
  // Timetable body
  periods.forEach((period, periodIndex) => {
    const row = document.createElement('div');
    row.className = 'timetable-editor-row';
    
    // Period label
    const periodCell = document.createElement('div');
    periodCell.className = 'timetable-editor-cell period-label';
    periodCell.textContent = period;
    row.appendChild(periodCell);
    
    // Cells for each weekday
    days.forEach((day, dayIndex) => {
      const cell = document.createElement('div');
      cell.className = 'timetable-editor-cell editable';
      
      const subjectId = timetable[periodIndex][dayIndex];
      const subject = subjectId ? getSubjectById(subjectId) : null;
      const input = document.createElement('input');
      input.type = 'text';
      input.value = subject ? subject.name : '';
      input.placeholder = '科目名';
      input.className = 'timetable-input';
      input.dataset.periodIndex = periodIndex;
      input.dataset.dayIndex = dayIndex;
      // Save to temporary data on change event (confirmed on save button)
      input.addEventListener('input', () => {
        timetable[periodIndex][dayIndex] = input.value.trim(); // store name temporarily for modal state
      });
      
      cell.appendChild(input);
      row.appendChild(cell);
    });
    
    editor.appendChild(row);
  });
}

// Function to display semester add modal
function showSemesterAddModal() {
  let modal = document.getElementById('semesterModal');
  if (!modal) {
    createSemesterModal();
    // Get modal again after creation
    modal = document.getElementById('semesterModal');
  }
  
  if (!modal) {
    console.error('Failed to create semester modal');
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
  
  // Set default values
  if (semesterYearInput) {
    const currentYear = new Date().getFullYear();
    semesterYearInput.value = currentYear;
  }
  if (semesterTypeInput) {
    semesterTypeInput.value = '';
  }
  
  modal.style.display = 'block';
}

// Function to display semester edit modal
function showSemesterEditModal(semester) {
  let modal = document.getElementById('semesterModal');
  if (!modal) {
    createSemesterModal();
    // Get modal again after creation
    modal = document.getElementById('semesterModal');
  }
  
  if (!modal) {
    console.error('Failed to create semester modal');
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
  
  // Parse academic year and semester type from semester name
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

// Function to get start and end dates from academic year and semester type
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

// Function to create semester management modal
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
  
  // Set current year as default value in year input field
  const yearInput = document.getElementById('semesterYear');
  if (yearInput) {
    const currentYear = new Date().getFullYear();
    yearInput.value = currentYear;
  }
  
  // Automatically set dates when semester type is changed
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
  
  // Form submission
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
      // Edit
      updateSemester(semesterId, { name, startDate, endDate });
    } else {
      // Add
      addSemester(name, startDate, endDate);
    }
    
    modal.style.display = 'none';
    renderSemestersList();
    renderSemesterSelector();
  });
  
  // Cancel button
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

// Global variables: Current month for calendar
let currentCalendarMonth = new Date();
let monthsCount = 3; // Number of months to display (default 3 months)

// Function to initialize management screen
function initializeManageTab() {
  // Semester add button
  const addSemesterBtn = document.getElementById('addSemesterBtn');
  if (addSemesterBtn) {
    addSemesterBtn.addEventListener('click', () => {
      showSemesterAddModal();
    });
  }
  
  // Display semester list
  renderSemestersList();
  
  // Calendar controls (event listeners set later)
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
  
  // Remove existing event listeners
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
    // Move monthsCount months forward, using the 1st of the month as reference
    const newMonth = new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() + monthsCount, 1);
    currentCalendarMonth = newMonth;
    renderClassDaysCalendar(currentCalendarMonth);
  };
  
  todayHandler = () => {
    // Use the 1st of today's month as reference
    const today = new Date();
    currentCalendarMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    renderClassDaysCalendar(currentCalendarMonth);
  };
  
  // Add event listeners
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

// Function to display class days calendar (supports multiple months)
function renderClassDaysCalendar(startMonth) {
  const calendar = document.getElementById('classDaysCalendar');
  const monthDisplay = document.getElementById('currentMonthDisplay');
  
  if (!calendar) {
    console.error('Calendar element not found');
    return;
  }
  
  const currentSemester = getCurrentSemester();
  if (!currentSemester) {
    calendar.innerHTML = '<p class="empty-message">学期を選択してください</p>';
    if (monthDisplay) monthDisplay.textContent = '';
    return;
  }
  
  // Convert if month is not a Date object
  if (!(startMonth instanceof Date)) {
    startMonth = new Date(startMonth);
  }
  
  // Update month display
  if (monthDisplay) {
    const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    if (monthsCount === 1) {
      monthDisplay.textContent = `${startMonth.getFullYear()}年${monthNames[startMonth.getMonth()]}`;
    } else {
      // Calculate last month (using the 1st of the month as reference)
      const endMonth = new Date(startMonth.getFullYear(), startMonth.getMonth() + monthsCount - 1, 1);
      monthDisplay.textContent = `${startMonth.getFullYear()}年${monthNames[startMonth.getMonth()]} 〜 ${endMonth.getFullYear()}年${monthNames[endMonth.getMonth()]}`;
    }
  }
  
  // Get semester start and end dates
  const startDate = new Date(currentSemester.startDate);
  const endDate = new Date(currentSemester.endDate);
  const classDays = currentSemester.classDays || [];
  
  calendar.innerHTML = '';
  
  // Display multiple calendars side by side
  const calendarsContainer = document.createElement('div');
  calendarsContainer.className = 'calendars-container';
  
  for (let m = 0; m < monthsCount; m++) {
    // Create month m months later, using the 1st of the month as reference
    const month = new Date(startMonth.getFullYear(), startMonth.getMonth() + m, 1);
    
    const monthCalendar = document.createElement('div');
    monthCalendar.className = 'month-calendar';
    
    // Month title
    const monthTitle = document.createElement('div');
    monthTitle.className = 'month-title';
    const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    monthTitle.textContent = `${month.getFullYear()}年${monthNames[month.getMonth()]}`;
    monthCalendar.appendChild(monthTitle);
    
    // Weekday header (with class count display)
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const weekdayNumbers = [0, 1, 2, 3, 4, 5, 6]; // Sunday=0, Monday=1, ...
    
    // Calculate total class count for each weekday in semester
    const weekdayClassCounts = {};
    const semesterStart = new Date(currentSemester.startDate);
    const semesterEnd = new Date(currentSemester.endDate);
    
    // Calculate number of class days for each weekday within semester
    weekdayNumbers.forEach(weekdayNum => {
      if (weekdayNum >= 1 && weekdayNum <= 5) { // Mon-Fri only
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
      
      // Display class count for Mon-Fri only
      if (weekdayNumbers[index] >= 1 && weekdayNumbers[index] <= 5) {
        const countLabel = document.createElement('div');
        countLabel.className = 'weekday-count';
        countLabel.textContent = `${weekdayClassCounts[weekdayNumbers[index]] || 0}回`;
        cell.appendChild(countLabel);
      }
      
      headerRow.appendChild(cell);
    });
    monthCalendar.appendChild(headerRow);
    
    // First day of calendar (first Sunday of the month)
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
    const firstSunday = new Date(firstDay);
    firstSunday.setDate(firstDay.getDate() - firstDay.getDay());
    
    // Last day of calendar (last Saturday of the month)
    const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    const lastSaturday = new Date(lastDay);
    lastSaturday.setDate(lastDay.getDate() + (6 - lastDay.getDay()));
    
    // Calendar body
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
        
        // Check if weekday within semester
        const isWeekdayInSemester = isInSemester && !isWeekend;
        
        // Check if class day (included in classDays = class day, not included = holiday)
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
        
        // Only weekdays within semester are clickable
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

// Function to toggle holiday (class day ↔ holiday)
function toggleHoliday(dateStr) {
  const currentSemester = getCurrentSemester();
  if (!currentSemester) return;
  
  const classDays = currentSemester.classDays || [];
  const index = classDays.indexOf(dateStr);
  
  if (index === -1) {
    // Restore to class day (remove holiday)
    classDays.push(dateStr);
    classDays.sort();
  } else {
    // Set as holiday (exclude from class days)
    classDays.splice(index, 1);
  }
  
  currentSemester.classDays = classDays;
  saveSemesters();
  
  // Redisplay calendar
  renderClassDaysCalendar(currentCalendarMonth);
}

// 曜日の休みを一括設定/解除する関数
function setWeekdayHolidayForCurrentMonth(weekday, month, setHoliday) {
  const currentSemester = getCurrentSemester();
  if (!currentSemester) return;
  
  const classDays = currentSemester.classDays || [];
  const startDate = new Date(currentSemester.startDate);
  const endDate = new Date(currentSemester.endDate);
  
  // First and last day of month
  const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
  const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  
  // Get dates for specified weekday within semester range
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
      // Remove holiday: restore to class day
      if (index === -1) classDays.push(dateStr);
    }
  });
  
  classDays.sort();
  currentSemester.classDays = classDays;
  saveSemesters();
  
  // Redisplay calendar
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
  
  // Redisplay calendar
  renderClassDaysCalendar(currentCalendarMonth);
}
// ============================================
// Step1: Semester Management Feature (end)
// ============================================

// Firebase connection check (v11 compatible)
function checkFirebase() {
  try {
    if (typeof window.firebase !== 'undefined' && window.firebase.db) {
      isFirebaseEnabled = true;
      return true;
    }
  } catch (e) {
    console.warn('Firebase is not available. Running in local-only mode.', e);
  }
  isFirebaseEnabled = false;
  return false;
}

// Function to load timetable (semester-based, Single Source of Truth)
function loadTimetable() {
  const currentSemester = getCurrentSemester();
  if (!currentSemester) {
    generateTimetable(createEmptyTimetable());
    return;
  }
  let t = currentSemester.timetable;
  if (!t || !Array.isArray(t) || t.length !== 5 || !Array.isArray(t[0])) {
    t = createEmptyTimetable();
    currentSemester.timetable = t;
    saveSemesters();
  }
  generateTimetable(t);
}

// Function to save task (v11 compatible, subjectId based)
function saveTask(subjectId, taskData) {
  if (!isFirebaseEnabled) return;
  const semesterId = currentSemesterId || null;
  
  const tasksRef = window.firebase.ref(window.firebase.db, "tabler/tasks");
  const newTaskRef = window.firebase.push(tasksRef);
  window.firebase.set(newTaskRef, {
    semesterId,
    subjectId,
    type: taskData.taskType || taskData.type || 'Assignment',
    content: taskData.content,
    dueDate: taskData.dueDate,
    completed: false,
    createdAt: Date.now()
  });
}

// Function to update task (v11 compatible)
function updateTask(taskId, taskData) {
  if (!isFirebaseEnabled) {
    // Update local only if Firebase is disabled
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
  
  const typeVal = taskData.taskType || taskData.type || existingTask?.type || existingTask?.taskType || 'Assignment';
  const updatedTask = {
    ...existingTask,
    ...taskData,
    type: typeVal,
    taskType: typeVal, // legacy compat
    updatedAt: Date.now()
  };
  
  // Write update to Firebase
  window.firebase.set(taskRef, updatedTask).then(() => {
    // Also update local task data
    if (!window.tasks) {
      window.tasks = {};
    }
    window.tasks[taskId] = updatedTask;
    // Update UI
    displayTasks(window.tasks);
    updateTaskNumbers(window.tasks);
    updateIncompleteTasksCount(window.tasks);
  }).catch((error) => {
    console.error('Failed to update task:', error);
    alert('Failed to update task.');
  });
}

// Common function to close modal
function closeModal() {
  const modal = document.getElementById('taskModal');
  if (modal) {
    modal.style.display = 'none';
    // Reset edit mode
    delete modal.dataset.editMode;
    delete modal.dataset.taskId;
  }
}

// Function to reset modal (for add mode)
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

  // 評価編集モードを解除
  setEvaluationEditMode(false);
}

// Function to display task edit modal (uses same logic as showTaskModal)
function showEditTaskModal(taskId, task) {
  const modal = document.getElementById('taskModal');
  
  // If modal is already open, close it first then reopen in edit mode
  if (modal && modal.style.display === 'block') {
    closeModal();
    resetModalToAddMode();
    // Wait a bit then reopen in edit mode (wait for animation to complete)
    setTimeout(() => {
      showEditTaskModalInternal(taskId, task);
    }, 200);
    return;
  }
  
  showEditTaskModalInternal(taskId, task);
}

// Internal implementation of task edit modal
function showEditTaskModalInternal(taskId, task) {
  const modal = document.getElementById('taskModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalSubtitle = document.getElementById('modalSubtitle');

  modal.dataset.editMode = 'true';
  modal.dataset.taskId = taskId;

  const subject = getSubjectById(task.subjectId);
  const subjectName = subject ? subject.name : (task.title || 'Edit Task');
  modalTitle.textContent = subjectName;
  const slot = getSubjectSlotFromTimetable(task.subjectId);
  modalSubtitle.textContent = slot ? `${slot.period} ${slot.day}` : 'Edit';
  const modalEvaluation = document.getElementById('modalEvaluation');
  if (modalEvaluation) {
    const text = subject ? formatEvaluationForModal(getEvaluationBySubject(subject)) : '';
    modalEvaluation.textContent = text || '（未設定）';
    modalEvaluation.classList.toggle('empty', !text);
  }
  
  const progressSection = document.querySelector('.progress-section');
  const sectionDivider = document.querySelector('.section-divider');
  if (progressSection) progressSection.style.display = 'none';
  if (sectionDivider) sectionDivider.style.display = 'none';
  
  const taskSection = document.getElementById('taskSection');
  if (taskSection) taskSection.style.display = 'block';
  
  const submitButton = document.getElementById('taskSubmitBtn');
  if (submitButton) submitButton.textContent = 'Update Task';
  
  modal.style.display = 'block';
  modalState = { subjectId: task.subjectId, period: slot?.period || '', day: slot?.day || '' };
  
  setTimeout(() => {
    const taskDateInput = document.getElementById('taskDate');
    if (taskDateInput && task.dueDate) {
      taskDateInput.value = task.dueDate;
    }
  }, 100);
  
  setTimeout(() => {
    if (task.subjectId) updateModalProgress(task.subjectId);
  }, 200);
  
  // Set existing values in form
  const taskContentInput = document.getElementById('taskContent');
  const taskDateInput = document.getElementById('taskDate');
  if (taskContentInput) taskContentInput.value = task.content || '';
  if (taskDateInput && task.dueDate) taskDateInput.value = task.dueDate;

  const taskType = task.type || task.taskType;
  document.querySelectorAll('.task-type-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.type === taskType) btn.classList.add('active');
  });
  if (!taskType) {
    document.querySelector('.task-type-btn.active')?.classList.remove('active');
    document.querySelector('.task-type-btn[data-type="Assignment"]')?.classList.add('active');
  }
}

// Function to automatically delete completed tasks (delete completed tasks older than 1 month)
function cleanupOldCompletedTasks(tasks) {
  if (!isFirebaseEnabled || !tasks) return;
  
  const now = Date.now();
  const oneMonthInMs = 30 * 24 * 60 * 60 * 1000; // Convert 30 days to milliseconds
  const tasksToDelete = [];
  
  // Collect task IDs to delete
  Object.entries(tasks).forEach(([taskId, task]) => {
    if (task.completed && task.completedAt) {
      const completedAt = task.completedAt;
      const ageInMs = now - completedAt;
      
      if (ageInMs > oneMonthInMs) {
        tasksToDelete.push(taskId);
      }
    }
  });
  
  // Delete target tasks from Firebase
  if (tasksToDelete.length > 0) {
    tasksToDelete.forEach(taskId => {
      const taskRef = window.firebase.ref(window.firebase.db, `tabler/tasks/${taskId}`);
      window.firebase.remove(taskRef).catch((error) => {
        console.error(`Failed to delete task ${taskId}:`, error);
      });
    });
  }
}

// Function to load tasks (v11 compatible)
function loadTasks() {
  if (!isFirebaseEnabled) {
    // Set empty task data if Firebase is disabled
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
      // Automatically delete old completed tasks
      cleanupOldCompletedTasks(data);
      
      // Filter only tasks for selected semester
      const filteredTasks = {};
      if (currentSemesterId) {
        Object.entries(data).forEach(([taskId, task]) => {
          // Don't display tasks where semesterId matches or old tasks without semesterId
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
      // If data doesn't exist
      window.tasks = {};
      displayTasks({});
      updateTaskNumbers({});
      updateIncompleteTasksCount({});
    }
  });
}

/** @returns {Subject|null} */
function getSubjectById(subjectId) {
  if (!subjectId) return null;
  return subjectsById[subjectId] || null;
}

/** @returns {Subject[]} */
function getSubjectsForSemester(semesterId) {
  return Object.values(subjectsById).filter(s => s.semesterId === semesterId);
}

/**
 * Create a new Subject and add to store.
 * 色はパレットから「currentSubjects で未使用の色」を優先して割り当て。全て使用済みなら先頭からループ。
 * 既存科目の再利用時は getOrCreateSubjectByName が既存を返すため色は維持される。
 *
 * @param {string} semesterId
 * @param {string} name
 * @param {string} [color] - Optional; 指定時はそれを使用
 * @returns {Subject}
 */
function createSubject(semesterId, name, color) {
  const id = `sub_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const currentSubjects = Object.values(subjectsById).filter(s => s.semesterId === semesterId);
  const usedColors = new Set(currentSubjects.map(s => s.color));
  let assignedColor = color;
  if (!assignedColor) {
    const unused = SUBJECT_COLOR_PALETTE.find(c => !usedColors.has(c));
    assignedColor = unused != null ? unused : SUBJECT_COLOR_PALETTE[currentSubjects.length % SUBJECT_COLOR_PALETTE.length];
  }
  const subject = {
    id,
    semesterId,
    name: (name || '').trim(),
    color: assignedColor,
    progress: 0,
    evaluation: null
  };
  subjectsById[id] = subject;
  return subject;
}

/**
 * Get or create Subject by name for a semester (used when editing timetable).
 * 同じ学期内に同じ名前（name）の科目が既に存在する場合は、新規 ID を発行せず
 * 既存の Subject の id を再利用する。週2回の授業や連続コマを1つの Subject で共有できる。
 *
 * @param {string} semesterId
 * @param {string} name
 * @returns {Subject|null}
 */
function getOrCreateSubjectByName(semesterId, name) {
  const trimmed = (name || '').trim();
  if (!trimmed) return null;
  const currentSubjects = Object.values(subjectsById).filter(s => s.semesterId === semesterId);
  const existing = currentSubjects.find(s => s.name === trimmed);
  if (existing) return existing;
  return createSubject(semesterId, trimmed);
}

// Function to load subjects data
function loadSubjects() {
  return new Promise((resolve) => {
    if (!currentSemesterId) {
      subjectsById = {};
      resolve(subjectsById);
      return;
    }
    
    if (isFirebaseEnabled) {
      const subjectsRef = window.firebase.ref(window.firebase.db, `subjects/${currentSemesterId}`);
      window.firebase.get(subjectsRef)
        .then((snapshot) => {
          const data = snapshot.val();
          subjectsById = {};
          if (data && typeof data === 'object') {
            Object.entries(data).forEach(([id, sub]) => {
              subjectsById[id] = {
                id,
                semesterId: currentSemesterId,
                name: sub.name || '',
                color: sub.color || '#F5F5F5',
                progress: sub.progress ?? 0,
                evaluation: sub.evaluation != null ? sub.evaluation : null
              };
            });
          }
          resolve(subjectsById);
        })
        .catch((error) => {
          console.error('Failed to load subjects from Firebase:', error);
          subjectsById = {};
          resolve(subjectsById);
        });
    } else {
      try {
        const key = `subjects_${currentSemesterId}`;
        const stored = localStorage.getItem(key);
        subjectsById = stored ? JSON.parse(stored) : {};
        if (typeof subjectsById !== 'object') subjectsById = {};
      } catch (e) {
        subjectsById = {};
      }
      resolve(subjectsById);
    }
  });
}

// Function to save subjects data
function saveSubjects() {
  if (!currentSemesterId) {
    console.warn('Cannot save subjects because no semester is selected');
    return;
  }
  
  if (isFirebaseEnabled) {
    const subjectsRef = window.firebase.ref(window.firebase.db, `subjects/${currentSemesterId}`);
    const toSave = Object.fromEntries(
      Object.entries(subjectsById).filter(([, s]) => s.semesterId === currentSemesterId)
    );
    window.firebase.set(subjectsRef, toSave).catch((error) => {
      console.error('Failed to save subjects to Firebase:', error);
    });
  } else {
    const key = `subjects_${currentSemesterId}`;
    const toSave = Object.fromEntries(
      Object.entries(subjectsById).filter(([, s]) => s.semesterId === currentSemesterId)
    );
    localStorage.setItem(key, JSON.stringify(toSave));
  }
}
/**
 * 科目に紐づく評価データを取得。Subject.evaluation を優先し、なければ evaluationsData から名前で検索。
 * @param {Subject} subject
 * @returns {Object|null} - components 等を持つ評価オブジェクト
 */
function getEvaluationBySubject(subject) {
  if (!subject) return null;
  if (subject.evaluation != null && typeof subject.evaluation === 'object') {
    return subject.evaluation;
  }
  if (!evaluationsData) return null;
  const list = evaluationsData.subjects || [];
  const aliasMap = {
    '電磁気学A': '電磁気', '電磁気': '電磁気',
    '電基礎': '電電電気', '電電電気': '電電電気',
    '力学A': '力学', '力学': '力学'
  };
  const key = aliasMap[subject.name] || subject.name;
  return list.find(s => s.displayName === key || s.subjectId === key) || null;
}

// Function to get class days data
function getClassDays() {
  // Step2: Return class days for selected semester
  const currentSemester = getCurrentSemester();
  if (currentSemester && currentSemester.classDays) {
    return currentSemester.classDays.map(date => ({
      date: date,
      dayOfWeek: ['日','月','火','水','木','金','土'][new Date(date).getDay()] + '曜日'
    }));
  }
  // Return empty array if no semester data
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

/** Get first slot (period, day) for a subject from the timetable */
function getSubjectSlotFromTimetable(subjectId) {
  if (!subjectId || !window.currentTimetableData) return null;
  const days = ['月', '火', '水', '木', '金'];
  const periods = ['1限', '2限', '3限', '4限', '5限'];
  for (let pi = 0; pi < 5; pi++) {
    for (let di = 0; di < 5; di++) {
      if (window.currentTimetableData[pi] && window.currentTimetableData[pi][di] === subjectId) {
        return { period: periods[pi], day: days[di] };
      }
    }
  }
  return null;
}

/** Get current week number for a subject based on its slot in the timetable */
function getCurrentWeekForSubject(subjectId, todayISO = getTodayISO()) {
  if (!subjectId || !window.currentTimetableData) return 1;
  const days = ['月', '火', '水', '木', '金'];
  for (let periodIndex = 0; periodIndex < 5; periodIndex++) {
    for (let dayIndex = 0; dayIndex < 5; dayIndex++) {
      const cellId = window.currentTimetableData[periodIndex] && window.currentTimetableData[periodIndex][dayIndex];
      if (cellId === subjectId) {
        const dayOfWeek = getDayOfWeek(days[dayIndex]);
        const allDays = getClassDaysByWeekday(dayOfWeek);
        const pastDays = allDays.filter(d => d.date <= todayISO);
        return Math.max(pastDays.length, 1);
      }
    }
  }
  return 1;
}

// Function to generate timetable (subject ID based)
function generateTimetable(timetableData) {
  window.currentTimetableData = timetableData;
  
  const timetable = document.getElementById('timetable');
  if (timetable) timetable.innerHTML = '';

  const days = ['月', '火', '水', '木', '金'];
  const headerCell = document.createElement('div');
  headerCell.className = 'cell header';
  timetable.appendChild(headerCell);

  const now = new Date();
  const currentDay = ['日', '月', '火', '水', '木', '金', '土'][now.getDay()];
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinute;

  days.forEach(day => {
    const cell = document.createElement('div');
    cell.className = 'cell header';
    if (day === currentDay) cell.classList.add('current-day-header');
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

  const periodTimes = periods.map(period => {
    const [start, end] = period.time.split('-');
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);
    return { start: startHour * 60 + startMinute, end: endHour * 60 + endMinute };
  });

  periods.forEach((period, periodIndex) => {
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

    days.forEach((day, dayIndex) => {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.setAttribute('data-period', period.name);
      cell.setAttribute('data-day', day);
      
      if (day === currentDay) {
        const pt = periodTimes[periodIndex];
        if (currentTime >= pt.start && currentTime <= pt.end) cell.classList.add('current-period');
      }

      const subjectId = (timetableData[periodIndex] && timetableData[periodIndex][dayIndex]) || '';
      const subject = subjectId ? getSubjectById(subjectId) : null;
      
      if (subject) {
        cell.setAttribute('data-subject-id', subject.id);
        const title = document.createElement('div');
        title.className = 'title';
        title.textContent = subject.name;
        cell.style.backgroundColor = subject.color || '#F5F5F5';
        cell.appendChild(title);

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

        cell.addEventListener('click', () => {
          showTaskModal(period.name, day, subject.id);
        });
      }
      
      timetable.appendChild(cell);
    });
  });
  
  // Redisplay task count badge after timetable generation
  if (window.tasks) {
    updateTaskNumbers(window.tasks);
  }
}

// Load and display evaluation information
// Currently only displays empty list since evaluations.json was removed
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

// Function to calculate and update task numbers
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
    const key = task.subjectId || `${task.period || ''}_${task.day || ''}_${task.title || ''}`;
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

    const normalizedType = normalizeTaskType(task.type || task.taskType) || 'Assignment';
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
    const subjectId = cell.getAttribute('data-subject-id');
    if (!subjectId) return;
    const aggregate = taskAggregates[subjectId];
    const count = aggregate?.count || 0;
    const priorityType = aggregate?.type || 'Assignment';

    const existingCircle = cell.querySelector('.number-circle');
    if (existingCircle) existingCircle.remove();

    if (count > 0) {
        const numberCircle = document.createElement('div');
        numberCircle.className = 'number-circle';
        numberCircle.textContent = count;
        numberCircle.style.display = 'flex';
        
        // Set shape according to task type
        if (priorityType === 'Test') {
          numberCircle.classList.add('shape-star');
        } else if (priorityType === 'Report') {
          numberCircle.classList.add('shape-square');
        } else {
          // Assignment is default circular
          numberCircle.classList.add('shape-circle');
        }
        
        // Set color according to deadline
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
        showTaskPopup(subjectId);
      });
      cell.appendChild(numberCircle);
    }
  });
  
  // Update incomplete task count
  updateIncompleteTasksCount(tasks);
}

// Function to update timetable progress bars
function updateTimetableProgressBars() {
  const cells = document.querySelectorAll('.cell:not(.header):not(.time)');
  cells.forEach(cell => {
    const subjectId = cell.getAttribute('data-subject-id');
    if (!subjectId) return;
    
    const s = getSubjectById(subjectId);
    const bar = cell.querySelector('.progress-bar');
    const text = cell.querySelector('.progress-text');

    if (s) {
      const denom = getCurrentWeekForSubject(s.id);
      const pct = Math.max(0, Math.min(100, Math.floor((denom ? (s.progress / denom) : 0) * 100)));
      if (bar) { bar.style.display = ''; bar.style.width = `${pct}%`; bar.className = `progress-bar ${computeProgressColorClass(pct)}`; }
      if (text) { text.style.display = ''; text.textContent = `${s.progress || 0}/${denom}`; }
    } else {
      if (bar) { bar.style.display = ''; bar.style.width = '0%'; bar.className = `progress-bar ${computeProgressColorClass(0)}`; }
      if (text) { text.style.display = ''; text.textContent = '0/1'; }
    }
  });
}

// Helper functions
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
  const subjects = getSubjectsForSemester(currentSemesterId);
  let totalProgress = 0;
  let totalRequired = 0;
  
  subjects.forEach(subject => {
    const currentWeek = getCurrentWeekForSubject(subject.id);
    const progress = subject.progress || 0;
    totalProgress += progress;
    totalRequired += currentWeek;
  });
  
  const overallProgressPercent = totalRequired > 0 ? Math.round((totalProgress / totalRequired) * 100) : 0;
  
  // Update display
  const overallProgressEl = document.getElementById('overallProgress');
  if (overallProgressEl) {
    overallProgressEl.textContent = `${overallProgressPercent}%`;
  }
}

// Function to update week display
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
  
  // Add total of progress deficits (sum of deficits for each subject)
  const progressDeficitTasks = generateProgressDeficitTasks();
  const totalDeficit = progressDeficitTasks.reduce((sum, task) => sum + task.deficit, 0);
  incompleteCount += totalDeficit;
  
  const incompleteTasksEl = document.getElementById('incompleteTasksCount');
  if (incompleteTasksEl) {
    incompleteTasksEl.textContent = incompleteCount;
  }
}

// モーダル表示関数（subjectId ベース）。displayText を優先、なければ components 形式をフォーマット
function formatEvaluationForModal(evalObj) {
  if (!evalObj) return '';
  if (typeof evalObj.displayText === 'string' && evalObj.displayText.trim()) return evalObj.displayText.trim();
  if (!Array.isArray(evalObj.components) || evalObj.components.length === 0) return '';
  return evalObj.components.slice(0, 4).map(c => {
    const w = c.weightType === 'points' ? `${c.weight}点` : `${c.weight}%`;
    return `${c.type}${w}`;
  }).join(' · ');
}

function refreshModalEvaluation() {
  const subjectId = modalState?.subjectId;
  if (!subjectId) return;
  const subject = getSubjectById(subjectId);
  const evalObj = subject ? getEvaluationBySubject(subject) : null;
  const text = formatEvaluationForModal(evalObj);
  const span = document.getElementById('modalEvaluation');
  const input = document.getElementById('modalEvaluationInput');
  if (span) {
    span.textContent = text || '（未設定）';
    span.classList.toggle('empty', !text);
  }
  if (input) input.value = text || '';
}

function setEvaluationEditMode(editing) {
  const span = document.getElementById('modalEvaluation');
  const input = document.getElementById('modalEvaluationInput');
  const btn = document.getElementById('modalEvaluationEditBtn');
  if (!span || !input || !btn) return;
  if (editing) {
    const current = span.textContent || '';
    input.value = current === '（未設定）' ? '' : current;
    span.style.display = 'none';
    input.style.display = '';
    input.focus();
    btn.textContent = '✓';
    btn.title = '保存';
    btn.classList.add('edit-mode');
  } else {
    span.style.display = '';
    input.style.display = 'none';
    btn.textContent = '✎';
    btn.title = '評価を編集';
    btn.classList.remove('edit-mode');
    refreshModalEvaluation();
  }
}

function saveEvaluationFromEdit() {
  const input = document.getElementById('modalEvaluationInput');
  const subjectId = modalState?.subjectId;
  if (!input || !subjectId) return;
  const subject = getSubjectById(subjectId);
  if (!subject) return;
  const text = (input.value || '').trim();
  subject.evaluation = text ? { displayText: text } : null;
  subjectsById[subjectId] = subject;
  saveSubjects();
  setEvaluationEditMode(false);
  updateTimetableProgressBars();
}

function showTaskModal(period, day, subjectId) {
  const modal = document.getElementById('taskModal');
  if (modal && modal.style.display === 'block') return;
  
  const subject = getSubjectById(subjectId);
  const title = subject ? subject.name : '';
  
  resetModalToAddMode();
  const modalTitle = document.getElementById('modalTitle');
  const modalSubtitle = document.getElementById('modalSubtitle');
  const modalEvaluation = document.getElementById('modalEvaluation');
  if (modalTitle) modalTitle.textContent = title;
  if (modalSubtitle) modalSubtitle.textContent = `${period} ${day}`;
  if (modalEvaluation) {
    const evalObj = subject ? getEvaluationBySubject(subject) : null;
    const text = formatEvaluationForModal(evalObj);
    modalEvaluation.textContent = text || '（未設定）';
    modalEvaluation.classList.toggle('empty', !text);
  }
  
  modal.style.display = 'block';
  modalState = { subjectId, period, day };

  setTimeout(() => setDate('nextWeekDayBefore'), 100);
  setTimeout(() => updateModalProgress(subjectId), 200);
  
  const taskForm = document.getElementById('taskForm');
  if (taskForm) {
    taskForm.reset();
    document.querySelectorAll('.task-type-btn').forEach(btn => btn.classList.remove('active'));
    const defaultBtn = document.querySelector('.task-type-btn[data-type="Assignment"]');
    if (defaultBtn) defaultBtn.classList.add('active');
  }
}

// モーダル内タブ切り替え（削除済み）
// 統合モーダルではタブ機能は不要

function updateModalProgress(subjectId) {
  if (!subjectId) return;
  const s = getSubjectById(subjectId);
  if (s) {
    const customInput = document.getElementById('customTimeInput');
    if (customInput) customInput.value = '';
  }
}

// 日付を設定する関数（週ベース：月曜始まり）
function setDate(type) {
  const modalSubtitle = document.getElementById('modalSubtitle').textContent;
  const [period, day] = modalSubtitle.split(' ');

  // 月曜=0, 火曜=1, 水曜=2, 木曜=3, 金曜=4
  const dayOffsetMap = { '月': 0, '火': 1, '水': 2, '木': 3, '金': 4 };
  const classWeekdayOffset = dayOffsetMap[day];

  if (classWeekdayOffset === undefined) {
    console.error('Failed to resolve weekday from day label:', day);
    return;
  }

  // 今週の月曜日を取得（週は月曜始まり）
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayOfWeek = today.getDay(); // 0=日, 1=月, ..., 6=土
  const daysFromMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const thisMonday = new Date(today);
  thisMonday.setDate(today.getDate() + daysFromMonday);

  const addDays = (baseDate, days) => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + days);
    return d;
  };

  let targetDate;
  switch (type) {
    case 'prevWeekDayBefore':
      // 先週の授業曜日の前日
      targetDate = addDays(thisMonday, -7 + classWeekdayOffset - 1);
      break;
    case 'thisWeekDayBefore':
      // 今週の授業曜日の前日
      targetDate = addDays(thisMonday, classWeekdayOffset - 1);
      break;
    case 'nextWeekDayBefore':
      // 来週の授業曜日の前日
      targetDate = addDays(thisMonday, 7 + classWeekdayOffset - 1);
      break;
    case 'nextWeek':
      // 来週の授業曜日
      targetDate = addDays(thisMonday, 7 + classWeekdayOffset);
      break;
    default:
      console.error('Unknown setDate type:', type);
      return;
  }

  document.getElementById('taskDate').value = formatDateLocal(targetDate);
}

// 進捗不足タスクを生成する関数
function generateProgressDeficitTasks() {
  const progressDeficitTasks = [];
  const subjects = getSubjectsForSemester(currentSemesterId);
  
  subjects.forEach(subject => {
    const currentWeek = getCurrentWeekForSubject(subject.id);
    const progress = subject.progress || 0;
    const deficit = currentWeek - progress;
    if (deficit > 0 && subject.name && subject.name.trim() !== '') {
      progressDeficitTasks.push({
        subjectId: subject.id,
        subjectName: subject.name,
        currentWeek,
        progress,
        deficit
      });
    }
  });
  
  // 不足分（deficit）が大きい順にソート
  progressDeficitTasks.sort((a, b) => b.deficit - a.deficit);
  
  return progressDeficitTasks;
}

// 進捗を更新する共通関数 (subjectId ベース)
async function updateProgressForSubject(subjectId, increment = 1) {
  if (!currentSemesterId || !subjectId) {
    console.warn('Cannot update progress: no semester or subject selected');
    return false;
  }
  await loadSubjects();
  let s = getSubjectById(subjectId);
  if (!s) return false;
  
  const oldProgress = s.progress || 0;
  const newProgress = Math.max(0, oldProgress + increment);
  if (newProgress === oldProgress && increment < 0) return false;
  
  s.progress = newProgress;
  subjectsById[subjectId] = s;
  saveSubjects();
  updateTimetableProgressBars();
  updateSummaryStats();
  if (window.tasks) updateIncompleteTasksCount(window.tasks);
  return true;
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
    
    const success = await updateProgressForSubject(task.subjectId, 1);
    
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
    
    const success = await updateProgressForSubject(task.subjectId, -1);
    
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

  const taskType = task.type || task.taskType;
  if (taskType) div.classList.add(`task-type-${taskType}`);

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

  const subject = getSubjectById(task.subjectId);
  const subjectName = subject ? subject.name : (task.title || 'Unknown');
  const title = document.createElement('div');
  title.className = 'task-title';
  title.textContent = subjectName;

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
function showTaskPopup(subjectId) {
  const existingPopup = document.querySelector('.task-popup');
  if (existingPopup) existingPopup.remove();

  const subject = getSubjectById(subjectId);
  const title = subject ? subject.name : 'Tasks';

  const popup = document.createElement('div');
  popup.className = 'task-popup';
  popup.innerHTML = `
    <div class="task-popup-content">
      <div class="task-popup-header">
        <h2>${title}</h2>
      </div>
      <div class="task-popup-list" id="taskPopupList"></div>
    </div>
  `;

  document.body.appendChild(popup);
  popup.style.display = 'block';

  const taskList = document.getElementById('taskPopupList');
  const tasks = Object.entries(window.tasks || {})
    .filter(([, task]) => !task.completed && task.subjectId === subjectId)
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
      // Editモード
      updateTask(taskId, taskData);
    } else {
      // Addモード
      const subjectId = modalState.subjectId;
      if (subjectId) saveTask(subjectId, taskData);
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
    const success = await updateProgressForSubject(modalState.subjectId, 1);
    if (success) {
      updateModalProgress(modalState.subjectId);
      const btnRect = understandBtn.getBoundingClientRect();
      const px = e.clientX || (btnRect.left + btnRect.width / 2);
      const py = e.clientY || (btnRect.top + btnRect.height / 2);
      playCelebrateAnimation(px, py, ['#10b981', '#34d399', '#6ee7b7', '#22c55e']);
      document.getElementById('taskModal').style.display = 'none';
    }
  });

  // 評価編集ボタン（鉛筆 / 保存）
  const evaluationEditBtn = document.getElementById('modalEvaluationEditBtn');
  const modalEvaluationInput = document.getElementById('modalEvaluationInput');
  if (evaluationEditBtn) {
    evaluationEditBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (evaluationEditBtn.classList.contains('edit-mode')) {
        saveEvaluationFromEdit();
      } else {
        setEvaluationEditMode(true);
      }
    });
  }
  if (modalEvaluationInput) {
    modalEvaluationInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        saveEvaluationFromEdit();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setEvaluationEditMode(false);
      }
    });
  }

  // 戻すボタン
  document.getElementById('ununderstandBtn').addEventListener('click', async () => {
    const success = await updateProgressForSubject(modalState.subjectId, -1);
    if (success) {
      updateModalProgress(modalState.subjectId);
      document.getElementById('taskModal').style.display = 'none';
    } else {
      const s = getSubjectById(modalState.subjectId);
      if (s && s.progress === 0) alert('理解度は既に0回です。これ以上減らすことはできません。');
      else alert('科目データが見つかりません。');
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
  
  wireEvents();
}




// グローバルに関数を公開
window.setDate = setDate;

// DOMContentLoadedで初期化
document.addEventListener('DOMContentLoaded', boot);

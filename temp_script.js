
  let activeVtuSem = 1;
  let vtuMarksStore = {};

  const semDefaultSubjectTemplates = {
    sem1: [
      { name: 'Calculus & Linear Algebra', credits: 4, marks: 85 },
      { name: 'Engineering Physics', credits: 4, marks: 88 },
      { name: 'Basic Electrical Engg', credits: 3, marks: 82 },
      { name: 'C Programming for Problem Solving', credits: 4, marks: 90 },
      { name: 'Technical English', credits: 2, marks: 86 },
      { name: 'Engineering Physics Lab', credits: 1.5, marks: 92 },
      { name: 'C Programming Lab', credits: 1.5, marks: 94 },
      { name: 'Engineering Workshop', credits: 1, marks: 88 },
      { name: 'Environmental Studies', credits: 1, marks: 84 },
      { name: 'Constitution & Ethics', credits: 1, marks: 87 }
    ],
    sem2: [
      { name: 'Advanced Calculus & Differential Eqs', credits: 4, marks: 86 },
      { name: 'Engineering Chemistry', credits: 4, marks: 84 },
      { name: 'Basic Electronics Engg', credits: 3, marks: 88 },
      { name: 'Data Structures & Algorithms', credits: 4, marks: 91 },
      { name: 'Python Programming', credits: 3, marks: 93 },
      { name: 'Engineering Chemistry Lab', credits: 1.5, marks: 90 },
      { name: 'Data Structures Lab', credits: 1.5, marks: 95 },
      { name: 'Computer Aided Drafting', credits: 1, marks: 87 },
      { name: 'Scientific Foundations of Health', credits: 1, marks: 85 },
      { name: 'Innovation & Design Thinking', credits: 1, marks: 89 }
    ],
    sem3: [
      { name: 'Discrete Mathematical Structures', credits: 3, marks: 84 },
      { name: 'Object Oriented Programming (C++)', credits: 4, marks: 89 },
      { name: 'Computer Organization & Architecture', credits: 4, marks: 86 },
      { name: 'Operating Systems', credits: 4, marks: 90 },
      { name: 'Software Engineering', credits: 3, marks: 88 },
      { name: 'OOP Lab', credits: 1.5, marks: 92 },
      { name: 'OS Lab', credits: 1.5, marks: 94 },
      { name: 'Object Oriented Modeling', credits: 2, marks: 87 },
      { name: 'Social Connect & Responsibility', credits: 1, marks: 85 },
      { name: 'Universal Human Values', credits: 1, marks: 86 }
    ],
    sem4: [
      { name: 'Complex Analysis & Probability', credits: 3, marks: 85 },
      { name: 'Database Management Systems', credits: 4, marks: 92 },
      { name: 'Design & Analysis of Algorithms', credits: 4, marks: 88 },
      { name: 'Computer Networks', credits: 4, marks: 87 },
      { name: 'Microprocessors & Controllers', credits: 3, marks: 84 },
      { name: 'DBMS Lab', credits: 1.5, marks: 95 },
      { name: 'Algorithms Lab', credits: 1.5, marks: 91 },
      { name: 'Web Technology Lab', credits: 2, marks: 93 },
      { name: 'Biology for Engineers', credits: 1, marks: 82 },
      { name: 'Aptitude & Logical Reasoning', credits: 1, marks: 88 }
    ],
    sem5: [
      { name: 'Management & Entrepreneurship', credits: 3, marks: 86 },
      { name: 'Automata Theory & Computability', credits: 4, marks: 87 },
      { name: 'Cloud Computing & Microservices', credits: 4, marks: 94 },
      { name: 'Artificial Intelligence & ML', credits: 4, marks: 91 },
      { name: 'Computer Graphics & Visualization', credits: 3, marks: 85 },
      { name: 'Cloud & DevOps Lab', credits: 1.5, marks: 96 },
      { name: 'AI & ML Lab', credits: 1.5, marks: 93 },
      { name: 'Full Stack Web Development Lab', credits: 2, marks: 95 },
      { name: 'Mini Project / Industrial Seminar', credits: 2, marks: 90 },
      { name: 'Research Methodology & IPR', credits: 1, marks: 88 }
    ],
    sem6: [
      { name: 'System Design & Distributed Systems', credits: 4, marks: 92 },
      { name: 'Compiler Design', credits: 4, marks: 84 },
      { name: 'Big Data Analytics', credits: 3, marks: 89 },
      { name: 'Cyber Security & Cryptography', credits: 3, marks: 88 },
      { name: 'DevOps & Containerization', credits: 3, marks: 93 },
      { name: 'System Design Lab', credits: 1.5, marks: 94 },
      { name: 'Big Data Lab', credits: 1.5, marks: 91 },
      { name: 'Mobile App Development', credits: 2, marks: 90 },
      { name: 'Internship / Technical Seminar', credits: 2, marks: 95 },
      { name: 'Major Project Phase 1', credits: 2, marks: 94 }
    ],
    sem7: [
      { name: 'High Performance Computing', credits: 4, marks: 90 },
      { name: 'Blockchain & Smart Contracts', credits: 3, marks: 89 },
      { name: 'Deep Learning & Neural Networks', credits: 3, marks: 92 },
      { name: 'Natural Language Processing', credits: 3, marks: 88 },
      { name: 'Cloud Native Architecture', credits: 3, marks: 94 },
      { name: 'HPC & Deep Learning Lab', credits: 1.5, marks: 95 },
      { name: 'Industry Project Phase 2', credits: 4, marks: 96 },
      { name: 'Technical Elective Seminar', credits: 2, marks: 91 },
      { name: 'Professional Ethics & Patent Filing', credits: 1, marks: 89 },
      { name: 'Comprehensive Viva Voce', credits: 1.5, marks: 93 }
    ],
    sem8: [
      { name: 'Enterprise Cloud Security', credits: 3, marks: 92 },
      { name: 'Edge AI & IoT Architecture', credits: 3, marks: 90 },
      { name: 'Capstone Industry Project', credits: 10, marks: 96 },
      { name: 'Industry Internship / Dissertation', credits: 6, marks: 95 },
      { name: 'Open Elective - Quantum Computing', credits: 3, marks: 88 },
      { name: 'Open Elective - Financial Tech', credits: 3, marks: 87 },
      { name: 'Technical Paper Presentation', credits: 2, marks: 94 },
      { name: 'Research Publication', credits: 2, marks: 93 },
      { name: 'Grand Viva', credits: 2, marks: 95 },
      { name: 'Placement Readiness Evaluation', credits: 2, marks: 96 }
    ]
  };

  document.addEventListener('DOMContentLoaded', () => {
    initStudentDashboard();
    window.addEventListener('sb-data-updated', initStudentDashboard);
  });

  function initVtuMarksStore() {
    const data = window.SBDynamic.getData();
    const s = data.student;
    if (s.vtuSubjectsBySem) {
      vtuMarksStore = JSON.parse(JSON.stringify(s.vtuSubjectsBySem));
      // Normalize raw arrays to object format
      for (let sem = 1; sem <= 8; sem++) {
        const key = `sem${sem}`;
        if (Array.isArray(vtuMarksStore[key])) {
          vtuMarksStore[key] = vtuMarksStore[key].map((item, idx) => {
            if (typeof item === 'object' && item !== null) return item;
            const tpl = (semDefaultSubjectTemplates[key] && semDefaultSubjectTemplates[key][idx]) || { name: `Subject ${idx + 1}`, credits: 3 };
            return { name: tpl.name, credits: tpl.credits, marks: parseFloat(item) || 85 };
          });
        } else {
          vtuMarksStore[key] = JSON.parse(JSON.stringify(semDefaultSubjectTemplates[key] || []));
        }
      }
    } else {
      vtuMarksStore = JSON.parse(JSON.stringify(semDefaultSubjectTemplates));
    }
  }

  function renderVtuSubjectInputs(semNum) {
    activeVtuSem = semNum;
    const key = `sem${semNum}`;
    if (!vtuMarksStore[key] || !Array.isArray(vtuMarksStore[key])) {
      vtuMarksStore[key] = JSON.parse(JSON.stringify(semDefaultSubjectTemplates[key] || []));
    }
    const subjects = vtuMarksStore[key];

    // Highlight active tab
    for (let i = 1; i <= 8; i++) {
      const tab = document.getElementById(`vtu-tab-${i}`);
      if (tab) {
        if (i === semNum) {
          tab.className = 'px-3 py-1.5 rounded-lg text-xs font-bold bg-primary text-on-primary shrink-0 transition-colors';
        } else {
          tab.className = 'px-3 py-1.5 rounded-lg text-xs font-bold text-on-surface-variant hover:bg-surface-container shrink-0 transition-colors';
        }
      }
    }

    const titleEl = document.getElementById('active-sem-title');
    if (titleEl) titleEl.textContent = `Semester ${semNum} (10 VTU Core Subjects)`;

    const inputsContainer = document.getElementById('vtu-10-subject-inputs');
    if (inputsContainer) {
      inputsContainer.innerHTML = subjects.map((sub, idx) => `
        <div class="grid grid-cols-12 gap-2 items-center bg-surface-container-lowest p-2 rounded-lg border border-outline/20">
          <div class="col-span-6">
            <label class="block text-[9px] font-bold text-on-surface-variant uppercase truncate">Sub ${idx + 1} Name</label>
            <input type="text" value="${escHtml(sub.name || '')}" onchange="updateVtuSubjectProp(${semNum}, ${idx}, 'name', this.value)"
                   class="w-full bg-surface-container-low border border-outline/30 rounded px-2 py-1 text-xs font-semibold text-on-surface" placeholder="Subject Name"/>
          </div>
          <div class="col-span-3">
            <label class="block text-[9px] font-bold text-on-surface-variant uppercase text-center">Credits</label>
            <input type="number" min="0.5" max="10" step="0.5" value="${sub.credits || 3}" oninput="updateVtuSubjectProp(${semNum}, ${idx}, 'credits', this.value)"
                   class="w-full bg-surface-container-low border border-outline/30 rounded px-2 py-1 font-data-mono text-xs font-bold text-on-surface text-center"/>
          </div>
          <div class="col-span-3">
            <label class="block text-[9px] font-bold text-on-surface-variant uppercase text-center">Marks / 100</label>
            <input type="number" min="0" max="100" value="${sub.marks !== undefined ? sub.marks : 85}" oninput="updateVtuSubjectProp(${semNum}, ${idx}, 'marks', this.value)"
                   class="w-full bg-surface-container-low border border-outline/30 rounded px-2 py-1 font-data-mono text-xs font-bold text-on-surface text-center"/>
          </div>
        </div>
      `).join('');
    }

    recalcVtuLiveSummary();
  }

  function switchVtuSemTab(semNum) {
    renderVtuSubjectInputs(semNum);
  }

  function updateVtuSubjectProp(semNum, subIdx, prop, value) {
    const key = `sem${semNum}`;
    if (!vtuMarksStore[key]) vtuMarksStore[key] = JSON.parse(JSON.stringify(semDefaultSubjectTemplates[key] || []));
    if (!vtuMarksStore[key][subIdx]) return;

    if (prop === 'marks') {
      vtuMarksStore[key][subIdx].marks = Math.min(100, Math.max(0, parseFloat(value) || 0));
    } else if (prop === 'credits') {
      vtuMarksStore[key][subIdx].credits = Math.max(0.5, parseFloat(value) || 1);
    } else if (prop === 'name') {
      vtuMarksStore[key][subIdx].name = value.trim() || `Subject ${subIdx + 1}`;
    }
    recalcVtuLiveSummary();
  }

  function recalcVtuLiveSummary() {
    // Current semester SGPA
    const curList = vtuMarksStore[`sem${activeVtuSem}`] || [];
    const sgpa = window.SBDynamic.calcVTUSGPAFromSubjects(curList);
    const sgpaEl = document.getElementById('active-sem-sgpa');
    if (sgpaEl) sgpaEl.textContent = `Sem ${activeVtuSem} SGPA: ${sgpa.toFixed(2)}`;

    // Overall 8-sem CGPA & Percentage
    const cgpa = window.SBDynamic.calcStudent8SemCGPA({ vtuSubjectsBySem: vtuMarksStore });
    const pct = window.SBDynamic.calcVTUPercentage(cgpa);

    const cgpaEl = document.getElementById('vtu-live-cgpa');
    if (cgpaEl) cgpaEl.textContent = `${cgpa.toFixed(2)} / 10.0`;

    const pctEl = document.getElementById('vtu-live-pct');
    if (pctEl) pctEl.textContent = `${pct.toFixed(1)} %`;
  }

  function openSemMarksModal() {
    try {
      initVtuMarksStore();
      renderVtuSubjectInputs(1);

      const data = window.SBDynamic ? window.SBDynamic.getData() : { student: {} };
      if (document.getElementById('achievements-inp')) {
        document.getElementById('achievements-inp').value = Array.isArray(data.student.achievements)
          ? data.student.achievements.join(', ')
          : (data.student.achievements || '');
      }
    } catch (e) {
      console.warn('Modal init warning:', e);
    }
    const modal = document.getElementById('semMarksModal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.style.display = 'flex';
    }
  }

  function closeSemMarksModal() {
    const modal = document.getElementById('semMarksModal');
    if (modal) {
      modal.classList.add('hidden');
      modal.style.display = 'none';
    }
  }

  function saveSemMarksAndAchievements() {
    const ach = document.getElementById('achievements-inp')?.value.trim() || '';

    // Calculate SGPAs across all 8 sems
    const semSGPAs = [];
    for (let sem = 1; sem <= 8; sem++) {
      const arr = vtuMarksStore[`sem${sem}`] || semDefaultSubjectTemplates[`sem${sem}`];
      semSGPAs.push(window.SBDynamic.calcVTUSGPAFromSubjects(arr));
    }
    const overallCGPA = window.SBDynamic.calcStudent8SemCGPA({ vtuSubjectsBySem: vtuMarksStore, semesters: semSGPAs });

    window.SBDynamic.updateData(data => {
      data.student.vtuSubjectsBySem = vtuMarksStore;
      data.student.semesters = semSGPAs;
      data.student.achievements = ach;
      data.student.cgpa = overallCGPA;
    });

    closeSemMarksModal();
    initStudentDashboard();
    alert(`VTU 8-Semester Marks Saved Successfully!\n\nCalculated CGPA: ${overallCGPA.toFixed(2)}\nVTU Percentage: ${window.SBDynamic.calcVTUPercentage(overallCGPA).toFixed(1)}%`);
  }

  function triggerAvatarUpload(e) {
    if (e) e.stopPropagation();
    const input = document.getElementById('student-avatar-file-input');
    if (input) input.click();
  }

  function handleStudentAvatarUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    // Enforce 2 MB maximum size limit
    const MAX_SIZE_MB = 2;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

    if (file.size > MAX_SIZE_BYTES) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      alert(`⚠️ Image File Size Exceeds Limit!\n\nYour file size: ${sizeMB} MB\nMaximum allowed limit: ${MAX_SIZE_MB} MB\n\nPlease select an image file under 2 MB.`);
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      const dataUrl = e.target.result;

      // 1. Update image src on identity card
      const img = document.getElementById('student-avatar-img');
      if (img) img.src = dataUrl;

      // 2. Update header avatars
      document.querySelectorAll('#sb-user-area img, img[alt="Profile"]').forEach(h => h.src = dataUrl);

      // 3. Update user object in SBAuth
      if (window.SBAuth && window.SBAuth.getUser) {
        const user = window.SBAuth.getUser();
        if (user) {
          user.avatar = dataUrl;
          localStorage.setItem('sb_user', JSON.stringify(user));
        }
      }

      // 4. Update SBDynamic state & trigger event
      window.SBDynamic.updateData(data => {
        data.student.avatar = dataUrl;
      });

      alert('✅ Profile photo updated successfully!');
    };
    reader.readAsDataURL(file);
  }

  function getActiveUserName() {
    try {
      if (window.SBAuth && window.SBAuth.getUser) {
        const u = window.SBAuth.getUser();
        if (u && u.name) return u.name;
      }
      const raw = localStorage.getItem('sb_user');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.name) return parsed.name;
      }
    } catch (e) {}
    const data = window.SBDynamic ? window.SBDynamic.getData() : null;
    return (data && data.student && data.student.name && data.student.name !== 'Aarav Sharma') ? data.student.name : 'Student Profile';
  }

  function initStudentDashboard() {
    const data = window.SBDynamic ? window.SBDynamic.getData() : { student: {}, recruiter: {} };
    const s = data.student || {};
    const r = data.recruiter || {};

    const displayName = getActiveUserName();
    const displayInst = s.institution || 'Silver Oak Institute of Tech';
    const displayDept = s.department || 'B.Tech Computer Science & Engineering';
    const displayYear = s.year || 4;
    const user = window.SBAuth && window.SBAuth.isLoggedIn() ? window.SBAuth.getUser() : null;
    const displayAvatar = (user && user.avatar) || s.avatar;

    // Fill form inputs with current values
    if (document.getElementById('inp-student-name')) document.getElementById('inp-student-name').value = displayName;
    if (document.getElementById('inp-student-inst')) document.getElementById('inp-student-inst').value = displayInst;
    if (document.getElementById('inp-student-cgpa')) document.getElementById('inp-student-cgpa').value = s.cgpa || '';
    if (document.getElementById('inp-student-skills')) document.getElementById('inp-student-skills').value = (s.skills || []).join(', ');
    if (document.getElementById('inp-student-prob')) document.getElementById('inp-student-prob').value = s.probSolving || 80;
    if (document.getElementById('inp-student-comm')) document.getElementById('inp-student-comm').value = s.commScore || 85;

    // Render identity card elements matching logged-in user credentials
    if (document.getElementById('student-name')) document.getElementById('student-name').textContent = displayName;
    if (document.getElementById('student-inst-name')) document.getElementById('student-inst-name').textContent = displayInst;
    if (document.getElementById('student-cgpa-val')) document.getElementById('student-cgpa-val').textContent = s.cgpa || '0.0';
    if (document.getElementById('student-dept-year')) document.getElementById('student-dept-year').textContent = `${displayDept} • ${displayYear}th Year`;
    if (document.getElementById('student-avatar-img') && displayAvatar) {
      document.getElementById('student-avatar-img').src = displayAvatar;
    }
    if (document.getElementById('student-id-badge')) {
      const idVal = user && user.id ? user.id : '8841';
      document.getElementById('student-id-badge').textContent = `ID: SB-2026-${idVal.toString().padStart(4, '0')}`;
    }

    // Calculate Placement Readiness
    const readiness = window.SBDynamic.calcStudentReadiness(s);
    const radCircle = document.getElementById('readiness-circle');
    const radPct = document.getElementById('readiness-pct');
    const radStatus = document.getElementById('readiness-status');

    if (radPct) radPct.textContent = readiness + '%';
    if (radCircle) {
      const offset = 125.6 * (1 - readiness / 100);
      radCircle.setAttribute('stroke-dashoffset', offset);
    }
    if (radStatus) {
      radStatus.textContent = readiness >= 75 ? 'Optimal / Day 1 Ready' : readiness >= 50 ? 'Developing / Action Required' : 'Foundational / Gap Building';
    }

    // Render Target Career Role from active jobs
    const latestJob = (r.jobs && r.jobs.length) ? r.jobs[0] : null;
    const targetRoleText = document.getElementById('target-career-role');
    if (targetRoleText && latestJob && latestJob.targetRole) {
      targetRoleText.textContent = latestJob.targetRole;
    }

    // Render Faculty & Industry Live Announcements Feed
    renderStudentAlertsFeed(data.notifications || []);
    renderMatchedJobs(r);
  }

  let currentNotifFilter = 'all';

  function filterStudentNotifs(type) {
    currentNotifFilter = type;
    ['all', 'faculty', 'industry'].forEach(t => {
      const btn = document.getElementById(`notif-flt-${t}`);
      if (btn) {
        if (t === type) {
          btn.className = 'px-2.5 py-1 rounded-md bg-primary text-on-primary transition-colors cursor-pointer';
        } else {
          btn.className = 'px-2.5 py-1 rounded-md bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer';
        }
      }
    });
    const data = window.SBDynamic.getData();
    renderStudentAlertsFeed(data.notifications || []);
  }

  function renderStudentAlertsFeed(notifs) {
    const feedContainer = document.getElementById('student-live-announcements-feed');
    if (!feedContainer) return;

    let filtered = notifs;
    if (currentNotifFilter === 'faculty') {
      filtered = notifs.filter(n => n.type === 'faculty' || (n.sender && n.sender.toLowerCase().includes('faculty')));
    } else if (currentNotifFilter === 'industry') {
      filtered = notifs.filter(n => n.type === 'industry' || (n.title && n.title.toLowerCase().includes('job')));
    }

    if (filtered.length === 0) {
      feedContainer.innerHTML = '<p class="text-xs text-on-surface-variant py-4 text-center">No notifications in this category</p>';
      return;
    }

    feedContainer.innerHTML = filtered.map(n => {
      const isUnread = !n.read;
      const isAck = n.acknowledged;
      return `
        <div onclick="window.openNotificationDetailModal('${n.id}')" class="p-2.5 rounded-lg bg-surface-container-low border border-surface-container-high/60 flex flex-col gap-1 hover:bg-surface-container transition-colors cursor-pointer relative ${isUnread ? 'border-l-4 border-l-primary bg-primary-fixed/10' : ''}">
          <div class="flex items-center justify-between">
            <span class="font-bold text-xs text-on-surface truncate pr-2">${escHtml(n.title)}</span>
            <span class="text-[10px] font-data-mono text-outline shrink-0">${escHtml(n.date || 'Just now')}</span>
          </div>
          <p class="text-xs text-on-surface-variant line-clamp-2 leading-snug">${escHtml(n.body)}</p>
          <div class="flex items-center justify-between pt-1">
            <span class="text-[10px] font-semibold text-secondary flex items-center gap-1">
              <span class="material-symbols-outlined text-[12px]">record_voice_over</span> ${escHtml(n.sender || 'Faculty / Industry')}
            </span>
            <div class="flex items-center gap-1">
              ${isAck ? '<span class="text-[9px] font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded">Acknowledged</span>' : ''}
              <span class="text-[10px] font-bold text-primary hover:underline flex items-center gap-0.5">Details <span class="material-symbols-outlined text-[12px]">open_in_new</span></span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderMatchedJobs(r) {
    // Dynamically render Industry Job Releases in AI Matched Internships container
    const jobsContainer = document.getElementById('ai-matched-jobs-container');
    if (jobsContainer && r.jobs && r.jobs.length) {
      jobsContainer.innerHTML = r.jobs.map((job, idx) => {
        const initials = (job.company || 'CO').slice(0, 2).toUpperCase();
        const skillsHTML = (job.reqSkills || ['Docker', 'AWS', 'Node.js']).map(sk => 
          `<span class="bg-surface-container text-on-surface-variant text-[11px] font-semibold px-2 py-0.5 rounded">${sk}</span>`
        ).join('');
        const matchPct = Math.min(99, 90 + (idx % 8));

        return `
          <div class="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-space-sm hover:shadow-sm transition-all border border-surface-container-high/50">
            <div class="flex items-start justify-between gap-space-sm">
              <div class="flex items-center gap-space-sm">
                <div class="w-12 h-12 rounded-lg bg-primary-container text-on-primary flex items-center justify-center font-bold text-lg shadow-sm">
                  ${initials}
                </div>
                <div>
                  <h4 class="font-title-md text-title-md font-bold text-on-surface">${job.title}</h4>
                  <span class="font-body-sm text-body-sm text-on-surface-variant">${job.company} • ${job.targetRole || 'Target Role'}</span>
                </div>
              </div>
              <div class="flex items-center gap-1 bg-secondary-container text-on-secondary-container font-data-mono text-label-md font-bold px-2.5 py-1 rounded-full">
                <span class="material-symbols-outlined text-xs">bolt</span>
                ${matchPct}% Match
              </div>
            </div>
            <div class="flex flex-wrap items-center gap-x-space-md gap-y-1 font-body-sm text-body-sm text-on-surface-variant pt-1">
              <span class="flex items-center gap-1"><span class="material-symbols-outlined text-sm text-outline">location_on</span> ${job.location || 'Hybrid'}</span>
              <span class="flex items-center gap-1"><span class="material-symbols-outlined text-sm text-outline">payments</span> ${job.stipend || 'Competitive'}</span>
              <span class="flex items-center gap-1"><span class="material-symbols-outlined text-sm text-secondary">verified</span> Industry Partnership Released</span>
            </div>
            <div class="flex flex-wrap items-center justify-between gap-space-xs pt-space-xs">
              <div class="flex flex-wrap gap-1.5">
                ${skillsHTML}
              </div>
              <button onclick="alert('Application sent for ${job.title} at ${job.company}!')" class="bg-primary-container text-on-primary font-label-sm text-label-sm px-space-md py-1.5 rounded-lg hover:bg-primary transition-colors font-semibold">
                Apply via SkillBridge NOC
              </button>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  function escHtml(str) {
    return String(str || '')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }

  function applyStudentDataInputs() {
    const name = document.getElementById('inp-student-name').value.trim();
    const inst = document.getElementById('inp-student-inst').value.trim();
    const cgpa = parseFloat(document.getElementById('inp-student-cgpa').value) || 0;
    const skillsRaw = document.getElementById('inp-student-skills').value;
    const skills = skillsRaw.split(',').map(x => x.trim()).filter(Boolean);
    const prob = parseInt(document.getElementById('inp-student-prob').value) || 0;
    const comm = parseInt(document.getElementById('inp-student-comm').value) || 0;

    window.SBDynamic.updateData(data => {
      data.student.name = name;
      data.student.institution = inst;
      data.student.cgpa = cgpa;
      data.student.skills = skills;
      data.student.probSolving = prob;
      data.student.commScore = comm;
    });

    initStudentDashboard();
    alert('Graphs dynamically recalculated based on your entered data!');
  }

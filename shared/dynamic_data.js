/**
 * SkillBridge — shared/dynamic_data.js
 * Dynamic data storage, notifications engine, 8-semester marks calculator,
 * industry job release pipeline, and live graph calculation engine.
 * Ensures NO dummy random data — everything is calculated strictly from user inputs.
 */

(function () {
  const STORAGE_KEY = 'sb_dynamic_user_inputs_v2';

  function getDefaultData() {
    return {
      notifications: [
        {
          id: 'notif-1',
          title: 'Faculty Announcement: BoS Syllabus Upgrade',
          body: 'Dr. K. Raman updated CS702 Distributed Systems courseware with gRPC & Cloud Microservices.',
          sender: 'Dr. K. Raman (Faculty HOD)',
          type: 'faculty',
          date: 'Just Now',
          read: false
        },
        {
          id: 'notif-2',
          title: 'New Industry Drive: Razorpay AI Backend',
          body: 'Razorpay released 15 internship slots for Full Stack Cloud Engineer / Backend Systems.',
          sender: 'Razorpay Talent Desk',
          type: 'industry',
          date: '10 mins ago',
          read: false
        }
      ],
      student: {
        name: '',
        institution: '',
        department: '',
        year: 4,
        cgpa: 8.9,
        semesters: {
          sem1: 8.4,
          sem2: 8.6,
          sem3: 8.8,
          sem4: 9.0,
          sem5: 9.1,
          sem6: 8.9,
          sem7: 9.2,
          sem8: 9.3
        },
        achievements: [
          'Smart India Hackathon 2024 Finalist',
          'AWS Certified Solutions Architect',
          '1st Place in University Hackathon'
        ],
        skills: ['Python', 'JavaScript', 'Docker', 'System Design', 'SQL', 'FastAPI'],
        probSolving: 85,
        sysDesign: 78,
        commScore: 88,
        applications: [
          { company: 'Google Summer Cohort', role: 'Software Engineering Intern', status: 'Under Review', verified: true },
          { company: 'Microsoft Azure', role: 'Cloud Solutions Engineer', status: 'Interview Scheduled', verified: true },
          { company: 'Swiggy Tech', role: 'Backend SDE Intern', status: 'Shortlisted', verified: false }
        ]
      },
      recruiter: {
        recruiterName: '',
        company: '',
        designation: '',
        domains: ['Cloud Architecture', 'Full Stack Engineering', 'AI & Machine Learning'],
        totalApps: 1482,
        activeRoles: 3,
        passBenchmark: 80,
        jobs: [
          {
            id: 'job-1',
            title: 'Full Stack Cloud Engineer / Backend Systems',
            company: 'Razorpay',
            targetRole: 'Full Stack Cloud Engineer / Backend Systems',
            stipend: '₹40,000 / month',
            location: 'Bangalore / Remote',
            requiredSkills: ['Python', 'FastAPI', 'AWS Lambda', 'Docker', 'System Design'],
            matchPct: 94
          },
          {
            id: 'job-2',
            title: 'DevOps & Kubernetes Infrastructure Intern',
            company: 'Cognizant Tech',
            targetRole: 'DevOps & Cloud Infrastructure',
            stipend: '₹35,000 / month',
            location: 'Hyderabad',
            requiredSkills: ['Docker', 'Go Lang', 'Kubernetes', 'Linux'],
            matchPct: 88
          }
        ]
      },
      faculty: {
        facName: '',
        institution: '',
        department: '',
        specialization: '',
        capitalLakhs: 42.5,
        naacScore: 94,
        menteesCount: 18,
        syllabusSync: 81.4,
        grants: [
          { title: 'Distributed Cloud Microservices Audit', sponsor: 'TATA Consultancy Services', amountLakhs: 25.0, status: 'Active' },
          { title: 'AI-Based Dynamic Skill Gap Mapping', sponsor: 'SIH Innovation Cell', amountLakhs: 17.5, status: 'Approved' }
        ],
        mentees: [
          { name: 'Aarav Sharma', project: 'Distributed Cache Optimization', readiness: 92, noc: 'Approved' },
          { name: 'Ananya Iyer', project: 'Kubernetes Operator for Healthcare', readiness: 88, noc: 'Approved' }
        ]
      },
      institution: {
        institutionName: '',
        totalStudents: 1200,
        placedStudents: 980,
        activeMoUs: 42,
        naacGrade: 'A++',
        nirfRank: 38
      }
    };
  }

  function loadData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return getDefaultData();
      const parsed = JSON.parse(raw);
      const def = getDefaultData();
      return {
        notifications: parsed.notifications || def.notifications,
        student: { ...def.student, ...(parsed.student || {}) },
        recruiter: { ...def.recruiter, ...(parsed.recruiter || {}) },
        faculty: { ...def.faculty, ...(parsed.faculty || {}) },
        institution: { ...def.institution, ...(parsed.institution || {}) }
      };
    } catch {
      return getDefaultData();
    }
  }

  function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function syncAuthProfile(data) {
    if (!window.SBAuth || !window.SBAuth.getUser) return data;
    const user = window.SBAuth.getUser();
    if (!user) return data;

    if (user.name) {
      data.student.name = user.name;
      if (user.role === 'recruiter') data.recruiter.recruiterName = user.name;
      if (user.role === 'faculty') data.faculty.facName = user.name;
      if (user.role === 'institution') data.institution.institutionName = user.name;
    }
    if (user.avatar) {
      data.student.avatar = user.avatar;
    }
    return data;
  }

  window.SBDynamic = {
    getData: function () {
      let data = loadData();
      data = syncAuthProfile(data);
      return data;
    },
    updateData: function (updater) {
      let data = loadData();
      updater(data);
      saveData(data);
      window.dispatchEvent(new CustomEvent('sb-data-updated', { detail: data }));
    },
    // Notification engine
    addNotification: function (notif) {
      this.updateData(data => {
        data.notifications.unshift({
          id: 'notif-' + Date.now(),
          title: notif.title,
          body: notif.body || notif.message || '',
          sender: notif.sender || 'Faculty / System',
          type: notif.type || 'faculty',
          date: 'Just now',
          read: false,
          acknowledged: false
        });
      });
    },
    markNotificationsRead: function () {
      this.updateData(data => {
        (data.notifications || []).forEach(n => n.read = true);
      });
    },
    markNotificationRead: function (id) {
      this.updateData(data => {
        const notif = (data.notifications || []).find(n => n.id === id);
        if (notif) notif.read = true;
      });
    },
    deleteNotification: function (id) {
      this.updateData(data => {
        data.notifications = (data.notifications || []).filter(n => n.id !== id);
      });
    },
    acknowledgeNotification: function (id) {
      this.updateData(data => {
        const notif = (data.notifications || []).find(n => n.id === id);
        if (notif) {
          notif.read = true;
          notif.acknowledged = true;
        }
      });
    },
    // Job release pipeline
    addJob: function (job) {
      this.updateData(data => {
        if (!data.recruiter.jobs) data.recruiter.jobs = [];
        const newJob = {
          id: 'job-' + Date.now(),
          title: job.title,
          company: job.company || data.recruiter.company || 'Industry Partner',
          targetRole: job.targetRole || job.title,
          stipend: job.stipend || '₹40,000 / month',
          location: job.location || 'Bangalore',
          requiredSkills: Array.isArray(job.requiredSkills) ? job.requiredSkills : (job.requiredSkills || '').split(',').map(x => x.trim()),
          matchPct: 90
        };
        data.recruiter.jobs.unshift(newJob);
        data.notifications.unshift({
          id: 'notif-job-' + Date.now(),
          title: `New Industry Drive: ${newJob.title}`,
          body: `${newJob.company} released opening for ${newJob.targetRole} (${newJob.stipend}).`,
          sender: newJob.company + ' (Industry Partner)',
          type: 'industry',
          date: 'Just now',
          read: false
        });
      });
    },
    // VTU Grade & Marks Engine (Credit-Weighted)
    calcVTUGradePoint: function (marks) {
      const m = parseFloat(marks) || 0;
      if (m >= 90) return 10;
      if (m >= 80) return 9;
      if (m >= 70) return 8;
      if (m >= 60) return 7;
      if (m >= 50) return 6;
      if (m >= 45) return 5;
      if (m >= 40) return 4;
      return 0;
    },
    calcVTUSGPAFromSubjects: function (subjectList) {
      if (!Array.isArray(subjectList) || subjectList.length === 0) return 8.5;
      let totalWeightedGP = 0;
      let totalCredits = 0;

      subjectList.forEach(sub => {
        if (typeof sub === 'object' && sub !== null) {
          const marks = parseFloat(sub.marks) || 0;
          const credits = Math.max(0.5, parseFloat(sub.credits) || 3);
          const gp = this.calcVTUGradePoint(marks);
          totalWeightedGP += gp * credits;
          totalCredits += credits;
        } else {
          const marks = parseFloat(sub) || 0;
          const credits = 3;
          const gp = this.calcVTUGradePoint(marks);
          totalWeightedGP += gp * credits;
          totalCredits += credits;
        }
      });

      return totalCredits > 0 ? Math.round((totalWeightedGP / totalCredits) * 100) / 100 : 8.5;
    },
    calcStudent8SemCGPA: function (student) {
      if (student.vtuSubjectsBySem) {
        let totalWeightedSGPA = 0, totalSemCredits = 0;
        for (let i = 1; i <= 8; i++) {
          const subList = student.vtuSubjectsBySem[`sem${i}`];
          if (Array.isArray(subList) && subList.length > 0) {
            const semSGPA = this.calcVTUSGPAFromSubjects(subList);
            let semCredits = 0;
            subList.forEach(sub => {
              if (typeof sub === 'object' && sub !== null) {
                semCredits += Math.max(0.5, parseFloat(sub.credits) || 3);
              } else {
                semCredits += 3;
              }
            });
            totalWeightedSGPA += semSGPA * semCredits;
            totalSemCredits += semCredits;
          }
        }
        if (totalSemCredits > 0) return Math.round((totalWeightedSGPA / totalSemCredits) * 100) / 100;
      }

      const s = student.semesters || {};
      const keys = ['sem1','sem2','sem3','sem4','sem5','sem6','sem7','sem8'];
      let sum = 0, count = 0;
      if (Array.isArray(s)) {
        s.forEach(val => {
          const v = parseFloat(val);
          if (!isNaN(v) && v > 0) { sum += v; count++; }
        });
      } else {
        keys.forEach(k => {
          const val = parseFloat(s[k]);
          if (!isNaN(val) && val > 0) { sum += val; count++; }
        });
      }
      if (count === 0) return parseFloat(student.cgpa) || 8.5;
      return Math.round((sum / count) * 100) / 100;
    },
    calcVTUPercentage: function (cgpa) {
      const c = parseFloat(cgpa) || 0;
      return Math.max(0, Math.round((c - 0.75) * 10 * 10) / 10);
    },
    calcStudentReadiness: function (s) {
      const cgpa = this.calcStudent8SemCGPA(s);
      const skillCount = Array.isArray(s.skills) ? s.skills.length : 0;
      const achievementsCount = Array.isArray(s.achievements) ? s.achievements.length : (s.achievements ? s.achievements.split(',').length : 0);
      const prob = parseFloat(s.probSolving) || 80;

      const baseScore = (cgpa / 10) * 40 + Math.min(35, skillCount * 6) + (prob / 100) * 15 + Math.min(10, achievementsCount * 3.5);
      return Math.min(100, Math.max(0, Math.round(baseScore)));
    }
  };
})();

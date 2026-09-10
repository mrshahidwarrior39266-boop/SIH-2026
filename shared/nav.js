/**
 * SkillBridge — shared/nav.js
 * Header user profile area, interactive live notification bell,
 * and role-based access guard & isolation logic.
 */

(function () {
  document.addEventListener('DOMContentLoaded', initNav);

  function initNav() {
    fixNavLinks();
    renderUserArea();
    initNotificationBell();
    applyRoleAccessIsolation();
  }

  function getDepth() {
    const parts = window.location.pathname.split('/').filter(Boolean);
    return parts.length <= 1 ? '' : '../';
  }

  function fixNavLinks() {
    const prefix = window.SBAuth && window.SBAuth.getDepthPrefix ? window.SBAuth.getDepthPrefix() : getDepth();
    const pathMap = {
      'student-hub':           prefix + 'student_dashboard_skill_gap_hub/code.html',
      'industry-partner':      prefix + 'industry_recruiter_matching_engine/code.html',
      'faculty-and-rd':        prefix + 'faculty_r_d_fdp_mentorship_portal/code.html',
      'institution-analytics': prefix + 'institution_analytics_tpo_intelligence/code.html',
    };

    const roleToPath = {
      student:     'student-hub',
      recruiter:   'industry-partner',
      faculty:     'faculty-and-rd',
      institution: 'institution-analytics',
    };

    const loggedIn = window.SBAuth && window.SBAuth.isLoggedIn();
    const user     = loggedIn ? window.SBAuth.getUser() : null;
    const userRole = user ? user.role : null;

    document.querySelectorAll('a[data-path]').forEach(a => {
      const path = a.getAttribute('data-path');
      if (pathMap[path]) a.href = pathMap[path];

      if (userRole) {
        const allowedPath = roleToPath[userRole];
        if (allowedPath && path !== allowedPath) {
          a.style.display = 'none';
          if (a.parentElement && (a.parentElement.tagName === 'LI' || a.parentElement.classList.contains('nav-item'))) {
            a.parentElement.style.display = 'none';
          }
        } else {
          a.style.display = '';
          if (a.parentElement && (a.parentElement.tagName === 'LI' || a.parentElement.classList.contains('nav-item'))) {
            a.parentElement.style.display = '';
          }
        }
      }
    });
  }

  function renderUserArea() {
    const target = document.getElementById('sb-user-area');
    if (!target) return;

    const loggedIn = window.SBAuth && window.SBAuth.isLoggedIn();
    const user     = loggedIn ? window.SBAuth.getUser() : null;

    if (!loggedIn || !user) {
      target.innerHTML = `
        <a href="${getDepth()}index.html"
           class="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-on-primary font-semibold text-sm hover:opacity-90 transition-opacity">
          <span class="material-symbols-outlined text-base">login</span>
          <span>Login</span>
        </a>
      `;
      return;
    }

    const roleLabels = {
      student:     'Student',
      recruiter:   'Recruiter',
      faculty:     'Faculty',
      institution: 'Institution / TPO',
    };
    const roleLabel = roleLabels[user.role] || 'User';
    const initials  = (user.name || 'U').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
    const avatarHTML = user.avatar
      ? `<img src="${user.avatar}" alt="Profile" class="w-8 h-8 rounded-full object-cover ring-2 ring-secondary-container" />`
      : `<div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary text-xs font-bold ring-2 ring-secondary-container">${initials}</div>`;

    target.innerHTML = `
      <div class="relative" id="sb-profile-wrapper">
        <button
          id="sb-profile-btn"
          class="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-surface-container transition-colors cursor-pointer">
          <div class="relative">
            ${avatarHTML}
            <span class="material-symbols-outlined absolute -bottom-1 -right-1 text-[12px] bg-secondary text-on-secondary rounded-full p-0.5">verified</span>
          </div>
          <div class="hidden lg:flex flex-col text-left">
            <span class="font-label-md text-label-md font-semibold text-on-surface leading-tight">${escHtml(user.name || 'User')}</span>
            <span class="font-label-sm text-label-sm text-on-surface-variant leading-tight">${escHtml(roleLabel)}</span>
          </div>
          <span class="material-symbols-outlined text-sm text-on-surface-variant">arrow_drop_down</span>
        </button>

        <div
          id="sb-profile-dropdown"
          class="absolute right-0 top-full mt-2 w-56 bg-surface-container rounded-xl shadow-xl border border-surface-container-high py-1.5 z-50 hidden">
          <div class="px-4 py-2.5 border-b border-surface-container-high">
            <p class="text-sm font-semibold text-on-surface truncate">${escHtml(user.name || '')}</p>
            <p class="text-xs text-on-surface-variant truncate">${escHtml(user.email || '')}</p>
            <span class="inline-block mt-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">${escHtml(roleLabel)}</span>
          </div>
          <a href="${getDepth()}profile_setup/index.html"
             class="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-high transition-colors">
            <span class="material-symbols-outlined text-base">manage_accounts</span>
            Edit Profile &amp; Role
          </a>
          <button
            onclick="window.SBAuth.logout()"
            class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-error-container transition-colors">
            <span class="material-symbols-outlined text-base">logout</span>
            Log Out
          </button>
        </div>
      </div>
    `;

    const btn      = document.getElementById('sb-profile-btn');
    const dropdown = document.getElementById('sb-profile-dropdown');
    if (btn && dropdown) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('hidden');
      });
      document.addEventListener('click', () => dropdown.classList.add('hidden'));
    }

    const rolePill = document.getElementById('sb-role-pill');
    if (rolePill) rolePill.style.display = 'none';

    // Notify page components to update identity displays
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('sb-data-updated'));
    }, 50);
  }

  // ── Notification Bell System ───────────────────────────────────────────────
  function initNotificationBell() {
    const bellBtn = document.querySelector('button[aria-label="Notifications"]');
    if (!bellBtn) return;

    // Make position relative for popup container
    bellBtn.classList.add('relative');

    function renderBellUI() {
      const data = window.SBDynamic ? window.SBDynamic.getData() : { notifications: [] };
      const notifs = data.notifications || [];
      const unread = notifs.filter(n => !n.read).length;

      // Update badge count
      let badge = bellBtn.querySelector('.sb-notif-badge');
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'sb-notif-badge absolute top-1.5 right-1.5 w-4 h-4 bg-error text-on-error font-data-mono text-[10px] rounded-full flex items-center justify-center font-bold';
        bellBtn.appendChild(badge);
      }
      badge.textContent = unread;
      badge.style.display = unread > 0 ? 'flex' : 'none';
    }

    renderBellUI();
    window.addEventListener('sb-data-updated', renderBellUI);

    // Create Notification Menu Popup
    const popup = document.createElement('div');
    popup.id = 'sb-notif-popup';
    popup.className = 'absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto bg-surface-container-lowest rounded-xl shadow-2xl border border-surface-container-high p-3 z-50 hidden flex flex-col gap-2 text-left';
    bellBtn.appendChild(popup);

    bellBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = popup.classList.contains('hidden');
      if (isHidden) {
        const data = window.SBDynamic ? window.SBDynamic.getData() : { notifications: [] };
        const notifs = data.notifications || [];

        popup.innerHTML = `
          <div class="flex items-center justify-between pb-2 border-b border-surface-container-high">
            <span class="font-bold text-sm text-on-surface flex items-center gap-1">
              <span class="material-symbols-outlined text-primary text-base">notifications</span>
              Faculty &amp; Industry Alerts
            </span>
            <button onclick="event.stopPropagation(); window.SBDynamic.markNotificationsRead()" class="text-xs text-primary font-semibold hover:underline">Mark all read</button>
          </div>
          <div class="flex flex-col gap-2 pt-1">
            ${notifs.length === 0 ? '<p class="text-xs text-on-surface-variant py-4 text-center">No new notifications</p>' : ''}
            ${notifs.map(n => `
              <div onclick="event.stopPropagation(); window.openNotificationDetailModal('${n.id}')" class="p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer flex flex-col gap-1 ${!n.read ? 'border-l-2 border-primary bg-primary-fixed/10' : ''}">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-xs text-on-surface truncate">${escHtml(n.title)}</span>
                  <span class="text-[10px] font-data-mono text-outline shrink-0">${escHtml(n.date)}</span>
                </div>
                <p class="text-xs text-on-surface-variant line-clamp-2">${escHtml(n.body)}</p>
                <div class="flex items-center justify-between pt-0.5">
                  <span class="text-[10px] font-semibold text-secondary flex items-center gap-1">
                    <span class="material-symbols-outlined text-[12px]">record_voice_over</span> ${escHtml(n.sender)}
                  </span>
                  <span class="text-[10px] font-bold text-primary hover:underline">View details &rarr;</span>
                </div>
              </div>
            `).join('')}
          </div>
        `;
        popup.classList.remove('hidden');
      } else {
        popup.classList.add('hidden');
      }
    });

    document.addEventListener('click', () => popup.classList.add('hidden'));
  }

  // ── Global Notification Detail Modal Handler ──────────────────────────────
  window.openNotificationDetailModal = function(id) {
    const data = window.SBDynamic ? window.SBDynamic.getData() : { notifications: [] };
    const notif = (data.notifications || []).find(n => n.id === id);
    if (!notif) return;

    window.SBDynamic.markNotificationRead(id);

    let modal = document.getElementById('sb-notif-detail-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'sb-notif-detail-modal';
      modal.className = 'fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4';
      document.body.appendChild(modal);
    }

    const isIndustry = notif.type === 'industry' || (notif.title && (notif.title.toLowerCase().includes('job') || notif.title.toLowerCase().includes('drive')));
    const categoryLabel = isIndustry ? 'Industry Placement Drive' : 'Faculty Announcement';
    const categoryIcon = isIndustry ? 'work' : 'campaign';
    const categoryColor = isIndustry ? 'bg-primary-container text-on-primary' : 'bg-secondary-container text-on-secondary-container';

    modal.innerHTML = `
      <div class="bg-surface-container-lowest max-w-lg w-full rounded-2xl p-6 shadow-2xl border border-surface-container-high relative flex flex-col gap-4">
        <div class="flex items-center justify-between pb-3 border-b border-surface-container-high">
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${categoryColor}">
              <span class="material-symbols-outlined text-sm">${categoryIcon}</span>
              ${escHtml(categoryLabel)}
            </span>
            ${notif.acknowledged ? '<span class="bg-emerald-500/20 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Acknowledged</span>' : ''}
          </div>
          <button onclick="window.closeNotificationDetailModal()" class="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div class="space-y-2 text-left">
          <h3 class="font-headline-sm text-lg font-bold text-on-surface leading-snug">${escHtml(notif.title)}</h3>
          <div class="flex items-center justify-between text-xs text-on-surface-variant font-data-mono pt-1">
            <span class="flex items-center gap-1 font-semibold text-secondary">
              <span class="material-symbols-outlined text-sm">verified</span>
              ${escHtml(notif.sender || 'Faculty / System')}
            </span>
            <span>${escHtml(notif.date || 'Just now')}</span>
          </div>
        </div>

        <div class="p-4 rounded-xl bg-surface-container-low border border-surface-container-high/60 text-xs md:text-sm text-on-surface leading-relaxed text-left">
          ${escHtml(notif.body || notif.message || '')}
        </div>

        <div class="flex items-center justify-between pt-3 border-t border-surface-container-high">
          <button onclick="window.SBDynamic.deleteNotification('${notif.id}'); window.closeNotificationDetailModal();" class="text-xs text-error font-semibold hover:underline flex items-center gap-1 cursor-pointer">
            <span class="material-symbols-outlined text-sm">delete</span>
            Dismiss Alert
          </button>
          <div class="flex items-center gap-2">
            <button onclick="window.closeNotificationDetailModal()" class="px-4 py-2 rounded-lg bg-surface-container text-on-surface font-semibold text-xs hover:bg-surface-container-high transition-colors cursor-pointer">Close</button>
            ${isIndustry ? `
              <button onclick="window.closeNotificationDetailModal(); const el = document.getElementById('ai-matched-jobs-container'); if(el) el.scrollIntoView({behavior:'smooth'});" class="px-4 py-2 rounded-lg bg-primary text-on-primary font-bold text-xs shadow hover:bg-primary-container transition-all flex items-center gap-1 cursor-pointer">
                <span class="material-symbols-outlined text-sm">arrow_forward</span>
                Explore Placement Drive
              </button>
            ` : `
              <button onclick="window.SBDynamic.acknowledgeNotification('${notif.id}'); window.closeNotificationDetailModal(); alert('Notice acknowledged successfully!');" class="px-4 py-2 rounded-lg bg-secondary text-on-secondary font-bold text-xs shadow hover:bg-secondary-fixed transition-all flex items-center gap-1 cursor-pointer">
                <span class="material-symbols-outlined text-sm">check_circle</span>
                ${notif.acknowledged ? 'Already Acknowledged' : 'Acknowledge Notice'}
              </button>
            `}
          </div>
        </div>
      </div>
    `;
    modal.classList.remove('hidden');
  };

  window.closeNotificationDetailModal = function() {
    const modal = document.getElementById('sb-notif-detail-modal');
    if (modal) modal.classList.add('hidden');
  };

  // ── Role Isolation & Access Guard ──────────────────────────────────────────
  function applyRoleAccessIsolation() {
    if (!window.SBAuth || !window.SBAuth.isLoggedIn()) return;
    const user = window.SBAuth.getUser();
    if (!user || !user.role) return;

    const pagePath = window.location.pathname.toLowerCase();

    // Map pages to required roles
    const pageRoles = {
      'student_dashboard_skill_gap_hub': 'student',
      'industry_recruiter_matching_engine': 'recruiter',
      'faculty_r_d_fdp_mentorship_portal': 'faculty',
      'institution_analytics_tpo_intelligence': 'institution'
    };

    let targetRole = null;
    for (const key in pageRoles) {
      if (pagePath.includes(key)) {
        targetRole = pageRoles[key];
        break;
      }
    }

    if (!targetRole) return; // Main landing platform is open

    // If user's role MATCHES page role, do nothing (keep everything active)
    if (user.role === targetRole) {
      const banner = document.getElementById('sb-view-only-banner');
      if (banner) banner.remove();
      return;
    }

    // If user's role does NOT match page role (e.g. Recruiter visiting Student Hub):
    // Show prominent View-Only Notice Banner at top of page content
    const main = document.querySelector('main');
    if (main && !document.getElementById('sb-view-only-banner')) {
      const banner = document.createElement('div');
      banner.id = 'sb-view-only-banner';
      banner.className = 'w-full bg-amber-500/15 border-b border-amber-500/30 text-amber-900 py-3 px-6 font-label-md text-xs font-semibold flex items-center justify-between gap-4 z-40 shadow-sm';
      banner.innerHTML = `
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-amber-600 text-lg">lock</span>
          <span><strong>View-Only Isolation Mode:</strong> You are signed up as <strong>${escHtml(user.role.toUpperCase())}</strong> (${escHtml(user.name || 'User')}). You are currently viewing the <strong>${targetRole.toUpperCase()}</strong> portal.</span>
        </div>
        <a href="${getDepth()}profile_setup/index.html" class="bg-amber-600 text-white px-3 py-1 rounded-md text-[11px] font-bold hover:bg-amber-700 transition-colors">Switch Profile / Role</a>
      `;
      main.insertBefore(banner, main.firstChild);
    }
  }

  function escHtml(str) {
    return String(str)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }
})();

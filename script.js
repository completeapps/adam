// Simple password-protected admin with localStorage content
// Password: 0000

const STORAGE_KEY = "myPersonalSiteConfig_v1";

const defaultConfig = {
  title: "Your Name",
  tagline: "Short tagline about who you are.",
  ctaText: "Learn more",
  aboutText:
    "This is where you write about yourself, what you do, and what you care about.",
  projects: [
    "Example project or interest 1",
    "Example project or interest 2",
    "Example project or interest 3",
  ],
  email: "me@example.com",
  social1Url: "#",
  social1Label: "Main link",
  social2Url: "#",
  social2Label: "Second link",
  footerText: "© 2026 Your Name. All rights reserved.",
  theme: {
    accent: "#4f46e5",
    bg: "#050816",
    cardBg: "#0b1020",
  },
};

// Elements
const el = {
  title: document.getElementById("site-title"),
  tagline: document.getElementById("site-tagline"),
  ctaText: document.getElementById("site-cta-text"),
  aboutText: document.getElementById("about-text"),
  projectsList: document.getElementById("projects-list"),
  email: document.getElementById("contact-email"),
  social1: document.getElementById("social-link-1"),
  social2: document.getElementById("social-link-2"),
  footerText: document.getElementById("footer-text"),

  openAdminBtn: document.getElementById("open-admin-btn"),
  adminPanel: document.getElementById("admin-panel"),
  closeAdminBtn: document.getElementById("close-admin-btn"),

  loginModal: document.getElementById("login-modal"),
  adminPassword: document.getElementById("admin-password"),
  loginBtn: document.getElementById("login-btn"),
  closeLoginBtn: document.getElementById("close-login-btn"),
  loginError: document.getElementById("login-error"),

  editTitle: document.getElementById("edit-title"),
  editTagline: document.getElementById("edit-tagline"),
  editCtaText: document.getElementById("edit-cta-text"),
  editAbout: document.getElementById("edit-about"),
  editProjects: document.getElementById("edit-projects"),
  editEmail: document.getElementById("edit-email"),
  editSocial1Url: document.getElementById("edit-social-1-url"),
  editSocial1Label: document.getElementById("edit-social-1-label"),
  editSocial2Url: document.getElementById("edit-social-2-url"),
  editSocial2Label: document.getElementById("edit-social-2-label"),
  editAccent: document.getElementById("edit-accent"),
  editBg: document.getElementById("edit-bg"),
  editCardBg: document.getElementById("edit-card-bg"),
  editFooter: document.getElementById("edit-footer"),

  saveBtn: document.getElementById("save-btn"),
  resetBtn: document.getElementById("reset-btn"),
  saveStatus: document.getElementById("save-status"),
};

let config = loadConfig();
let isAdminOpen = false;

// Load config from localStorage
function loadConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultConfig);
    const parsed = JSON.parse(raw);
    return Object.assign(structuredClone(defaultConfig), parsed);
  } catch (e) {
    console.error("Failed to parse config, resetting to defaults", e);
    return structuredClone(defaultConfig);
  }
}

// Save config
function saveConfig() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

// Apply config to DOM
function applyConfig() {
  el.title.textContent = config.title;
  el.tagline.textContent = config.tagline;
  el.ctaText.textContent = config.ctaText;

  el.aboutText.textContent = config.aboutText;

  // Projects list
  el.projectsList.innerHTML = "";
  config.projects.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    el.projectsList.appendChild(li);
  });

  el.email.textContent = config.email;

  el.social1.href = config.social1Url || "#";
  el.social1.textContent = config.social1Label || "Main link";

  el.social2.href = config.social2Url || "#";
  el.social2.textContent = config.social2Label || "Second link";

  el.footerText.textContent = config.footerText;

  // Theme
  document.documentElement.style.setProperty("--accent", config.theme.accent);
  document.documentElement.style.setProperty("--bg", config.theme.bg);
  document.documentElement.style.setProperty("--card-bg", config.theme.cardBg);
  document.body.style.background =
    `radial-gradient(circle at top, #1f2937 0, ${config.theme.bg} 48%, #000 100%)`;
}

// Populate admin fields
function populateAdminFields() {
  el.editTitle.value = config.title;
  el.editTagline.value = config.tagline;
  el.editCtaText.value = config.ctaText;
  el.editAbout.value = config.aboutText;
  el.editProjects.value = config.projects.join("\n");
  el.editEmail.value = config.email;
  el.editSocial1Url.value = config.social1Url;
  el.editSocial1Label.value = config.social1Label;
  el.editSocial2Url.value = config.social2Url;
  el.editSocial2Label.value = config.social2Label;
  el.editAccent.value = config.theme.accent;
  el.editBg.value = config.theme.bg;
  el.editCardBg.value = config.theme.cardBg;
  el.editFooter.value = config.footerText;
}

// Read values from admin fields into config
function updateConfigFromAdmin() {
  config.title = el.editTitle.value.trim() || defaultConfig.title;
  config.tagline = el.editTagline.value.trim() || defaultConfig.tagline;
  config.ctaText = el.editCtaText.value.trim() || defaultConfig.ctaText;
  config.aboutText = el.editAbout.value.trim() || defaultConfig.aboutText;

  const projectsRaw = el.editProjects.value.split("\n");
  config.projects = projectsRaw
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (config.projects.length === 0) {
    config.projects = structuredClone(defaultConfig.projects);
  }

  config.email = el.editEmail.value.trim() || defaultConfig.email;

  config.social1Url = el.editSocial1Url.value.trim() || "#";
  config.social1Label =
    el.editSocial1Label.value.trim() || defaultConfig.social1Label;

  config.social2Url = el.editSocial2Url.value.trim() || "#";
  config.social2Label =
    el.editSocial2Label.value.trim() || defaultConfig.social2Label;

  config.theme.accent =
    el.editAccent.value || defaultConfig.theme.accent;
  config.theme.bg = el.editBg.value || defaultConfig.theme.bg;
  config.theme.cardBg =
    el.editCardBg.value || defaultConfig.theme.cardBg;

  config.footerText = el.editFooter.value.trim() || defaultConfig.footerText;
}

// Show login modal
function openLoginModal() {
  el.loginError.textContent = "";
  el.adminPassword.value = "";
  el.loginModal.classList.remove("hidden");
  el.adminPassword.focus();
}

// Hide login modal
function closeLoginModal() {
  el.loginModal.classList.add("hidden");
}

// Open admin panel
function openAdminPanel() {
  isAdminOpen = true;
  populateAdminFields();
  el.adminPanel.classList.remove("hidden");
}

// Close admin panel
function closeAdminPanel() {
  isAdminOpen = false;
  el.adminPanel.classList.add("hidden");
}

// Handle login
function handleLogin() {
  const pwd = el.adminPassword.value;
  if (pwd === "0000") {
    closeLoginModal();
    openAdminPanel();
  } else {
    el.loginError.textContent = "Wrong password.";
  }
}

// Reset site to defaults
function resetToDefaults() {
  if (!confirm("Reset everything back to default?")) return;
  config = structuredClone(defaultConfig);
  saveConfig();
  applyConfig();
  populateAdminFields();
  showStatus("Reset to defaults.", 1800);
}

// Show status text
function showStatus(msg, ms = 1600) {
  el.saveStatus.textContent = msg;
  if (ms > 0) {
    setTimeout(() => {
      if (el.saveStatus.textContent === msg) {
        el.saveStatus.textContent = "";
      }
    }, ms);
  }
}

// Event listeners
el.openAdminBtn.addEventListener("click", openLoginModal);
el.closeLoginBtn.addEventListener("click", closeLoginModal);
el.loginBtn.addEventListener("click", handleLogin);
el.adminPassword.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleLogin();
  } else if (e.key === "Escape") {
    closeLoginModal();
  }
});

el.closeAdminBtn.addEventListener("click", closeAdminPanel);

el.saveBtn.addEventListener("click", () => {
  updateConfigFromAdmin();
  saveConfig();
  applyConfig();
  showStatus("Saved.");
});

el.resetBtn.addEventListener("click", resetToDefaults);

// Close panels with Escape
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (!el.loginModal.classList.contains("hidden")) {
      closeLoginModal();
    } else if (isAdminOpen) {
      closeAdminPanel();
    }
  }
});

// Initialize
applyConfig();

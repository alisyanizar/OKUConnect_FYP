"use strict";

// Uses localhost on your laptop, and the public tunnel everywhere else
const LOCAL_CHAT_URL =
  "http://localhost:5678/webhook/dadad677-c640-43a4-b373-19530771ffc9/chat";
const PUBLIC_CHAT_URL =
  "https://bread-velocity-alcohol-diane.trycloudflare.com/webhook/dadad677-c640-43a4-b373-19530771ffc9/chat";
const N8N_CHAT_URL = ["localhost", "127.0.0.1"].includes(location.hostname)
  ? LOCAL_CHAT_URL
  : PUBLIC_CHAT_URL;

// How long to wait for an answer before showing a timeout message (ms)
const REQUEST_TIMEOUT_MS = 60000;

// A random ID so n8n's memory can follow this conversation.
// crypto.randomUUID only works on https or localhost, so there is a fallback.
function makeSessionId() {
  if (window.crypto && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return (
    "s-" +
    Date.now().toString(36) +
    "-" +
    Math.random().toString(36).slice(2, 10)
  );
}
let sessionId = makeSessionId();

/* ==========================================================
   Text in both languages (plain language, short sentences)
   ========================================================== */
const strings = {
  en: {
    skipMain: "Skip to main content",
    display: "Display",
    sizeLabel: "Text size",
    sizeNormal: "Normal",
    sizeLarge: "Large",
    sizeLarger: "Larger",
    contrast: "High contrast",
    tagline: "Information Without Limits",
    navLabel: "Main menu",
    sourcesLabel: "Information sources",
    navHome: "Home",
    navChat: "AI Chatbot",
    navLinks: "Official Websites",
    navHelp: "How to Use",
    pageTitles: {
      home: "Home",
      chat: "AI Chatbot",
      links: "Official websites",
      help: "How to use",
    },

    // Home
    heroPill: "Bahasa Malaysia & English",
    heading: "Everything you need,\nin one place.",
    intro:
      "Aid schemes, legal rights and agency contacts for OKU in Malaysia, explained simply.",
    heroLabel: "Ask the OKU AI Assistant a question",
    heroPlaceholder: "Type your question…",
    heroButton: "Ask",
    heroEmpty: "Type a question first. Then press Ask.",
    heroPopular: "Popular questions",
    statsLabel: "About OKUConnect",
    statTopics: "Topics",
    statAgencies: "Official agencies",
    statLangs: "Languages",
    introNote:
      "Answers come from official information. Before you make an important decision, check with the agency.",
    ctaKicker: "Answers from official sources",
    ctaTitle: "OKU AI Assistant",
    ctaSub: "Ask a question in BM or English",
    ctaButton: "Start Chat",
    homeTopicsHeading: "Browse by topic",
    homeTopicsHint:
      "Choose a topic to see questions you can ask the assistant.",
    topicCardAction: "See questions",

    // Chatbot
    chatHeading: "OKU AI Assistant",
    chatBadge: "BM & EN",
    chatSub:
      "Ask in Bahasa Malaysia or English. Answers come from official agency information.",
    sidebarHeading: "Suggested questions",
    sidebarHint: "Open a topic and choose a question. It is sent for you.",
    convHeading: "OKU Assistant",
    convSub: "Answers from official sources · BM & EN",
    botName: "OKU Assistant",
    welcome:
      "Welcome! I'm the OKU AI Assistant. Type a question below, or choose a suggested question.",
    label: "Your question",
    placeholder: "Type your question…",
    hint: "Write in English or Bahasa Malaysia. Press Enter to send. Press Shift and Enter for a new line.",
    send: "Send",
    newChat: "New conversation",
    newChatDone:
      "New conversation started. Your earlier questions are cleared.",
    you: "Your question",
    bot: "OKU Assistant",
    notice: "OKU Assistant",
    loading: "Looking this up…",
    loadingStatus: "Looking this up. This can take up to one minute.",
    answerStatus: "OKU Assistant answer:",
    wait: "Please wait. The assistant is still answering your last question.",
    empty: "Type a question first. Then press Send.",
    error:
      "The answer could not be loaded. Check your internet connection and try again. If it keeps happening, the OKUConnect service may be offline.",
    timeout:
      "This is taking too long. Please try again. If it keeps happening, the OKUConnect service may be offline.",
    readAloud: "Read aloud",
    stopReading: "Stop reading",
    copy: "Copy answer",
    copied: "Copied",
    copiedStatus: "Answer copied.",
    tryAsking: "Try asking",
    langChanged: "Language changed to English.",

    // Official websites
    linksHeading: "Official websites",
    linksIntro: "Go to the agency website to apply or to check details.",
    newTab: "(opens in a new tab)",
    govBadge: "Government",

    // How to use
    helpHeading: "How to use this site",
    helpSub: "Four steps to get an answer, and some tips.",
    helpStepsHeading: "Getting an answer",
    stepWord: "Step",
    step1: "Go to AI Chatbot.",
    step2: "Choose a suggested question, or type your own question.",
    step3: "Press Send and wait for the answer.",
    step4: "Check important details with the agency. Use Official Websites.",
    helpTipsHeading: "Tips",
    help1:
      "Ask short questions, one at a time. For example: How do I get a Kad OKU?",
    help2: "Use the Tab key to move around the page. Press Enter to choose.",
    help3: "Screen readers will read each new answer for you.",
    help4:
      "Use Text size and High contrast at the top of the page. On a phone, press Display first.",
    help5:
      "You can change the language or the page at any time. Your conversation stays.",
    help6: "Do not type your IC number or other private details.",
    footer:
      "OKUConnect is a final year project prototype. It does not replace advice from government agencies.",

    topics: [
      {
        id: "kad-oku",
        icon: "id-card",
        title: "Kad OKU Application",
        desc: "How to register, what documents you need, and what the card is for.",
        questions: [
          "How do I register for a Kad OKU?",
          "What documents do I need to register as OKU?",
          "What can I use my Kad OKU for?",
        ],
      },
      {
        id: "jkm",
        icon: "heart",
        title: "Financial Aid",
        desc: "Allowances and other financial aid from the Department of Social Welfare (JKM).",
        questions: [
          "What financial aid can OKU get from JKM?",
          "Who can apply for JKM aid for OKU?",
          "How do I apply for JKM financial aid?",
        ],
      },
      {
        id: "perkeso",
        icon: "briefcase",
        title: "PERKESO (SOCSO)",
        desc: "Help for workers who become disabled because of work or illness.",
        questions: [
          "What benefits does PERKESO give for disability?",
          "What is the PERKESO Invalidity Pension?",
          "How do I make a claim with PERKESO?",
        ],
      },
      {
        id: "kwsp",
        icon: "piggy",
        title: "KWSP (EPF)",
        desc: "When a member with a disability can take out KWSP savings.",
        questions: [
          "Can I withdraw my KWSP savings if I have a disability?",
          "What documents does KWSP need for a disability withdrawal?",
        ],
      },
      {
        id: "rights",
        icon: "shield",
        title: "Rights of OKU",
        desc: "What the Persons with Disabilities Act 2008 (Akta OKU 2008) says.",
        questions: [
          "What rights do OKU have under Akta OKU 2008?",
          "What are my rights at work as an OKU?",
          "What can I do if a public place is not accessible?",
        ],
      },
      {
        id: "agencies",
        icon: "users",
        title: "Agencies and Organisations",
        desc: "Government agencies and NGOs that support OKU and caregivers.",
        questions: [
          "Which agencies help OKU in Malaysia?",
          "Which NGOs support OKU and caregivers?",
          "What is a PDK centre?",
        ],
      },
    ],
    links: [
      {
        abbr: "JKM",
        name: "Department of Social Welfare",
        url: "https://www.jkm.gov.my",
        desc: "OKU registration, Kad OKU and financial aid.",
      },
      {
        abbr: "PERKESO",
        name: "Social Security Organisation (SOCSO)",
        url: "https://www.perkeso.gov.my",
        desc: "Benefits for workers who become disabled.",
      },
      {
        abbr: "KWSP",
        name: "Employees Provident Fund (EPF)",
        url: "https://www.kwsp.gov.my",
        desc: "Withdrawing savings because of disability.",
      },
      {
        abbr: "KKM",
        name: "Ministry of Health",
        url: "https://www.moh.gov.my",
        desc: "Health services and medical reports.",
      },
    ],
  },

  ms: {
    skipMain: "Langkau ke kandungan utama",
    display: "Paparan",
    sizeLabel: "Saiz teks",
    sizeNormal: "Biasa",
    sizeLarge: "Besar",
    sizeLarger: "Lebih besar",
    contrast: "Kontras tinggi",
    tagline: "Informasi Tanpa Batasan",
    navLabel: "Menu utama",
    sourcesLabel: "Sumber maklumat",
    navHome: "Utama",
    navChat: "Pembantu AI",
    navLinks: "Laman Web Rasmi",
    navHelp: "Cara Guna",
    pageTitles: {
      home: "Utama",
      chat: "Pembantu AI",
      links: "Laman web rasmi",
      help: "Cara guna",
    },

    heroPill: "Bahasa Malaysia & Bahasa Inggeris",
    heading: "Satu Destinasi,\nJawapan di Hujung Jari",
    intro:
      "Skim bantuan, hak undang-undang dan kenalan agensi untuk OKU di Malaysia, diterangkan dengan mudah.",
    heroLabel: "Tanya soalan kepada Pembantu AI OKU",
    heroPlaceholder: "Taip soalan anda…",
    heroButton: "Tanya",
    heroEmpty: "Taip soalan dahulu. Kemudian tekan Tanya.",
    heroPopular: "Soalan popular",
    statsLabel: "Tentang OKUConnect",
    statTopics: "Topik",
    statAgencies: "Agensi rasmi",
    statLangs: "Bahasa",
    introNote:
      "Jawapan diambil daripada maklumat rasmi. Sebelum membuat keputusan penting, semak dengan agensi berkenaan.",
    ctaKicker: "Jawapan daripada sumber rasmi",
    ctaTitle: "Pembantu AI OKU",
    ctaSub: "Tanya soalan dalam BM atau Bahasa Inggeris",
    ctaButton: "Mula Berbual",
    homeTopicsHeading: "Lihat mengikut topik",
    homeTopicsHint:
      "Pilih topik untuk melihat soalan yang boleh ditanya kepada pembantu.",
    topicCardAction: "Lihat soalan",

    chatHeading: "Pembantu AI OKU",
    chatBadge: "BM & EN",
    chatSub:
      "Tanya dalam Bahasa Malaysia atau Bahasa Inggeris. Jawapan diambil daripada maklumat rasmi agensi.",
    sidebarHeading: "Cadangan soalan",
    sidebarHint:
      "Buka topik dan pilih soalan. Soalan akan dihantar untuk anda.",
    convHeading: "Pembantu OKU",
    convSub: "Jawapan daripada sumber rasmi · BM & EN",
    botName: "Pembantu OKU",
    welcome:
      "Selamat datang! Saya Pembantu AI OKU. Taip soalan di bawah, atau pilih cadangan soalan.",
    label: "Soalan anda",
    placeholder: "Taip soalan anda…",
    hint: "Tulis dalam Bahasa Malaysia atau Bahasa Inggeris. Tekan Enter untuk hantar. Tekan Shift dan Enter untuk baris baharu.",
    send: "Hantar",
    newChat: "Perbualan baharu",
    newChatDone:
      "Perbualan baharu dimulakan. Soalan anda sebelum ini telah dipadam.",
    you: "Soalan anda",
    bot: "Pembantu OKU",
    notice: "Pembantu OKU",
    loading: "Sedang mencari maklumat…",
    loadingStatus:
      "Sedang mencari maklumat. Ini boleh mengambil masa sehingga satu minit.",
    answerStatus: "Jawapan Pembantu OKU:",
    wait: "Sila tunggu. Pembantu masih menjawab soalan anda yang lepas.",
    empty: "Taip soalan dahulu. Kemudian tekan Hantar.",
    error:
      "Jawapan tidak dapat dimuatkan. Semak sambungan internet anda dan cuba lagi. Jika masalah berterusan, perkhidmatan OKUConnect mungkin tidak aktif.",
    timeout:
      "Ini mengambil masa terlalu lama. Sila cuba lagi. Jika masalah berterusan, perkhidmatan OKUConnect mungkin tidak aktif.",
    readAloud: "Bacakan",
    stopReading: "Berhenti membaca",
    copy: "Salin jawapan",
    copied: "Disalin",
    copiedStatus: "Jawapan disalin.",
    tryAsking: "Cuba tanya",
    langChanged: "Bahasa ditukar kepada Bahasa Malaysia.",

    linksHeading: "Laman web rasmi",
    linksIntro:
      "Pergi ke laman web agensi untuk memohon atau menyemak butiran.",
    newTab: "(dibuka dalam tab baharu)",
    govBadge: "Kerajaan",

    helpHeading: "Cara guna laman ini",
    helpSub: "Empat langkah untuk mendapat jawapan, dan beberapa tip.",
    helpStepsHeading: "Cara mendapat jawapan",
    stepWord: "Langkah",
    step1: "Pergi ke Pembantu AI.",
    step2: "Pilih cadangan soalan, atau taip soalan anda sendiri.",
    step3: "Tekan Hantar dan tunggu jawapan.",
    step4: "Semak butiran penting dengan agensi. Guna Laman Web Rasmi.",
    helpTipsHeading: "Tip",
    help1:
      "Tanya soalan yang pendek, satu demi satu. Contoh: Bagaimana cara memohon Kad OKU?",
    help2:
      "Guna kekunci Tab untuk bergerak di halaman. Tekan Enter untuk memilih.",
    help3: "Pembaca skrin akan membacakan setiap jawapan baharu untuk anda.",
    help4:
      "Guna Saiz teks dan Kontras tinggi di bahagian atas halaman. Di telefon, tekan Paparan dahulu.",
    help5:
      "Anda boleh menukar bahasa atau halaman pada bila-bila masa. Perbualan anda kekal.",
    help6: "Jangan taip nombor kad pengenalan atau maklumat peribadi lain.",
    footer:
      "OKUConnect ialah prototaip projek tahun akhir. Ia tidak menggantikan nasihat agensi kerajaan.",

    topics: [
      {
        id: "kad-oku",
        icon: "id-card",
        title: "Permohonan Kad OKU",
        desc: "Cara mendaftar, dokumen yang diperlukan, dan kegunaan kad ini.",
        questions: [
          "Bagaimana cara memohon Kad OKU?",
          "Apakah dokumen yang diperlukan untuk mendaftar sebagai OKU?",
          "Apakah kegunaan Kad OKU?",
        ],
      },
      {
        id: "jkm",
        icon: "heart",
        title: "Bantuan Kewangan",
        desc: "Elaun dan bantuan kewangan lain daripada Jabatan Kebajikan Masyarakat (JKM).",
        questions: [
          "Apakah bantuan kewangan JKM untuk OKU?",
          "Siapa yang layak memohon bantuan JKM untuk OKU?",
          "Bagaimana cara memohon bantuan kewangan JKM?",
        ],
      },
      {
        id: "perkeso",
        icon: "briefcase",
        title: "PERKESO",
        desc: "Bantuan untuk pekerja yang hilang upaya akibat kerja atau penyakit.",
        questions: [
          "Apakah faedah PERKESO untuk hilang upaya?",
          "Apakah Pencen Ilat PERKESO?",
          "Bagaimana cara membuat tuntutan dengan PERKESO?",
        ],
      },
      {
        id: "kwsp",
        icon: "piggy",
        title: "KWSP",
        desc: "Bila ahli yang hilang upaya boleh mengeluarkan simpanan KWSP.",
        questions: [
          "Bolehkah saya mengeluarkan simpanan KWSP jika saya hilang upaya?",
          "Apakah dokumen yang KWSP perlukan untuk pengeluaran hilang upaya?",
        ],
      },
      {
        id: "rights",
        icon: "shield",
        title: "Hak OKU",
        desc: "Apa yang dinyatakan dalam Akta Orang Kurang Upaya 2008 (Akta OKU 2008).",
        questions: [
          "Apakah hak OKU di bawah Akta OKU 2008?",
          "Apakah hak saya sebagai OKU di tempat kerja?",
          "Apa yang boleh saya buat jika tempat awam tidak mesra OKU?",
        ],
      },
      {
        id: "agencies",
        icon: "users",
        title: "Agensi dan Pertubuhan",
        desc: "Agensi kerajaan dan NGO yang membantu OKU dan penjaga.",
        questions: [
          "Agensi manakah yang membantu OKU di Malaysia?",
          "NGO manakah yang membantu OKU dan penjaga?",
          "Apakah itu pusat PDK?",
        ],
      },
    ],
    links: [
      {
        abbr: "JKM",
        name: "Jabatan Kebajikan Masyarakat",
        url: "https://www.jkm.gov.my",
        desc: "Pendaftaran OKU, Kad OKU dan bantuan kewangan.",
      },
      {
        abbr: "PERKESO",
        name: "Pertubuhan Keselamatan Sosial",
        url: "https://www.perkeso.gov.my",
        desc: "Faedah untuk pekerja yang hilang upaya.",
      },
      {
        abbr: "KWSP",
        name: "Kumpulan Wang Simpanan Pekerja",
        url: "https://www.kwsp.gov.my",
        desc: "Pengeluaran simpanan kerana hilang upaya.",
      },
      {
        abbr: "KKM",
        name: "Kementerian Kesihatan Malaysia",
        url: "https://www.moh.gov.my",
        desc: "Perkhidmatan kesihatan dan laporan perubatan.",
      },
    ],
  },
};

/* ==========================================================
   Saved preferences (fails safely if storage is blocked)
   ========================================================== */
const store = {
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      /* ignore */
    }
  },
};

let lang = "en";
let busy = false;
let currentPage = "home";

const root = document.documentElement;
const form = document.getElementById("chat-form");
const input = document.getElementById("question");
const sendBtn = document.getElementById("send-btn");
const log = document.getElementById("chat-log");
const chatScroll = document.getElementById("chat-scroll");
const heroForm = document.getElementById("hero-form");
const heroInput = document.getElementById("hero-question");
const heroError = document.getElementById("hero-error");
const topicList = document.getElementById("topic-list");
const topicGrid = document.getElementById("topic-grid");
const linkList = document.getElementById("link-list");
const statusEl = document.getElementById("status");
const fieldError = document.getElementById("question-error");
const newChatBtn = document.getElementById("new-chat");
const contrastBtn = document.getElementById("contrast-btn");
const sidebarToggle = document.getElementById("sidebar-toggle");
const sidebarBody = document.getElementById("sidebar-body");
const displayToggle = document.getElementById("display-toggle");
const displaySettings = document.getElementById("display-settings");
const heroQuestions = document.getElementById("hero-questions");
const welcomeChips = document.getElementById("welcome-chips");
const welcomeList = document.getElementById("welcome-list");

// Topics whose first question is offered as a one-tap starter
const STARTER_TOPICS = ["kad-oku", "jkm", "rights"];

const desktopQuery = window.matchMedia("(min-width: 64rem)");

function t(key) {
  return strings[lang][key];
}

// Builds a decorative Lucide icon from the sprite in index.html
const SVG_NS = "http://www.w3.org/2000/svg";
function icon(name) {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("class", "icon");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  const use = document.createElementNS(SVG_NS, "use");
  use.setAttribute("href", `#i-${name}`);
  svg.append(use);
  return svg;
}

/* WCAG 4.1.3: announce without moving focus */
let statusTimer;
function announce(message) {
  clearTimeout(statusTimer);
  statusEl.textContent = "";
  statusTimer = setTimeout(() => {
    statusEl.textContent = message;
  }, 150);
}

/* ==========================================================
   Pages (hash routing keeps the conversation and n8n session
   alive while moving between pages)
   ========================================================== */
const PAGES = ["home", "chat", "links", "help"];

function parseHash() {
  const [page, topic] = window.location.hash.replace(/^#\/?/, "").split("/");
  return { page: page || "home", topic };
}

function showPage(page, { topic = null, moveFocus = true } = {}) {
  if (!PAGES.includes(page)) page = "home";
  currentPage = page;

  document.querySelectorAll(".page").forEach((section) => {
    section.hidden = section.dataset.page !== page;
  });
  document.querySelectorAll("[data-page-link]").forEach((a) => {
    if (a.dataset.pageLink === page) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  updateTitle();
  window.scrollTo(0, 0);

  if (page === "chat" && topic) {
    openTopic(topic);
    return;
  }
  // WCAG 2.4.3: move focus to the new page heading so screen readers announce it
  if (moveFocus) {
    const heading = document.querySelector(`[data-page="${page}"] h1`);
    if (heading) heading.focus();
  }
}

function updateTitle() {
  document.title = `${t("pageTitles")[currentPage]} – OKUConnect`; // WCAG 2.4.2
}

window.addEventListener("hashchange", () => {
  const { page, topic } = parseHash();
  // Ignore in-page anchors such as the skip link (#main)
  if (PAGES.includes(page)) showPage(page, { topic });
});

// Clicking a link to the page you are already on still moves focus
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (a && a.getAttribute("href") === window.location.hash) {
    const { page, topic } = parseHash();
    if (PAGES.includes(page)) showPage(page, { topic });
  }
});

/* ==========================================================
   Phone-only folding panels (sidebar and display settings)
   ========================================================== */
function setExpanded(button, panel, open) {
  button.setAttribute("aria-expanded", String(open));
  panel.classList.toggle("is-open", open);
}

sidebarToggle.addEventListener("click", () => {
  setExpanded(
    sidebarToggle,
    sidebarBody,
    sidebarToggle.getAttribute("aria-expanded") !== "true",
  );
});
displayToggle.addEventListener("click", () => {
  setExpanded(
    displayToggle,
    displaySettings,
    displayToggle.getAttribute("aria-expanded") !== "true",
  );
});

// Opens one topic in the chatbot sidebar (used by the Home topic cards)
function openTopic(id) {
  const details = topicList.querySelector(`details[data-topic="${id}"]`);
  if (!details) return;
  setExpanded(sidebarToggle, sidebarBody, true);
  details.open = true;
  const summary = details.querySelector("summary");
  summary.focus();
  summary.scrollIntoView({ block: "nearest" });
}

/* ==========================================================
   Language detection for single messages (WCAG 3.1.2)
   ========================================================== */
const MS_WORDS = new Set([
  "yang",
  "dan",
  "untuk",
  "saya",
  "anda",
  "bagaimana",
  "apakah",
  "boleh",
  "tidak",
  "ini",
  "itu",
  "dengan",
  "kepada",
  "daripada",
  "adalah",
  "ialah",
  "atau",
  "jika",
  "bantuan",
  "permohonan",
  "memohon",
  "cara",
  "sila",
  "kami",
  "akan",
  "dalam",
  "oleh",
  "bagi",
  "hak",
  "siapa",
  "bila",
  "mana",
  "manakah",
  "kerana",
  "juga",
  "perlu",
  "sebagai",
]);
const EN_WORDS = new Set([
  "the",
  "and",
  "for",
  "you",
  "how",
  "what",
  "can",
  "is",
  "are",
  "to",
  "of",
  "with",
  "your",
  "if",
  "this",
  "apply",
  "help",
  "or",
  "be",
  "will",
  "do",
  "my",
  "who",
  "when",
  "which",
  "need",
  "from",
  "have",
  "get",
  "a",
  "an",
  "it",
  "that",
  "on",
]);

function detectLang(text, fallback) {
  const words = text.toLowerCase().match(/[a-z]+/g) || [];
  let ms = 0;
  let en = 0;
  words.forEach((w) => {
    if (MS_WORDS.has(w)) ms++;
    if (EN_WORDS.has(w)) en++;
  });
  if (ms > en) return "ms";
  if (en > ms) return "en";
  return fallback;
}

/* ==========================================================
   Safe answer formatting (no innerHTML)
   ========================================================== */
const INLINE_PATTERN =
  /\*\*(.+?)\*\*|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s<>()]+)|(?<![\w*])\*(?!\s)([^*\n]+?)(?<!\s)\*(?![\w*])/g;

function makeLink(label, url) {
  let safe;
  try {
    safe = new URL(url);
  } catch (e) {
    return document.createTextNode(label);
  }
  if (safe.protocol !== "https:" && safe.protocol !== "http:") {
    return document.createTextNode(label);
  }
  const a = document.createElement("a");
  a.href = safe.href;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.textContent = label;
  const note = document.createElement("span");
  note.className = "visually-hidden";
  note.dataset.i18n = "newTab";
  note.textContent = " " + t("newTab");
  a.appendChild(note);
  return a;
}

function appendInline(parent, text) {
  let last = 0;
  let m;
  INLINE_PATTERN.lastIndex = 0;
  while ((m = INLINE_PATTERN.exec(text)) !== null) {
    if (m.index > last) parent.append(text.slice(last, m.index));
    if (m[1] !== undefined) {
      const strong = document.createElement("strong");
      strong.textContent = m[1];
      parent.append(strong);
    } else if (m[2] !== undefined) {
      parent.append(makeLink(m[2], m[3]));
    } else if (m[4] !== undefined) {
      let url = m[4];
      const trail = (url.match(/[.,;:!?]+$/) || [""])[0];
      if (trail) url = url.slice(0, -trail.length);
      parent.append(makeLink(url, url));
      if (trail) parent.append(trail);
    } else if (m[5] !== undefined) {
      const em = document.createElement("em");
      em.textContent = m[5];
      parent.append(em);
    }
    last = INLINE_PATTERN.lastIndex;
  }
  if (last < text.length) parent.append(text.slice(last));
}

function renderRich(text, container) {
  const lines = text.replace(/\r\n?/g, "\n").split("\n");
  let para = null;
  let list = null;

  lines.forEach((raw) => {
    const line = raw.replace(/\s+$/, "");
    let m;

    if (!line.trim()) {
      para = null;
      list = null;
      return;
    }
    if ((m = line.match(/^\s*[-*•]\s+(.*)$/))) {
      para = null;
      if (!list || list.tagName !== "UL") {
        list = document.createElement("ul");
        container.append(list);
      }
      const li = document.createElement("li");
      appendInline(li, m[1]);
      list.append(li);
      return;
    }
    if ((m = line.match(/^\s*(\d+)[.)]\s+(.*)$/))) {
      para = null;
      if (!list || list.tagName !== "OL") {
        list = document.createElement("ol");
        const start = parseInt(m[1], 10);
        if (start !== 1) list.start = start;
        container.append(list);
      }
      const li = document.createElement("li");
      appendInline(li, m[2]);
      list.append(li);
      return;
    }
    if ((m = line.match(/^\s*#{1,6}\s+(.*)$/))) {
      para = null;
      list = null;
      const p = document.createElement("p");
      p.className = "subhead";
      const strong = document.createElement("strong");
      appendInline(strong, m[1]);
      p.append(strong);
      container.append(p);
      return;
    }
    list = null;
    if (!para) {
      para = document.createElement("p");
      container.append(para);
    } else {
      para.append(document.createElement("br"));
    }
    appendInline(para, line.trim());
  });
}

function toPlainText(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, "$1")
    .replace(/^\s*#{1,6}\s+/gm, "")
    .replace(/^\s*[-*•]\s+/gm, "")
    .replace(/(?<![\w*])\*(?!\s)([^*\n]+?)(?<!\s)\*(?![\w*])/g, "$1")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

/* ==========================================================
   Read aloud (browser text-to-speech, output only)
   ========================================================== */
const canSpeak =
  "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
let speakingBtn = null;

function stopSpeaking() {
  if (!canSpeak) return;
  window.speechSynthesis.cancel();
  if (speakingBtn) {
    speakingBtn.querySelector(".label").textContent = t("readAloud");
    speakingBtn = null;
  }
}

function toggleSpeak(btn, text, textLang) {
  if (speakingBtn === btn) {
    stopSpeaking();
    return;
  }
  stopSpeaking();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = textLang === "ms" ? "ms-MY" : "en-GB";
  const voice = window.speechSynthesis
    .getVoices()
    .find((v) => v.lang && v.lang.toLowerCase().startsWith(textLang));
  if (voice) utterance.voice = voice;
  utterance.onend = utterance.onerror = () => {
    if (speakingBtn === btn) stopSpeaking();
  };
  speakingBtn = btn;
  btn.querySelector(".label").textContent = t("stopReading");
  window.speechSynthesis.speak(utterance);
}

/* ==========================================================
   Conversation
   ========================================================== */
let messageCount = 0;

function updateEmptyState() {
  const empty = log.children.length === 0;
  newChatBtn.hidden = empty;
  welcomeChips.hidden = !empty; // starters only before the first question
}

// Textarea grows with its text, up to the CSS max-height
function autoGrow() {
  input.style.height = "auto";
  input.style.height = `${input.scrollHeight}px`;
}

// role: "user" | "bot" | "notice" (loading and errors)
function addMessage(role, text, extraClass = "") {
  messageCount++;
  const article = document.createElement("article");
  article.className = `message ${role} ${extraClass}`.trim();
  article.dataset.role = role;

  // Each message has a heading so screen reader users can jump between them
  const heading = document.createElement("h3");
  // User bubbles show no label (as in the mockup) but keep it for screen readers
  heading.className = role === "user" ? "who visually-hidden" : "who";
  heading.id = `msg-${messageCount}`;
  if (role !== "user") heading.append(icon("bot"));
  const headingLabel = document.createElement("span");
  headingLabel.className = "label";
  headingLabel.textContent = t(role === "user" ? "you" : role);
  heading.append(headingLabel);
  article.setAttribute("aria-labelledby", heading.id);

  const body = document.createElement("div");
  body.className = "text";
  const msgLang = detectLang(text, lang);
  body.lang = msgLang;

  if (role === "bot") {
    renderRich(text, body); // safe: builds elements, never uses innerHTML
  } else {
    const p = document.createElement("p");
    p.textContent = text; // textContent keeps the page safe from injected HTML
    p.style.whiteSpace = "pre-wrap";
    body.append(p);
  }
  if (extraClass === "loading") {
    // Decorative typing dots; the words beside them carry the meaning
    const dots = document.createElement("span");
    dots.className = "typing";
    dots.setAttribute("aria-hidden", "true");
    dots.append(
      document.createElement("span"),
      document.createElement("span"),
      document.createElement("span"),
    );
    body.prepend(dots);
  }
  article.append(heading, body);

  const canCopy = !!(navigator.clipboard && window.isSecureContext);
  if (role === "bot" && (canSpeak || canCopy)) {
    const actions = document.createElement("div");
    actions.className = "message-actions";
    if (canSpeak) {
      const readBtn = document.createElement("button");
      readBtn.type = "button";
      readBtn.className = "msg-btn read-btn";
      const readLabel = document.createElement("span");
      readLabel.className = "label";
      readLabel.textContent = t("readAloud");
      readBtn.append(icon("volume"), readLabel);
      readBtn.addEventListener("click", () =>
        toggleSpeak(readBtn, toPlainText(text), msgLang),
      );
      actions.append(readBtn);
    }
    if (canCopy) {
      const copyBtn = document.createElement("button");
      copyBtn.type = "button";
      copyBtn.className = "msg-btn copy-btn";
      const copyLabel = document.createElement("span");
      copyLabel.className = "label";
      copyLabel.textContent = t("copy");
      copyBtn.append(icon("copy"), copyLabel);
      copyBtn.addEventListener("click", () =>
        copyAnswer(copyBtn, toPlainText(text)),
      );
      actions.append(copyBtn);
    }
    article.append(actions);
  }

  log.appendChild(article);
  updateEmptyState();
  // Keep the newest message in view inside the conversation area
  chatScroll.scrollTop = chatScroll.scrollHeight;
  return article;
}

let copyTimer;
async function copyAnswer(btn, text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (e) {
    return;
  }
  const label = btn.querySelector(".label");
  const use = btn.querySelector("use");
  btn.classList.add("is-done");
  use.setAttribute("href", "#i-check");
  label.textContent = t("copied");
  announce(t("copiedStatus"));
  clearTimeout(copyTimer);
  copyTimer = setTimeout(() => {
    btn.classList.remove("is-done");
    use.setAttribute("href", "#i-copy");
    label.textContent = t("copy");
  }, 2000);
}

function showFieldError(message) {
  fieldError.textContent = message; // role="alert" announces it
  input.setAttribute("aria-invalid", "true");
  if (document.activeElement !== input) input.focus();
}

function clearFieldError() {
  fieldError.textContent = "";
  input.removeAttribute("aria-invalid");
}

function setBusy(state) {
  busy = state;
  sendBtn.disabled = state;
}

// n8n may return { output } or [{ output }]
function extractAnswer(data) {
  const item = Array.isArray(data) ? data[0] : data;
  if (!item || typeof item !== "object") return "";
  const answer = item.output || item.text || item.response || "";
  return typeof answer === "string" ? answer.trim() : "";
}

async function ask(question) {
  if (busy) {
    announce(t("wait"));
    return;
  }
  question = (question || "").trim();
  if (!question) {
    showFieldError(t("empty"));
    return;
  }

  clearFieldError();
  stopSpeaking();
  addMessage("user", question);
  input.value = "";
  autoGrow();
  setBusy(true);
  const loading = addMessage("notice", t("loading"), "loading");
  announce(t("loadingStatus"));

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(N8N_CHAT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "sendMessage",
        sessionId,
        chatInput: question,
        metadata: { language: lang }, // the page language, available in n8n if needed
      }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const answer = extractAnswer(data);
    loading.remove();
    if (answer) {
      addMessage("bot", answer);
      announce(`${t("answerStatus")} ${toPlainText(answer)}`);
    } else {
      addMessage("notice", t("error"), "error");
      announce(t("error"));
    }
  } catch (err) {
    console.error(err);
    loading.remove();
    const message = err.name === "AbortError" ? t("timeout") : t("error");
    addMessage("notice", message, "error");
    announce(message);
  } finally {
    clearTimeout(timer);
    setBusy(false);
    // Only take focus back if the user is still on the chatbot page
    if (currentPage === "chat") input.focus();
  }
}

function startNewConversation() {
  stopSpeaking();
  log.innerHTML = "";
  sessionId = makeSessionId(); // n8n treats this as a fresh conversation
  updateEmptyState();
  clearFieldError();
  autoGrow();
  input.focus();
  announce(t("newChatDone"));
}

/* ==========================================================
   Topics (Home cards + chatbot sidebar) and official links
   ========================================================== */
function iconChip(name) {
  const chip = document.createElement("span");
  chip.className = "icon-chip";
  chip.setAttribute("aria-hidden", "true");
  chip.append(icon(name));
  return chip;
}

// Home: topic cards with an icon chip, as in the mockup's category cards
function renderTopicGrid() {
  topicGrid.innerHTML = "";
  t("topics").forEach((topic) => {
    const li = document.createElement("li");
    const card = document.createElement("div");
    card.className = "topic-card";

    const h3 = document.createElement("h3");
    const a = document.createElement("a");
    a.href = `#chat/${topic.id}`;
    a.textContent = topic.title;
    h3.append(a);

    const p = document.createElement("p");
    p.textContent = topic.desc;

    // Visual cue only; the link above is what keyboard and screen reader users use
    const action = document.createElement("span");
    action.className = "card-action";
    action.setAttribute("aria-hidden", "true");
    action.append(t("topicCardAction"), icon("arrow-right"));

    card.append(iconChip(topic.icon), h3, p, action);
    li.append(card);
    topicGrid.append(li);
  });
}

// Home hero panel and chat welcome: one-tap starter questions
function starterButton(q, onClick) {
  const li = document.createElement("li");
  const b = document.createElement("button");
  b.type = "button";
  b.append(q, icon("arrow-right"));
  b.addEventListener("click", () => onClick(q));
  li.append(b);
  return li;
}

function renderStarters() {
  heroQuestions.innerHTML = "";
  welcomeList.innerHTML = "";
  STARTER_TOPICS.forEach((id) => {
    const topic = t("topics").find((tp) => tp.id === id);
    if (!topic) return;
    const q = topic.questions[0];
    heroQuestions.append(starterButton(q, askFromHome));
    welcomeList.append(starterButton(q, ask));
  });
}

// Chatbot sidebar: folding topics with suggested questions
function renderTopicSidebar() {
  // Keep open topics open when the language changes
  const open = new Set(
    Array.from(topicList.querySelectorAll("details[open]")).map(
      (d) => d.dataset.topic,
    ),
  );
  topicList.innerHTML = "";

  t("topics").forEach((topic) => {
    const details = document.createElement("details");
    details.className = "topic";
    details.dataset.topic = topic.id;
    if (open.has(topic.id)) details.open = true;

    const summary = document.createElement("summary");
    const title = document.createElement("span");
    title.className = "topic-name";
    title.textContent = topic.title;
    const chev = icon("chevron");
    chev.classList.add("chev");
    summary.append(iconChip(topic.icon), title, chev);

    const list = document.createElement("ul");
    list.className = "question-list";
    topic.questions.forEach((q) => {
      const li = document.createElement("li");
      const b = document.createElement("button");
      b.type = "button";
      b.append(q, icon("arrow-right"));
      b.addEventListener("click", () => {
        // On phones, fold the sidebar away so the answer is visible
        if (!desktopQuery.matches)
          setExpanded(sidebarToggle, sidebarBody, false);
        ask(q);
      });
      li.append(b);
      list.append(li);
    });

    details.append(summary, list);
    topicList.append(details);
  });
}

// Official websites: directory cards, as in the mockup's NGO list
function renderLinks() {
  linkList.innerHTML = "";
  t("links").forEach((link) => {
    const li = document.createElement("li");
    const card = document.createElement("div");
    card.className = "link-card";

    const abbr = document.createElement("span");
    abbr.className = "link-abbr";
    abbr.setAttribute("aria-hidden", "true");
    abbr.textContent = link.abbr;

    const body = document.createElement("div");
    body.className = "link-body";
    const top = document.createElement("div");
    top.className = "link-top";
    const a = document.createElement("a");
    a.href = link.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.append(`${link.abbr} – ${link.name}`, icon("external"));
    const note = document.createElement("span");
    note.className = "visually-hidden";
    note.textContent = ` ${t("newTab")}`;
    a.append(note);
    const badge = document.createElement("span");
    badge.className = "badge-gov";
    badge.textContent = t("govBadge");
    top.append(a, badge);

    const p = document.createElement("p");
    p.textContent = link.desc;
    const host = document.createElement("span");
    host.className = "link-host";
    host.textContent = new URL(link.url).hostname.replace(/^www\./, "");
    body.append(top, p, host);

    card.append(abbr, body);
    li.append(card);
    linkList.append(li);
  });
}

/* ==========================================================
   Language and display settings
   ========================================================== */
function setLanguage(newLang, { announceChange = false } = {}) {
  if (!strings[newLang]) newLang = "en";
  lang = newLang;
  root.lang = lang; // tells screen readers which language to read in

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const value = t(el.dataset.i18n);
    if (typeof value !== "string") return;
    el.textContent = el.classList.contains("visually-hidden")
      ? " " + value
      : value;
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.setAttribute("placeholder", t(el.dataset.i18nPlaceholder));
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    el.setAttribute("aria-label", t(el.dataset.i18nAria));
  });
  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.setAttribute("aria-pressed", String(btn.dataset.lang === lang));
  });

  // Update messages already on the page
  log.querySelectorAll("article[data-role]").forEach((article) => {
    const role = article.dataset.role;
    article.querySelector(".who .label").textContent = t(
      role === "user" ? "you" : role,
    );
    const copyLabel = article.querySelector(".copy-btn .label");
    if (copyLabel) {
      const done = copyLabel.parentElement.classList.contains("is-done");
      copyLabel.textContent = done ? t("copied") : t("copy");
    }
    const readLabel = article.querySelector(".read-btn .label");
    if (readLabel) {
      const isSpeaking = readLabel.parentElement === speakingBtn;
      readLabel.textContent = isSpeaking ? t("stopReading") : t("readAloud");
    }
  });
  log.querySelectorAll(".message.loading .text p").forEach((p) => {
    p.textContent = t("loading");
  });

  renderTopicGrid();
  renderStarters();
  renderTopicSidebar();
  renderLinks();
  updateTitle();
  store.set("okuconnect-lang", lang);
  if (announceChange) announce(t("langChanged"));
}

function setTextSize(size) {
  if (!["normal", "large", "larger"].includes(size)) size = "normal";
  root.dataset.textSize = size;
  document.querySelectorAll("[data-size]").forEach((btn) => {
    btn.setAttribute("aria-pressed", String(btn.dataset.size === size));
  });
  store.set("okuconnect-size", size);
}

function setContrast(on) {
  root.classList.toggle("high-contrast", on);
  contrastBtn.setAttribute("aria-pressed", String(on));
  store.set("okuconnect-contrast", on ? "on" : "off");
}

/* ==========================================================
   Events
   ========================================================== */
form.addEventListener("submit", (e) => {
  e.preventDefault();
  ask(input.value);
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
    e.preventDefault();
    ask(input.value);
  }
});

input.addEventListener("input", () => {
  autoGrow();
  if (input.getAttribute("aria-invalid") === "true" && input.value.trim())
    clearFieldError();
});

newChatBtn.addEventListener("click", startNewConversation);

// Home hero box: opens the chatbot page and sends the question
heroForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const q = heroInput.value.trim();
  if (!q) {
    heroError.textContent = t("heroEmpty"); // role="alert" announces it
    heroInput.setAttribute("aria-invalid", "true");
    heroInput.focus();
    return;
  }
  heroError.textContent = "";
  heroInput.removeAttribute("aria-invalid");
  heroInput.value = "";
  askFromHome(q);
});

// Opens the chatbot page and sends the question
function askFromHome(q) {
  window.location.hash = "#chat"; // hashchange shows the chatbot page
  showPage("chat", { moveFocus: false });
  ask(q);
}

heroInput.addEventListener("input", () => {
  if (heroInput.value.trim()) {
    heroError.textContent = "";
    heroInput.removeAttribute("aria-invalid");
  }
});

document.querySelectorAll("[data-lang]").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.dataset.lang !== lang)
      setLanguage(btn.dataset.lang, { announceChange: true });
  });
});

document.querySelectorAll("[data-size]").forEach((btn) => {
  btn.addEventListener("click", () => setTextSize(btn.dataset.size));
});

contrastBtn.addEventListener("click", () => {
  setContrast(contrastBtn.getAttribute("aria-pressed") !== "true");
});

/* ==========================================================
   Start up
   Language order: ?lang= in the link, saved choice, browser language.
   ========================================================== */
(function init() {
  const params = new URLSearchParams(window.location.search);
  const urlLang = params.get("lang");
  const savedLang = store.get("okuconnect-lang");
  const browserLang = (navigator.language || "").toLowerCase().startsWith("ms")
    ? "ms"
    : "en";
  setLanguage(strings[urlLang] ? urlLang : savedLang || browserLang);

  setTextSize(store.get("okuconnect-size") || "normal");

  const savedContrast = store.get("okuconnect-contrast");
  const prefersMore =
    window.matchMedia && window.matchMedia("(prefers-contrast: more)").matches;
  setContrast(savedContrast ? savedContrast === "on" : prefersMore);

  updateEmptyState();
  // Do not steal focus on first load
  const { page, topic } = parseHash();
  showPage(page, { topic: null, moveFocus: false });
  if (page === "chat" && topic) openTopic(topic);
})();

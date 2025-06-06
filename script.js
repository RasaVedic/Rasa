// ------------- UI TEXTS (EN/HI) ---------------
const uiText = {
  en: {
    searchPlaceholder: 'Search...',
    searchTips: 'Search Tips',
    majorBooks: 'Major Books',
    otherCollections: 'Other Collections',
    about: 'About',
    aboutDesc: 'Islamic Hadith Collection app for study & awareness.',
    faq: 'FAQ',
    language: 'Language',
    contact: 'Contact',
    educational: 'Educational & Awareness',
    copy: 'Copy',
    share: 'Share',
    back: 'Back',
    switchLang: 'Switch Language',
    next: 'Next',
    noResult: 'No results found'
  },
  hi: {
    searchPlaceholder: 'खोजें...',
    searchTips: 'खोज युक्तियाँ',
    majorBooks: 'मुख्य किताबें',
    otherCollections: 'अन्य संग्रह',
    about: 'परिचय',
    aboutDesc: 'अध्ययन और जागरूकता के लिए इस्लामी हदीस संग्रह ऐप।',
    faq: 'सामान्य प्रश्न',
    language: 'भाषा',
    contact: 'संपर्क',
    educational: 'शैक्षिक एवं जागरूकता',
    copy: 'कॉपी करें',
    share: 'साझा करें',
    back: 'वापस',
    switchLang: 'भाषा बदलें',
    next: 'आगे',
    noResult: 'कोई परिणाम नहीं मिला'
  }
};

// ---------- HADITH DATA (EN/HI/AR) --------------
const hadithBooks = [
  {
    en: "Sahih al-Bukhari",
    hi: "सहीह अल-बुखारी",
    ar: "صحيح البخاري",
    hadith: [
      {
        en: "The reward of deeds depends upon intentions.",
        hi: "कर्मों का फल नीयत पर निर्भर करता है।",
        ar: "إنما الأعمال بالنيات"
      }
    ],
    id: "bukhari"
  },
  {
    en: "Sahih Muslim",
    hi: "सहीह मुस्लिम",
    ar: "صحيح مسلم",
    hadith: [
      {
        en: "None of you truly believes until he loves for his brother what he loves for himself.",
        hi: "तुममें से कोई सच्चा मोमिन नहीं हो सकता जब तक वह अपने भाई के लिए वही न चाहे जो वह अपने लिए चाहता है।",
        ar: "لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه"
      }
    ],
    id: "muslim"
  },
];
const otherBooks = [
  {
    en: "Riyad as-Salihin",
    hi: "रियादुस-सालिहीन",
    ar: "رياض الصالحين",
    hadith: [
      {
        en: "God does not look at your forms or your wealth but He looks at your hearts and your deeds.",
        hi: "अल्लाह तुम्हारे रूप या संपत्ति को नहीं देखता, बल्कि तुम्हारे दिल और कर्म को देखता है।",
        ar: "إن الله لا ينظر إلى صوركم وأموالكم ولكن ينظر إلى قلوبكم وأعمالكم"
      }
    ],
    id: "riyad"
  }
];

// ------------ GLOBAL STATE -----------------
let siteLang = "en";    // Site-wide language
let modalLang = "en";   // Modal-only language
let currentBook = null, currentIdx = 0, currentList = null;

// ---- showToast function ----
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = 'toast show';
  setTimeout(() => { toast.className = 'toast'; }, 1600);
}

// ---------- UI UPDATE LOGIC ----------------
function updateSiteLanguage() {
  // Static text
  document.getElementById('searchInput').placeholder = uiText[siteLang].searchPlaceholder;
  document.querySelector('.search-tips').textContent = uiText[siteLang].searchTips;
  document.getElementById('majorBooks').textContent = uiText[siteLang].majorBooks;
  document.getElementById('otherCollections').textContent = uiText[siteLang].otherCollections;
  document.getElementById('aboutTitle').textContent = uiText[siteLang].about;
  document.getElementById('aboutDesc').textContent = uiText[siteLang].aboutDesc;
  document.getElementById('faqTitle').textContent = uiText[siteLang].faq;
  document.getElementById('langTitle').textContent = uiText[siteLang].language;
  document.getElementById('footerContact').textContent = uiText[siteLang].contact;
  document.getElementById('footerEducational').textContent = uiText[siteLang].educational;

  // Modal button labels
  document.getElementById('copyLabel').textContent = uiText[siteLang].copy;
  document.getElementById('shareLabel').textContent = uiText[siteLang].share;
  document.getElementById('backLabel').textContent = uiText[siteLang].back;
  document.getElementById('switchLangLabel').textContent = uiText[siteLang].switchLang;
  document.getElementById('nextLabel').textContent = uiText[siteLang].next;

  // Hadith button grids
  renderGrid(hadithBooks, "hadithGrid");
  renderGrid(otherBooks, "hadithGrid2");

  // If modal open, modalLang ko bhi siteLang par la do
  if (document.getElementById("modal").classList.contains("show")) {
    modalLang = siteLang;
    showHadith();
  }
}

// --------- RENDER HADITH BUTTONS ------------
function renderGrid(list, gridId) {
  const el = document.getElementById(gridId);
  el.innerHTML = "";
  list.forEach(item => {
    const btn = document.createElement("button");
    btn.className = "hadith-btn";
    btn.setAttribute('aria-label', item[siteLang]); // accessibility
    btn.onclick = () => openModal(item, 0, list);
    btn.innerHTML = `
      <span class="en">${item[siteLang]}</span>
      <span class="ar">${item.ar}</span>
    `;
    el.appendChild(btn);
  });
}

// --------- MODAL LOGIC -----------------------
function openModal(book, idx, list) {
  currentBook = book;
  currentIdx = idx;
  currentList = list;
  modalLang = siteLang;
  showHadith();
  document.getElementById("modal").classList.add("show");
  document.getElementById("modalBlur").classList.add("show");
  document.body.style.overflow = "hidden";
  // scroll to top for modal
  document.getElementById("modal").scrollTop = 0;
}
function showHadith() {
  const h = currentBook.hadith[currentIdx];
  document.getElementById("modalArabic").style.display = (modalLang === "ar") ? "block" : "none";
  document.getElementById("modalEnglish").style.display = (modalLang === "en") ? "block" : "none";
  document.getElementById("modalHindi").style.display = (modalLang === "hi") ? "block" : "none";
  document.getElementById("modalArabic").textContent = h.ar;
  document.getElementById("modalEnglish").textContent = h.en;
  document.getElementById("modalHindi").textContent = h.hi;
  // Prev button disable logic
  const prevBtn = document.getElementById("prevBtn");
  if (prevBtn) {
    prevBtn.disabled = (currentList.indexOf(currentBook) === 0);
  }
}
function closeModal() {
  document.getElementById("modal").classList.remove("show");
  document.getElementById("modalBlur").classList.remove("show");
  document.body.style.overflow = "";
}
function nextHadith() {
  let idx = currentList.indexOf(currentBook);
  idx = (idx + 1) % currentList.length;
  openModal(currentList[idx], 0, currentList);
}
function prevHadith() {
  let idx = currentList.indexOf(currentBook);
  idx = (idx - 1 + currentList.length) % currentList.length;
  openModal(currentList[idx], 0, currentList);
}
function switchLanguage() {
  // ONLY Modal language change hota hai
  if (modalLang === "en") modalLang = "hi";
  else if (modalLang === "hi") modalLang = "ar";
  else modalLang = "en";
  showHadith();
}
async function copyHadith() {
  const h = currentBook.hadith[currentIdx];
  let text = h[modalLang] || h.en;
  try {
    await navigator.clipboard.writeText(text);
    showToast(uiText[siteLang].copy + "!");
  } catch (e) {
    showToast("Copy feature not supported in this browser.");
  }
}
async function shareHadith() {
  const url = location.origin + location.pathname + "#" + currentBook.id;
  const text = currentBook.hadith[currentIdx][modalLang] || currentBook.hadith[currentIdx].en;
  if (navigator.share) {
    try {
      await navigator.share({
        title: "Hadith Share",
        text: text,
        url: url
      });
      showToast("Shared successfully!");
    } catch (e) {
      showToast("Share cancelled or failed.");
    }
  } else {
    try {
      await navigator.clipboard.writeText(url);
      showToast("Link copied: " + url);
    } catch (e) {
      showToast("Could not copy link.");
    }
  }
}

// --------- SEARCH LOGIC ----------------------
document.getElementById("searchInput").addEventListener("input", (e) => {
  const q = e.target.value.trim().toLowerCase();
  filterGrid(hadithBooks, "hadithGrid", q);
  filterGrid(otherBooks, "hadithGrid2", q);
});

function filterGrid(list, gridId, q) {
  const el = document.getElementById(gridId);
  el.innerHTML = "";
  // Filter on book name OR any hadith text (en/hi/ar)
  const filtered = (!q)
    ? list
    : list.filter(item =>
        item.en.toLowerCase().includes(q) ||
        (item.hi && item.hi.toLowerCase().includes(q)) ||
        (item.ar && item.ar.includes(q)) ||
        (item.hadith && item.hadith.some(h =>
          (h.en && h.en.toLowerCase().includes(q)) ||
          (h.hi && h.hi.toLowerCase().includes(q)) ||
          (h.ar && h.ar.includes(q))
        ))
      );
  if (!filtered.length) {
    el.innerHTML = `<div class="no-result">${uiText[siteLang].noResult}</div>`;
    return;
  }
  filtered.forEach(item => {
    const btn = document.createElement("button");
    btn.className = "hadith-btn";
    btn.setAttribute('aria-label', item[siteLang]);
    btn.onclick = () => openModal(item, 0, list);
    btn.innerHTML = `
      <span class="en">${item[siteLang]}</span>
      <span class="ar">${item.ar}</span>
    `;
    el.appendChild(btn);
  });
}

// --------- SIDE MENU LOGIC -------------------
const menuBtn = document.getElementById("menuBtn");
const sideMenu = document.getElementById("sideMenu");
const sideMenuBlur = document.getElementById("sideMenuBlur");
menuBtn.onclick = () => { sideMenu.classList.add("open"); sideMenuBlur.classList.add("show"); };
sideMenuBlur.onclick = () => { sideMenu.classList.remove("open"); sideMenuBlur.classList.remove("show"); };

// --------- LANGUAGE SWITCH (SITE-WIDE) --------
document.getElementById("langEn").onclick = () => {
  document.getElementById("langEn").classList.add("active");
  document.getElementById("langHi").classList.remove("active");
  siteLang = "en";
  updateSiteLanguage();
};
document.getElementById("langHi").onclick = () => {
  document.getElementById("langHi").classList.add("active");
  document.getElementById("langEn").classList.remove("active");
  siteLang = "hi";
  updateSiteLanguage();
};

// ---------- MODAL BUTTONS -------------------
document.getElementById("modalBlur").onclick = closeModal;
document.getElementById("copyBtn").onclick = copyHadith;
document.getElementById("shareBtn").onclick = shareHadith;
document.getElementById("backBtn").onclick = closeModal;
document.getElementById("switchLangBtn").onclick = switchLanguage;
document.getElementById("prevBtn").onclick = prevHadith;
document.getElementById("nextBtn").onclick = nextHadith;

// --------- MODAL: OPEN BY HASH ---------
window.addEventListener("load", () => {
  updateSiteLanguage();
  if (location.hash) {
    const id = location.hash.slice(1);
    let book = hadithBooks.concat(otherBooks).find(b => b.id === id);
    if (book) openModal(book, 0, hadithBooks.concat(otherBooks));
  }
});

// --------- KEYBOARD SHORTCUTS (Accessibility) -----
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// --------- LOADER (for future async) --------------
// HTML me yeh line daal dein jahan list dikhegi:
/*
  <div id="loader" style="display:none;">Loading...</div>
*/
// Loader show/hide example
function showLoader(show) {
  document.getElementById("loader").style.display = show ? "block" : "none";
}

// --- Responsive hint (CSS/HTML) ---
// Example HTML me grid ya body pe class="responsive" lagayein
// Aur CSS me media query use karein

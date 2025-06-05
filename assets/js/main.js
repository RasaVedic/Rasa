// ===================== MAIN.JS =====================

// --------- GLOBALS ---------
let langData = {};
let currentLang = 'en';
let topics = [];

// --------- LANGUAGE LOADING ---------
async function loadLanguage(lang) {
  const res = await fetch(`assets/lang/${lang}.json`);
  langData = await res.json();
  document.querySelectorAll("[data-translate]").forEach(el => {
    const key = el.getAttribute("data-translate");
    if (langData[key]) el.textContent = langData[key];
  });
  // Update placeholder for search
  document.getElementById('searchInput').placeholder = langData.search || 'Search...';
}

// --------- SET LANGUAGE (ONLY FROM MENU) ---------
async function setLanguage(lang) {
  currentLang = lang;
  await loadLanguage(lang);
  renderTopics();
  renderSideMenuTopics();
  highlightActiveLang(lang);
  toggleMenu();
}

// --------- THEME/DARK MODE ---------
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem("theme", theme);
  document.getElementById("darkModeToggle").setAttribute('aria-pressed', theme === "dark");
}
document.addEventListener("DOMContentLoaded", () => {
  // Language auto-detect
  if (navigator.language && navigator.language.startsWith('hi')) currentLang = 'hi';

  let theme = localStorage.getItem("theme") || (window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light");
  setTheme(theme);

  document.getElementById("darkModeToggle").onclick = function() {
    setTheme(document.documentElement.getAttribute('data-theme') === "dark" ? "light" : "dark");
  };

  // Welcome banner
  const wb = document.getElementById("welcomeBanner");
  wb.style.display = "block";
  setTimeout(() => { wb.style.display = "none"; }, 7000);

  // Keyboard shortcut for search
  document.addEventListener('keydown', function(e) {
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      document.getElementById('searchInput').focus();
    }
  });

  highlightActiveLang(currentLang);
});

// --------- ACTIVE LANG BUTTON HIGHLIGHT ---------
function highlightActiveLang(lang) {
  document.querySelectorAll("#sideMenu button[id^='lang-']").forEach(btn => {
    btn.classList.toggle('active', btn.id === 'lang-' + lang);
  });
}

// --------- MENU ---------
function toggleMenu() {
  const menu = document.getElementById("sideMenu");
  menu.classList.toggle("hidden");
  menu.classList.toggle("visible");
}

// --------- LOAD TOPICS ---------
document.getElementById('loadingSpinner').style.display = 'block';
fetch("assets/data/topics.json")
  .then(res => res.json())
  .then(data => {
    topics = data;
    renderTopics();
    loadLanguage(currentLang);
    renderSideMenuTopics();
    document.getElementById('loadingSpinner').style.display = 'none';
  });

// =================== TOPICS ===================
function renderTopics() {
  const container = document.getElementById("topic-buttons");
  container.innerHTML = '';
  topics.forEach(topic => {
    const card = document.createElement("div");
    card.className = "topic-card";
    card.tabIndex = 0;
    card.innerHTML = `
      <h3>${topic.title[currentLang]}</h3>
      ${topic.shortDesc ? `<p>${topic.shortDesc[currentLang]}</p>` : ''}
      <button class="show-topic-btn">${langData.see_details || "See Details"}</button>
    `;
    card.querySelector(".show-topic-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      document.querySelectorAll('.topic-card').forEach(c => {
        c.classList.add('minimized'); c.classList.remove('active');
      });
      card.classList.remove('minimized');
      card.classList.add('active');
      showTopic(topic, card);
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") showTopic(topic, card);
    });
    container.appendChild(card);
  });
}

function renderSideMenuTopics() {
  const ul = document.getElementById("sideMenuTopics");
  if (!ul) return;
  ul.innerHTML = '';
  topics.forEach((topic, idx) => {
    const li = document.createElement("li");
    li.style.margin = '0.5em 0';
    li.innerHTML = `<button style="width:100%;background:none;border:none;text-align:left;padding:0.4em 0.5em;cursor:pointer;font-size:1em;">${topic.title[currentLang]}</button>`;
    li.querySelector("button").onclick = () => {
      toggleMenu();
      const topicCard = Array.from(document.getElementById("topic-buttons").children)[idx];
      if (topicCard) {
        topicCard.scrollIntoView({behavior:"smooth"});
        topicCard.focus();
        showTopic(topics[idx], topicCard);
      }
    };
    ul.appendChild(li);
  });
}

function showTopic(topic, afterElement) {
  document.querySelectorAll(".topic-reference-section").forEach(el => el.remove());
  const refSection = document.createElement("section");
  refSection.className = "topic-reference-section";
  refSection.innerHTML = `
    <h4>${topic.title[currentLang]}</h4>
    <div class="reference-block">
      ${topic.references.map(ref =>
        `<div class="ref-detail" tabindex="0">
          <span>${ref.label}</span>
          <button class="ref-btn">${langData.see_reference || "See Reference"}</button>
        </div>`
      ).join("")}
    </div>
    <button class="close-ref-btn">${langData.back || "Back"}</button>
  `;
  afterElement.insertAdjacentElement('afterend', refSection);
  refSection.querySelectorAll(".ref-btn").forEach((btn, i) => {
    btn.addEventListener("click", () => displayReference(refSection, topic.references[i]));
  });
  refSection.querySelector(".close-ref-btn").addEventListener("click", () => refSection.remove());
}

function displayReference(refSection, ref) {
  let refLang = currentLang;
  refSection.innerHTML = `
    <strong>${ref.label}</strong><br>
    <em id="ref-text">${ref.text[refLang]}</em><br>
    <button class="switch-lang-btn">&#127760; ${langData.switch_language || "Switch Language"}</button>
    <button class="close-ref-btn">${langData.back || "Back"}</button>
    <button class="copy-btn">&#128203; ${langData.copy || "Copy"}</button>
    <button class="share-btn">&#128257; ${langData.share || "Share"}</button>
  `;
  refSection.querySelector(".switch-lang-btn").onclick = () => {
    refLang = refLang === 'en' ? 'hi' : 'en';
    refSection.querySelector("#ref-text").textContent = ref.text[refLang];
  };
  refSection.querySelector(".close-ref-btn").onclick = () => refSection.remove();
  refSection.querySelector(".copy-btn").onclick = () => {
    navigator.clipboard.writeText(ref.text[refLang]);
    showErrorMessage(langData.copied || "✅ Copied!");
  };
  refSection.querySelector(".share-btn").onclick = () => {
    if (navigator.share) {
      navigator.share({
        title: ref.label,
        text: ref.text[refLang],
        url: window.location.href
      });
    } else {
      showErrorMessage(langData.share_not_supported || "Share not supported.");
    }
  };
}

// =================== SEARCH ===================
function handleSearch(event) {
  const keyword = event.target.value.trim().toLowerCase();
  const results = document.getElementById("searchResults");
  results.innerHTML = '';
  if (!keyword) {
    results.classList.add("hidden");
    return;
  }
  const found = [];
  topics.forEach(topic => {
    if (topic.title.en.toLowerCase().includes(keyword) || topic.title.hi.toLowerCase().includes(keyword)) {
      found.push({
        label: topic.title[currentLang],
        action: () => {
          const topicCard = Array.from(document.getElementById("topic-buttons").children)
            .find(card => card.querySelector("h3").textContent === topic.title[currentLang]);
          if (topicCard) {
            topicCard.scrollIntoView({behavior:"smooth"});
            topicCard.classList.add("active");
            setTimeout(() => topicCard.classList.remove("active"), 1600);
            showTopic(topic, topicCard);
          }
        }
      });
    }
    topic.references.forEach(ref => {
      if (
        ref.label.toLowerCase().includes(keyword) ||
        ref.text.en.toLowerCase().includes(keyword) ||
        ref.text.hi.toLowerCase().includes(keyword)
      ) {
        found.push({
          label: `${ref.label} - ${ref.text[currentLang].slice(0, 50)}...`,
          action: () => {
            const topicCard = Array.from(document.getElementById("topic-buttons").children)
              .find(card => card.querySelector("h3").textContent === topic.title[currentLang]);
            if (topicCard) showTopic(topic, topicCard);
          }
        });
      }
    });
  });
  if (found.length === 0) {
    results.innerHTML = `<div>${langData.no_results || "No matches found."}</div>`;
  } else {
    found.forEach(item => {
      const div = document.createElement("div");
      div.textContent = item.label;
      div.tabIndex = 0;
      div.onclick = item.action;
      div.onkeydown = (e) => { if(e.key === "Enter" || e.key === " ") div.click(); };
      results.appendChild(div);
    });
  }
  results.classList.remove("hidden");
}

// =================== UTILS ===================
function goBack() {
  document.getElementById("reference-section").classList.add("hidden");
}

function showErrorMessage(msg) {
  const banner = document.getElementById('errorBanner');
  banner.textContent = msg;
  banner.classList.remove('hidden');
  setTimeout(() => banner.classList.add('hidden'), 3500);
}

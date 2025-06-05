// ====== SIDEMENU ======
const menuBtn = document.getElementById('menuBtn');
const sideMenu = document.getElementById('sideMenu');
const closeMenuBtn = document.getElementById('closeMenuBtn');
menuBtn.onclick = () => sideMenu.classList.add('open');
closeMenuBtn.onclick = () => sideMenu.classList.remove('open');
sideMenu.onclick = e => { if (e.target === sideMenu) sideMenu.classList.remove('open'); };

// ====== SCROLL TO TOP FAB ======
document.getElementById('scrollTopBtn').onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

// ====== THEME PICKER FAB (Sample: toggling light/yellow/dark) ======
const themeBtn = document.getElementById('themePickerBtn');
themeBtn.onclick = () => {
  document.body.classList.toggle('dark-theme');
  themeBtn.title = document.body.classList.contains('dark-theme') ? 'Light Theme' : 'Dark Theme';
};

// ====== MODAL LOGIC ======
const detailModal = document.getElementById('detailModal');
const backBtn = document.getElementById('backBtn');

function openDetailModal(contentHtml) {
  document.getElementById('detailContent').innerHTML = contentHtml;
  detailModal.classList.remove('hidden');
}
function closeDetailModal() {
  detailModal.classList.add('hidden');
}
backBtn.onclick = closeDetailModal;
window.onkeydown = e => {
  if (e.key === "Escape") closeDetailModal();
};

// ====== COPY LINK BUTTON ======
const copyBtn = document.getElementById('copyBtn');
copyBtn.onclick = function() {
  // Example: Use current page + hash as shareable link
  let url = window.location.href;
  navigator.clipboard.writeText(url).then(() => {
    showBanner('Link copied to clipboard!');
  });
};

// ====== SHARE BUTTON (Web Share API) ======
const shareBtn = document.getElementById('shareBtn');
shareBtn.onclick = function() {
  let url = window.location.href;
  let text = 'Check out this Vedic reference on BhaiVedic!';
  if (navigator.share) {
    navigator.share({ title: document.title, text, url });
  } else {
    navigator.clipboard.writeText(url);
    showBanner('Link copied! (Share API not supported)');
  }
};

// ====== BOOKMARK BUTTON (localStorage) ======
const bookmarkBtn = document.getElementById('bookmarkBtn');
bookmarkBtn.onclick = function() {
  let content = document.getElementById('detailContent').innerHTML;
  let bookmarks = JSON.parse(localStorage.getItem('bhaivedic-bookmarks') || '[]');
  if (!bookmarks.includes(content)) {
    bookmarks.push(content);
    localStorage.setItem('bhaivedic-bookmarks', JSON.stringify(bookmarks));
    showBanner('Bookmarked!');
  } else {
    showBanner('Already bookmarked!');
  }
};

// ====== BOOKMARK MODAL (Export/Import) ======
const bookmarkModal = document.getElementById('bookmarkModal');
const bookmarksList = document.getElementById('bookmarksList');
document.getElementById('exportBookmarksBtn').onclick = function() {
  let data = localStorage.getItem('bhaivedic-bookmarks') || '[]';
  let blob = new Blob([data], { type: "application/json" });
  let url = URL.createObjectURL(blob);
  let a = document.createElement('a');
  a.href = url; a.download = "bhaivedic-bookmarks.json";
  a.click();
};
document.getElementById('importBookmarksBtn').onclick = function() {
  document.getElementById('importFileInput').click();
};
document.getElementById('importFileInput').onchange = function(e) {
  let file = e.target.files[0];
  let reader = new FileReader();
  reader.onload = function() {
    localStorage.setItem('bhaivedic-bookmarks', reader.result);
    showBanner('Bookmarks imported!');
    renderBookmarks();
  };
  reader.readAsText(file);
};
function renderBookmarks() {
  let bookmarks = JSON.parse(localStorage.getItem('bhaivedic-bookmarks') || '[]');
  bookmarksList.innerHTML = bookmarks.length ?
    bookmarks.map((b, i) => `<div class="bookmark-item">${b}</div>`).join('') :
    '<em>No bookmarks yet.</em>';
}
document.getElementById('closeBookmarkModalBtn').onclick = () => bookmarkModal.classList.add('hidden');

// ====== PRINT & PDF ======
document.getElementById('printBtn').onclick = function() {
  // Prepare content for printing or PDF
  let content = document.getElementById('detailContent').innerHTML;
  let printModal = document.getElementById('printModal');
  document.getElementById('printContent').innerHTML = content;
  printModal.classList.remove('hidden');
};
document.getElementById('doPrintBtn').onclick = function() {
  let win = window.open('', '', 'width=700,height=800');
  win.document.write('<html><head><title>Print</title></head><body>' +
    document.getElementById('printContent').innerHTML + '</body></html>');
  win.print();
};
document.getElementById('doDownloadPdfBtn').onclick = function() {
  // Basic: print as PDF (for advanced: use html2pdf = function() {
  document.getElementById('updateBanner').classList.add('hidden');
};

// ====== DYNAMIC CONTENT DEMO ======
// You would typically fetch or generate these from a backend/database!
document.getElementById('thoughtOfDay').textContent = "Satyam vada, dharmam char. (Speak the truth, follow righteousness)";

// Sample trending topics
const trendingTopics = [
  { title: "Vedas", desc: "Ancient Indian scriptures" },
  { title: "Upanishads", desc: "Philosophical texts" },
  { title: "Bhagavad}</p>
    </div>`).join('');

// Topic grid sample
const topics = [
  { title: "Rigveda", desc: "Earliest Veda" },
  { title: "Ayurveda", desc: "Science of life" },
  { title: "Panini", desc: "Sanskrit grammar" }
];
document.getElementById('topicsGrid').innerHTML =
  topics.map(t =>
    `<div onclick="openDetailModal('<h3>${t.title}</h3><p>${t.desc}</p>')">
      <h3>${t.title}</h3><p>${t.desc}</p>
    </div>`).join('');

// Reference grid sample
const references = [
  { title: "Chandogya Upanishad", desc: "One of the oldest" },
  { title: "Patanjali Yoga Sutra", desc: "Yoga philosophy" }
];
document.getElementById('referencesGrid').innerHTML =
  references.map(r =>
    `<div onclick="openDetailModal('<h3>${r.title}</h3><p>${r.desc}</p>')">
      <h3>${r.title}</h3><p>${r.desc}</p>
    </div>`).join('');

// ====== COMMENTS (Demo, not persistent) ======
let comments = [];
const commentsList = document.getElementById('commentsList');
const commentForm = document.getElementById('commentForm');
commentForm.onsubmit = function(e) {
  e.preventDefault();
  const val = document.getElementById('commentInput').value.trim();
  if (val) {
    comments.push(val);
    renderComments();
    document.getElementById('commentInput').value = '';
  }
};
function renderComments() {
  commentsList.innerHTML = comments.length ?
    comments.map(c => `<div class="comment">${c}</div>`).join('') :
    "<em>No comments yet.</em>";
}
renderComments();

// ====== CONTRIBUTE FORM (Demo) ======
document.getElementById('contributeForm').onsubmit = function(e) {
  e.preventDefault();
  showBanner('Thank you for your contribution!');
  this.reset();
};

// ====== DONATE BUTTON ======
document.getElementById('donateBtn').onclick = function() {
  showBanner('UPI: bhaivedic@upi or contact for details.');
};

// ====== SEARCH (Filter topics/references) ======
document.getElementById('searchBar').oninput = function(e) {
  let q = e.target.value.toLowerCase();
  document.querySelectorAll('.topics-grid > div, .references-grid > div').forEach(div => {
    div.style.display = div.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
};

// ====== VEDIC CALENDAR DEMO ======
document.getElementById('vedicCalendar').innerHTML =
  "<b>5 June 2025</b><br>Ekadashi Tithi, Shukla Paksha, Vaishakh Maas";

// ====== DARK THEME SUPPORT (Optional, CSS me bhi class add karein) ======
if (!localStorage.getItem('theme')) localStorage.setItem('theme', 'light');
if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-theme');
themeBtn.onclick = () => {
  document.body.classList.toggle('dark-theme');
  localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
};

// ====== SERVICE WORKER REGISTRATION FOR PWA ======
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').then(reg => {
      // console.log('Service Worker registered!', reg);
    });
  });
}

// ====== CLOSE MODAL ON OVERLAY CLICK ======
detailModal.addEventListener('click', function(e) {
  if (e.target === detailModal) closeDetailModal();
});

// ====== OPEN MODAL ON HASH CHANGE (for shareable links) ======
window.addEventListener('hashchange', () => {
  let hash = window.location.hash.slice(1);
  if (hash.startsWith('ref-')) {
    // Example: open reference detail from hash
    openDetailModal(`<h3>Reference: ${hash.replace('ref-', '')}</h3>`);
  }
});


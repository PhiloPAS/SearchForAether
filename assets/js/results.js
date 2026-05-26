const params = new URLSearchParams(window.location.search);
const query = (params.get("q") || "").trim();

const resultTitle = document.getElementById("result-title");
const resultQuery = document.getElementById("result-query");
const confidence = document.getElementById("confidence");
const matches = document.getElementById("matches");
const statusText = document.getElementById("status");
const scanLabel = document.getElementById("scan-label");
const sourceList = document.getElementById("source-list");
const summaryList = document.getElementById("summary-list");

const sources = [
  ["Search index", 82, "#69e7ff"],
  ["Public profiles", 66, "#9ee7b0"],
  ["News and pages", 48, "#f0c36b"],
  ["Archives", 37, "#aeb9ff"]
];

const summaries = [
  "Several public references may share a similar name or keyword.",
  "Profile matches should be reviewed manually before assuming identity.",
  "No private address, phone number, credential, or document is shown here."
];

function scoreFromQuery(text) {
  let score = 0;
  for (const char of text) score += char.charCodeAt(0);
  return score;
}

function renderSources(seed) {
  sourceList.innerHTML = sources.map(([name, base, color], index) => {
    const value = Math.min(96, Math.max(18, base + ((seed + index * 11) % 15) - 7));
    return `
      <div>
        <div class="mb-2 flex items-center justify-between text-sm">
          <span class="font-semibold text-text">${name}</span>
          <span class="text-muted">${value}%</span>
        </div>
        <div class="bar">
          <span style="background: ${color}; width: ${value}%"></span>
        </div>
      </div>
    `;
  }).join("");
}

function renderSummary() {
  summaryList.innerHTML = summaries.map(item => `
    <div class="rounded-lg border border-white/10 bg-white/[.035] p-4 text-sm leading-6 text-muted">
      ${item}
    </div>
  `).join("");
}

function renderPage() {
  if (!query) {
    window.location.href = "index.html";
    return;
  }

  const seed = scoreFromQuery(query);
  resultTitle.textContent = query;
  resultQuery.value = query;
  confidence.textContent = `${Math.min(94, 58 + (seed % 34))}%`;
  matches.textContent = `${Math.max(4, seed % 23)}`;
  renderSources(seed);
  renderSummary();

  setTimeout(() => {
    statusText.textContent = "Ready";
    scanLabel.textContent = "Complete";
  }, 650);
}

renderPage();


const CHARACTER_PACKS = [
  "characters_official.json",
  "characters_pack_02.json",
  "characters_pack_03.json",
  "characters_pack_04.json",
  "characters_pack_05.json"
];


let loadedCharacters = [];
let nextPackIndex = 0;

async function loadNextPack() {
  if (nextPackIndex >= CHARACTER_PACKS.length) return;
  const file = CHARACTER_PACKS[nextPackIndex++];
  const res = await fetch(file);
  const json = await res.json();
  loadedCharacters = loadedCharacters.concat(json);
  renderSearchResults();
}

async function initCharacters() {
  await loadNextPack();
}

function getQuery(elId) {
  return document.getElementById(elId).value.trim().toLowerCase();
}

function renderSearchResults() {
  const q = getQuery("search");
  const list = document.getElementById("results");
  const filtered = q
    ? loadedCharacters.filter(c =>
        (c.name||'').toLowerCase().includes(q) ||
        (c.house||'').toLowerCase().includes(q) ||
        (c.role||'').toLowerCase().includes(q)
      )
    : loadedCharacters;

  list.innerHTML = filtered.slice(0, 50).map(c => `
    <li>
      <strong>${c.name}</strong> (${c.house||"—"}) - ${c.role||""}
      ${c.wiki ? `<a href="${c.wiki}" target="_blank" rel="noopener">위키</a>` : ""}
    </li>
  `).join("");
}

function onSearchInput() { renderSearchResults(); }

document.addEventListener("DOMContentLoaded", async () => {
  await initCharacters();
  document.getElementById("moreBtn")?.addEventListener("click", loadNextPack);
  document.getElementById("search")?.addEventListener("input", onSearchInput);
});

// Spells
async function loadData(file) {
  const res = await fetch(file);
  return await res.json();
}
async function searchSpells() {
  const data = await loadData("spells_official.json");
  const input = document.getElementById("spellSearch").value.toLowerCase();
  const results = data.filter(s => s.name.toLowerCase().includes(input));
  const list = document.getElementById("spellResults");
  list.innerHTML = results.slice(0, 20).map(s =>
    `<li>${s.name} (${s.korean_name}) - ${s.description}</li>`
  ).join("");
}

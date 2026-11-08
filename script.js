// ---------------------------------------------------------------
// Gallery data — edit titles/categories here.
// category: "canvas" | "mural" | "digital"
// ---------------------------------------------------------------
const WORKS = [
  { src: "assets/art/art-01.jpg", title: "Portrait in Green Hat", category: "canvas" },
  { src: "assets/art/art-07.jpg", title: "The Knight", category: "mural" },
  { src: "assets/art/art-11.jpg", title: "Shades", category: "digital" },
  { src: "assets/art/art-03.jpg", title: "Woman in Blue", category: "canvas" },
  { src: "assets/art/art-04.jpg", title: "Macaw Stairwell", category: "mural" },
  { src: "assets/art/art-10.jpg", title: "Crowned", category: "digital" },
  { src: "assets/art/art-02.jpg", title: "Hilltop Citadel", category: "canvas" },
  { src: "assets/art/art-12.jpg", title: "Sweet Tooth", category: "digital" },
  { src: "assets/art/art-05.jpg", title: "Hello Jungle", category: "mural" },
  { src: "assets/art/art-15.jpg", title: "Blossom", category: "canvas" },
  { src: "assets/art/art-13.jpg", title: "Portrait Study", category: "digital" },
  { src: "assets/art/art-08.jpg", title: "Cartoon Doodle Room", category: "mural" },
  { src: "assets/art/art-14.jpg", title: "Blossom & Silhouette", category: "canvas" },
  { src: "assets/art/art-06.jpg", title: "The Knight — in progress", category: "mural" },
  { src: "assets/art/art-09.jpg", title: "Doodle Walls", category: "mural" },
  { src: "assets/art/art-16.jpg", title: "Anime Wall Panels", category: "mural" },
];

const LABELS = { canvas: "Oil on Canvas", mural: "Wall Mural", digital: "Digital" };

const gallery = document.getElementById("gallery");
let visible = WORKS;

function render(filter = "all") {
  visible = filter === "all" ? WORKS : WORKS.filter((w) => w.category === filter);
  gallery.innerHTML = "";
  visible.forEach((w, i) => {
    const tile = document.createElement("button");
    tile.className = "tile";
    tile.style.animationDelay = `${Math.min(i, 10) * 40}ms`;
    tile.setAttribute("aria-label", `View ${w.title}, ${LABELS[w.category]}`);
    tile.innerHTML = `
      <img src="${w.src}" alt="${w.title} by Hillson" loading="lazy">
      <span class="tile-zoom" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="16" height="16"><path d="M8 5l11 7-11 7z" fill="currentColor"/></svg>
      </span>
      <span class="tile-meta"><strong>${w.title}</strong><span>${LABELS[w.category]}</span></span>`;
    tile.addEventListener("click", () => openLightbox(i));
    gallery.appendChild(tile);
  });
}

function setFilter(filter) {
  document.querySelectorAll(".chip").forEach((c) => c.classList.toggle("is-active", c.dataset.filter === filter));
  document.querySelectorAll(".disciplines button").forEach((b) => b.classList.toggle("is-active", b.dataset.filter === filter));
  render(filter);
}

document.querySelectorAll(".chip").forEach((c) => c.addEventListener("click", () => setFilter(c.dataset.filter)));

// Counts on the discipline list
document.querySelectorAll("[data-count]").forEach((el) => {
  const n = WORKS.filter((w) => w.category === el.dataset.count).length;
  el.textContent = String(n).padStart(2, "0");
});

// Discipline rows: hover preview + click to filter
const preview = document.querySelector(".hover-preview");
document.querySelectorAll(".disciplines button").forEach((b) => {
  b.addEventListener("click", () => {
    setFilter(b.dataset.filter);
    gallery.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  b.addEventListener("mouseenter", () => {
    preview.src = b.dataset.preview;
    preview.classList.add("is-visible");
  });
  b.addEventListener("mouseleave", () => preview.classList.remove("is-visible"));
  b.addEventListener("mousemove", (e) => {
    preview.style.left = `${e.clientX + 130}px`;
    preview.style.top = `${e.clientY}px`;
  });
});

// Lightbox
const lb = document.getElementById("lightbox");
const lbImg = document.getElementById("lb-img");
const lbTitle = document.getElementById("lb-title");
const lbCat = document.getElementById("lb-cat");
let current = 0;

function show(i) {
  current = (i + visible.length) % visible.length;
  const w = visible[current];
  lbImg.src = w.src;
  lbImg.alt = `${w.title} by Hillson`;
  lbTitle.textContent = w.title;
  lbCat.textContent = LABELS[w.category];
}
function openLightbox(i) {
  show(i);
  lb.showModal();
}
lb.querySelector(".lb-close").addEventListener("click", () => lb.close());
lb.querySelector(".lb-prev").addEventListener("click", () => show(current - 1));
lb.querySelector(".lb-next").addEventListener("click", () => show(current + 1));
lb.addEventListener("click", (e) => { if (e.target === lb) lb.close(); });
lb.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") show(current - 1);
  if (e.key === "ArrowRight") show(current + 1);
});
let touchX = null;
lb.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
lb.addEventListener("touchend", (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
  touchX = null;
});

// Mobile nav
const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".nav-links");
toggle.addEventListener("click", () => {
  const open = links.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", open);
});
links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => {
  links.classList.remove("is-open");
  toggle.setAttribute("aria-expanded", "false");
}));

document.getElementById("year").textContent = new Date().getFullYear();
render();

const WA_NUMBER = "34603257104";
const waLink = (text) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

// Intro con el logo y arranque de animaciones del hero
const intro = document.getElementById("intro");
const start = () => {
  intro.classList.add("done");
  document.body.classList.add("is-loaded");
  setTimeout(() => intro.remove(), 1100);
};
if (reduced || sessionStorage.getItem("maluIntro")) {
  intro.style.transition = "none";
  start();
} else {
  try { sessionStorage.setItem("maluIntro", "1"); } catch (e) {}
  window.addEventListener("load", () => setTimeout(start, 650));
  setTimeout(start, 2500); // por si "load" tarda
}

// Manchas de color del fondo del hero
const hero = document.querySelector(".hero");
hero.insertAdjacentHTML("afterbegin", '<span class="blob blob--1" aria-hidden="true"></span><span class="blob blob--2" aria-hidden="true"></span>');

// Header: fondo al hacer scroll, se esconde al bajar y vuelve al subir
const header = document.getElementById("header");
const progress = document.getElementById("progress");
const waFloat = document.querySelector(".wa-float");
let lastY = window.scrollY;
let ticking = false;

const onScroll = () => {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  header.classList.toggle("scrolled", y > 20);
  header.classList.toggle("hide", y > 400 && y > lastY && !nav.classList.contains("open"));
  progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  waFloat.classList.toggle("show", y > 300);
  lastY = y;

  // Parallax de las fotos del hero
  if (!reduced && y < window.innerHeight * 1.2) {
    document.querySelectorAll("[data-depth]").forEach((el) => {
      el.style.translate = `0 ${y * -0.08 * el.dataset.depth}px`;
    });
  }
  ticking = false;
};
window.addEventListener("scroll", () => {
  if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
}, { passive: true });

// Menú móvil
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");
const toggleMenu = (open) => {
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  nav.classList.toggle("open", open);
  header.classList.toggle("menu-open", open);
  header.classList.remove("hide");
};
burger.addEventListener("click", () => toggleMenu(burger.getAttribute("aria-expanded") !== "true"));
nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => toggleMenu(false)));
onScroll();

// Enlace activo del menú según la sección visible
const navLinks = [...nav.querySelectorAll("a")];
const sectionSpy = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (e.isIntersecting) {
    navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${e.target.id}`));
  }
}), { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("main section[id]").forEach((s) => sectionSpy.observe(s));

// Entrada escalonada del texto del hero
document.querySelectorAll(".hero .reveal").forEach((el, i) => el.style.setProperty("--i", i));

// Títulos de sección palabra a palabra
document.querySelectorAll(".section h2").forEach((h) => {
  const words = h.textContent.trim().split(/\s+/);
  h.setAttribute("aria-label", h.textContent.trim());
  h.innerHTML = words.map((w, i) => `<span class="w" aria-hidden="true"><span style="--w:${i}">${w}</span></span>`).join(" ");
  h.classList.add("split");
});

// Grupos que aparecen en cascada
document.querySelectorAll(".services, .catalog, .steps, .why__grid, .faq__list").forEach((group) => {
  group.classList.add("stagger");
  [...group.children].forEach((child, i) => {
    child.classList.remove("reveal");
    child.style.setProperty("--s", i % 4);
  });
});

// Observador común para todo lo que aparece al hacer scroll
const io = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (e.isIntersecting) {
    e.target.classList.add("is-visible");
    io.unobserve(e.target);
  }
}), { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
document.querySelectorAll(".reveal, .split, .stagger, .step").forEach((el) => io.observe(el));

// Tarjetas con inclinación 3D (solo con ratón)
if (finePointer && !reduced) {
  document.querySelectorAll(".service, .product").forEach((card) => {
    card.classList.add("tilt");
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      card.style.setProperty("--mx", `${x * 100}%`);
      card.style.setProperty("--my", `${y * 100}%`);
      card.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 6}deg) rotateY(${(x - 0.5) * 8}deg) translateY(-6px)`;
    });
    card.addEventListener("mouseleave", () => { card.style.transform = ""; });
  });

  // Botones magnéticos
  document.querySelectorAll(".btn:not(.btn--sm), .header__cta").forEach((btn) => {
    btn.classList.add("magnetic");
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
    });
    btn.addEventListener("mouseleave", () => { btn.style.transform = ""; });
  });

  // Fotos del hero siguen ligeramente al ratón
  const heroMedia = document.getElementById("heroMedia");
  hero.addEventListener("mousemove", (e) => {
    const cx = e.clientX / window.innerWidth - 0.5;
    const cy = e.clientY / window.innerHeight - 0.5;
    heroMedia.querySelectorAll("[data-depth]").forEach((el) => {
      el.style.transform = `translate(${cx * 18 * el.dataset.depth}px, ${cy * 18 * el.dataset.depth}px)`;
    });
  });

  // Cursor personalizado
  const cursor = document.createElement("div");
  cursor.className = "cursor";
  document.body.appendChild(cursor);
  let cx = 0, cy = 0, tx = 0, ty = 0;
  window.addEventListener("mousemove", (e) => { tx = e.clientX; ty = e.clientY; cursor.classList.add("on"); });
  document.addEventListener("mouseleave", () => cursor.classList.remove("on"));
  const loop = () => {
    cx += (tx - cx) * 0.2;
    cy += (ty - cy) * 0.2;
    cursor.style.transform = `translate(${cx}px, ${cy}px)`;
    requestAnimationFrame(loop);
  };
  loop();
  document.querySelectorAll("a, button, summary, .product, .service").forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("big"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("big"));
  });
}

// Filtros del catálogo con animación
const filters = document.querySelectorAll(".filter");
const products = document.querySelectorAll(".product");
filters.forEach((btn) => btn.addEventListener("click", () => {
  const cat = btn.dataset.filter;
  filters.forEach((b) => {
    const active = b === btn;
    b.classList.toggle("is-active", active);
    b.setAttribute("aria-selected", String(active));
  });
  let n = 0;
  products.forEach((p) => {
    const show = cat === "todo" || p.dataset.cat === cat;
    p.classList.toggle("is-hidden", !show);
    p.classList.remove("entering");
    if (show) {
      p.style.setProperty("--s", n++);
      void p.offsetWidth; // reinicia la animación
      p.classList.add("entering");
    }
  });
}));

// Botones "Pedir" del catálogo -> WhatsApp con el producto
document.querySelectorAll("[data-wa]").forEach((a) => {
  a.href = waLink(`Hola Malú, me interesa: ${a.dataset.wa}. ¿Me dais presupuesto?`);
  a.target = "_blank";
  a.rel = "noopener";
});

// Formulario -> WhatsApp
const form = document.getElementById("form");
const note = document.getElementById("formNote");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const nombre = data.get("nombre").trim();
  const mensaje = data.get("mensaje").trim();
  if (!nombre || !mensaje) {
    note.textContent = "Rellena tu nombre y cuéntanos qué necesitas.";
    return;
  }
  note.textContent = "";
  window.open(waLink(`Hola Malú, soy ${nombre}.\nServicio: ${data.get("servicio")}\n${mensaje}`), "_blank", "noopener");
});

document.getElementById("year").textContent = new Date().getFullYear();

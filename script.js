const WA_NUMBER = "34603257104";
const waLink = (text) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

// Header al hacer scroll
const header = document.getElementById("header");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 20);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// Menú móvil
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");
const toggleMenu = (open) => {
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  nav.classList.toggle("open", open);
  header.classList.toggle("menu-open", open);
};
burger.addEventListener("click", () => toggleMenu(burger.getAttribute("aria-expanded") !== "true"));
nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => toggleMenu(false)));

// Animación de entrada escalonada en el hero
document.querySelectorAll(".hero .reveal").forEach((el, i) => el.style.setProperty("--i", i));

// Reveal al entrar en pantalla
const io = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add("is-visible");
      io.unobserve(e.target);
    }
  }),
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);
document.querySelectorAll(".reveal, .step").forEach((el) => io.observe(el));

// Filtros del catálogo
const filters = document.querySelectorAll(".filter");
const products = document.querySelectorAll(".product");
filters.forEach((btn) => btn.addEventListener("click", () => {
  const cat = btn.dataset.filter;
  filters.forEach((b) => {
    const active = b === btn;
    b.classList.toggle("is-active", active);
    b.setAttribute("aria-selected", String(active));
  });
  products.forEach((p) => p.classList.toggle("is-hidden", cat !== "todo" && p.dataset.cat !== cat));
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

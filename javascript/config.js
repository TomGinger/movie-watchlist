export const apiKey = import.meta.env.VITE_OMDB_API_KEY;

export function initTheme() {
    const saved = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", saved);
    updateToggleIcon(saved);
}

export function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    updateToggleIcon(next);
}

function updateToggleIcon(theme) {
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;
    btn.innerHTML = theme === "dark"
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
}

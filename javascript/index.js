import { apiKey, initTheme, toggleTheme } from './config.js';

initTheme();
document.getElementById("theme-toggle").addEventListener("click", toggleTheme);

// DOM prvky
const inputFilm = document.getElementById("input-film");
const searchBtn = document.getElementById("search-btn");
const postContainer = document.getElementById("post-container");

// Udržení stavu stránky při obnovení
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('s');
    if (query) {
        inputFilm.value = query;
        runSearch(query);
    }
});

// Obsluha tlačítek Zpět/Vpřed v prohlížeči
window.addEventListener("popstate", () => {
    const query = new URLSearchParams(window.location.search).get('s');
    if (query) {
        inputFilm.value = query;
        runSearch(query);
    } else {
        inputFilm.value = "";
        postContainer.innerHTML = `
            <div class="post-empty">
                <i class="fa-solid fa-film"></i>
                <p>Start exploring</p>
            </div>`;
    }
});

// Hledání přes tlačítko
searchBtn.addEventListener("click", () => {
    const searchValue = inputFilm.value.trim();
    if (searchValue) {
        const newUrl = `${window.location.pathname}?s=${encodeURIComponent(searchValue)}`;
        window.history.pushState({ path: newUrl }, '', newUrl);
        runSearch(searchValue);
    }
});

// Hledání přes Enter
inputFilm.addEventListener("keydown", (e) => {
    if (e.key === "Enter") searchBtn.click();
});

async function runSearch(searchValue) {
    try {
        const res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(searchValue)}`);
        const data = await res.json();

        if (!data.Search) {
            postContainer.innerHTML = `
                <div class="post-empty">
                    <h2>Unable to find what you're looking for.<br>Please try another search.</h2>
                </div>`;
            return;
        }

        await renderMoviePosts(data.Search);
    } catch (error) {
        console.error("Error fetching data:", error);
        postContainer.innerHTML = `
            <div class="post-empty">
                <h2>Something went wrong. Please try again.</h2>
            </div>`;
    }
}

async function renderMoviePosts(movies) {
    postContainer.innerHTML = "";

    const watchList = JSON.parse(localStorage.getItem("watchlist")) || [];

    // Načtení detailů všech filmů paralelně
    const movieDetails = await Promise.all(
        movies.map(movie =>
            fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}`).then(r => r.json())
        )
    );

    movieDetails.forEach(moviePost => {
        const inWatchlist = watchList.includes(moviePost.imdbID);
        const iconClass = inWatchlist ? "fa-circle-check icon-check" : "fa-circle-plus";

        const posterSrc = moviePost.Poster !== "N/A" ? moviePost.Poster : null;

        postContainer.innerHTML += `
            <div class="movie-post-container">
                <div class="poster-container">
                    <i class="fa-solid fa-film poster-fallback"></i>
                    ${posterSrc ? `<img src="${posterSrc}" alt="${moviePost.Title} poster" onerror="this.style.display='none'">` : ""}
                </div>
                <div class="movie-post-info">
                    <div class="post-header">
                        <h2>${moviePost.Title}</h2>
                        <div class="movie-rating">
                            <i class="fa-solid fa-star"></i>
                            <p>${moviePost.imdbRating}</p>
                        </div>
                    </div>
                    <div class="genre-runtime">
                        <p>${moviePost.Runtime}</p>
                        <p>${moviePost.Genre}</p>
                        <div>
                            <span class="watchlist-icon-wrapper">
                                <i class="fa-solid ${iconClass}" data-id="${moviePost.imdbID}"></i>
                            </span>
                            <p>Watchlist</p>
                        </div>
                    </div>
                    <p>${moviePost.Plot}</p>
                </div>
            </div>`;
    });
}

// Přidání do watchlistu
document.addEventListener("click", (e) => {
    const movieId = e.target.dataset.id;
    if (movieId) addToWatchList(movieId, e.target);
});

function addToWatchList(movieId, iconEl) {
    let watchList = JSON.parse(localStorage.getItem("watchlist")) || [];

    if (!watchList.includes(movieId)) {
        watchList.push(movieId);
        localStorage.setItem("watchlist", JSON.stringify(watchList));
        animateIcon(iconEl, "added");
        showNotification("Added to your watchlist!");
    } else {
        animateIcon(iconEl, "exists");
        showNotification("Already in your watchlist!");
    }
}

function animateIcon(el, type) {
    if (type === "exists") {
        el.classList.add("icon-shake");
        setTimeout(() => el.classList.remove("icon-shake"), 500);
        return;
    }

    const wrapper = el.parentElement;
    const r = 13;
    const circumference = 2 * Math.PI * r;

    // Vytvoření SVG kruhu
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

    svg.setAttribute("class", "icon-ring-svg");
    svg.setAttribute("width", "30");
    svg.setAttribute("height", "30");
    svg.setAttribute("viewBox", "0 0 30 30");

    circle.setAttribute("cx", "15");
    circle.setAttribute("cy", "15");
    circle.setAttribute("r", String(r));
    circle.setAttribute("fill", "none");
    circle.setAttribute("stroke", "#22c55e");
    circle.setAttribute("stroke-width", "2.5");
    circle.setAttribute("stroke-linecap", "round");
    circle.setAttribute("stroke-dasharray", String(circumference));
    circle.style.strokeDashoffset = String(circumference);

    svg.appendChild(circle);
    wrapper.appendChild(svg);

    // Spuštění animace kreslení kruhu
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            circle.style.transition = "stroke-dashoffset 0.5s ease";
            circle.style.strokeDashoffset = "0";
        });
    });

    // Po dokončení kruhu — přepni na fajfku
    setTimeout(() => {
        el.classList.replace("fa-circle-plus", "fa-circle-check");
        el.classList.add("icon-check");
        svg.remove();
    }, 550);

}

function showNotification(message) {
    const existing = document.querySelector(".toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 2500);
}

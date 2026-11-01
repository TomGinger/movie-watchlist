import { apiKey, initTheme, toggleTheme } from './config.js';

initTheme();
document.getElementById("theme-toggle").addEventListener("click", toggleTheme);

// DOM prvky
const watchListContainer = document.getElementById("watch-list-container");
const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

async function getWatchlistDetails() {
    if (watchlist.length === 0) {
        watchListContainer.innerHTML = `
            <div class="watch-list-container-empty">
                <p>Your watchlist is looking a little empty...</p>
                <a href="index.html" class="empty-watchlist">
                    <i class="fa-solid fa-circle-plus"></i>
                    <p>Let's add some movies!</p>
                </a>
            </div>`;
        return;
    }

    watchListContainer.innerHTML = "";

    // Načtení detailů všech filmů paralelně
    const movies = await Promise.all(
        watchlist.map(id =>
            fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${id}`).then(r => r.json())
        )
    );

    movies.forEach(moviePost => {
        const posterSrc = moviePost.Poster !== "N/A" ? moviePost.Poster : null;

        watchListContainer.innerHTML += `
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
                                <i class="fa-solid fa-circle-minus" data-id="${moviePost.imdbID}"></i>
                            </span>
                            <p>Watchlist</p>
                        </div>
                    </div>
                    <p>${moviePost.Plot}</p>
                </div>
            </div>`;
    });
}

getWatchlistDetails();

// Odstranění filmů ze seznamu
document.addEventListener("click", (e) => {
    const movieId = e.target.dataset.id;
    if (movieId) animateRemove(e.target);
});

function animateRemove(el) {
    const wrapper = el.parentElement;
    const card = el.closest(".movie-post-container");
    const r = 13;
    const circumference = 2 * Math.PI * r;

    // Vytvoření červeného SVG kruhu
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
    circle.setAttribute("stroke", "#ef4444");
    circle.setAttribute("stroke-width", "2.5");
    circle.setAttribute("stroke-linecap", "round");
    circle.setAttribute("stroke-dasharray", String(circumference));
    circle.style.strokeDashoffset = String(circumference);

    svg.appendChild(circle);
    wrapper.appendChild(svg);

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            circle.style.transition = "stroke-dashoffset 0.5s ease";
            circle.style.strokeDashoffset = "0";
        });
    });

    // Po dokončení kruhu — přepni na X
    setTimeout(() => {
        el.classList.replace("fa-circle-minus", "fa-circle-xmark");
        el.classList.add("icon-remove");
        svg.remove();
    }, 550);

    // Karta vyjede vlevo
    setTimeout(() => card.classList.add("card-removing"), 700);

    // Odstranění z localStorage a re-render
    setTimeout(() => {
        const indexOfId = watchlist.indexOf(el.dataset.id);
        watchlist.splice(indexOfId, 1);
        localStorage.setItem("watchlist", JSON.stringify(watchlist));
        getWatchlistDetails();
    }, 1050);
}

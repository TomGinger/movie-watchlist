// Promněné a výběr DOM prvků
const apiKey = "6fb3e59f"; // API klíč
const inputFilm = document.getElementById("input-film");
const searchBtn = document.getElementById("search-btn");
const postContainer = document.getElementById("post-container");
const watchListContainer = document.getElementById("watch-list-container");
let searchArray = [];

// Udržení stavu stránky při obnovení
document.addEventListener("DOMContentLoaded", () => {
    // Získáme parametry z URL 
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('s');
    
    // Pokud je v URL parametr 's' automaticky vyplníme input a spustíme hledání
    if (query) {
        inputFilm.value = query;
        runSearch(query);
    }
});


searchBtn.addEventListener("click", () => {
    // Uložíme hodnotu do URL historie
    const searchValue = inputFilm.value;
    if (searchValue) {
        //Změníme URL v prohlížeci bez znovunačtení stránky
        const newUrl = `${window.location.pathname}?s=${searchValue}`;
        window.history.pushState({ path: newUrl }, '', newUrl);
        
        // Spustíme hledání
        runSearch(searchValue);
    }
})

async function runSearch(searchValue) {
    //První fetch: získáme seznam filmů podle názvu
    const res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${searchValue}`)
    const data = await res.json(); //Převádíme response na javascript object 
    loopMovies(data);
}


// Zpracování výsledků hledání
function loopMovies(data) {
    try {
        searchArray = [];
        //Naplní pole filmy z výsledků API
        for(let movieData of data.Search) {
            searchArray.push(movieData);
        }
        //Funkce pro vykreslení HTML
        renderMoviePosts(searchArray);          
    } catch(error) {
        //Ošetření chyby pokud API nic nevrátí (např. název filmu neexistuje)
        console.error("Error in fetching data: " + error);
        postContainer.innerHTML = `<div class="post-empty">
        <h2>Unable to find what you´re looking for.<br> Please try another search.</h2>
        </div>`;
    }


}


// Vykreslení HTML na stránku 
function renderMoviePosts(post) {
        postContainer.innerHTML = ""; //Čištění containeru před novým hledáním

        //Pro každý nalezený film děláme druhý fetch, pro získání detailů filmů
        post.forEach(async movie => {
            
            const res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}`)
            const moviePost = await res.json();
            //HTML pro filmy
            postContainer.innerHTML += `
                <div class="movie-post-container">
                    <img src="${moviePost.Poster}">
                    
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
                                <i class="fa-solid fa-circle-plus" data-id="${moviePost.imdbID}"></i>
                                <p>Watchlist</p>
                            </div>
                        </div>
                        <p>${moviePost.Plot}</p>
                    </div>
                </div>`
 
        }); 
}

//Přidání do watchlistu 
document.addEventListener("click", function (e) {
    //zjistíme zda má kliknutý prvek atribut data-id, pokud ano přidámeho pomocí funkce addToWatchList do watchlistu
    const movieId = e.target.dataset.id;
    if(movieId) {
        addToWatchList(movieId);
    }
}) 

//Local storage operace 
function addToWatchList(movieId) {
    //Načteme existující seznam nebo vytvoříme prázdné pole
    let watchList = JSON.parse(localStorage.getItem("watchlist")) || [];
    
    //Kontrola duplicity filmů ve watchlistu
    if(!watchList.includes(movieId)) {
        watchList.push(movieId);
        //Převedení seznamu na string 
        localStorage.setItem("watchlist", JSON.stringify(watchList));
    }else {
        alert("You have already added this film to your watchlist!");
    }
}
// Variables, DOM manipulation
const apiKey = "6fb3e59f";
const inputFilm = document.getElementById("input-film");
const searchBtn = document.getElementById("search-btn");
const postContainer = document.getElementById("post-container");
const watchListContainer = document.getElementById("watch-list-container");
let searchArray = [];

document.addEventListener("DOMContentLoaded", () => {
    // Přečte ?s=nazevfilmu z adresy
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('s');
    
    // Pokud tam něco je, vloží to do inputu a spustí hledání
    if (query) {
        inputFilm.value = query;
        runSearch(query);
    }
});

searchBtn.addEventListener("click", () => {
    // Uložíme hodnotu do URL historie
    const searchValue = inputFilm.value;
    if (searchValue) {
        const newUrl = `${window.location.pathname}?s=${searchValue}`;
        window.history.pushState({ path: newUrl }, '', newUrl);
        
        // Spustíme hledání
        runSearch(searchValue);
    }
})

async function runSearch(searchValue) {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${searchValue}`)
    const data = await res.json();
    loopMovies(data); // Volá tvou původní funkci
}


function loopMovies(data) {
    try {
        searchArray = [];
        for(let movieData of data.Search) {
            searchArray.push(movieData);
        }
        renderMoviePosts(searchArray);          
    } catch(error) {
        console.error("Error in fetching data: " + error);
        postContainer.innerHTML = `<div class="post-empty">
        <h2>Unable to find what you´re looking for.<br> Please try another search.</h2>
        </div>`;
    }


}


// Rendering from the new array that is made by loopMovies function and putting it to UI
function renderMoviePosts(post) {
        postContainer.innerHTML = "";
        post.forEach(async movie => {
            
            const res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}`)
            const moviePost = await res.json();

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

// Catching id of movie to save it in localStorage, chatching it from data-id
document.addEventListener("click", function (e) {
    const movieId = e.target.dataset.id;
    if(movieId) {
        addToWatchList(movieId);
    }
}) 

// Saving movies to localStorage to render them in watchlist

function addToWatchList(movieId) {
    let watchList = JSON.parse(localStorage.getItem("watchlist")) || [];
     
    if(!watchList.includes(movieId)) {
        watchList.push(movieId);
        localStorage.setItem("watchlist", JSON.stringify(watchList));
    }else {
        alert("You have already added this film to your watchlist!");
    }
}
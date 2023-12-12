// Variables, keys and DOM manipulation
const apiKey = "6fb3e59f";
const watchListContainer = document.getElementById("watch-list-container");
const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

const deleteHtml = localStorage.getItem("detectHtml");

// Rendering each movie saved into localStorage 
async function getWatchlistDetails() {
    if(deleteHtml === "true") {
            watchListContainer.innerHTML = "";
    }
    // Looping through the watchlist and make API calls for each movie
    for (const movieId of watchlist) {
        const res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${movieId}`);
        const moviePost = await res.json();
        
        watchListContainer.innerHTML += `
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
                                <i class="fa-solid fa-circle-minus" data-id="${moviePost.imdbID}"></i>
                                <p>Watchlist</p>
                            </div>
                        </div>
                        <p>${moviePost.Plot}</p>
                    </div>
            </div>
        `
    }
}

getWatchlistDetails();


// Deleting movie selected by click on data-id, updating UI and updating localStorage to prevent loading deleted movie when we reload page
document.addEventListener("click", (e) => {
    const movieId = e.target.dataset.id;

    if(movieId) {
        const indexOfId = watchlist.indexOf(movieId);

        watchlist.splice(indexOfId, 1);
        localStorage.setItem("watchlist", JSON.stringify(watchlist));
        getWatchlistDetails();
    }

})
const apiKey = "6fb3e59f";
const watchListContainer = document.getElementById("watch-list-container");

async function getWatchlistDetails() {
    watchListContainer.innerHTML = "";
    const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

    // Loop through the watchlist and make API calls for each movie
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
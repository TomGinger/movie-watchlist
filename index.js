'use strict'
// Variables, keys, DOM manipulation 
const apiKey = "6fb3e59f";
//const imdbId = "tt3896198";
const inputFilm = document.getElementById("input-film");
const searchBtn = document.getElementById("search-btn");
const postContainer = document.getElementById("post-container");
const watchListContainer = document.getElementById("watch-list-container");
let searchArray = [];

//  Search button, when user search for movie title(input.value), gives the value to API call and fetch data from movies API
//  and the data is given to loopMovies function
searchBtn.addEventListener("click", async () => {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${inputFilm.value}`)
    const data = await res.json();

    loopMovies(data);
})

// Looping through data given by movies API call and pushing to new array that data, if user puts invalid input.value,
// its secured to throw error and give him and warning through UI.
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
        localStorage.setItem("detectHtml", "true");
    }else {
        alert("You have already added this film to your watchlist!");
    }
}

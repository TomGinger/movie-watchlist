'use strict'

const apiKey = "6fb3e59f";
//const imdbId = "tt3896198";
const inputFilm = document.getElementById("input-film");
const searchBtn = document.getElementById("search-btn");
const postContainer = document.getElementById("post-container");


let searchArray = [];

    
searchBtn.addEventListener("click", async () => {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${inputFilm.value}`)
    const data = await res.json();
    loopMovies(data); 
           
    inputFilm.value = "";
})

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

function addToLocalStorage(searchArray) {
    const moviesArray = JSON.stringify(searchArray) || [];
    localStorage.setItem("movieSearch", moviesArray);
    const storedData = localStorage.getItem("movieSearch");

    const storedObject = JSON.parse(storedData);
    
    console.log(storedObject);
}





//{Title: "Batman Begins", Year: "2005", Rated: "PG-13", Released: "15 Jun 2005", Runtime: "140 min", Genre: "Action, Crime, Drama", Director: "Christopher Nolan", Writer: "Bob Kane, David S. Goyer, Christopher Nolan", Actors: "Christian Bale, Michael Caine, Ken Watanabe", Plot: "After witnessing his parents' death, Bruce learns the art of fighting to confront injustice. When he returns to Gotham as Batman, he must stop a secret society that intends to destroy the city.", Language: "English, Mandarin", Country: "United States, United Kingdom", Awards: "Nominated for 1 Oscar. 14 wins & 79 nominations total", Poster: "https://m.media-amazon.com/images/M/MV5BOTY4YjI2N2MtYmFlMC00ZjcyLTg3YjEtMDQyM2ZjYzQ5YWFkXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg", Ratings: [{Source: "Internet Movie Database", Value: "8.2/10"}, {Source: "Rotten Tomatoes", Value: "85%"}, {Source: "Metacritic", Value: "70/100"}], Metascore: "70", imdbRating: "8.2", imdbVotes: "1,540,461", imdbID: "tt0372784", Type: "movie", DVD: "09 Sep 2009", BoxOffice: "$206,863,479", Production: "N/A", Website: "N/A", Response: "True"}
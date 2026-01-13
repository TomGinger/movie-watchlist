//Proměnné a výběr DOM prvků
const apiKey = "6fb3e59f"; // API klíč
const watchListContainer = document.getElementById("watch-list-container");
//Načte pole ID filmů z LocalStorage, v případě že localStorage je prázdné použije se prázdné pole
const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

//Rendrování filmů uložených v localStorage
async function getWatchlistDetails() {
    //Ošetření, kdyby seznam byl prázdný
    if(watchlist.length === 0) {
            watchListContainer.innerHTML = `
            <div class="watch-list-container-empty">
                <p>Your watchlist is looking a little empty...</p>
                <a href="index.html" class="empty-watchlist">
                    <i class="fa-solid fa-circle-plus"></i>
                    <p>Let's add some movies!</p>
                </a>
            </div>
        `;
        return;
    }

    watchListContainer.innerHTML = "";

    //Načítání detailů filmů
    //For of loop projíždí každé uložené ID ve watchlistu 
    for (const movieId of watchlist) {
        //Pro každé id je voláno API, abychom získali detaily
        const res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${movieId}`);
        const moviePost = await res.json();
        
        //Definování HTML struktury karty 
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

//Odstranění filmů ze seznamu
document.addEventListener("click", (e) => {
    //Zjištění id filmu, který chceme odstranit
    const movieId = e.target.dataset.id;

    if(movieId) {
        //Zjištění indexu filmu v poli
        const indexOfId = watchlist.indexOf(movieId);
        //Odstranění prvku na nalezené pozici
        watchlist.splice(indexOfId, 1);
        //Aktualizované pole se ukládá do localStorage
        localStorage.setItem("watchlist", JSON.stringify(watchlist));
        //Volání funkce, která nám vyrendruje zmenšený seznam na stránku
        getWatchlistDetails();
    }

})
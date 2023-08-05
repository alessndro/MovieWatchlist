// a3a3c046
let location
const movieInputFormEl = document.getElementById('search-movie-form')

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, get, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"


const appSettings = {
   databaseURL: "https://moviewatchlist-3a722-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const moviesInDB = ref(database, "movies")


if (document.getElementById('results-main-flex-section'))
{
    document.getElementById('results-main-flex-section').addEventListener('click', function(event)
    {
        // If user on main page and click specific movie, showcase movie
        if (event.target.dataset.trendingmovie)
        {
            location = "main-showcase-container"
            renderShowcaseMovie(event.target.dataset.trendingmovie, location)
        }

        // If you are on search page and click specific movie, showcase movie
        if (event.target.dataset.movie)
        {
            location = 'search-showcase-container'
            renderShowcaseMovie(event.target.dataset.movie, location)
        }

        // Add movie to watchlist
        if (event.target.dataset.addmovie) 
        {
            console.log("click add movie")
            addMovieWatchlist(event.target.dataset.addmovie)
        }
    })
}


if (document.getElementById('movie-watchlist-section'))
{
    document.getElementById('movie-watchlist-section').addEventListener('click', function(event)
    {
       console.log("clicked remove movie")
        if (event.target.dataset.remove) 
        {
            console.log("remove movie")
            removeMovieWatchlist(event.target.dataset.remove)
         }
    })   
}



// Render trending movies on main page, put in grid, and first movie in showcase container
function renderTrendingMovies()
    {
        fetch(`http://www.omdbapi.com/?apikey=a3a3c046&s="lord+of+the+rings"&type=movie`)
            .then(response => response.json())
            .then(data => {
                let templateStringTrending = ""
                    data.Search.forEach(function(movie)
                    {
                    templateStringTrending += `<div data-trendingmovie=${movie.imdbID} class="trending-movie-before trending-movie">
                                            <img data-trendingmovie=${movie.imdbID} src=${movie.Poster}></img>
                                            <h5 data-trendingmovie=${movie.imdbID} class="trending-movie-title">${movie.Title}</h5>
                                            <div data-trendingmovie=${movie.imdbID} class="trending-movie-information">
                                                <p>${movie.Year}</p>
                                                <p>${movie.imdbID}</p>
                                            </div>
                                        </div>`
                    })
                    
                    document.getElementById('trending-grid').innerHTML = templateStringTrending
                    
                    // Load first movie in showcase section, make fetch request with id to get more info for showcase
                    fetch(`http://www.omdbapi.com/?apikey=a3a3c046&9&i=${data.Search[0].imdbID}&plot=full`)
                        .then(response => response.json())
                        .then(data => {

                            let templateStringShowcase = ''
                            templateStringShowcase += `<div class="showcase-div">
                                                        <img src=${data.Poster}></img>
                                                        <div class="showcase-title-div">
                                                            <h3 class="trending-movie-title">${data.Title}</h3>
                                                            <p> ★ ${data.imdbRating}</p>
                                                        </div>
                                                        <div class="showcase-info-div">
                                                            <p>${data.Year}</p>
                                                            <p>${data.Genre}</p>
                                                            <p>${data.Runtime}</p>
                                                        </div>
                                                        <p>${data.Plot}</p>
                                                        <button id="add-watchlist-btn" data-addmovie=${data.imdbID}>Add to watchlist</button>
                                                    </div>`
                            document.getElementById('main-showcase-container').innerHTML = templateStringShowcase })
            })
    }


function renderShowcaseMovie(movieId, location)
{
    fetch(`http://www.omdbapi.com/?apikey=a3a3c046&9&i=${movieId}&plot=full`)
        .then(response => response.json())
        .then(data => {
            let templateStringShowcase = ''
            templateStringShowcase += `<div class="showcase-div">
                                        <img src=${data.Poster}></img>
                                        <div class="showcase-title-div">
                                            <h3 class="trending-movie-title">${data.Title}</h3>
                                            <p> ★ ${data.imdbRating}</p>
                                        </div>
                                        <div class="showcase-info-div">
                                            <p>${data.Year}</p>
                                            <p>${data.Genre}</p>
                                            <p>${data.Runtime}</p>
                                        </div>
                                        <p>${data.Plot}</p>
                                        <button id="add-watchlist-btn" data-addmovie=${data.imdbID}>Add to watchlist</button>
                                    </div>`
            document.getElementById(location).innerHTML = templateStringShowcase
            document.getElementById(location).scrollIntoView({
                behavior: "smooth",
            });
        })

}

if (movieInputFormEl)
{
    movieInputFormEl.addEventListener('submit', function(event){
        event.preventDefault()

        const movieFormData = new FormData(movieInputFormEl)
        const movieTitle = movieFormData.get('title')
        document.getElementById('waiting-svg').innerHTML = `<img src="/images/spinning-circles.svg">`
        document.getElementById("showing-loading-icons").classList.remove('hidden')
        document.getElementById("waiting-svg").classList.remove('hidden')
        document.getElementById('results-main-flex-section').classList.remove("hidden")

        fetch(`http://www.omdbapi.com/?apikey=a3a3c046&s=${movieTitle}&type=movie`)
            .then(response => response.json())
            .then(data => {
                let templateString = ""
                setTimeout(function(){
                    data.Search.forEach(function(movie)
                    {
                    templateString += `<div data-movie=${movie.imdbID} class="trending-movie-before trending-movie">
                                            <img data-movie=${movie.imdbID} src=${movie.Poster}></img>
                                            <h5 data-movie=${movie.imdbID} class="trending-movie-title">${movie.Title}</h5>
                                            <div data-movie=${movie.imdbID} class="trending-movie-information">
                                                <p>${movie.Year}</p>
                                                <p>${movie.imdbID}</p>
                                            </div>
                                        </div>`
                    })

                    // Remove loading icon, add items to grid
                    document.getElementById("showing-loading-icons").classList.add('hidden')
                    document.getElementById("waiting-svg").classList.add('hidden')
                    document.getElementById('search-results-grid').innerHTML = templateString 
                    document.getElementById('results-main-flex-section').classList.remove("hidden")
                    
                    // Load first movie in showcase section, make fetch request with id to get more info for showcase
                    fetch(`http://www.omdbapi.com/?apikey=a3a3c046&9&i=${data.Search[0].imdbID}&plot=full`)
                        .then(response => response.json())
                        .then(data => {

                            let templateStringShowcase = ''
                            templateStringShowcase += `<div class="showcase-div">
                                                        <img src=${data.Poster}></img>
                                                        <div class="showcase-title-div">
                                                            <h3 class="trending-movie-title">${data.Title}</h3>
                                                            <p> ★ ${data.imdbRating}</p>
                                                        </div>
                                                        <div class="showcase-info-div">
                                                            <p>${data.Year}</p>
                                                            <p>${data.Genre}</p>
                                                            <p>${data.Runtime}</p>
                                                        </div>
                                                        <p>${data.Plot}</p>
                                                        <button id="add-watchlist-btn" data-addmovie=${data.imdbID}>Add to watchlist</button>
                                                    </div>`
                            document.getElementById('search-showcase-container').innerHTML = templateStringShowcase })
                            document.getElementById('search-showcase-container').scrollIntoView({
                                behavior: "smooth",
                            });
                        
                              
                    movieInputFormEl.reset()
                },3000)
            })
    })
}

function addMovieWatchlist(movieId)
{
    get(moviesInDB)
        .then((snapshot) => {
            if (snapshot.exists()) {
                console.log('### INSIDE SNAPSHOT ###')
                let moviesArray = Object.values(snapshot.val())
                console.log(moviesArray)
                if (!moviesArray.includes(movieId))
                {
                    push(moviesInDB, movieId)
                }
                    console.log("movie already added")
                    // document.getElementById("add-watchlist-btn").disabled = true
                    document.getElementById("add-watchlist-btn").style.backgroundColor = "gray"
                    document.getElementById("add-watchlist-btn").style.color = "white"
                    document.getElementById("add-watchlist-btn").style.cursor = "default"
                    document.getElementById("add-watchlist-btn").textContent = "Already added"
            }
            else {
                push(moviesInDB, movieId)
            }
        })
}

function removeMovieWatchlist(movieId){
    
    
    get(moviesInDB)
        .then((snapshot) => {
            if (snapshot.exists()) {
                console.log('### INSIDE SNAPSHOT ###')
                let moviesArray = Object.entries(snapshot.val())
                
                moviesArray.forEach( item => {
                    console.log(item)
                    if (item[1] === movieId)
                    {
                        let exactLocation = ref(database, `movies/${item[0]}`)
                        remove(exactLocation)
                    }
                })
                console.log('### inside movie render watchlist after removal')
                console.log(Object.entries(snapshot.val()))
                renderMovieWatchlist()
            }
        })
}       



function renderMovieWatchlist()
{
    onValue(moviesInDB, function(snapshot)
    {
        if(snapshot.exists())
        {
            let moviesArrayId = Object.values(snapshot.val())

            console.log('### Render movie watchlist')
            console.log(Object.values(snapshot.val()))
            // Create an array to store the promises returned by the fetch requests
            const fetchPromises = moviesArrayId.map(function(movieId) {
                return fetch(`http://www.omdbapi.com/?apikey=a3a3c046&i=${movieId}&plot=full`)
                .then(response => response.json());
            });
            
            // Use Promise.all to wait for all the fetch requests to complete
            Promise.all(fetchPromises)
                .then(dataArray => {
                // Once all fetch requests are completed, build the template string
                let templateStringWatchlist = "";
                dataArray.forEach(data => {
                    templateStringWatchlist += `<div class="showcase-watchlist-div">
                                                    <div class="img-wrapper">
                                                        <img src=${data.Poster}></img>
                                                    </div>
                                                    <div class="showcase-watchlist-title-div">
                                                        <h3 class="watchlist-movie-title">${data.Title}</h3>
                                                        <p> ★ ${data.imdbRating}</p>
                                                    </div>
                                                    <div class="showcase-watchlist-info-div">
                                                        <p>${data.Year}</p>
                                                        <p>${data.Genre}</p>
                                                        <p>${data.Runtime}</p>
                                                    </div>
                                                    <button id="remove-watchlist-btn" data-remove=${data.imdbID}>Remove</button>
                                                </div>`
                });
                
                // After building the template string, update the innerHTML once
                document.getElementById("watchlist-results-grid").innerHTML = templateStringWatchlist;
                })
                .catch(error => {
                console.error("Error fetching movie data:", error);
                });

        }
        else {
            document.getElementById("watchlist-results-grid").innerHTML = `<p>No movies added</p>`; 
        }
    }) 
}


renderTrendingMovies()
renderMovieWatchlist()
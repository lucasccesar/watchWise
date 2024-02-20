const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});
const query = params.query;
const media_type = params.media_type;
const API_KEY = 'api_key=59fa1df362aba6e085744095198c2402';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/original';
const div = document.getElementById('searchResults');
const title = document.getElementById('resultsTitle');

title.innerText = `Results For: ${query}`;

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1OWZhMWRmMzYyYWJhNmUwODU3NDQwOTUxOThjMjQwMiIsInN1YiI6IjY0ZWJhOTA3YzYxM2NlMDBlYWE5YWUzOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.H_LhjbrrBxrFa4FEiXXPt4VPn6xDyzvdtiZJ28820uk',
    },
};

/*=============== SEARCH ===============*/
const search = document.getElementById('search'),
    searchBtn = document.getElementById('search-btn');

/* Search show */
searchBtn.addEventListener('click', () => {
    search.classList.add('show-search');
    document.getElementById('searchInput').focus();
});

/* Search hidden */
search.addEventListener('click', (event) => {
    if (event.target == search) {
        search.classList.remove('show-search');
    }
});

async function main() {
    let resultsMovies = await fetch(`https://api.themoviedb.org/3/search/movie?query=${query}&page=1`, options).then((response) => response.json());
    resultsMovies.results.forEach((element) => {
        element.media_type = 'movie';
    });
    let resultsShows = await fetch(`https://api.themoviedb.org/3/search/tv?query=${query}&page=1`, options).then((response) => response.json());
    resultsShows.results.forEach((element) => {
        element.media_type = 'tv';
    });
    let results = [];

    if (media_type == 'moviesAndShows') {
        results = [...resultsMovies.results, ...resultsShows.results];
    } else if (media_type == 'movies') {
        results = [...resultsMovies.results];
    } else if (media_type == 'shows') {
        results = [...resultsShows.results];
    }
    results.sort((a, b) => Number(b.vote_count) - Number(a.vote_count));

    for (let i = 0; i < results.length; i++) {
        let divMovies = document.createElement('div');
        divMovies.classList.add('movie');
        divMovies.addEventListener('click', openR);
        divMovies.dataset.id = `${results[i].id}`;
        divMovies.dataset.type = results[i].media_type;
        let movieImgCount = 0;
        let movieImg = await fetch(`https://api.themoviedb.org/3/${results[i].media_type}/${results[i].id}/images`, options).then((response) => response.json());

        for (let i = 0; i < movieImg.backdrops.length; i++) {
            if (movieImg.backdrops[i].iso_639_1 == 'en' && movieImgCount == 0 && movieImg.backdrops.length > 0) {
                movieImgCount = 1;
                movieImgPath = movieImg.backdrops[i].file_path;
            }
        }
        if (movieImgCount == 0 && movieImg.backdrops.length > 0) {
            movieImgPath = movieImg.backdrops[0].file_path;
        }
        divMovies.innerHTML = `
        <div class="movieBackdrop" style="background-image: url('${IMG_URL + movieImgPath}')"></div>
        <div class="movieInfo"><p class="title">${
            results[i].media_type == 'movie' ? results[i].title : results[i].name
        }</p><svg xmlns="http://www.w3.org/2000/svg" height="2rem" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><style>svg{fill:#ffffff}</style><path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/></svg></div>
        `;
        div.appendChild(divMovies);
    }
}

main();

function openR(event) {
    if (event.target.dataset.id != undefined) {
        movieId = event.target.dataset.id;
        if (event.target.dataset.type == 'movie') {
            site = 'watchMovies.html?id=' + movieId;
        } else {
            site = 'watchShows.html?id=' + movieId;
        }
        window.location.href = site;
    } else {
        movieId = event.target.parentElement.dataset.id;
        if (event.target.parentElement.dataset.type == 'movie') {
            site = 'watchMovies.html?id=' + movieId;
        } else {
            site = 'watchShows.html?id=' + movieId;
        }
        window.location.href = site;
    }
}

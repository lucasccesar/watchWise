const bgImg = document.getElementById('bgImg');
const imgUrl = 'https://image.tmdb.org/t/p/original';
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1OWZhMWRmMzYyYWJhNmUwODU3NDQwOTUxOThjMjQwMiIsInN1YiI6IjY0ZWJhOTA3YzYxM2NlMDBlYWE5YWUzOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.H_LhjbrrBxrFa4FEiXXPt4VPn6xDyzvdtiZJ28820uk',
    },
};
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');
var diretores = [];
const diretor = document.getElementById('diretores');
const nome = document.getElementById('nome');
const generos = document.getElementById('generos');
const rating = document.getElementById('rating');
const release = document.getElementById('release');
const budget = document.getElementById('budget');
const length = document.getElementById('length');
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var mes = '';
var releaseDate = '';
var data = '';
const description = document.getElementById('description');
const cast = document.getElementById('cast');
var j = 0;
const filme = document.getElementById('filme');
const play = document.getElementById('play');
play.addEventListener('click', abrir);
const iframe = document.getElementById('iframe');
const mainHtml = document.querySelector('main');
var similarFull = [];
var similar = [];
const similarMovies = document.getElementById('similarMovies');
let expandSearch = document.getElementById('expandSearch');
let isSearchExpanded = false;
let search = document.querySelector('#searchBar');

expandSearch.addEventListener('click', () => {
    if (window.getComputedStyle(document.getElementById('searchBarWrapper')).getPropertyValue('display') != 'none') {
        if (isSearchExpanded) {
            document.getElementById('searchBarWrapper').style.width = '0rem';
            isSearchExpanded = false;
        } else {
            document.getElementById('searchBarWrapper').style.width = '37rem';
            isSearchExpanded = true;
        }
    } else {
        if (isSearchExpanded) {
            document.getElementById('searchBarWrapperMobile').style.width = '0vw';
            isSearchExpanded = false;
        } else {
            document.getElementById('searchBarWrapperMobile').style.width = '81vw';
            isSearchExpanded = true;
        }
    }
});

async function main() {
    var info = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=en-US`, options).then((response) => response.json());
    nome.innerText = info.title;

    window.top.document.title = 'Watch ' + info.title;

    var img = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/images`, options).then((response) => response.json());

    var foto = img.backdrops[0].file_path;
    var fotoLink = imgUrl + foto;
    bgImg.style.backgroundImage = `-webkit-linear-gradient(bottom, rgba(5, 21, 30, 1) 0%, rgba(0, 0, 0, 0) 30%), url('${fotoLink}')`;

    var credits = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`, options).then((response) => response.json());

    for (let i = 0; i < credits.crew.length; i++) {
        if (credits.crew[i].job == 'Director' && diretores.length < 2) {
            diretores[diretores.length] = credits.crew[i].name;
        }
    }
    diretores.forEach((e) => {
        var d = document.createElement('p');
        d.innerText = e;
        diretor.appendChild(d);
    });

    info.genres.forEach((e) => {
        var genero = document.createElement('p');
        genero.innerText = e.name;
        genero.classList.add('genero');
        generos.appendChild(genero);
    });

    var votosAvg = info.vote_average;
    var votosRating = votosAvg.toFixed(2);
    rating.innerText = votosRating;

    releaseDate = info.release_date.split('-');
    mes = months[parseInt(releaseDate[1] - 1)];
    data = mes + ' ' + releaseDate[2] + ', ' + releaseDate[0];
    release.innerText = data;

    budget.innerText = '$' + info.budget / 1000000 + 'M';

    length.innerText = info.runtime + ' min';

    description.innerText = info.overview;

    credits.cast.forEach((e) => {
        if (j < 12) {
            var actor = document.createElement('div');
            actor.classList.add('actor');

            var face = document.createElement('div');
            face.classList.add('face');
            if (e.profile_path != null) {
                var faceImg = imgUrl + e.profile_path;
                face.style.backgroundImage = `url("${faceImg}")`;
            } else {
                face.style.backgroundImage = `url("https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRkmcrd-1DlsghkUmszTsMtJtjTj2avxELvWWjDfbIrqboIQMdL")`;
                face.classList.replace('face', 'guest');
            }

            actor.appendChild(face);

            var nome = document.createElement('p');
            nome.innerText = e.name;
            actor.appendChild(nome);

            cast.appendChild(actor);
            j++;
        }
    });

    let k = 0;
    for (let h = 1; h < 6; h++) {
        similar = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/similar?language=en-US&page=${h}`, options)
            .then((res) => res.json())
            .then((data) => {
                return data.results;
            });
        for (let i = 0; i < 20; i++) {
            similarFull[k + i] = similar[i];
        }
        k += 20;
    }

    similarFull.sort((a, b) => Number(b.vote_count) - Number(a.vote_count));

    jsonObject = similarFull.map(JSON.stringify);
    uniqueSet = new Set(jsonObject);
    uniqueSimilar = Array.from(uniqueSet).map(JSON.parse);

    for (let i = uniqueSimilar.length; i > 7; i--) {
        uniqueSimilar.pop();
    }

    uniqueSimilar.forEach((movie) => {
        const { title, poster_path, vote_average, id } = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.classList.add('gradient-border');
        movieEl.id = `${id}`;
        movieEl.innerHTML = `
        
        <div id="img${id}" class="imagem"></div>
        `;

        similarMovies.appendChild(movieEl);

        var imgId = document.getElementById(`img${id}`);
        imgId.style.backgroundImage = `url("${imgUrl + poster_path}")`;
        imgId.style.backgroundSize = `cover`;
        imgId.addEventListener('click', abrirSimilar);
        console.log(poster_path)
    });
}

main();

function getColor(vote) {
    if (vote >= 8) {
        return 'green';
    } else if (vote >= 5) {
        return 'orange';
    } else {
        return 'red';
    }
}

function abrir() {
    iframe.src = `https://vidsrc.to/embed/movie/${movieId}`;
    bgImg.classList.replace('fechadoImg', 'abertoImg');
    iframe.classList.replace('iframeFechado', 'iframeAberto');
    mainHtml.classList.replace('top200', 'top');
}

function abrirSimilar(event) {
    var similarMovieId = event.target.offsetParent.id;
    site = 'watchMovies.html?id=' + similarMovieId;
    window.location.href = site;
}

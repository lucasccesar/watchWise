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
const iframe = document.getElementById('iframe');
const mainHtml = document.querySelector('main');
var similarFull = [];
var similar = [];
const similarMovies = document.getElementById('similarMovies');
const avancar = document.getElementById('avancar');
const anterior = document.getElementById('anterior');
avancar.addEventListener('click', proximo);
anterior.addEventListener('click', voltar);
var current = 0;
const seasons = document.getElementById('seasons');
const episodes = document.getElementById('episodes');
var divCount = 0;
var episodesCount = 0;
var divCountFloat = 0;
var epNum = 0;
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
    var info = await fetch(`https://api.themoviedb.org/3/tv/${movieId}?language=en-US`, options).then((response) => response.json());
    if (info.seasons[0].name == 'Specials') {
        var seasonsNum = info.seasons.length - 1;
    } else {
        var seasonsNum = info.seasons.length;
    }
    nome.innerText = info.name;

    seasonFunc();

    window.top.document.title = 'Watch ' + info.name;

    var img = await fetch(`https://api.themoviedb.org/3/tv/${movieId}/images`, options).then((response) => response.json());

    var foto = img.backdrops[0].file_path;
    var fotoLink = imgUrl + foto;
    bgImg.style.backgroundImage = `-webkit-linear-gradient(bottom, rgba(5, 21, 30, 1) 0%, rgba(0, 0, 0, 0) 30%), url('${fotoLink}')`;

    if (info.seasons[0].name == 'Specials') {
        for (let i = 0; i < seasonsNum; i++) {
            var option = document.createElement('option');
            option.value = `${i + 1}`;
            option.innerHTML = `${info.seasons[i + 1].name}`;
            seasons.appendChild(option);
        }
    } else {
        for (let i = 0; i < seasonsNum; i++) {
            var option = document.createElement('option');
            option.value = `${i + 1}`;
            option.innerHTML = `${info.seasons[i].name}`;
            seasons.appendChild(option);
        }
    }

    /* var credits = await fetch(`https://api.themoviedb.org/3/tv/${movieId}/credits?language=en-US`, options).then((response) => response.json()); */
    var creditsA = await fetch(`https://api.themoviedb.org/3/tv/${movieId}/aggregate_credits?language=en-US`, options).then((response) => response.json());
    var creditsCast = creditsA.cast;
    var creditsCrew = creditsA.crew;
    creditsCast.sort((a, b) => Number(b.total_episode_count) - Number(a.total_episode_count));
    creditsCrew.sort((a, b) => Number(b.popularity) - Number(a.popularity));

    for (let i = 0; i < info.created_by.length; i++) {
        if (diretores.length < 2) {
            diretores[diretores.length] = info.created_by[i].name;
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
    var votosRating = votosAvg.toFixed(1);
    rating.innerText = votosRating;

    releaseDate = info.first_air_date.split('-');
    mes = months[parseInt(releaseDate[1] - 1)];
    data = mes + ' ' + releaseDate[2] + ', ' + releaseDate[0];
    release.innerText = data;

    budget.innerText = info.status;

    length.innerText = info.number_of_episodes;

    description.innerText = info.overview;

    creditsCast.forEach((e) => {
        if (j < 12 && e.known_for_department == 'Acting') {
            var actor = document.createElement('div');
            actor.classList.add('actor');
            actor.dataset.id = e.id;

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

            var character = document.createElement('p');
            character.innerText = `(${e.roles[0].character})`;
            character.classList.add('character');
            actor.appendChild(character);

            cast.appendChild(actor);
            j++;
        }
    });

    let k = 0;
    for (let h = 1; h < 6; h++) {
        similar = await fetch(`https://api.themoviedb.org/3/tv/${movieId}/similar?language=en-US&page=${h}`, options)
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
    });

    var actorMovies = await fetch('https://api.themoviedb.org/3/person/59410/movie_credits?language=en-US', options).then((response) => response.json());
    var actorMoviesActing = [...actorMovies.cast];
    actorMoviesActing = actorMoviesActing.filter((object) => {
        return object.backdrop_path != null;
    });
    actorMoviesActing.sort((a, b) => Number(b.vote_count) - Number(a.vote_count));

    var actorMoviesJob = [...actorMovies.crew];
    actorMoviesJob = actorMoviesJob.filter((object) => {
        return object.backdrop_path != null;
    });
    actorMoviesJob.sort((a, b) => Number(b.vote_count) - Number(a.vote_count));

    var actorShows = await fetch('https://api.themoviedb.org/3/person/59410/tv_credits?language=en-US', options).then((response) => response.json());
    var actorShowsActing = [...actorShows.cast];
    actorShowsActing = actorShowsActing.filter((object) => {
        return object.backdrop_path != null;
    });
    actorShowsActing.sort((a, b) => Number(b.episode_count) - Number(a.episode_count));
    console.log(actorShowsActing);

    var actorShowsJob = [...actorShows.crew];
    actorShowsJob = actorShowsJob.filter((object) => {
        return object.backdrop_path != null;
    });
    actorShowsJob.sort((a, b) => Number(b.episode_count) - Number(a.episode_count));
}

main();

async function seasonFunc() {
    current = 0;
    episodes.innerHTML = '';
    episodes.style.transform = `translateX(0)`;
    avancar.style.visibility = 'visible';
    anterior.style.visibility = 'hidden';
    var seasonInfo = await fetch(`https://api.themoviedb.org/3/tv/${movieId}/season/${seasons.value == '' ? 1 : seasons.value}?language=en-US`, options).then((response) => response.json());
    episodesCount = seasonInfo.episodes.length;
    divCount = Math.ceil(episodesCount / 4);
    divCountFloat = episodesCount / 4;
    var count = 0;
    for (let i = 0; i < episodesCount; i++) {
        var episodeInfo = await fetch(`https://api.themoviedb.org/3/tv/${movieId}/season/${seasons.value == '' ? 1 : seasons.value}/episode/${i + 1}?language=en-US`, options).then((response) => response.json());
        let divEp = document.createElement('div');
        divEp.id = `${i + 1}`;
        divEp.addEventListener('mouseenter', hover);
        divEp.addEventListener('mouseleave', leave);
        /* divEp.addEventListener('click', abrir); */
        divEp.classList.add('episode');
        let divImg = document.createElement('div');
        let divInfo = document.createElement('div');
        divImg.style.backgroundImage = `url('${imgUrl + episodeInfo.still_path}')`;
        divImg.classList.add('episodeImg');
        /* divImg.style.filter = 'grayscale(70%)'; */
        divEp.appendChild(divImg);
        episodes.appendChild(divEp);
        divInfo.classList.add('episodeInfo');
        divInfo.innerHTML = `
                    <span class="material-symbols-outlined" id="playEp">play_circle</span>
                    <div class="episodeInfoClass">
                    <p class="epNum">EP${i + 1} - ${episodeInfo.name}</p>
                    <p>${episodeInfo.runtime} min</p>
                    </div>
                    
                    `;
        divEp.appendChild(divInfo);
    }
}

function proximo() {
    if (current < (episodesCount % 4 == 0 ? episodesCount / 4 - 1 : Math.floor(episodesCount / 4))) {
        current++;
        if (current >= (episodesCount % 4 == 0 ? episodesCount / 4 - 1 : Math.floor(episodesCount / 4))) {
            avancar.style.visibility = 'hidden';
        }
    }
    anterior.style.visibility = 'visible';
    episodes.style.transform = `translateX(${-current * 78}vw)`;
}

function voltar() {
    if (current > 0) {
        current--;
        if (current == 0) {
            anterior.style.visibility = 'hidden';
        }
    }
    avancar.style.visibility = 'visible';
    episodes.style.transform = `translateX(${-current * 78}vw)`;
}

function getColor(vote) {
    if (vote >= 8) {
        return 'green';
    } else if (vote >= 5) {
        return 'orange';
    } else {
        return 'red';
    }
}

function abrirSimilar(event) {
    var similarMovieId = event.target.offsetParent.id;
    site = 'watchShows.html?id=' + similarMovieId;
    window.location.href = site;
}

function hover(event) {
    event.target.children[0].style.filter = 'grayscale(0%)';
}

function leave(event) {
    event.target.children[0].style.filter = 'grayscale(70%)';
}

function abrir(event) {
    window.scrollTo(0, bgImg);
    if (event.target.classList[0] == 'episodeImg' || event.target.classList[0] == 'episodeInfo') {
        epNum = event.target.parentElement.id;
    } else if (event.target.nodeName == 'SPAN' || event.target.nodeName == 'DIV') {
        epNum = event.target.parentElement.parentElement.id;
    } else if (event.target.nodeName == 'P') {
        epNum = event.target.parentElement.parentElement.parentElement.id;
    }
    iframe.src = `https://vidsrc.to/embed/tv/${movieId}/${seasons.value}/${epNum}`;
    bgImg.classList.replace('fechadoImg', 'abertoImg');
    iframe.classList.replace('iframeFechado', 'iframeAberto');
    mainHtml.classList.replace('top200', 'top');
}

/* async function seasonInfo(id) {
    document.getElementById(`selectEpisode${id}`).innerHTML = '';
    var seasonNum = document.getElementById(`selectSeason${id}`).value;
    var select2 = document.getElementById(`selectEpisode${id}`);
    var y = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${seasonNum}?language=en-US&${API_KEY}`)
        .then((response) => response.json())
        .catch((err) => console.error(err));
    for (i = 0; i < y.episodes.length; i++) {
        var option = document.createElement('option');
        option.value = `${i + 1}`;
        option.innerHTML = `Episódio ${i + 1}`;
        select2.appendChild(option);
    }
} */

/* const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');
const body = document.querySelector("body")
const vidsrc = "https://vidsrc.to/embed/movie/"

function getIP(){
    var ip = fetch('https://api.ipify.org?format=json')
   .then(response => response.json())
   .then(data => data.ip);

   return ip
}

async function main() {
    var ip = await getIP()
    console.log(ip)
    if(ip=='179.189.246.61'){
        console.log("alou")
    } else{
        console.log("intruso")
    }
}

main()

var iframe = document.createElement("iframe")
iframe.src = vidsrc + movieId
iframe.height = "500"
iframe.width = "900"
iframe.title = "filme"
body.appendChild(iframe)
 */

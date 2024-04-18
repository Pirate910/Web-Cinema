
const API_KEY = "563d4c06-0268-4224-82bf-030bd575042a";
const API_URL_POPULAR = "https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_250_MOVIES&page=1";
const API_URL_SEARCH = "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";
const API_URL_DETAILS="https://kinopoiskapiunofficial.tech/api/v2.2/films/"

getFilms(API_URL_POPULAR);

async function getFilms(url){
  const resp = await fetch(url,{
    headers: {
      'accept': 'application/json',
      'X-API-KEY': API_KEY,
    },
  });

  const respData = await resp.json();
  console.log(respData);
  showFilms(respData);
}


function GetClassByRate(vote){
  if(vote >= 7){
    return "blue";
  } else if(vote > 5){
    return "yellow";
  } else{
    return "red";
  }
}

function showFilms(data){
  console.log(data);
  const filmsEl = document.querySelector('.films');
  document.querySelector('.films').innerHTML = ''

  if(data.items && Array.isArray(data.items)){
    
  data.items.forEach((item) => {
    const filmEl = document.createElement('li');
    filmEl.classList.add('film__item');
    filmEl.innerHTML = 
    `<a href="#" class="film__item-link">
    <div class="film__cover-inner">
      <img class="film__image" src="${item.posterUrlPreview}" alt="${item.nameRU}">
      <div class="film__image-curtain"></div>
    </div>
    <div class="film__info">
      <h3 class="film__info-title">${item.nameRu}</h3>
      <div class="film__info-category info-category__item">
        ${item.genres.map((genre) => ` ${genre.genre}`)}
      </div>
    </div>
    <div class="film__rate film__rate--${GetClassByRate(item.ratingKinopoisk)}">${item.ratingKinopoisk}</div>
  </a>`;
  filmEl.addEventListener("click", () => openModal(item.kinopoiskId))
  filmsEl.appendChild(filmEl);
  }); 
  } else if(data.films && Array.isArray(data.films)){
  data.films.forEach((film) => {
    const filmEl = document.createElement('li');
    filmEl.classList.add('film__item');
    filmEl.innerHTML = 
    `<a href="#" class="film__item-link">
    <div class="film__cover-inner">
      <img class="film__image" src="${film.posterUrlPreview}" alt="${film.nameRU}">
      <div class="film__image-curtain"></div>
    </div>
    <div class="film__info">
      <h3 class="film__info-title">${film.nameRu}</h3>
      <div class="film__info-category info-category__item">
        ${film.genres.map((genre) => ` ${genre.genre}`)}
      </div>
    </div>
    <div class="film__rate film__rate--${GetClassByRate(film.rating)}">${film.rating}</div>
  </a>`;
  
  filmEl.addEventListener("click", () => openModal(film.filmId))
  filmsEl.appendChild(filmEl);
  }); 
  }
}

const form = document.querySelector('form');
const search = document.querySelector('.header__search');

form.addEventListener('submit', (e)=>{
  e.preventDefault();

  const apiSearch = `${API_URL_SEARCH}${search.value}`;

  if(search.value){
    getFilms(apiSearch);
  }

});

const modalEl = document.querySelector('.modal');

async function openModal(id){

const resp = await fetch(API_URL_DETAILS + id, {
  headers: {
   'accept': 'application/json',
    'X-API-KEY': API_KEY,
  },
});

const respData = await resp.json();

console.log(id)
modalEl.classList.add ('modal--show');

modalEl.innerHTML = `
  <div class="modal__card">
  <div class="modal__image"><img class="modal__movie-backdrop" src="${respData.posterUrl}" alt=""></div>
  <h2 class="modal__name-card">
    <span class="modal__movie-title">Название: ${respData.nameRu}</span>
    <span class="modal__movie-release-year">год: ${respData.year}</span>
  </h2>
  <ul class="modal__movie-info">
    <div class="loader"></div>
    <li class="modal__info-item movie-genre">Жанр: ${respData.genres.map((genre) => `${genre.genre}`)}</li>
    <li class="modal__info-item movie-runtime">Время: ${respData.filmLength + ' min'}</li>
    <li class="modal__info-item movie-link">Ссылка: <a href="${respData.webUrl}">${respData.webUrl}</a></li>
    <li class="modal__info-item movie-description">Описание: ${respData.description}</li>
  </ul>
  <button type="button" class="modal__movie-close">Закрыть</button>
  </div>
`

window.addEventListener("click", (e) => {
  if(e.target == modalEl){
    closeModal();
  }
});

window.addEventListener("keydown", (e) => {
  if(e.keyCode === 27){
    closeModal();
  }
});


function closeModal(){
  modalEl.innerHTML = ''
  modalEl.classList.remove ('modal--show');
} 

const btnClose = document.querySelector('.modal__movie-close');
btnClose.addEventListener('click', function(){
  closeModal();
})
}

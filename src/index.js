import { mapMovie } from './helpers/mapMovie.js';

// Components
import './components/currentYear.js';
import './components/movieCard.js';

const resultsContainer = document.querySelector('.results__grid');
const form = document.querySelector('.search__form');
const input = document.querySelector('.search__input');

// Активация поиска

const main = document.querySelector('.main');
const activateSearch = () => {
  main.classList.add('search_active');
};

activateSearch();

// Рендер

const render = (movieData) => {
  const movie = document.createElement('movie-card');

  movie.poster = movieData.poster;
  movie.title = movieData.title;
  movie.year = movieData.year;
  movie.link = movieData.link;

  return movie;
};

const search = async (searchTerm) => {
  resultsContainer.innerHTML = '';

  const response = await fetch(`http://www.omdbapi.com/?apikey=dfc2dae4&type=movie&s=${searchTerm}`);
  const { Search } = await response.json();
  const movies = Search.map((result) => render(mapMovie(result)));

  const fragment = document.createDocumentFragment();

  movies.forEach((movie) => fragment.appendChild(movie));
  resultsContainer.appendChild(fragment);
};

const subscribeToSubmit = () => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    search(input.value);
  });
};

subscribeToSubmit();

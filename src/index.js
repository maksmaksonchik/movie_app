import { mapMovie } from './helpers/mapMovie.js';

// Components
import './components/currentYear.js';
import './components/movieCard.js';

// Активация поиска

const search = document.querySelector('.main');
const activateSearch = () => {
  search.classList.add('search_active');
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

const resultsContainer = document.querySelector('.results__grid');

const main = async () => {
  const { Search } = await fetch('./src/data.json').then((r) => r.json());
  const movies = Search.map((result) => render(mapMovie(result)));

  const fragment = document.createDocumentFragment();

  movies.forEach((movie) => fragment.appendChild(movie));
  resultsContainer.appendChild(fragment);
};

main();

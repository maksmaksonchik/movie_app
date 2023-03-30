import { mapMovie } from './helpers/mapMovie.js';

// Components
import './components/currentYear.js';

const movieTemplate = document.querySelector('#movie');

const render = (movieData) => {
  const movie = movieTemplate.content.cloneNode(true);

  const link = movie.querySelector('.movie');
  const title = movie.querySelector('.movie__name');
  const poster = movie.querySelector('.movie__poster');
  const year = movie.querySelector('.movie__year');
  const genre = movie.querySelector('.movie__genres');
  const rating = movie.querySelector('.movie__rating');

  poster.src = movieData.poster;
  title.textContent = movieData.title;
  year.textContent = movieData.year;
  link.href = movieData.link;

  return movie;
};

const resultsContainer = document.querySelector('.results__grid');

const search = document.querySelector('.main');
const activateSearch = () => {
  search.classList.add('search_active');
};

activateSearch();

const main = async () => {
  const { Search } = await fetch('./src/data.json').then((r) => r.json());
  const movies = Search.map((result) => render(mapMovie(result)));

  const fragment = document.createDocumentFragment();

  movies.forEach((movie) => fragment.appendChild(movie));
  resultsContainer.appendChild(fragment);
};

main();

// Helpers
import mapMovie from './helpers/mapMovie.js';
import getDeclension from './helpers/getDeclension.js';

// Components
import './components/currentYear.js';
import './components/movieCard.js';

// Nodes
const resultsContainer = document.querySelector('.results__grid');
const resultsMessage = document.querySelector('.results__message');

const form = document.querySelector('.search__form');
const input = document.querySelector('.search__input');

// Активация строки поиска

const main = document.querySelector('.main');
const activateSearch = () => {
  main.classList.add('search_active');
};

activateSearch();

// Склонения

const declensionedMovies = getDeclension('фильм', 'фильма', 'фильмов');

// Создание хранилища

let state = {
  count: 0,
  results: [],
  error: false,
  searches: [
    'dreamers',
    'europa',
    'before sunrise',
    'dogma',
    'stealing beauty',
  ],
};

const setState = (update) => {
  state = { ...state, ...update };
  return state;
};

const getState = () => state;

// Поиск по запросу
// (обнуляет счетчик резкльтатов, добавляет запрос в searches,
// делает запрос и возвращает объект {count, results, error})

const search = async (currentState, searchTerm) => {
  setState({
    count: 0,
    results: [],
    error: false,
    searches: [searchTerm].concat(currentState.searches.filter((term) => term !== searchTerm)),
  });

  try {
    const response = await fetch(`http://www.omdbapi.com/?apikey=dfc2dae4&type=movie&s=${searchTerm}`);
    const results = await response.json();

    return results.Response === 'True'
      ? {
        count: results.totalResults,
        results: results.Search.map(mapMovie),
      }
      : { error: results.Error };
  } catch (error) {
    return { error };
  }
};

// Рендер карточки

const render = (movieData) => {
  const movie = document.createElement('movie-card');

  movie.poster = movieData.poster;
  movie.title = movieData.title;
  movie.year = movieData.year;
  movie.link = movieData.link;

  return movie;
};

// Рендер результатов

const renderList = (results) => {
  const list = document.createDocumentFragment();

  results.forEach((movieData) => list.appendChild(render(movieData)));

  resultsContainer.innerHTML = '';
  resultsContainer.appendChild(list);
};

// Рендер количества совпадений

const renderCount = (count) => {
  resultsMessage.textContent = `Нашли ${count} ${declensionedMovies(count)}`;
};

// Рендер ошибки

const renderError = () => {
  resultsMessage.textContent = 'Мы не поняли о чем речь ¯\\_(ツ)_/¯';
};

// Обработка сабмита

const subscribeToSubmit = () => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = await search(getState(), input.value);

    if (data.error) {
      renderError();
      renderList([]);
    } else {
      renderCount(data.count);
      renderList(data.results);
    }
  });
};

subscribeToSubmit();

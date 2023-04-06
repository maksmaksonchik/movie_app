// Helpers
import mapMovie from './helpers/mapMovie.js';
import getDeclension from './helpers/getDeclension.js';

// Components
import './components/currentYear.js';
import './components/movieCard.js';

// Nodes
const searchForm = document.querySelector('.search__form');
const searchInput = document.querySelector('.search__input');
const searchHistory = document.querySelector('.search__history');

const resultsContainer = document.querySelector('.results__grid');
const resultsMessage = document.querySelector('.results__message');

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
      ? setState({
        count: results.totalResults,
        results: results.Search.map(mapMovie),
      })
      : setState({ error: results.Error });
  } catch (error) {
    return setState({ error });
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

// Рендер истории

const renderHistory = (searches) => {
  const list = document.createDocumentFragment();

  searches.forEach((searchTerm) => {
    const tag = document.createElement('button');

    tag.classList.add('search__tag');
    tag.textContent = searchTerm;
    tag.dataset.movie = searchTerm;

    list.appendChild(tag);
  });

  searchHistory.innerHTML = '';
  searchHistory.appendChild(list);
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

// Update

const updateView = (nextState) => {
  if (nextState.error) {
    renderError();
  } else {
    renderCount(nextState.count);
  }
  renderHistory(nextState.searches);
  renderList(nextState.results);
};

// Обработчики событий

const onSearchSubmit = async (event) => {
  event.preventDefault();
  searchInput.blur();
  const nextState = await search(getState(), searchInput.value);

  updateView(nextState);
};

const onTagClick = async (event) => {
  event.preventDefault();

  if (event.target.classList.contains('search__tag') && !event.altKey) {
    searchInput.value = event.target.dataset.movie;
    const nextState = await search(getState(), event.target.dataset.movie);
    updateView(nextState);
  }
};

// Активация строки поиска

const activateSearch = () => {
  searchForm.classList.add('search_active');
  renderHistory(state.searches);
  searchForm.removeEventListener('click');
};

// Подписки на события

const subscribeToSubmit = () => {
  searchForm.addEventListener('submit', onSearchSubmit);
};

const subscribeToTagClick = () => {
  searchHistory.addEventListener('click', onTagClick);
};

const subscribeToSearchClick = () => {
  searchForm.addEventListener('click', activateSearch);
};

subscribeToSubmit();
subscribeToTagClick();
subscribeToSearchClick();

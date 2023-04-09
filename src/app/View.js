import Controller from './Controller.js';
import getDeclension from '../helpers/getDeclension.js';

// Helpers
const declensionedMovies = getDeclension('фильм', 'фильма', 'фильмов');

export default class View {
  constructor() {
    this.controller = new Controller();

    // Form
    this.searchForm = document.querySelector('.search__form');
    this.searchInput = document.querySelector('.search__input');

    // History
    this.searchHistory = document.querySelector('.search__history');

    // Results
    this.resultsContainer = document.querySelector('.results__grid');
    this.resultsMessage = document.querySelector('.results__message');
  }

  // Renders

  renderHistory(searches) {
    const list = document.createDocumentFragment();

    searches.forEach((term) => {
      const tag = document.createElement('div');

      tag.classList.add('search__tag');
      tag.textContent = term;
      tag.dataset.movie = term;

      list.appendChild(tag);
    });

    this.searchHistory.innerHTML = '';
    this.searchHistory.appendChild(list);
  }

  renderCount(count) {
    this.resultsMessage.textContent = `Нашли ${count} ${declensionedMovies(count)}`;
  }

  renderError() {
    this.resultsMessage.textContent = 'Мы не поняли о чем речь ¯\\_(ツ)_/¯';
  }

  renderList(results) {
    const renderMovie = (movieData) => {
      const movie = document.createElement('movie-card');

      movie.poster = movieData.poster;
      movie.title = movieData.title;
      movie.year = movieData.year;
      movie.link = movieData.link;

      return movie;
    };

    const list = document.createDocumentFragment();

    results.forEach((movieData) => list.appendChild(renderMovie(movieData)));

    this.resultsContainer.innerHTML = '';
    this.resultsContainer.appendChild(list);
  }

  renderSearch(state) {
    if (state.error) {
      this.renderError();
    } else {
      this.renderCount(state.count);
    }
    this.renderHistory(state.searches);
    this.renderList(state.results);
  }

  // Listeners

  onSearchActivation() {
    this.searchForm.classList.add('search_active');
    this.renderHistory(this.controller.getHistory());
  }

  async onSearchSubmit(event) {
    event.preventDefault();
    this.searchInput.blur();

    const nextState = await this.controller.handleSearchSubmit(this.searchInput.value);

    this.renderSearch(nextState);
  }

  subscribeToTagClickAndRemove() {
    const isTargetTag = (event) => event.target.classList.contains('search__tag') && !event.altKey;

    const onTagClick = async (event) => {
      this.searchInput.value = event.target.dataset.movie;

      const nextState = await this.controller.handleTagClick(event.target.dataset.movie);

      this.renderSearch(nextState);
    };

    const onTagRemove = (event) => {
      this.controller.handleTagRemove(event.target.dataset.movie);
      this.renderHistory(this.controller.getHistory());
    };

    const delay = 200;
    let timer;
    let prevent = false;

    this.searchHistory.addEventListener('click', (event) => {
      event.preventDefault();
      if (!isTargetTag(event)) { return; }
      timer = setTimeout(async () => {
        if (!prevent) {
          onTagClick(event);
        } else {
          prevent = false;
        }
      }, delay);
    });

    this.searchHistory.addEventListener('dblclick', (event) => {
      event.preventDefault();
      if (!isTargetTag(event)) { return; }
      clearTimeout(timer);
      prevent = true;
      onTagRemove(event);
    });
  }

  // Init
  init() {
    if (this.controller.isDefaultState()) {
      this.searchForm.addEventListener('click', this.onSearchActivation.bind(this), { once: true });
    } else {
      this.onSearchActivation();
      [this.searchInput.value] = this.controller.getHistory();
      this.renderSearch(this.controller.getState());
    }

    this.searchForm.addEventListener('submit', this.onSearchSubmit.bind(this));
    this.subscribeToTagClickAndRemove();
  }
}

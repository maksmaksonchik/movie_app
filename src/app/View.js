import Controller from './Controller.js';
// import getDeclension from '../helpers/getDeclension';

export default class View {
  constructor() {
    this.controller = new Controller();

    this.searchForm = document.querySelector('.search__form');
    this.searchInput = document.querySelector('.search__input');
    this.searchHistory = document.querySelector('.search__history');

    this.resultsContainer = document.querySelector('.results__grid');
    this.resultsMessage = document.querySelector('.results__message');
  }

  onSearchActivation() {
    this.searchForm.classList.add('search_active');
    this.renderHistory(this.controller.getHistory());
    this.searchForm.removeEventListener('click', this.onSearchActivation);
  }

  renderHistory(searches) {
    const list = document.createDocumentFragment();

    searches.forEach((term) => {
      const tag = document.createElement('button');

      tag.classList.add('search__tag');
      tag.textContent = term;
      tag.dataset.movie = term;

      list.appendChild(tag);
    });

    this.searchHistory.innerHTML = '';
    this.searchHistory.appendChild(list);
  }

  init() {
    // this.searchForm.addEventListener('submit', this.onSearchSubmit.bind(this));
    // this.searchHistory.addEventListener('click', this.onTagClick.bind(this));
    // this.searchHistory.addEventListener('dblclick', this.onTagRemove.bind(this));
    this.searchForm.addEventListener('click', this.onSearchActivation.bind(this));
  }
}

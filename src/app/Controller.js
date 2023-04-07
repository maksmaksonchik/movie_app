import Model from './Model.js';

export default class Controller {
  constructor() {
    this.model = new Model();
  }

  getHistory() {
    return this.model.getState().searches;
  }

  async handleSearchSubmit(searchTerm) {
    const nextState = await this.model.search(searchTerm);

    return nextState;
  }

  async handleTagClick(searchTerm) {
    const nextState = await this.model.search(searchTerm);

    return nextState;
  }

  handleTagRemove(removeTerm) {
    return this.model.removeSearchTerm(removeTerm);
  }
}

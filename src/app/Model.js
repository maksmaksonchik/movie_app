import mapMovie from '../helpers/mapMovie.js';

export default class Model {
  constructor() {
    const restoredState = JSON.parse(localStorage.getItem('state'));

    if (restoredState) {
      this.state = restoredState;
      this.isDefaultState = false;
    } else {
      this.state = {
        count: 0,
        results: [],
        error: false,
        searches: [],
      };
      this.isDefaultState = true;
    }

    this.cache = {};
  }

  setState(update) {
    this.state = { ...this.state, ...update };
    localStorage.setItem('state', JSON.stringify(this.state));
    return this.state;
  }

  getState() {
    return this.state;
  }

  async search(searchString) {
    const searchTerm = searchString.toLowerCase();

    this.setState({
      count: 0,
      results: [],
      error: false,
      searches: [searchTerm].concat(this.state.searches.filter((term) => term !== searchTerm)),
    });

    if (this.cache[searchTerm] !== undefined) {
      return this.setState(this.cache[searchTerm]);
    }

    try {
      const response = await fetch(`http://www.omdbapi.com/?apikey=dfc2dae4&type=movie&s=${searchTerm}`);
      const results = await response.json();

      this.cache[searchTerm] = results.Response === 'True'
        ? {
          count: results.totalResults,
          results: results.Search.map(mapMovie),
        }
        : { error: results.Error };
    } catch (error) {
      this.cache[searchTerm] = { error };
    }

    return this.setState(this.cache[searchTerm]);
  }

  removeSearchTerm(removeTerm) {
    return this.setState({
      searches: this.state.searches.filter((term) => term !== removeTerm),
    });
  }
}

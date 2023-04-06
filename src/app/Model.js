import mapMovie from '../helpers/mapMovie.js';

export default class Model {
  constructor() {
    this.state = {
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
  }

  setState(update) {
    this.state = { ...this.state, ...update };
    return this.state;
  }

  getState() {
    return this.state;
  }

  async search(searchTerm) {
    this.setState({
      count: 0,
      results: [],
      error: false,
      searches: [searchTerm].concat(this.state.searches.filter((term) => term !== searchTerm)),
    });

    try {
      const response = await fetch(`http://www.omdbapi.com/?apikey=dfc2dae4&type=movie&s=${searchTerm}`);
      const results = await response.json();

      return results.Response === 'True'
        ? this.setState({
          count: results.totalResults,
          results: results.Search.map(mapMovie),
        })
        : this.setState({ error: results.Error });
    } catch (error) {
      return this.setState({ error });
    }
  }
}

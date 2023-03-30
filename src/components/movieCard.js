const movieTemplate = document.createElement('template');
movieTemplate.innerHTML = `
  <style>
  :host {
    display: block;
  }
  
  * {
    box-sizing: border-box;
  }
  
  .movie {
    background-color: rgba(255, 255, 255, 0.24);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    position: relative;
    height: 100%;
  }
  
  .movie__link {
    display: block;
    height: 100%;
    width: 100%;
  }
  
  .movie__image {
    position: absolute;
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
  
  .movie__description {
    width: 100%;
    height: 100%;
    padding: 20px;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0) 26.43%,
      rgba(0, 0, 0, 0.8) 72.41%
    );
  
    position: absolute;
  
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  
  .movie:hover .movie__description {
    opacity: 1;
  }
  
  .movie__rating {
    color: #fff;
  }
  
  .movie__title {
    font-size: 1.5rem;
    color: #fff;
    margin: 4px 0 0;
  }
  
  .movie__footer {
    margin-top: 16px;
    color: rgba(255, 255, 255, 0.4);
    display: flex;
    justify-content: space-between;
  }
  </style>

  <article class="movie">
    <a href="" class="movie__link">
      <img class="movie__image" src="" alt="poster" />
      <div class="movie__description">
        <div class="movie__rating"></div>
        <h3 class="movie__title"></h3>
        <footer class="movie__footer">
          <div class="movie__genre"></div>
          <div class="movie__year"></div>
        </footer>
      </div>
    </a>
  </article>
`;

const params = ['title', 'poster', 'link', 'year', 'genre', 'rating'];
const mirror = (element) => {
  params.forEach((param) => {
    Object.defineProperty(element, param, {
      get() {
        return this.getAttribute(param);
      },
      set(value) {
        this.setAttribute(param, value);
      },
    });
  });
};

class MovieCard extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });
    const template = movieTemplate.content.cloneNode(true);

    shadow.appendChild(template);
    mirror(this);
  }

  static get observedAttributes() {
    return params;
  }

  attributeChangedCallback(param, oldValue, newValue) {
    switch (param) {
      case 'title':
        this.shadowRoot.querySelector('.movie__title').textContent = newValue;
        break;
      case 'poster':
        this.shadowRoot.querySelector('.movie__image').src = newValue;
        break;
      case 'link':
        this.shadowRoot.querySelector('.movie__link').href = newValue;
        break;
      case 'year':
        this.shadowRoot.querySelector('.movie__year').textContent = newValue;
        break;
      case 'rating':
        this.shadowRoot.querySelector('.movie__rating').textContent = newValue;
        break;
      case 'genre':
        this.shadowRoot.querySelector('.movie__genre').textContent = newValue;
        break;
      default:
    }
    return newValue;
  }
}

customElements.define('movie-card', MovieCard);

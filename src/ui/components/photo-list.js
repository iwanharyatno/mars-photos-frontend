import $ from 'jquery';

import './photo-item.js';
import events from'../events.js';

function generatePages(total, length=25) {
  const pagesCount = Math.floor(total / length);
  const pageIntervals = [];

  if (pagesCount === 0) return [[1, total]];

  for (let i = 0; i < pagesCount; i++) {
    pageIntervals.push([i*length, (i+1)*length]);
  }

  if (total % length !== 0) pageIntervals.push([pagesCount*length, total]);

  return pageIntervals;
}

customElements.define('photo-list', class extends HTMLElement {
  constructor() {
    super();
    this._photos = [];
    this._roverName = '';
    this._sol = 1;
    this._pages = [];
    this._page = 0;
  }

  connectedCallback() {
    this.render();
  }

  set photos(photos) {
    this._photos = photos;
    this._pages = generatePages(photos.length);
    if (photos.length !== 0) this._roverName = photos[0].rover.name;
    this.render();
  }

  get photos() {
    if (this._photos.length === 0) return [];
    const [start, end] = this.currentPageInterval;
    return this._photos.slice(start, end);
  }

  get currentPageInterval() {
    return this._pages[this._page];
  }

  set loading(loading) {
    this._loading = loading;
    this._photos = [];
    this._pages = [];
    this._page = 0;
    this.render();
  }

  get loading() {
    return this._loading;
  }

  render() {
    this.innerHTML = `
    <h2 class="text-primary d-flex align-items-center">${!this.loading ? `${this._photos.length} Photos found` : '<span class="spinner-border me-3"></span>Loading...'}</h2>
    <hr>
    <div>
      <label for="date-filter" class="form-label">Filter by sol (<a href="https://en.m.wikipedia.org/wiki/Mars_sol" target="_blank">Martian days</a> since the rover was first activated):</label>
      <input type="number" id="sol-filter" class="form-control" value="${this._sol}">
    </div>
    <p class="text-secondary mt-3"><em>Taken by the ${this._roverName} Rover.</em></p>
    <div id="photos-container" class="mt-3 row">
    </div>
    <h5 class="text-primary text-center my-3">Pages</h5>
    <ul class="pagination justify-content-center flex-wrap">
    </ul>
    `;

    $('#sol-filter').on('change', e => {
      this._sol = e.target.value;
      this.dispatchEvent(new CustomEvent(events.SOL_INPUT_CHANGE, {
        detail: {
          value: this._sol
        }
      }));
    });

    this.photos.forEach(photo => {
      const photoItem = document.createElement('photo-item');
      photoItem.photo = photo;
      photoItem.classList.add('col-md-6');
      $('#photos-container').append(photoItem);
    });

    for (let i = 0; i < this._pages.length; i++) {
      const pageItem = document.createElement('li');
      pageItem.classList.add('page-item', 'my-1');
      pageItem.innerHTML = `<a href="javascript:void(0)" class="page-link ${this._page === i ? 'active' : ''}">${i+1}</a>`;
      $(pageItem).find('a').on('click', () => {
        this._page = i;
        this.render();
      });
      $(this).find('.pagination').append(pageItem);
    }
  }

  static get observedAttributes() {
    return ['photos', 'loading'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch(name) {
    case 'photos':
      this.photos = JSON.parse(newValue);
      break;
    case 'loading':
      this.loading = newValue;
      break;
    }
  }
});

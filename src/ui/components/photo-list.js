import $ from 'jquery';

import './photo-item.js';
import events from'../events.js';

customElements.define('photo-list', class extends HTMLElement {
  constructor() {
    super();
    this._photos = [];
    this._roverName = '';
    this._sol = 1;
  }

  connectedCallback() {
    this.render();
  }

  set photos(photos) {
    this._photos = photos;
    if (photos.length !== 0) this._roverName = photos[0].rover.name;
    this.render();
  }

  get photos() {
    return this._photos;
  }

  set loading(loading) {
    this._loading = loading;
    this._photos = [];
    this.render();
  }

  get loading() {
    return this._loading;
  }

  render() {
    this.innerHTML = `
    <h2 class="text-primary d-flex align-items-center">${!this.loading ? `${this.photos.length} Photos found` : '<span class="spinner-border me-3"></span>Loading...'}</h2>
    <hr>
    <div>
      <label for="date-filter" class="form-label">Filter by sol (<a href="https://en.m.wikipedia.org/wiki/Mars_sol" target="_blank">Martian days</a> since the rover was first activated):</label>
      <input type="number" id="sol-filter" class="form-control" value="${this._sol}">
    </div>
    <p class="text-secondary mt-3"><em>Taken by the ${this._roverName} Rover.</em></p>
    <div id="photos-container" class="mt-3 row">
    </div>
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

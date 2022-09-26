customElements.define('photo-item', class extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  set photo(photo) {
    this._photo = photo;
    this.render();
  }

  get photo() {
    return this._photo;
  }

  render() {
    this.innerHTML = `
    <div class="card m-3">
      <a href="${this.photo.img_src}" target="_blank">
        <img class="card-img-top" src="${this.photo.img_src}">
      </a>
      <div class="card-body d-flex flex-wrap">
        <h3 class="card-title w-100 text-primary">Info</h3>

        <div style="width: 40%"><strong>Earth Date</strong></div>
        <div style="width: 60%">${this.photo.earth_date}</div>

        <div style="width: 40%"><strong>Sol</strong></div>
        <div style="width: 60%">${this.photo.sol}</div>

        <div style="width: 40%"><strong>Taken by</strong></div>
        <div style="width: 60%">${this.photo.camera.full_name} (${this.photo.camera.name})</div>
      </div>
    </div>
    `;
  }
});

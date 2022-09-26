customElements.define('app-bar', class extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  set brand(brand) {
    this._brand = brand;
    this.render();
  }

  render() {
    this.innerHTML = '';
    this.innerHTML += `
    <nav class="navbar navbar-dark bg-primary">
      <div class="container-fluid">
        <a class="navbar-brand" href="javascript:void(0)">${this._brand}</a>
      </div>
    </nav>
    `;
  }

  static get observedAttributes() {
    return ['brand'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch(name) {
    case 'brand':
      this.brand = newValue;
      break;
    }
  }
});

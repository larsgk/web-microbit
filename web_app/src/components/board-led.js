import { LitElement, html, css } from "lit-element";


// todo:
//  dropshadow (light)
//  styling pcb & led color
//  mount = pcb | ?
//  color-hue
//  value [0.0;1.0]
//  toggle events
//  detect pointer events 


export class BoardLED extends LitElement {
  constructor() {
    super();

    this.lit = false;
    this.row=-1;
    this.col=-1;
  }

  static get properties() {
    return {
      lit: { type: Boolean, reflect: true },
      row: { type: Number },
      col: { type: Number }
    }
  }

  static get styles() {
    return [
      css`
        #pcb {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          margin: 0;
        }

        .led {
          width: 0.5rem;
          height: 0.8rem;
          background: rgba(255, 255, 255, 0.2);
        }

        .led[lit] {
          background: red;
          box-shadow: 0px 0px 1.5rem 0.4rem red;
        }
      `
    ];
  }

  render() {
    return html`
      <div id="pcb" @click="${this.clicked}"><div class="led" ?lit="${this.lit}"></div></div>
    `;
  }

  clicked() {
    this.toggleLED();
    this.dispatchEvent(new CustomEvent('change', {detail: {row: this.row, col: this.col, lit: this.lit}}));
  }

  toggleLED() {
    this.lit = !this.lit;
  }
}
customElements.define("board-led", BoardLED);

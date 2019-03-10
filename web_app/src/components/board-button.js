import { LitElement, html, css } from "lit-element";

export class BoardButton extends LitElement {
  constructor() {
    super();

    this.pressed = false;
  }

  static get properties() {
    return {
      pressed: { type: Boolean, reflect: true }
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

        .btnbox {
          width: 1.2rem;
          height: 1.2rem;
          background: silver;

          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btnbox[pressed] {
          background: blue;
          box-shadow: 0px 0px 1.5rem 0.4rem blue;
        }

        .btn {
            width: 0.8rem;
            height: 0.8rem;
            border-radius: 50%;
            background: black;
        }
      `
    ];
  }

  render() {
      // TODO: buttons
    return html`
      <div id="pcb"><div class="btnbox" ?pressed="${this.pressed}"><div class="btn"></div></div></div>
    `;
  }
}
customElements.define("board-button", BoardButton);

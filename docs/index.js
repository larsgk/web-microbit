const t=new WeakMap,e=e=>"function"==typeof e&&t.has(e),s=void 0!==window.customElements&&void 0!==window.customElements.polyfillWrapFlushCallback,i=(t,e,s=null)=>{let i=e;for(;i!==s;){const e=i.nextSibling;t.removeChild(i),i=e}},n={},r={},o=`{{lit-${String(Math.random()).slice(2)}}}`,a=`\x3c!--${o}--\x3e`,d=new RegExp(`${o}|${a}`),c="$lit$";class l{constructor(t,e){this.parts=[],this.element=e;let s=-1,i=0;const n=[],r=e=>{const a=e.content,l=document.createTreeWalker(a,133,null,!1);let h=0;for(;l.nextNode();){s++;const e=l.currentNode;if(1===e.nodeType){if(e.hasAttributes()){const n=e.attributes;let r=0;for(let t=0;t<n.length;t++)n[t].value.indexOf(o)>=0&&r++;for(;r-- >0;){const n=t.strings[i],r=u.exec(n)[2],o=r.toLowerCase()+c,a=e.getAttribute(o).split(d);this.parts.push({type:"attribute",index:s,name:r,strings:a}),e.removeAttribute(o),i+=a.length-1}}"TEMPLATE"===e.tagName&&r(e)}else if(3===e.nodeType){const t=e.data;if(t.indexOf(o)>=0){const r=e.parentNode,o=t.split(d),a=o.length-1;for(let t=0;t<a;t++)r.insertBefore(""===o[t]?p():document.createTextNode(o[t]),e),this.parts.push({type:"node",index:++s});""===o[a]?(r.insertBefore(p(),e),n.push(e)):e.data=o[a],i+=a}}else if(8===e.nodeType)if(e.data===o){const t=e.parentNode;null!==e.previousSibling&&s!==h||(s++,t.insertBefore(p(),e)),h=s,this.parts.push({type:"node",index:s}),null===e.nextSibling?e.data="":(n.push(e),s--),i++}else{let t=-1;for(;-1!==(t=e.data.indexOf(o,t+1));)this.parts.push({type:"node",index:-1})}}};r(e);for(const t of n)t.parentNode.removeChild(t)}}const h=t=>-1!==t.index,p=()=>document.createComment(""),u=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F \x09\x0a\x0c\x0d"'>=\/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;class m{constructor(t,e,s){this._parts=[],this.template=t,this.processor=e,this.options=s}update(t){let e=0;for(const s of this._parts)void 0!==s&&s.setValue(t[e]),e++;for(const t of this._parts)void 0!==t&&t.commit()}_clone(){const t=s?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),e=this.template.parts;let i=0,n=0;const r=t=>{const s=document.createTreeWalker(t,133,null,!1);let o=s.nextNode();for(;i<e.length&&null!==o;){const t=e[i];if(h(t))if(n===t.index){if("node"===t.type){const t=this.processor.handleTextExpression(this.options);t.insertAfterNode(o.previousSibling),this._parts.push(t)}else this._parts.push(...this.processor.handleAttributeExpressions(o,t.name,t.strings,this.options));i++}else n++,"TEMPLATE"===o.nodeName&&r(o.content),o=s.nextNode();else this._parts.push(void 0),i++}};return r(t),s&&(document.adoptNode(t),customElements.upgrade(t)),t}}class g{constructor(t,e,s,i){this.strings=t,this.values=e,this.type=s,this.processor=i}getHTML(){const t=this.strings.length-1;let e="";for(let s=0;s<t;s++){const t=this.strings[s],i=u.exec(t);e+=i?t.substr(0,i.index)+i[1]+i[2]+c+i[3]+o:t+a}return e+this.strings[t]}getTemplateElement(){const t=document.createElement("template");return t.innerHTML=this.getHTML(),t}}const v=t=>null===t||!("object"==typeof t||"function"==typeof t);class f{constructor(t,e,s){this.dirty=!0,this.element=t,this.name=e,this.strings=s,this.parts=[];for(let t=0;t<s.length-1;t++)this.parts[t]=this._createPart()}_createPart(){return new y(this)}_getValue(){const t=this.strings,e=t.length-1;let s="";for(let i=0;i<e;i++){s+=t[i];const e=this.parts[i];if(void 0!==e){const t=e.value;if(null!=t&&(Array.isArray(t)||"string"!=typeof t&&t[Symbol.iterator]))for(const e of t)s+="string"==typeof e?e:String(e);else s+="string"==typeof t?t:String(t)}}return s+=t[e]}commit(){this.dirty&&(this.dirty=!1,this.element.setAttribute(this.name,this._getValue()))}}class y{constructor(t){this.value=void 0,this.committer=t}setValue(t){t===n||v(t)&&t===this.value||(this.value=t,e(t)||(this.committer.dirty=!0))}commit(){for(;e(this.value);){const t=this.value;this.value=n,t(this)}this.value!==n&&this.committer.commit()}}class b{constructor(t){this.value=void 0,this._pendingValue=void 0,this.options=t}appendInto(t){this.startNode=t.appendChild(p()),this.endNode=t.appendChild(p())}insertAfterNode(t){this.startNode=t,this.endNode=t.nextSibling}appendIntoPart(t){t._insert(this.startNode=p()),t._insert(this.endNode=p())}insertAfterPart(t){t._insert(this.startNode=p()),this.endNode=t.endNode,t.endNode=this.startNode}setValue(t){this._pendingValue=t}commit(){for(;e(this._pendingValue);){const t=this._pendingValue;this._pendingValue=n,t(this)}const t=this._pendingValue;t!==n&&(v(t)?t!==this.value&&this._commitText(t):t instanceof g?this._commitTemplateResult(t):t instanceof Node?this._commitNode(t):Array.isArray(t)||t[Symbol.iterator]?this._commitIterable(t):t===r?(this.value=r,this.clear()):this._commitText(t))}_insert(t){this.endNode.parentNode.insertBefore(t,this.endNode)}_commitNode(t){this.value!==t&&(this.clear(),this._insert(t),this.value=t)}_commitText(t){const e=this.startNode.nextSibling;t=null==t?"":t,e===this.endNode.previousSibling&&3===e.nodeType?e.data=t:this._commitNode(document.createTextNode("string"==typeof t?t:String(t))),this.value=t}_commitTemplateResult(t){const e=this.options.templateFactory(t);if(this.value instanceof m&&this.value.template===e)this.value.update(t.values);else{const s=new m(e,t.processor,this.options),i=s._clone();s.update(t.values),this._commitNode(i),this.value=s}}_commitIterable(t){Array.isArray(this.value)||(this.value=[],this.clear());const e=this.value;let s,i=0;for(const n of t)void 0===(s=e[i])&&(s=new b(this.options),e.push(s),0===i?s.appendIntoPart(this):s.insertAfterPart(e[i-1])),s.setValue(n),s.commit(),i++;i<e.length&&(e.length=i,this.clear(s&&s.endNode))}clear(t=this.startNode){i(this.startNode.parentNode,t.nextSibling,this.endNode)}}class w{constructor(t,e,s){if(this.value=void 0,this._pendingValue=void 0,2!==s.length||""!==s[0]||""!==s[1])throw new Error("Boolean attributes can only contain a single expression");this.element=t,this.name=e,this.strings=s}setValue(t){this._pendingValue=t}commit(){for(;e(this._pendingValue);){const t=this._pendingValue;this._pendingValue=n,t(this)}if(this._pendingValue===n)return;const t=!!this._pendingValue;this.value!==t&&(t?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name)),this.value=t,this._pendingValue=n}}class _ extends f{constructor(t,e,s){super(t,e,s),this.single=2===s.length&&""===s[0]&&""===s[1]}_createPart(){return new S(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){this.dirty&&(this.dirty=!1,this.element[this.name]=this._getValue())}}class S extends y{}let x=!1;try{const t={get capture(){return x=!0,!1}};window.addEventListener("test",t,t),window.removeEventListener("test",t,t)}catch(t){}class E{constructor(t,e,s){this.value=void 0,this._pendingValue=void 0,this.element=t,this.eventName=e,this.eventContext=s,this._boundHandleEvent=(t=>this.handleEvent(t))}setValue(t){this._pendingValue=t}commit(){for(;e(this._pendingValue);){const t=this._pendingValue;this._pendingValue=n,t(this)}if(this._pendingValue===n)return;const t=this._pendingValue,s=this.value,i=null==t||null!=s&&(t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive),r=null!=t&&(null==s||i);i&&this.element.removeEventListener(this.eventName,this._boundHandleEvent,this._options),r&&(this._options=C(t),this.element.addEventListener(this.eventName,this._boundHandleEvent,this._options)),this.value=t,this._pendingValue=n}handleEvent(t){"function"==typeof this.value?this.value.call(this.eventContext||this.element,t):this.value.handleEvent(t)}}const C=t=>t&&(x?{capture:t.capture,passive:t.passive,once:t.once}:t.capture);const P=new class{handleAttributeExpressions(t,e,s,i){const n=e[0];return"."===n?new _(t,e.slice(1),s).parts:"@"===n?[new E(t,e.slice(1),i.eventContext)]:"?"===n?[new w(t,e.slice(1),s)]:new f(t,e,s).parts}handleTextExpression(t){return new b(t)}};function N(t){let e=A.get(t.type);void 0===e&&(e={stringsArray:new WeakMap,keyString:new Map},A.set(t.type,e));let s=e.stringsArray.get(t.strings);if(void 0!==s)return s;const i=t.strings.join(o);return void 0===(s=e.keyString.get(i))&&(s=new l(t,t.getTemplateElement()),e.keyString.set(i,s)),e.stringsArray.set(t.strings,s),s}const A=new Map,T=new WeakMap;(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.0.0");const k=(t,...e)=>new g(t,e,"html",P),V=133;function U(t,e){const{element:{content:s},parts:i}=t,n=document.createTreeWalker(s,V,null,!1);let r=L(i),o=i[r],a=-1,d=0;const c=[];let l=null;for(;n.nextNode();){a++;const t=n.currentNode;for(t.previousSibling===l&&(l=null),e.has(t)&&(c.push(t),null===l&&(l=t)),null!==l&&d++;void 0!==o&&o.index===a;)o.index=null!==l?-1:o.index-d,o=i[r=L(i,r)]}c.forEach(t=>t.parentNode.removeChild(t))}const $=t=>{let e=11===t.nodeType?0:1;const s=document.createTreeWalker(t,V,null,!1);for(;s.nextNode();)e++;return e},L=(t,e=-1)=>{for(let s=e+1;s<t.length;s++){const e=t[s];if(h(e))return s}return-1};const D=(t,e)=>`${t}--${e}`;let B=!0;void 0===window.ShadyCSS?B=!1:void 0===window.ShadyCSS.prepareTemplateDom&&(console.warn("Incompatible ShadyCSS version detected.Please update to at least @webcomponents/webcomponentsjs@2.0.2 and@webcomponents/shadycss@1.3.1."),B=!1);const O=t=>e=>{const s=D(e.type,t);let i=A.get(s);void 0===i&&(i={stringsArray:new WeakMap,keyString:new Map},A.set(s,i));let n=i.stringsArray.get(e.strings);if(void 0!==n)return n;const r=e.strings.join(o);if(void 0===(n=i.keyString.get(r))){const s=e.getTemplateElement();B&&window.ShadyCSS.prepareTemplateDom(s,t),n=new l(e,s),i.keyString.set(r,n)}return i.stringsArray.set(e.strings,n),n},R=["html","svg"],M=new Set,I=(t,e,s)=>{M.add(s);const i=t.querySelectorAll("style");if(0===i.length)return void window.ShadyCSS.prepareTemplateStyles(e.element,s);const n=document.createElement("style");for(let t=0;t<i.length;t++){const e=i[t];e.parentNode.removeChild(e),n.textContent+=e.textContent}if((t=>{R.forEach(e=>{const s=A.get(D(e,t));void 0!==s&&s.keyString.forEach(t=>{const{element:{content:e}}=t,s=new Set;Array.from(e.querySelectorAll("style")).forEach(t=>{s.add(t)}),U(t,s)})})})(s),function(t,e,s=null){const{element:{content:i},parts:n}=t;if(null==s)return void i.appendChild(e);const r=document.createTreeWalker(i,V,null,!1);let o=L(n),a=0,d=-1;for(;r.nextNode();)for(d++,r.currentNode===s&&(a=$(e),s.parentNode.insertBefore(e,s));-1!==o&&n[o].index===d;){if(a>0){for(;-1!==o;)n[o].index+=a,o=L(n,o);return}o=L(n,o)}}(e,n,e.element.content.firstChild),window.ShadyCSS.prepareTemplateStyles(e.element,s),window.ShadyCSS.nativeShadow){const s=e.element.content.querySelector("style");t.insertBefore(s.cloneNode(!0),t.firstChild)}else{e.element.content.insertBefore(n,e.element.content.firstChild);const t=new Set;t.add(n),U(e,t)}};window.JSCompiler_renameProperty=((t,e)=>t);const j={toAttribute(t,e){switch(e){case Boolean:return t?"":null;case Object:case Array:return null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){switch(e){case Boolean:return null!==t;case Number:return null===t?null:Number(t);case Object:case Array:return JSON.parse(t)}return t}},z=(t,e)=>e!==t&&(e==e||t==t),q={attribute:!0,type:String,converter:j,reflect:!1,hasChanged:z},H=Promise.resolve(!0),W=1,F=4,J=8,X=16,Z=32;class G extends HTMLElement{constructor(){super(),this._updateState=0,this._instanceProperties=void 0,this._updatePromise=H,this._hasConnectedResolver=void 0,this._changedProperties=new Map,this._reflectingProperties=void 0,this.initialize()}static get observedAttributes(){this.finalize();const t=[];return this._classProperties.forEach((e,s)=>{const i=this._attributeNameForProperty(s,e);void 0!==i&&(this._attributeToPropertyMap.set(i,s),t.push(i))}),t}static _ensureClassProperties(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_classProperties",this))){this._classProperties=new Map;const t=Object.getPrototypeOf(this)._classProperties;void 0!==t&&t.forEach((t,e)=>this._classProperties.set(e,t))}}static createProperty(t,e=q){if(this._ensureClassProperties(),this._classProperties.set(t,e),e.noAccessor||this.prototype.hasOwnProperty(t))return;const s="symbol"==typeof t?Symbol():`__${t}`;Object.defineProperty(this.prototype,t,{get(){return this[s]},set(e){const i=this[t];this[s]=e,this.requestUpdate(t,i)},configurable:!0,enumerable:!0})}static finalize(){if(this.hasOwnProperty(JSCompiler_renameProperty("finalized",this))&&this.finalized)return;const t=Object.getPrototypeOf(this);if("function"==typeof t.finalize&&t.finalize(),this.finalized=!0,this._ensureClassProperties(),this._attributeToPropertyMap=new Map,this.hasOwnProperty(JSCompiler_renameProperty("properties",this))){const t=this.properties,e=[...Object.getOwnPropertyNames(t),..."function"==typeof Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(t):[]];for(const s of e)this.createProperty(s,t[s])}}static _attributeNameForProperty(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}static _valueHasChanged(t,e,s=z){return s(t,e)}static _propertyValueFromAttribute(t,e){const s=e.type,i=e.converter||j,n="function"==typeof i?i:i.fromAttribute;return n?n(t,s):t}static _propertyValueToAttribute(t,e){if(void 0===e.reflect)return;const s=e.type,i=e.converter;return(i&&i.toAttribute||j.toAttribute)(t,s)}initialize(){this._saveInstanceProperties()}_saveInstanceProperties(){this.constructor._classProperties.forEach((t,e)=>{if(this.hasOwnProperty(e)){const t=this[e];delete this[e],this._instanceProperties||(this._instanceProperties=new Map),this._instanceProperties.set(e,t)}})}_applyInstanceProperties(){this._instanceProperties.forEach((t,e)=>this[e]=t),this._instanceProperties=void 0}connectedCallback(){this._updateState=this._updateState|Z,this._hasConnectedResolver?(this._hasConnectedResolver(),this._hasConnectedResolver=void 0):this.requestUpdate()}disconnectedCallback(){}attributeChangedCallback(t,e,s){e!==s&&this._attributeToProperty(t,s)}_propertyToAttribute(t,e,s=q){const i=this.constructor,n=i._attributeNameForProperty(t,s);if(void 0!==n){const t=i._propertyValueToAttribute(e,s);if(void 0===t)return;this._updateState=this._updateState|J,null==t?this.removeAttribute(n):this.setAttribute(n,t),this._updateState=this._updateState&~J}}_attributeToProperty(t,e){if(this._updateState&J)return;const s=this.constructor,i=s._attributeToPropertyMap.get(t);if(void 0!==i){const t=s._classProperties.get(i)||q;this._updateState=this._updateState|X,this[i]=s._propertyValueFromAttribute(e,t),this._updateState=this._updateState&~X}}requestUpdate(t,e){let s=!0;if(void 0!==t&&!this._changedProperties.has(t)){const i=this.constructor,n=i._classProperties.get(t)||q;i._valueHasChanged(this[t],e,n.hasChanged)?(this._changedProperties.set(t,e),!0!==n.reflect||this._updateState&X||(void 0===this._reflectingProperties&&(this._reflectingProperties=new Map),this._reflectingProperties.set(t,n))):s=!1}return!this._hasRequestedUpdate&&s&&this._enqueueUpdate(),this.updateComplete}async _enqueueUpdate(){let t;this._updateState=this._updateState|F;const e=this._updatePromise;this._updatePromise=new Promise(e=>t=e),await e,this._hasConnected||await new Promise(t=>this._hasConnectedResolver=t);const s=this.performUpdate();null!=s&&"function"==typeof s.then&&await s,t(!this._hasRequestedUpdate)}get _hasConnected(){return this._updateState&Z}get _hasRequestedUpdate(){return this._updateState&F}get hasUpdated(){return this._updateState&W}performUpdate(){if(this._instanceProperties&&this._applyInstanceProperties(),this.shouldUpdate(this._changedProperties)){const t=this._changedProperties;this.update(t),this._markUpdated(),this._updateState&W||(this._updateState=this._updateState|W,this.firstUpdated(t)),this.updated(t)}else this._markUpdated()}_markUpdated(){this._changedProperties=new Map,this._updateState=this._updateState&~F}get updateComplete(){return this._updatePromise}shouldUpdate(t){return!0}update(t){void 0!==this._reflectingProperties&&this._reflectingProperties.size>0&&(this._reflectingProperties.forEach((t,e)=>this._propertyToAttribute(e,this[e],t)),this._reflectingProperties=void 0)}updated(t){}firstUpdated(t){}}G.finalized=!0;const K="adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Q=Symbol();class Y{constructor(t,e){if(e!==Q)throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t}get styleSheet(){return void 0===this._styleSheet&&(K?(this._styleSheet=new CSSStyleSheet,this._styleSheet.replaceSync(this.cssText)):this._styleSheet=null),this._styleSheet}toString(){return this.cssText}}const tt=(t,...e)=>{const s=e.reduce((e,s,i)=>e+(t=>{if(t instanceof Y)return t.cssText;throw new Error(`Value passed to 'css' function must be a 'css' function result: ${t}. Use 'unsafeCSS' to pass non-literal values, but\n            take care to ensure page security.`)})(s)+t[i+1],t[0]);return new Y(s,Q)};(window.litElementVersions||(window.litElementVersions=[])).push("2.0.1");const et=t=>t.flat?t.flat(1/0):function t(e,s=[]){for(let i=0,n=e.length;i<n;i++){const n=e[i];Array.isArray(n)?t(n,s):s.push(n)}return s}(t);class st extends G{static finalize(){super.finalize(),this._styles=this.hasOwnProperty(JSCompiler_renameProperty("styles",this))?this._getUniqueStyles():this._styles||[]}static _getUniqueStyles(){const t=this.styles,e=[];if(Array.isArray(t)){et(t).reduceRight((t,e)=>(t.add(e),t),new Set).forEach(t=>e.unshift(t))}else t&&e.push(t);return e}initialize(){super.initialize(),this.renderRoot=this.createRenderRoot(),window.ShadowRoot&&this.renderRoot instanceof window.ShadowRoot&&this.adoptStyles()}createRenderRoot(){return this.attachShadow({mode:"open"})}adoptStyles(){const t=this.constructor._styles;0!==t.length&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow?K?this.renderRoot.adoptedStyleSheets=t.map(t=>t.styleSheet):this._needsShimAdoptedStyleSheets=!0:window.ShadyCSS.ScopingShim.prepareAdoptedCssText(t.map(t=>t.cssText),this.localName))}connectedCallback(){super.connectedCallback(),this.hasUpdated&&void 0!==window.ShadyCSS&&window.ShadyCSS.styleElement(this)}update(t){super.update(t);const e=this.render();e instanceof g&&this.constructor.render(e,this.renderRoot,{scopeName:this.localName,eventContext:this}),this._needsShimAdoptedStyleSheets&&(this._needsShimAdoptedStyleSheets=!1,this.constructor._styles.forEach(t=>{const e=document.createElement("style");e.textContent=t.cssText,this.renderRoot.appendChild(e)}))}render(){}}st.finalized=!0,st.render=((t,e,s)=>{const n=s.scopeName,r=T.has(e),o=e instanceof ShadowRoot&&B&&t instanceof g,a=o&&!M.has(n),d=a?document.createDocumentFragment():e;if(((t,e,s)=>{let n=T.get(e);void 0===n&&(i(e,e.firstChild),T.set(e,n=new b(Object.assign({templateFactory:N},s))),n.appendInto(e)),n.setValue(t),n.commit()})(t,d,Object.assign({templateFactory:O(n)},s)),a){const t=T.get(d);T.delete(d),t.value instanceof m&&I(d,t.value.template,n),i(e,e.firstChild),e.appendChild(d),T.set(e,t)}!r&&o&&window.ShadyCSS.styleElement(e.host)});const it=new class extends EventTarget{constructor(){super(),this.ble_devices=new Map,this.textDecoder=new TextDecoder,this.textEncoder=new TextEncoder}initialize(){}async startHeartbeatNotifications(t){const e=await t.getPrimaryService("12345678-1234-5678-1234-56789abcdef0"),s=await e.getCharacteristic("12345678-1234-5678-1234-56789abcdef1");return s.addEventListener("characteristicvaluechanged",e=>{const s=e.target.value.getInt16(0,!0);console.log(`Heartbeat[${t.device.id}] = ${s}`),this.notify("heartbeat",{deviceId:t.device.id,value:s})}),s.startNotifications()}async startDataNotifications(t){const e=await t.getPrimaryService("12345678-1234-5678-1234-56789abcdef0"),s=await e.getCharacteristic("12345678-1234-5678-1234-56789abcdef2");return s.addEventListener("characteristicvaluechanged",e=>{this.notify("data",{deviceId:t.device.id,value:e.target.value})}),s.startNotifications()}async fetchCmdCharacteristic(t){const e=await t.getPrimaryService("12345678-1234-5678-1234-56789abcdef0");t.device.cmdCharacteristic=await e.getCharacteristic("12345678-1234-5678-1234-56789abcdef3")}async writeBinaryToBLEDevice(t,e){const s=this.ble_devices.get(t);s&&(console.log(`TX_BLE[${t}]:`,e),await s.cmdCharacteristic.writeValue(e))}async openBLEDevice(t){try{const e=await t.gatt.connect();await this.startHeartbeatNotifications(e),await this.startDataNotifications(e),await this.fetchCmdCharacteristic(e),this.notify("connect",{deviceId:t.id}),this.ble_devices.set(`${t.id}`,t),t.bleConnectedAt=Date.now(),console.log(`connected BLE[${t.id}]`,t),t.ongattserverdisconnected=(e=>{console.log(`disconnected BLE[${t.id}] after ${(Date.now()-t.bleConnectedAt)/1e3} sec`,t),this.notify("disconnect",{deviceId:t.id}),this.ble_devices.delete(`${t.id}`)})}catch(t){console.warn(t)}}async scan(){try{const t=await navigator.bluetooth.requestDevice({filters:[{services:["12345678-1234-5678-1234-56789abcdef0"]}]});await this.openBLEDevice(t)}catch(t){console.warn(t)}}async disconnect(t){const e=this.ble_devices.get(t);e&&(console.log(`Disconnecting [${t}]:`),await e.gatt.disconnect())}broadcastBinary(t){for(let[e,s]of this.ble_devices)this.writeBinaryToBLEDevice(e,t)}notify(t,e){this.dispatchEvent(new CustomEvent(t,{detail:e}))}};class nt extends EventTarget{constructor(t){super(),this.deviceId=t,this._state={buttons:{left:!1,right:!1},ledData:new Uint8Array([1,0,0,0,0,0])},it.addEventListener("data",t=>{t.detail.deviceId===this.deviceId&&this.handleData(t.detail.value)})}get state(){return this._state}disconnect(){it.disconnect(this.deviceId)}dispatchAll(){this.dispatchEvent(new CustomEvent("leds-changed",{detail:{data:this._state.ledData}})),this.dispatchEvent(new CustomEvent("buttons-changed",{detail:{data:this._state.buttons}}))}async setLED(t,e,s){console.log(t,e,s);let i=this._state.ledData[1+t];const n=1<<e;s?i|=n:i&=~n,this._state.ledData[1+t]=i,console.log(this._state),await it.writeBinaryToBLEDevice(this.deviceId,this._state.ledData)}async clear(t){this._state.ledData=t?new Uint8Array([1,31,31,31,31,31]):new Uint8Array([1,0,0,0,0,0]),this.dispatchEvent(new CustomEvent("leds-changed",{detail:{data:this._state.ledData}})),await it.writeBinaryToBLEDevice(this.deviceId,this._state.ledData)}handleData(t){switch(console.log(`data[${this.deviceId}]`,t.getUint8(0),t.getUint8(1),t.getUint8(2)),t.getUint8(0)){case 16:if(3!=t.byteLength)return;const e=t.getUint8(1),s=1===t.getUint8(2);0===e?this._state.buttons.left=s:1===e&&(this._state.buttons.right=s),this.dispatchEvent(new CustomEvent("buttons-changed",{detail:{data:this._state.buttons}}))}}}customElements.define("board-button",class extends st{constructor(){super(),this.pressed=!1}static get properties(){return{pressed:{type:Boolean,reflect:!0}}}static get styles(){return[tt`
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
      `]}render(){return k`
      <div id="pcb"><div class="btnbox" ?pressed="${this.pressed}"><div class="btn"></div></div></div>
    `}});customElements.define("board-led",class extends st{constructor(){super(),this.lit=!1,this.row=-1,this.col=-1}static get properties(){return{lit:{type:Boolean,reflect:!0},row:{type:Number},col:{type:Number}}}static get styles(){return[tt`
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
      `]}render(){return k`
      <div id="pcb" @click="${this.clicked}"><div class="led" ?lit="${this.lit}"></div></div>
    `}clicked(){this.toggleLED(),this.dispatchEvent(new CustomEvent("change",{detail:{row:this.row,col:this.col,lit:this.lit}}))}toggleLED(){this.lit=!this.lit}});customElements.define("microbit-board",class extends st{static get properties(){return{leftbtn:{type:Boolean,reflect:!0},rightbtn:{type:Boolean,reflect:!0},deviceId:{type:String},model:{type:Object}}}static get styles(){return[tt`
            :host {
                display: inline-block;
                background: #001000;
                margin: auto;
                width: auto;
                border-radius: 1em;
            }

            .overlay {
                display: flex;
                position: absolute;
                align-items: center;
                justify-content: center;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background: blue;
                margin: auto;
                border-radius: 1em;
                background: rgba(250, 250, 250, 0.5);
                color: white;
                z-index: -10;
                cursor: pointer;
            }

            .overlay[addboard] {
                z-index: 10;
            }

            .mega {
                font-weight: bold;
                font-size: 400%;
                cursor: pointer;
            }

            .col {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
            }

            .rows {
                display: flex;
                position: relative;
                flex-direction: column;
                display: inline-block;
            }
            
            .row {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
            }

            .connectors {
                width: 80%;
                height: 2rem;
                background: rgba(200,100,20,0.5);
            }

            board-led {
                width:2.8em;
                height: 2.1em;
            }

            board-button {
                width:2.8em;
                height: 2.8em;
            }
            
            #disconnect {
                cursor: pointer;
                margin: 2px;
                border-radius: 2px;
                background-color: red;
                color: white;
            }

            [hide] {
                opacity: 0;
            }
        `]}constructor(){super(),this.leftbtn=!1,this.rightbtn=!1,this.model=null,this.NUM_ROWS=5,this.NUM_COLS=5,this.ledData=new Uint8Array(this.NUM_ROWS+1),this.ledData[0]=1}render(){return k`
            <div class="rows">
                <div class="row">
                    <div id="disconnect" @click=${this.disconnect} ?hide=${!this.model}>DISCONNECT</div>
                </div>
                <div class="row">
                    <div class="col">
                        <board-button ?pressed=${this.leftbtn}></board-button>
                    </div>
                    <div class="col">
                        <div class="rows">
                            ${Array(5).fill(0).map((t,e)=>k`
                                <div class="row">
                                    ${Array(5).fill(0).map((t,s)=>k`
                                        <board-led .row=${e} .col=${s} @change=${this.ledChange}></board-led>
                                    `)}
                                </div>
                            `)}
                        </div>
                    </div>
                    <div class="col">
                        <board-button ?pressed=${this.rightbtn}></board-button>
                    </div>
                </div>
                <div class="row">
                    <div class="row connectors"></div>
                </div>
                <div class="overlay" @click=${this.addBoard} ?addboard=${!this.model}>
                    <div class="mega">+</div>
                </div>
            </div>
        `}firstUpdated(){this.model&&(this.model.addEventListener("buttons-changed",t=>{const e=t.detail.data;this.leftbtn=e.left,this.rightbtn=e.right}),this.model.addEventListener("leds-changed",t=>{console.log(t.detail)}))}addBoard(t){this.model||it.scan()}disconnect(){this.model.disconnect()}ledChange(t){const{row:e,col:s,lit:i}=t.detail;this.model.setLED(e,s,i)}clearAll(){this.shadowRoot.querySelectorAll("board-led").forEach(t=>{t.lit=!1})}});const rt=new class extends EventTarget{register(){"serviceWorker"in navigator&&navigator.serviceWorker.register("./sw.js").then(t=>{let e;navigator.serviceWorker.addEventListener("controllerchange",()=>{console.log("controllerchange"),e||(this.dispatchEvent(new CustomEvent("update-available")),e=!0)})})}};customElements.define("main-app",class extends st{static get properties(){return{devices:{type:Object},updateAvailable:{type:Boolean}}}static get styles(){return[tt`
        .flex-container {
          display: flex;
          height: 100%;
        }
        .content {
          margin: auto;
          position: relative;
          width: 95%;
          max-width: 800px;
        }
        
        .col {
          display: flex;
          flex-direction: column;
        }

        .row {
          display: flex;
          flex-direction: row;
        }

        h1 {
          text-align: center;
        }

        button {
          flex-grow: 1;
          font-size: 1.2rem;
          margin: 0.2em;
        }

        microbit-board {
          margin-bottom: 10px;
        }

        .refresh {
          position: fixed;
          left: 20px;
          bottom: 20px;
          background: black;
        }

        a {
          font-weight: bold;
          line-height: 40px;
          color: white;
          margin: 20px;
        }

        a:hover {
          color: purple;
          cursor: pointer;
        }
    `]}constructor(){super(),this.devices=new Map,it.addEventListener("connect",t=>{const e=t.detail.deviceId;e&&!this.devices.has(e)&&(this.devices.set(e,new nt(e)),this.requestUpdate())}),it.addEventListener("disconnect",t=>{const e=t.detail.deviceId;e&&this.devices.has(e)&&(this.devices.delete(e),this.requestUpdate())}),it.addEventListener("data",t=>{console.log("DATA",t.detail)}),this.updateAvailable=!1,rt.addEventListener("update-available",()=>{this.updateAvailable=!0,console.log("Update available")}),rt.register()}render(){return k`
      <div class="flex-container">
        <div class="content">
          <div class="col">
            <h1>Zephyr & LitElement<br>with BBC:Microbit</h1>
            <microbit-board></microbit-board>
            ${Array.from(this.devices.values()).map((t,e)=>k`<microbit-board .model=${t}></microbit-board>`)}
          </div>
        </div>
      </div>
      ${this.updateAvailable?k`<div class="refresh"><a @click=${this.refresh}>REFRESH APP</a></div>`:""}
    `}refresh(){window.location.reload()}});
//# sourceMappingURL=index.js.map

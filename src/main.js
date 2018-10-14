import Vue from 'vue'
import App from './App.vue'

import VeeValidate from 'vee-validate';
var dictionary = {
  en: {
    messages: {
      required: function() { return "A response is required." }
    }
  }
};
VeeValidate.Validator.localize(dictionary);
Vue.use(VeeValidate, {
  events: ''
});

import { library } from '@fortawesome/fontawesome-svg-core'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faSpinner);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

export class ProgressiveProfile {
  constructor(opts) {
    this.opts = opts;;
  }
  show(callback) {
    if (document.readyState == 'complete') {
      this.mountApp(callback);
    } else {
      window.onload = (function() { this.mountApp(callback); }).bind(this)
    }
  }
  mountApp(callback) {
    var opts = this.opts;
    var AppComponentClass = Vue.extend(App);
    var app = new AppComponentClass({
      propsData: { opts: opts, callback: callback }
    });
    app.$mount();
    document.body.insertBefore(app.$el, document.body.firstChild);
  }
}

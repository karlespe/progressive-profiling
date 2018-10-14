<template>
  <div id="app" ref="container"></div>
</template>

<script>
import Vue from 'vue'
import QuestionModal from './components/QuestionModal.vue'

export default {
  name: 'app',
  components: { QuestionModal },
  props: {
    opts: {
      type: Object,
      required: true
    },
    callback: {
      type: Function,
      required: true
    }
  },
  mounted: function () {
    var ModalComponentClass = Vue.extend(QuestionModal);
    var modal = new ModalComponentClass({
      propsData: { opts: this.opts, callback: this.callback }
    });
    modal.$mount();
    this.$refs.container.appendChild(modal.$el);
    modal.show();
  }
}
</script>

<style>
  @import './assets/styles/bulma.css';
  body { padding-left: 40px; padding-right: 40px; padding-top: 20px; }
</style>

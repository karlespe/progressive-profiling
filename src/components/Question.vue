<template>

  <div class="columns is-multiline is-mobile">
    <div class="column is-one-half">
      <strong>{{ text }}</strong>
    </div>
    <div class="column is-one-half">
      <input type="text"
           :name="id"
           v-validate="'required'"
           :class="{ 'input': true, 'is-danger': errors.has(id) }"
           v-show="isTextbox()"
           v-model="response"
           autocomplete="off"
           @blur="questionChange"/>
      <div class="control" v-show="isMultiResponse()">
        <div v-for="option in options">
          <label class="radio">
            <input type="radio"
                   :name="id"
                   v-validate="'required'"
                   :class="{ 'is-danger': errors.has(id) }"
                   :value="option"
                   v-model="response"
                   @blur="questionChange"
                   @change="questionChange">
            {{ option }}
          </label>
        </div>
      </div>
      <span v-show="errors.has(id)" class="help is-danger">{{ errors.first(id) }}</span>
    </div>
  </div>

</template>

<script>
  import Vue from 'vue'
  export default {
    name: 'question',
    props: {
      id: {
        type: String,
        required: true
      },
      text: {
        type: String,
        required: true
      },
      val: {
        type: String,
        required: false,
        default: ""
      },
      options: {
        type: Array,
        required: false,
        default: function () { return [] }
      },
      bus: {
        type: Vue,
        required: true
      }
    },
    data() {
      return {
        response: ""
      }
    },
    methods: {
      questionChange: function() {
        this.$validator.validate().then((function(result) {
          if (result) {
            this.bus.$emit('question-change', this.id, this.response, true);
          } else {
            this.bus.$emit('question-change', this.id, this.response, false);
          }
        }).bind(this));
      },
      isTextbox: function() {
        return this.options === undefined || this.options.length == 0;
      },
      isMultiResponse: function() {
        return !this.isTextbox();
      }
    },
    mounted() {
      this.bus.$on('validate', (function() {
        this.$validator.validate().then(function(result) { });
      }).bind(this));
      this.bus.$on('response', (function(key, val) {
        if (this.id == key) {
          this.response = val;
        }
      }).bind(this));
    }
  }

</script>

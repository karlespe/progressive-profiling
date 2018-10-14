<template>

  <div class="modal is-active" v-show="showModal">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box" v-show="!showConfirm">

        <div v-for="question in this.opts.questions">
          <question
            :id="question.key"
            :text="question.text"
            :options="question.options"
            :val="userMetadata[question.key]"
            :bus="bus"
            v-show="showQuestion(question)">
          </question>
        </div>

        <div class="columns is-multiline is-mobile">
          <div class="column is-half"></div>
          <div class="control column is-half" v-show="showButtons">
            <button class="button is-primary" @click="onSave()" autofocus>Save</button>
            <button class="button" aria-label="close" @click="closeModal">Not now</button>
          </div>
          <div class="control column is-half" v-show="!showButtons">
            <font-awesome-icon icon="spinner" spin/>&nbsp;Saving
          </div>
          <div class="column is-full is-pulled-left">
            <button class="button is-link is-small" @click="showAllQuestions()" v-show="!showAll && showButtons">Update all of your question responses</button>
          </div>
        </div>

      </div>

      <div class="box" v-show="showConfirm">
        <div class="columns is-multiline is-mobile">
          <div class="column is-full">
            Thank you! Your responses have been saved.
          </div>
          <div class="column is-four-fifths"></div>
          <div class="control column is-one-fifth">
            <button class="button is-primary" @click="closeModalDone">Continue</button>
          </div>
        </div>
      </div>

    </div>
    <button class="modal-close is-large" aria-label="close" @click="closeModal"></button>
  </div>

</template>

<script>
  import Vue from 'vue'
  import auth0 from 'auth0-js'
  import Question from './Question.vue'
  import jsrsasign from 'jsrsasign';
  export default {
    name: 'questionModal',
    components: { Question },
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
    data() {
      return {
        showModal: false,
        showAll: false,
        showButtons: true,
        showConfirm: false,
        bus: new Vue(),
        mgmt: new auth0.Management({
          domain: this.opts.domain,
          token:  this.opts.token
        }),
        userMetadata: {},
        userMetadataProfilingStepKey: "auth0_user_metadata_profiling_step",
        userMetadataValid: [],
        user: null
      }
    },
    methods: {

      show: function () {
        this.mgmt.getUser(this.getUserIdFromToken(), (function(err, user) {
          if (err) {
            this.callback(err);
          } else {
            this.initializeUserMetadata(user);
            if (this.getQuestionsForThisStep().length > 0) {
              this.showModal = true;
            }
          }
        }).bind(this));
      },

      showQuestion: function(question) {
        var questions = this.getQuestionsForThisStep();
        for (var i = 0; i < questions.length; i++) {
          if (question.key == questions[i].key) {
            return true;
          }
        }
        return false;
      },

      getUserIdFromToken: function() {
        return jsrsasign.KJUR.jws.JWS.readSafeJSONString(jsrsasign.b64utoutf8(this.opts.token.split(".")[1])).sub;
      },

      initializeUserMetadata: function(user) {
        this.initializeResponseValidity();
        if (user.user_metadata) {
          for (var i = 0; i < this.opts.questions.length; i++) {
            var key = this.opts.questions[i].key;
            var val = user.user_metadata[key];
            this.userMetadata[key] = typeof val === "undefined" ? "" : val;
            if (!(typeof val === "undefined") && val) {
              this.userMetadataValid[key] = true;
              this.bus.$emit('response', key, val);
            }
          }
          this.userMetadata[this.userMetadataProfilingStepKey] = user.user_metadata[this.userMetadataProfilingStepKey] ? user.user_metadata[this.userMetadataProfilingStepKey] : "1";
        } else {
          this.userMetadata[this.userMetadataProfilingStepKey] = "1";
        }
      },

      initializeResponseValidity: function() {
        var questions = this.opts.questions;
        for (var i = 0; i < questions.length; i++) {
          this.userMetadataValid[questions[i].key] = false;
        }
      },

      getQuestionsForThisStep: function() {
        var step = 1;
        var questionsPerStep = this.opts.questions.length;
        if (!this.showAll) {
          step = this.getCurrentProfilingStep();
          questionsPerStep = this.getQuestionsPerStep();
        }
        return this.opts.questions.slice(((step - 1) * questionsPerStep), ((step - 1) * questionsPerStep) + questionsPerStep);
      },

      getCurrentProfilingStep: function() {
        return parseInt(this.userMetadata[this.userMetadataProfilingStepKey] ? this.userMetadata[this.userMetadataProfilingStepKey] : "1");
      },

      getQuestionsPerStep: function() {
        return parseInt(this.opts.questionsPerProfilingStep ? this.opts.questionsPerProfilingStep : "2");
      },

      allResponsesValid: function() {
        var questions = this.getQuestionsForThisStep();
        for (var i = 0; i < questions.length; i++) {
          if (!this.userMetadataValid[questions[i].key]) {
            return false;
          }
        }
        return true;
      },

      incrementProfilingStep: function(metadata) {
        var step = Math.ceil(this.opts.questions.length / this.getQuestionsPerStep());
        if (!this.showAll) {
          step = this.getCurrentProfilingStep();
        }
        metadata[this.userMetadataProfilingStepKey] = (step + 1) + "";
      },

      showAllQuestions: function() {
        this.showAll = true;
      },

      onSave: function() {
        this.bus.$emit("validate");
        if (this.allResponsesValid()) {
          this.saveResponses();
        }
      },

      cloneUserMetadata: function() {
        var metadata = {};
        for (var prop in this.userMetadata) {
          metadata[prop] = this.userMetadata[prop];
        }
        return metadata;
      },

      saveResponses: function() {
        this.showButtons = false;
        var metadata = this.cloneUserMetadata();
        this.incrementProfilingStep(metadata);
        this.mgmt.patchUserMetadata(this.getUserIdFromToken(), metadata, (function(err, updatedUser) {
          if (err) {
            this.showButtons = true;
            this.callback(err);
          } else {
            this.user = updatedUser;
            this.showConfirm = true;
          }
        }).bind(this));
      },

      closeModal: function() {
        this.showModal = false;
        this.callback(null, null);
      },

      closeModalDone: function() {
        this.showModal = false;
        this.callback(null, this.user);
      }

    },

    mounted() {
      this.bus.$on('question-change', (function(key, value, valid) {
        this.userMetadata[key] = value;
        this.userMetadataValid[key] = valid;
      }).bind(this));
    }

  }

</script>

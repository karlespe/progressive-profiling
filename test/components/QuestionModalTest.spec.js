import Vue from 'vue'
import { shallowMount, createLocalVue, mount } from '@vue/test-utils'
import QuestionModal from '../../src/components/QuestionModal.vue'
import VeeValidate from 'vee-validate';
Vue.use(VeeValidate);

describe('question modal component', function() {

  var STEP_KEY = "auth0_user_metadata_profiling_step";
  var QUESTIONS = [{key: "a", text: "What is a?"}, {key: "b", text: "Who is b?"}, {key: "c", text: "Where is c?"}]

  it('should initiate the questions per step correctly', function () {

    var opts = {questionsPerProfilingStep: 2, questions: QUESTIONS, domain: '', token: ''};
    var wrapper = shallowMount(QuestionModal, {
      sync: false, propsData: {
        opts: opts, callback: function () {
        }
      }
    });

    expect(wrapper.vm.getQuestionsPerStep()).toBe(2);

  });

  it('should initiate the current step correctly', function () {

    var opts = {questionsPerProfilingStep: 2, questions: QUESTIONS, domain: '', token: ''};
    var wrapper = shallowMount(QuestionModal, {
      sync: false, propsData: {
        opts: opts, callback: function () {
        }
      }
    });

    wrapper.vm.$data.userMetadata = {};

    expect(wrapper.vm.getCurrentProfilingStep()).toBe(1);

    wrapper.vm.$data.userMetadata[STEP_KEY] = "3";

    expect(wrapper.vm.getCurrentProfilingStep()).toBe(3);

  });

  it('should display questions for the current step', function () {

    var opts = {questionsPerProfilingStep: 2, questions: QUESTIONS, domain: '', token: ''};
    var wrapper = shallowMount(QuestionModal, {
      sync: false, propsData: {
        opts: opts, callback: function () {
        }
      }
    });

    wrapper.vm.$data.userMetadata = {};
    wrapper.vm.$data.userMetadata[STEP_KEY] = "2";

    var questionsForThisStep = wrapper.vm.getQuestionsForThisStep();
    expect(questionsForThisStep.length).toBe(1);
    expect(questionsForThisStep[0].key).toBe("c");

  });

  it('should determine whether to show a question of a certain type', function () {

    var opts = {questionsPerProfilingStep: 2, questions: QUESTIONS, domain: '', token: ''};
    var wrapper = shallowMount(QuestionModal, {
      sync: false, propsData: {
        opts: opts, callback: function () {
        }
      }
    });

    wrapper.vm.$data.userMetadata = {};
    wrapper.vm.$data.userMetadata[STEP_KEY] = "2";

    expect(wrapper.vm.showQuestion({key: "a"})).toBeFalsy();
    expect(wrapper.vm.showQuestion({key: "c"})).toBeTruthy();

  });

  it('should initialize existing user metadata', function () {

    var opts = {questionsPerProfilingStep: 2, questions: QUESTIONS, domain: '', token: ''};
    var wrapper = shallowMount(QuestionModal, {
      sync: false, propsData: {
        opts: opts, callback: function () {
        }
      }
    });

    var user = {user_metadata: {a: "answer a", b: "answer b"}};

    wrapper.vm.initializeUserMetadata(user);

    expect(wrapper.vm.$data.userMetadata["a"]).toBe("answer a");
    expect(wrapper.vm.$data.userMetadata["b"]).toBe("answer b");
    expect(wrapper.vm.$data.userMetadata["c"]).toBe("");
    expect(wrapper.vm.$data.userMetadata[wrapper.vm.$data.userMetadataProfilingStepKey]).toBe("1");

    user = {user_metadata: {a: "answer a", b: "answer b", auth0_user_metadata_profiling_step: "4"}};
    wrapper.vm.initializeUserMetadata(user);
    expect(wrapper.vm.$data.userMetadata[wrapper.vm.$data.userMetadataProfilingStepKey]).toBe("4");

  });

  it('should send a response event when initializing metadata', function () {

    var opts = {questionsPerProfilingStep: 2, questions: QUESTIONS, domain: '', token: ''};
    var wrapper = shallowMount(QuestionModal, {
      sync: false, propsData: {
        opts: opts, callback: function () {
        }
      }
    });

    var events = [];
    wrapper.vm.$data.bus.$on('response', (function(key, val) {
      events[key] = val;
    }).bind(this));

    var user = {user_metadata: {a: "answer a", b: "answer b"}};

    wrapper.vm.initializeUserMetadata(user);

    expect(events["a"]).toBe("answer a");
    expect(events["b"]).toBe("answer b");
    expect(events["c"]).toBeUndefined();

  });

  it('should initiate response validity', function () {

    var opts = {questionsPerProfilingStep: 2, questions: QUESTIONS, domain: '', token: ''};
    var wrapper = shallowMount(QuestionModal, {
      sync: false, propsData: {
        opts: opts, callback: function () {
        }
      }
    });

    var user = {user_metadata: {a: "answer a", b: "answer b"}};

    wrapper.vm.initializeUserMetadata(user);

    expect(wrapper.vm.$data.userMetadataValid["a"]).toBeTruthy();
    expect(wrapper.vm.$data.userMetadataValid["b"]).toBeTruthy();
    expect(wrapper.vm.$data.userMetadataValid["c"]).toBeFalsy();

  });

  it('should evaluate response validity', function () {

    var opts = {questionsPerProfilingStep: 2, questions: QUESTIONS, domain: '', token: ''};
    var wrapper = shallowMount(QuestionModal, {
      sync: false, propsData: {
        opts: opts, callback: function () {
        }
      }
    });

    wrapper.vm.$data.showAll = true;

    var user = {user_metadata: {a: "answer a", b: "answer b"}};
    wrapper.vm.initializeUserMetadata(user);

    expect(wrapper.vm.allResponsesValid()).toBeFalsy();

    user = {user_metadata: {a: "answer a", b: "answer b", c: "answer c"}};
    wrapper.vm.initializeUserMetadata(user);

    expect(wrapper.vm.allResponsesValid()).toBeTruthy();

  });

  it('should increment profiling step', function () {

    var opts = {questionsPerProfilingStep: 2, questions: QUESTIONS, domain: '', token: ''};
    var wrapper = shallowMount(QuestionModal, {
      sync: false, propsData: {
        opts: opts, callback: function () {
        }
      }
    });

    wrapper.vm.$data.userMetadata[STEP_KEY] = "1";
    var metadata = {};
    wrapper.vm.incrementProfilingStep(metadata);

    expect(metadata[STEP_KEY]).toBe("2");

    metadata = {};
    wrapper.vm.$data.showAll = true;
    wrapper.vm.incrementProfilingStep(metadata);

    expect(metadata[STEP_KEY]).toBe("3");

  });

  it('should show all questions', function () {

    var opts = {questionsPerProfilingStep: 2, questions: QUESTIONS, domain: '', token: ''};
    var wrapper = shallowMount(QuestionModal, {
      sync: false, propsData: {
        opts: opts, callback: function () {
        }
      }
    });
    expect(wrapper.vm.$data.showAll).toBeFalsy();
    wrapper.vm.showAllQuestions();
    expect(wrapper.vm.$data.showAll).toBeTruthy();

  });

});

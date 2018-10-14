import Vue from 'vue'
import { shallowMount, createLocalVue, mount } from '@vue/test-utils'
import Question from '../../src/components/Question.vue'
import VeeValidate from 'vee-validate';
Vue.use(VeeValidate);

describe('question component', function() {

  it('question type is textbox', function() {
    var wrapper = shallowMount(Question, { sync: false, propsData: { id: 'field_name', text: 'Question?', val: '', options: [], bus: new Vue() }});
    expect(wrapper.vm.isTextbox()).toBeTruthy();
    expect(wrapper.vm.isMultiResponse()).toBeFalsy();
    expect(wrapper.find('input[type="text"]').exists()).toBeTruthy();
    expect(wrapper.find('input[type="radio"]').exists()).toBeFalsy();
  });

  it('question type is multi response', function() {
    var wrapper = shallowMount(Question, { sync: false, propsData: { id: 'field_name', text: 'Question?', val: '', options: ['Yes', 'No'], bus: new Vue() }});
    expect(wrapper.vm.isTextbox()).toBeFalsy();
    expect(wrapper.vm.isMultiResponse()).toBeTruthy();
    expect(wrapper.find('input[type="radio"]').exists()).toBeTruthy();
    expect(wrapper.find('input[type="text"][style="display: none;"]').exists()).toBeTruthy();
  });

  it('question response is saved to model', function() {

    var wrapper = shallowMount(Question, { sync: false, propsData: { id: 'field_name', text: 'Question?', val: '', options: [], bus: new Vue() }});

    var input = wrapper.find('input[type="text"]');

    input.element.value = 'answer';
    input.trigger('input');
    input.trigger('blur');
    expect(wrapper.vm.$data.response).toBe('answer');

    input.element.value = '';
    input.trigger('input');
    input.trigger('blur');

    expect(wrapper.vm.$data.response).toBe('');

  });

  it('question response is updated via event', function() {

    var bus = new Vue();
    var key = 'field_name';
    var wrapper = shallowMount(Question, { sync: false, propsData: { id: key, text: 'Question?', val: '', options: [], bus: bus }});

    expect(wrapper.vm.$data.response).toBe('');

    var value = 'answer';
    bus.$emit("response", key, value);

    expect(wrapper.vm.$data.response).toBe(value);

  });

});

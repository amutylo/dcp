import Vue from 'vue'
import App from './App.vue'
import vSelect from 'vue-select'
Vue.component('v-select', vSelect)
import {Checkbox, Radio} from 'vue-checkbox-radio';
Vue.component('radio', Radio);

new Vue({
  el: '#app',
  render: h => h(App)
})

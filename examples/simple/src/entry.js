/**
 * @file empty entry
 * @author panyuqi <pyqiverson@gmail.com>
 */

import Vue from 'vue';
import Router from 'vue-router';

console.log('entry...')

Vue.use(Router);

let router = new Router({
    mode: 'history',
    routes: []
});

export default new Vue({
    router
});

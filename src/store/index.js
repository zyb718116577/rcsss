import Vue from 'vue';
import Vuex from 'vuex';
import {loginRouter} from "../router/index";

Vue.use(Vuex);
const store = new Vuex.Store({
    state: {
        count: 10000,
        currentPath:[]
    },
    mutations: {
        add(state) {
            state.count += 1;
        },
        reduce(state) {
            state.count -= 1;
        },
        setCurrentPath(state,to) {
            let index = {
                path: '/',
                name: 'index',
                title: '首页'
            };
            state.currentPath = [index,{
                path: to.path,
                name: to.name,
                title: to.meta.title
            }]
        }
    }
});

export default store;

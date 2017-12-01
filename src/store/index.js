import Vue from 'vue';
import Vuex from 'vuex';
import {loginRouter} from "../router/index";

Vue.use(Vuex);
const store = new Vuex.Store({
    state: {
        currentPath:[],//面包屑
        openedSubmenuArr: [],  // 要展开的菜单数组
    },
    mutations: {
        setCurrentPath(state,to) {
            let index = {
                path: '/quick/quickEntry',
                name: 'quickEntry',
                title: '首页'
            };
            state.currentPath = [index,{
                path: to.path,
                name: to.name,
                title: to.meta.title
            }]
        },
        addOpenSubmenu (state, name) {
            if (state.openedSubmenuArr.length > 0){
                state.openedSubmenuArr = [];
            }
            let hasThisName = false;
            let isEmpty = false;
            if (name.length === 0) {
                isEmpty = true;
            }
            if (state.openedSubmenuArr.indexOf(name) > -1) {
                hasThisName = true;
            }
            if (!hasThisName && !isEmpty) {
                state.openedSubmenuArr.push(name);
            }
        }
    }
});

export default store;

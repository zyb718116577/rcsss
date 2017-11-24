import Vue from 'vue'
import Router from 'vue-router'
import {getCookie} from "common/js/cookie";
import iView from 'iview'
import Main from 'components/main/main'
import Util from 'common/js/util'
import store from '../store/index';

Vue.use(Router)

export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: resolve => { require(['components/login/Login'], resolve); }
};
const redictRouter = {
    path: '/',
    // 重定向（默认路由）
    redirect: '/login'
};
export const menuRouter = [
    {
        path: '/quick',
        name: 'quick-entry',
        title: '快速入口',
        icon: 'paper-airplane',
        component: Main,
        meta: {
            title: '快速入口',
            requireAuth: true
        },
        children: [
            {
                path: 'quickEntry',
                icon: 'compose',
                name: 'quick-entry',
                meta: {
                    title: '快速入口',
                    requireAuth: true
                },
                component: resolve => { require(['components/user/userInfoList'], resolve); }
            }
        ]
    },
    {
        path: '/user',
        name: 'user',
        title: '用户管理',
        icon: 'ios-person',
        meta: {
            title: '',
            requireAuth: true
        },
        component: Main,
        children: [
            {
                path: 'userInfoList',
                icon: 'compose',
                name: 'userInfoList',
                meta: {
                    title: '用户管理',
                    requireAuth: true
                },
                component: resolve => { require(['components/user/userInfoList'], resolve); }
            },
            {
                path: 'groupInfoList',
                icon: 'person-stalker',
                name: 'groupInfoList',
                meta: {
                    title: '分组管理',
                    requireAuth: true
                },
                component: resolve => { require(['components/user/groupInfoList'], resolve); }
            }
        ]
    },
    {
        path: '/config',
        name: 'config',
        title: '配置管理',
        icon: 'gear-a',
        meta: {
            title: '',
            requireAuth: true
        },
        component: Main,
        children: [
            {
                path: 'updateConfigList',
                icon: 'arrow-graph-up-right',
                name: 'updateConfigList',
                meta: {
                    title: '自动更新',
                    requireAuth: true
                },
                component: resolve => { require(['components/user/userInfoList'], resolve); }
            }
        ]
    }
];

let routes = [...menuRouter,loginRouter,redictRouter];

export const router = new Router({routes: routes});

router.beforeEach((to, from, next) => {
    store.commit('setCurrentPath',to);
    iView.LoadingBar.start();
    Util.title(to.meta.title);
    if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
        if (getCookie('RCSSS')) {  // 通过cookie判断当前的cookie是否存在
            next();
        } else {
            next({
                path: '/login'
                //query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
            })
        }
    } else {
        next();
    }
});
router.afterEach((to) => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});

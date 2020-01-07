import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Map from '../views/map.vue'
import B from '../views/B.vue'


Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'map',
    component: Map
}, {
    path: '/map',
    name: 'map',
    component: Map
}, {
    path: '/b',
    name: 'b',
    component: B
}]

const router = new VueRouter({
    routes
})

export default router
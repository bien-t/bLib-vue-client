import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import Profile from './components/Profile.vue';
import Search from './components/Search.vue';
import Library from './components/Library.vue';
import Home from './components/Home.vue';
import Collection from './components/Collection.vue';
import Book from './components/Book.vue';
import Author from './components/Author.vue';
import Login from './components/Login.vue';
import Signup from './components/Signup.vue';

import { createRouter, createWebHistory } from 'vue-router'
import { ApolloClient, ApolloLink, createHttpLink, InMemoryCache, concat } from '@apollo/client/core'
import { DefaultApolloClient } from '@vue/apollo-composable'
const httpLink = createHttpLink({
  uri: 'http://localhost:4000',
  credentials: 'include'
});

const authMiddleware = new ApolloLink((operation, forward) => {
  const token = sessionStorage.getItem('token');
  operation.setContext({
    headers: {
      authorization: token ? token : ''
    }
  })
  return forward(operation)
})
const cache = new InMemoryCache();
export const apolloClient = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache,
})

const routes = [
  { path: '/', component: Home, },
  { path: '/search', component: Search },
  { path: '/profile', component: Profile },
  { path: '/library', component: Library },
  { path: '/collection', component: Collection },
  { path: '/book/:id', component: Book },
  { path: '/author/:id', component: Author },
  { path: '/login', component: Login },
  { path: '/signup', component: Signup },
  { path: '/:pathMatch(.*)*', component: Home }

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})



router.beforeEach((to, from) => {
  if (!sessionStorage.getItem('token') && (to.path !== '/login' && to.path !== '/signup')) {
    return '/login';
  }
  if (sessionStorage.getItem('token') && (to.path == '/login' || to.path == '/signup')) {
    return '/';
  }
})



createApp(App).provide(DefaultApolloClient, apolloClient).use(router).mount('#app')

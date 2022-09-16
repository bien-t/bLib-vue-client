<script setup lang="ts">
import MenuMobile from './MenuMobile.vue';
import MenuStandard from './MenuStandard.vue';
import { inject, Ref } from 'vue';
import {useRouter} from 'vue-router';
import { apolloClient } from '../main';

const token = inject('token') as Ref;
const router = useRouter();

const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userId');
    token.value = false;
    apolloClient.clearStore();
    router.push('/login');
}
</script>

<template>
    <menu class="text-white uppercase w-full text-center relative">
        <MenuMobile class="md:hidden" :logout="logout"></MenuMobile>
        <MenuStandard class="hidden md:flex" :logout="logout"></MenuStandard>
    </menu>
</template>

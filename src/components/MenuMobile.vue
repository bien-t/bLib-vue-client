<script setup lang="ts">
import { ref, Ref, inject } from 'vue';

const showMenu = ref(false);
const token = inject('token') as Ref;
const props = defineProps<{
    logout: () => void
}>();
</script>

<template>
    <div>
        <span class="flex h-[40px] bg-[#003366] hover:bg-[#003399] items-center justify-center cursor-pointer"
            @click="showMenu = !showMenu">Menu</span>
        <ul :class="showMenu ? 'flex' : 'hidden'" class="flex-col">
            <template v-if="token">
                <li class="w-full h-[40px] bg-[#003366] hover:bg-[#003399]">
                    <router-link class="h-full w-full  flex justify-center items-center" to='/'
                        @click="showMenu = false">
                        Home
                    </router-link>
                </li>
                <li class="w-full h-[40px] bg-[#003366] hover:bg-[#003399]">
                    <router-link class="h-full w-full  flex justify-center items-center" to='/search'
                        @click="showMenu = false">Search</router-link>
                </li>
                <li class="w-full h-[40px] bg-[#003366] hover:bg-[#003399]">
                    <router-link class="h-full w-full  flex justify-center items-center" to='/library'
                        @click="showMenu = false">Library</router-link>
                </li>
                <li class="w-full h-[40px] bg-[#003366] hover:bg-[#003399]">
                    <router-link class="h-full w-full  flex justify-center items-center" to="/collection"
                        @click="showMenu = false">My collection
                    </router-link>
                </li>
                <li class="w-full h-[40px] bg-[#003366] hover:bg-[#003399]">
                    <router-link class="h-full w-full  flex justify-center items-center" to='/profile'
                        @click="showMenu = false">Profile</router-link>
                </li>
                <li class="w-full h-[40px] bg-[#003366] hover:bg-[#003399]">
                    <a class="h-full w-full  flex justify-center items-center cursor-pointer"
                        @click="showMenu = false,props.logout()">Logout</a>
                </li>
            </template>
            <template v-else>
                <li class="w-full h-[40px] bg-[#003366] hover:bg-[#003399]">
                    <router-link class="h-full w-full  flex justify-center items-center" to='/login'
                        @click="showMenu = false">Login</router-link>
                </li>
                <li class="w-full h-[40px] bg-[#003366] hover:bg-[#003399]">
                    <router-link class="h-full w-full  flex justify-center items-center" to='/signup'
                        @click="showMenu = false">Signup</router-link>
                </li>
            </template>
        </ul>
    </div>
</template>
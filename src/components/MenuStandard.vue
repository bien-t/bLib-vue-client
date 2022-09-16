<script setup lang="ts">
import { inject, Ref } from 'vue';

const token = inject('token') as Ref;
const props = defineProps<{
    logout: () => void
}>();
</script>


<template>
    <ul
        class="flex-row justify-center items-center gap-x-1 mt-2 after:h-[8px] after:absolute after:bottom-0 after:left-0 after:w-full after:bg-[#003366] after:-z-[1]">
        <template v-if="token">
            <li class="h-[40px] bg-[#003366] hover:bg-[#003399] w-[150px] rounded-t-md">
                <router-link class="h-full w-full  flex justify-center items-center" to='/'>Home</router-link>
            </li>
            <li class="h-[40px] bg-[#003366] hover:bg-[#003399] w-[150px] rounded-t-md">
                <router-link class="h-full w-full  flex justify-center items-center" to='/search'>Search</router-link>
            </li>
            <li class="h-[40px] bg-[#003366] hover:bg-[#003399] w-[150px] rounded-t-md">
                <router-link class="h-full w-full  flex justify-center items-center" to='/library'>Library</router-link>
            </li>
            <li class="h-[40px] bg-[#003366] hover:bg-[#003399] w-[150px] rounded-t-md">
                <router-link class="h-full w-full  flex justify-center items-center" to="/collection">My collection
                </router-link>
            </li>
            <li class="h-[40px] bg-[#003366] hover:bg-[#003399] w-[150px] rounded-t-md">
                <router-link class="h-full w-full  flex justify-center items-center" to='/profile'>Profile</router-link>
            </li>
            <li class="h-[40px] bg-[#003366] hover:bg-[#003399] w-[150px] rounded-t-md">
                <a class="h-full w-full  flex justify-center items-center cursor-pointer"
                    @click="props.logout">Logout</a>
            </li>
        </template>

        <template v-else>
            <li class="h-[40px] bg-[#003366] hover:bg-[#003399] w-[150px] rounded-t-md">

                <router-link class="h-full w-full  flex justify-center items-center" to='/login'>Login</router-link>
            </li>
            <li class="h-[40px] bg-[#003366] hover:bg-[#003399] w-[150px] rounded-t-md">

                <router-link class="h-full w-full  flex justify-center items-center" to='/signup'>Signup</router-link>
            </li>
        </template>
    </ul>
</template>
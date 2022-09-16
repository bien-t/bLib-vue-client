<script setup lang="ts">
import { Book } from '../types';
const props = defineProps<{
    book: Book
}>();
</script>


<template>
    <div class="border-[#003366] border text-center">
        <router-link :to="`/book/${props.book._id}`">
            <img :src="props.book.imgUrl" alt="Book cover" class="border-b-[#003366] border w-[200px] h-[300px]">
        </router-link>
        <div class="flex flex-col font-bold ">
            <router-link :to="`/book/${props.book._id}`" class="hover:underline">{{ props.book.title }}</router-link>
            <router-link :to="`/author/${author._id}`" v-for="author in props.book.authors" :key="author._id" class="hover:underline">{{ `${author.name} ` }}
            </router-link>
        </div>
    </div>
</template>
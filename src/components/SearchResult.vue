<script setup lang="ts">
import { Data } from './Search.vue';
import BookMiniature from './BookMiniature.vue';
const props = defineProps<{
    data: Data
}>();

</script>

<template >
    <BookMiniature v-for="book in props.data.books" :book="book" v-if="props.data?.__typename === 'BooksPayload'"></BookMiniature>
    <div v-if="props.data?.__typename === 'AuthorsPayload'" v-for="author in props.data.authors" :key="author._id">
        <span><router-link class=" hover:font-bold" :to="`/author/${author._id}`">{{ author.name }}</router-link></span>
    </div>
    <div v-if="props.data?.__typename === 'Error'">
        <span class=" text-red-700">No result</span>
    </div>
</template>
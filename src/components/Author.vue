<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable';
import { watch, ref } from 'vue';
import { useRoute } from 'vue-router';
import { queryAuthor } from '../gql/queries'
import { Author } from '../types';

const route = useRoute();
const authorData = ref<Author>()
const { result } = useQuery(queryAuthor, { id: route.params.id }, { fetchPolicy: 'cache-and-network' });

watch(result, value => {
    authorData.value = value.getAuthor.author;

})
</script>

<template>
    <div>
        <h2 class="font-bold text-xl text-center">{{ authorData?.name }} books</h2>
        <div class="flex gap-3 flex-wrap justify-center mt-[12px]">
            <div class="border-[#003366] border text-center" v-for="book in authorData?.books">
                <router-link :to="`/book/${book._id}`">
                    <img :src="book.imgUrl" alt="Book cover" width="200"
                        class="border-b-[#003366] border w-[200px] h-[300px]">
                </router-link>
                <div class="flex flex-col font-bold ">
                    <router-link :to="`/book/${book._id}`" class="hover:underline">{{ book.title }}</router-link>
                </div>
            </div>
        </div>
    </div>
</template>
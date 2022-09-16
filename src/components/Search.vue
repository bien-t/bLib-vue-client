<script setup lang="ts">
import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import { reactive, ref, watch } from 'vue';
import { querySearch } from '../gql/queries';
import { apolloClient } from '../main';
import SearchResult from './SearchResult.vue'
import { Book, Author } from '../types';


export interface Data {
    __typename?: string
    books?: Book[]
    authors?: Author[]
}

interface SearchData {
    data: Data
}
provideApolloClient(apolloClient);

const searchData: SearchData = reactive({ data: {} });
const isDisabled = ref(true);
const selectedCategory = ref('');
const searchInput = ref('');

const submitQuery = () => {
    const { result } = useQuery(querySearch, { data: searchInput.value, category: selectedCategory.value }, { fetchPolicy: 'cache-and-network' })
    watch(result, value => {
        searchData.data = value.search;
    })
}

watch([selectedCategory, searchInput], () => {
    if (selectedCategory.value && searchInput.value) {
        isDisabled.value = false;
    } else {
        isDisabled.value = true;
    }
})


</script>

<template>
    <div class="w-[90%]">
        <form class="flex flex-col  gap-y-3" @submit.prevent="submitQuery">
            <label for="searchValue" class="text-center font-bold text-xl">Search</label>
            <input type="search" name="searchValue" id="searchValue" class="w-full border border-[#003366]"
                v-model="searchInput">
            <div class="flex justify-center gap-x-3">
                <label for="byTitle">Book by title
                    <input type="radio" name="searchCategory" id="byTitle" value="title" v-model="selectedCategory">
                </label>

                <label for="byISBN">Book by ISBN
                    <input type="radio" name="searchCategory" id="byISBN" value="isbn" v-model="selectedCategory">
                </label>

                <label for="byAuthor">Author
                    <input type="radio" name="searchCategory" id="byAuthor" value="author" v-model="selectedCategory">
                </label>
            </div>
            <button type="submit" class=" text-white self-center px-4 py-1 rounded-md uppercase"
                :class="isDisabled ? 'bg-slate-600' : 'bg-[#003366]'" :disabled="isDisabled">Submit</button>
        </form>

        <div class="flex gap-3 flex-wrap justify-center mt-[12px]">
            <SearchResult :data="searchData.data"></SearchResult>
        </div>
    </div>
</template>
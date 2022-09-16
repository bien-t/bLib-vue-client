<script setup lang="ts">
import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import { queryUserCollection } from '../gql/queries';
import { UserInfo } from '../App.vue';
import { inject, reactive, ref, watch } from 'vue';
import { apolloClient } from '../main';
import CollectionMiniature from './CollectionMiniature.vue';
import { Book } from '../types';

provideApolloClient(apolloClient);

interface Books {
    book: {
        _id: string
        status: string
        book: Book
    }
}

const userInfo = inject('userInfo') as UserInfo;
const books = reactive({ books: {} as Books });

const currentFilter = ref('All');

if (userInfo.user._id) {
    const { onResult } = useQuery(queryUserCollection, { id: userInfo.user._id, bookFilter: currentFilter.value }, { fetchPolicy: 'cache-and-network' });
    onResult((res) => {
        books.books = res.data.getUser.user.books;
    })
}

watch(userInfo, (newUserInfo) => {
    const { onResult } = useQuery(queryUserCollection, { id: newUserInfo.user._id, bookFilter: currentFilter.value });
    onResult((res) => {
        books.books = res.data.getUser.user.books;
    })

})

const changeEvent = (event: Event) => {
    currentFilter.value = (event.target as HTMLInputElement).value;
}

watch(currentFilter, () => {
    const { result, onResult } = useQuery(queryUserCollection, { id: userInfo.user._id, bookFilter: currentFilter.value }, { fetchPolicy: 'network-only' });
    onResult(() => {
        books.books = result.value.getUser.user.books;
    })
})

</script>

<template>
    <section class="flex flex-col gap-y-3  w-full items-center">
        <h2 class="font-bold text-xl text-center"> My collection</h2>
        <fieldset class="border border-[#003366] flex flex-wrap w-[80%] justify-between md:w-[60%] p-1"
            @change="changeEvent">
            <legend> Filter your books</legend>
            <div><input type="radio" name="filter" id="all" value="All" :checked="currentFilter==='All'"><label
                    for="all">All</label></div>
            <div><input type="radio" name="filter" id="completed" value="Completed"
                    :checked="currentFilter==='Completed'"><label for="completed">Completed</label></div>
            <div><input type="radio" name="filter" id="planToRead" value="Plan to read"
                    :checked="currentFilter==='Plan to read'"><label for="planToRead">Plan to
                    read</label></div>
            <div><input type="radio" name="filter" id="reading" value="Reading"
                    :checked="currentFilter==='Reading'"><label for="reading">Reading</label>
            </div>
        </fieldset>
        <CollectionMiniature v-for="book in books?.books" :key="book.book._id" :book="book.book" :status="book.status"
            :userId="userInfo.user._id" :id="book._id"></CollectionMiniature>

    </section>
</template>
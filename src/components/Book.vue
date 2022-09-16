<script setup lang="ts">
import { useMutation, useQuery } from '@vue/apollo-composable';
import { watch, ref, inject, computed } from 'vue';
import { useRoute } from 'vue-router';
import { UserInfo } from '../App.vue';
import { addToCollection } from '../gql/mutations';
import { queryBook } from '../gql/queries'
import { Book } from '../types';

const route = useRoute();
const userInfo = inject('userInfo') as UserInfo;
const bookData = ref<Book>();
const bookStatus = ref('Completed');
const showChangeStatusPanel = ref(false);
const showChangeStatusMessage = ref(false);
const changeStatusMessage = ref('');


const { result } = useQuery(queryBook, { id: route.params.id }, { fetchPolicy: 'cache-and-network' });
const { mutate, onDone } = useMutation(addToCollection);

const setBookStatus = (event: Event) => {
    bookStatus.value = (event.target as HTMLInputElement).value;
}

watch(result, value => {
    bookData.value = value.getBook.book;
})

const submit = () => {
    mutate({ bookId: bookData.value?._id, userId: userInfo.user._id, bookStatus: bookStatus.value }, {
        update: (cache) => {
            cache.modify({
                id: 'User:' + userInfo.user._id,
                fields: {
                    books(currentBooks) {
                        const newBooks = [...currentBooks, { book: { _id: bookData.value?._id } }] as [{book:Book}]
                        userInfo.user.books = newBooks; 
                        return newBooks
                    }
                }
            })
        }
    })

    onDone(result => {
        if (result.data.addToCollection.errors.length === 0) {
            showChangeStatusPanel.value = false;
            showChangeStatusMessage.value = true;
            changeStatusMessage.value = result.data.addToCollection.message;
            setTimeout(() => {
                showChangeStatusMessage.value = false;
            }, 3000)
        }
    })
}

const isInCollection = computed(() => {
    const array = userInfo?.user?.books || [];
    const filteredArray = array.filter(book => book?.book._id === route.params.id);
    return filteredArray.length > 0 ? false : true;
})

</script>

<template>
    <div class="flex  w-full justify-center">
        <div class="flex flex-col items-center border border-[#003366]  w-[80%] md:w-[70%] md:flex-row md:items-start">
            <img :src="bookData?.imgUrl" alt="Book cover"
                class="mt-2 md:mt-0 border-r-[#003366] border w-[200px] h-[300px]">
            <div class="flex flex-col items-center w-full mr-1 mb-2 md:items-stretch md:mb-0 md:h-full md:pl-1">
                <span>Title: {{ bookData?.title }}</span>
                <span>
                    Author(s):
                    <router-link :to="`/author/${author._id}`" v-for="author in bookData?.authors" :key="author._id"
                        class="hover:underline hover:font-bold">{{ `${author.name} `
                        }}
                    </router-link>
                </span>
                <span>ISBN: {{ bookData?.isbn }}</span>
                <span>Description: {{ bookData?.description }}</span>


                <button v-if="isInCollection" type="button"
                    class="bg-[#003366] text-white  px-4 py-1 rounded-md uppercase self-center md:self-start mt-2 mb-2"
                    @click="showChangeStatusPanel = !showChangeStatusPanel">Add to
                    collection</button>
                <div v-if="showChangeStatusPanel">
                    <form>
                        <select class="p-1" name="selectBookStatus" id="selectBookStatus" @change="setBookStatus">
                            <option value="Completed">Completed</option>
                            <option value="Plan to read">Plan to read</option>
                            <option value="Reading">Reading</option>
                        </select>
                        <button type="submit" @click.prevent="submit"
                            class="bg-[#003366] text-white  px-4 py-1 rounded-md uppercase ml-2">Add</button>
                    </form>
                </div>
                <span v-if="showChangeStatusMessage" class="text-green-500">{{ changeStatusMessage }}</span>
            </div>
        </div>
    </div>
</template>
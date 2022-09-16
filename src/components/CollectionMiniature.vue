<script setup lang="ts">
import { Book } from '../types';
import { ref,inject } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import { changeBookStatus, removeFromCollection } from '../gql/mutations';
import { UserInfo } from '../App.vue';

const props = defineProps<{
    userId: string
    status: string
    book: Book
    id: string
}>();

const showChangeStatus = ref(false);
const changeStatusInput = ref(props.status);
const userInfo = inject('userInfo') as UserInfo;

const { mutate: mutateChangeBookStatus, onDone } = useMutation(changeBookStatus);
const { mutate: mutateRemoveFromCollection } = useMutation(removeFromCollection);

const changeStatus = (event: Event) => {
    changeStatusInput.value = (event.target as HTMLInputElement).value
}

const submitChangeStatus = (bookId: string) => {
    mutateChangeBookStatus({ userId: props.userId, bookId: bookId, newStatus: changeStatusInput.value })
    onDone(() => {
        showChangeStatus.value = false;
    })
}

const submitRemoveFromCollection = (bookId: string) => {
    mutateRemoveFromCollection({ userId: props.userId, bookId: bookId },
        {
            update: (cache) => {
                cache.modify({
                    id: 'UserBook:' + props.id,
                    fields(value, details) {
                        return details.DELETE;
                    }
                })
                cache.modify({
                    id: 'User:' + props.userId,
                    fields: {
                        books(currentValue) {
                            const newBooks = currentValue.filter(((book: { book: Book }) => book.book._id !== bookId));
                            userInfo.user.books = newBooks;
                            return newBooks;
                        }
                    }
                })

            }
        }
    )
}
</script>

<template>
    <div class="flex flex-col items-center border border-[#003366]  w-[80%] md:w-[70%] md:flex-row md:items-start">
        <img :src="props.book.imgUrl" alt="Book cover"
            class="mt-2 md:mt-0 w-[200px] h-[300px] border border-r-[#003366]">
        <div class="flex flex-col items-center w-full mr-1 mb-2 md:items-stretch md:mb-0 md:pl-1">
            <span>Title: <router-link :to="`/book/${props.book._id}`" class="hover:underline hover:font-bold">{{
            props.book.title }}</router-link></span>
            <span>
                Author(s):
                <router-link :to="`/author/${author._id}`" v-for="author in props.book.authors" :key="author._id"
                    class="hover:underline hover:font-bold">{{
                    `${author.name} `
                    }} </router-link>
            </span>

            <span>ISBN: <router-link :to="`/book/${props.book._id}`" class="hover:underline hover:font-bold">{{
            props.book.isbn }}</router-link></span>
            <div class="flex flex-col items-center md:flex-row md:items-start">
                <span>Status: {{ props.status }}</span><button type="button"
                    class="bg-[#003366] text-white px-4 py-1 rounded-md uppercase md:ml-auto"
                    @click="showChangeStatus = !showChangeStatus">Change
                    status</button>
            </div>

            <form v-if="showChangeStatus">
                <select class="p-1" name="selectBookStatus" id="selectBookStatus" @change="changeStatus">
                    <option value="Completed" :selected="status === 'Completed' ? true : false">Completed</option>
                    <option value="Plan to read" :selected="status === 'Plan to read' ? true : false">Plan to read
                    </option>
                    <option value="Reading" :selected="status === 'Reading' ? true : false">Reading</option>
                </select>
                <button type="submit" @click.prevent="submitChangeStatus(book._id)"
                    class="bg-[#003366] text-white  px-4 py-1 rounded-md uppercase ml-2">Change</button>

            </form>

            <button type="button"
                class="bg-[#003366] text-white  px-4 py-1 rounded-md uppercase self-center mt-2 md:self-end"
                @click="submitRemoveFromCollection(book._id)">Remove
                from collection</button>
        </div>
    </div>
</template>
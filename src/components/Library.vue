<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useQuery, useMutation } from '@vue/apollo-composable';
import { queryBooks } from '../gql/queries';
import { addBook } from '../gql/mutations';
import BookMiniature from './BookMiniature.vue'
import { Book } from '../types';


export interface Data {
    data: {
        books?: Book[]
    }
}

interface FormData {
    title: string,
    isbn: string,
    authors: string[],
    pages: number,
    imgUrl: string,
    description: string
}

const showForm = ref(false);
const formData = reactive({
    title: '',
    isbn: '',
    author: '',
    pages: 0,
    imgUrl: '',
    description: ''
});

const { result } = useQuery(queryBooks, {});
const { mutate, onDone } = useMutation(addBook, {
    variables: {} as FormData, update: (cache, { data: addBookData }) => {
        cache.modify({
            fields: {
                getBooks(currentBooks) {
                    return { ...currentBooks, books: [...currentBooks.books, addBookData.bookAdd.book] }
                }
            }
        })
    }
})

const setShowForm = () => {
    showForm.value = !showForm.value;
}

const sendForm = () => {
    const authors = formData.author.split(';');
    mutate(
        {
            title: formData.title,
            isbn: formData.isbn,
            authors: authors,
            pages: formData.pages,
            imgUrl: formData.imgUrl,
            description: formData.description
        }
    )
}

onDone(() => {
    showForm.value = false;
    formData.title = '';
    formData.isbn = '';
    formData.pages = 0;
    formData.author = '';
    formData.imgUrl = '';
    formData.description = '';
})
</script>

<template>
    <section class="text-center flex flex-col gap-y-3">
        <h2 class="font-bold text-xl">Library</h2>
        <button @click="setShowForm" type="button"
            class="bg-[#003366] text-white self-center px-4 py-1 rounded-md uppercase">Add a new
            book</button>
        <div v-if="showForm">
            <ul class=" list-disc">
                <li>ISBN: accepts only 13 characters number, e.g. 1234567891234</li>
                <li>Author: if more than one, split them with ";", e.g. Author 1; Author 2</li>
            </ul>
            <form class="flex flex-col gap-y-3 ">
                <div class="flex flex-col self-center w-full max-w-[80%] md:flex-row md:max-w-[100%] md:gap-x-2  ">
                    <label for="bookTitle" class="flex flex-col">Title<input type="text" name="bookTitle" id="bookTitle"
                            class="border border-[#003366] invalid:border-red-500" v-model="formData.title"
                            required></label>
                    <label for="bookIsbn" class="flex flex-col">ISBN<input type="text" name="bookIsbn" id="bookIsbn"
                            class="border border-[#003366] invalid:border-red-500" v-model="formData.isbn"
                            maxlength="13" minlength="13" required></label>
                    <label for="bookAuthor" class="flex flex-col">Author<input type="text" name="bookAuthor"
                            id="bookAuthor" class="border border-[#003366] invalid:border-red-500"
                            v-model="formData.author" required></label>
                    <label for="bookPages" class="flex flex-col">Pages<input type="number" name="bookPages"
                            id="bookPages" class="border border-[#003366] invalid:border-red-500"
                            v-model="formData.pages" required></label>
                </div>
                <div class="max-w-[80%] w-full self-center md:max-w-[100%]">
                    <label class="mr-1" for="imageCoverUrl">Image cover url</label>
                    <input type="text" name="imageCoverUrl" id="imageCoverUrl"
                        class="border border-[#003366] w-full invalid:border-red-500" v-model="formData.imgUrl"
                        required>

                </div>
                <div class="self-center max-w-[80%] w-full md:max-w-[100%]">
                    <label for="">Book description</label>
                    <textarea name="" id="" rows="10"
                        class="border border-[#003366] w-full resize-none invalid:border-red-500"
                        v-model="formData.description" required></textarea>
                </div>

                <button type="submit" class="bg-[#003366] text-white self-center px-4 py-1 rounded-md uppercase"
                    @click.prevent="sendForm">Add</button>
            </form>

        </div>
        <div class="flex gap-3 flex-wrap justify-center mt-[12px]">
            <BookMiniature v-for="book in result?.getBooks.books" :book="book" :key="book._id"></BookMiniature>
        </div>



    </section>

</template>
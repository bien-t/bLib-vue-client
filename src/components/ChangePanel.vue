<script setup lang="ts">
import { Message } from '../types';

const props = defineProps<{ send: () => void, close: () => void, errors: Message[]}>();
</script>

<template>
    <div class="fixed top-0 left-0 bg-slate-500 bg-opacity-70 h-screen w-full flex justify-center ">
        <form
            class="w-[90%] bg-white max-w-[300px]  h-[300px] flex flex-col items-center gap-y-2 border-2 border-[#003366] relative mt-20">
            <button type="button"
                class="bg-[#003366] text-white px-4 py-1  rounded-md uppercase absolute -right-3 -top-3 pointer"
                @click="props.close">X</button>
            <slot></slot>
            <button type="submit" class="bg-[#003366] text-white px-4 py-1  rounded-md uppercase "
                @click.prevent="props.send">Submit</button>
            <template v-if="errors">
                <span v-for="error in errors" class=" text-red-600 mb-3">{{ error.message }}</span>
            </template>
        </form>
    </div>
</template>
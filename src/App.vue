<script setup lang="ts">
import Menu from './components/Menu.vue';
import { ref, provide, reactive, watch } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { queryUser } from './gql/queries';
import { Book } from './types';
export type UserInfo = {
  user: {
    _id: string
    email: string
    books: [
      {book:Book}
    ]
  }
}

const token = ref(false);
const userInfo = reactive({ user: {} as UserInfo });


if (sessionStorage.getItem('token')) {
  token.value = true;
}

if (sessionStorage.getItem('userId')) {
  const { result } = useQuery(queryUser, { id: sessionStorage.getItem('userId') });
  watch(result, value => {
    userInfo.user = value.getUser.user;
  })
}

provide('token', token);
provide('userInfo', userInfo);

</script>

<template>
  <Menu></Menu>
  <main class="flex justify-center mt-16 text-[#003366]">
    <RouterView class="max-w-[800px] md:max-w-[900px]"></RouterView>
  </main>
</template>

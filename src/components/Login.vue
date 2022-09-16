<script setup lang="ts">
import { inject, Ref, ref } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import { userLogin } from '../gql/mutations';
import { useRouter } from 'vue-router';
import { UserInfo } from '../App.vue';

interface Login {
    email: string
    password: string
}

type Message = {
    message: string,
    __typename: string
}

const router = useRouter();
const token = inject('token') as Ref;
const userInfo = inject('userInfo') as UserInfo;
const emailInput = ref('');
const passwordInput = ref('');
const errors = ref([] as Message[]);

const { mutate, onDone } = useMutation(userLogin, { variables: {} as Login });

const sendForm = () => {
    mutate(
        {
            email: emailInput.value,
            password: passwordInput.value,
        }

    )
}

onDone(result => {
    if (result.data.userLogin.errors.length > 0) {
        errors.value = result.data.userLogin.errors;
    }

    if (result.data.userLogin.errors.length === 0) {
        sessionStorage.setItem('token', `${result.data.userLogin.token}`);
        sessionStorage.setItem('userId', `${result.data.userLogin.user._id}`);
        userInfo.user = result.data.userLogin.user;
        token.value = true;
        router.push('/');
    }
})


</script>

<template>
    <div class="w-[90%] flex justify-center">
        <form class="border-[#003366] border-2 rounded-md max-w-[500px] w-full flex flex-col items-center gap-y-3 ">
            <h3 class="uppercase w-full mt-3 font-bold text-center">Login</h3>
            <div class="flex flex-wrap">
                <label for="email" class="w-[80px]">Email:</label>
                <input type="email" name="email" id="email" class="border border-[#003366] invalid:border-red-500"
                    v-model="emailInput">
            </div>
            <div class="flex  flex-wrap">
                <label for="password" class="w-[80px]">Password:</label>
                <input type="password" name="password" id="password"
                    class="border border-[#003366] invalid:border-red-500" v-model="passwordInput">
            </div>
            <button type="submit" class="bg-[#003366] text-white  px-4 py-1 rounded-md uppercase mb-3 "
                @click.prevent="sendForm">Login</button>
            <template v-if="errors">
                <span v-for="error in errors" class=" text-red-600 mb-3">{{error.message}}</span>
            </template>
        </form>
    </div>

</template>
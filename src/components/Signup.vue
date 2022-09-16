<script setup lang="ts">
import { useMutation } from '@vue/apollo-composable';
import { ref, inject, Ref } from 'vue';
import { userCreate } from '../gql/mutations';
import { useRouter } from 'vue-router';
import { UserInfo } from '../App.vue';

interface Signup {
    email: string
    password: string
}

type Message = {
    message: string,
    __typename: string
}

const router = useRouter();
const errors = ref([] as Message[]);
const token = inject('token') as Ref
const userInfo = inject('userInfo') as UserInfo;
const emailInput = ref('');
const passwordInput = ref('');
const emailValidation = ref(false);
const passwordValidation = ref(false);

const { mutate, onDone } = useMutation(userCreate, { variables: {} as Signup });

const sendForm = () => {
    mutate(
        {
            email: emailInput.value,
            password: passwordInput.value
        }

    )
}

onDone(result => {
    if (result.data.userCreate.errors.length > 0) {
        errors.value = result.data.userCreate.errors;
    }

    if (result.data.userCreate.errors.length === 0) {
        sessionStorage.setItem('token', `${result.data.userCreate.token}`);
        sessionStorage.setItem('userId', `${result.data.userLogin.user._id}`);
        token.value = true;
        userInfo.user = result.data.userCreate.user;

        router.push('/');
    }
})

const edit = (event: Event) => {
    if ((event.target as HTMLInputElement).name === 'email') {
        emailValidation.value = (event.target as HTMLInputElement).checkValidity()
    }
        if ((event.target as HTMLInputElement).name === 'password') {
        passwordValidation.value = (event.target as HTMLInputElement).checkValidity()
    }
}

</script>

<template>
    <div class="w-[90%] flex justify-center">
        <form class="border-[#003366] border-2 rounded-md max-w-[500px] w-full flex flex-col items-center gap-y-3 ">
            <h3 class="uppercase w-full mt-3 font-bold text-center">Signup</h3>
            <div class="flex flex-wrap">
                <label for="email" class="w-[80px]">Email:</label>
                <input type="email" name="email" id="email" required
                    class="border border-[#003366] invalid:border-red-500" v-model="emailInput" @input="edit"
                    pattern=".+@.+\..+">
            </div>
            <div class="flex  flex-wrap">
                <label for="password" class="w-[80px]">Password:</label>
                <input type="password" name="password" id="password"
                    class="border border-[#003366] invalid:border-red-500" v-model="passwordInput" required minlength="6"
                    @input="edit">
            </div>
            <button type="submit" class="bg-[#003366] text-white  px-4 py-1 rounded-md uppercase mb-3 disabled:bg-slate-500 "
                @click.prevent="sendForm" :disabled="!emailValidation || !passwordValidation">Register</button>
            <template v-if="errors">
                <span v-for="error in errors" class=" text-red-600 mb-3">{{ error.message }}</span>

            </template>
        </form>
    </div>

</template>
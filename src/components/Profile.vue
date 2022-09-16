<script setup lang="ts">
import { ref, inject } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import { Message } from '../types';
import ChangePanel from './ChangePanel.vue';
import { UserInfo } from '../App.vue';
import { changeEmail } from '../gql/mutations';
import { changePassword } from '../gql/mutations';



const errors = ref([] as Message[]);
const showChangePasswordPanel = ref(false);
const showChangeEmailPanel = ref(false);
const password = ref('');
const passwordConfirm = ref('');
const email = ref('');
const emailConfirm = ref('');
const userInfo = inject('userInfo') as UserInfo;

const { mutate: emailChange, onDone: emailDone } = useMutation(changeEmail);
const { mutate: passwordChange, onDone: passwordDone } = useMutation(changePassword);


const emailInfo = {
    send: () => {
        if (email.value === emailConfirm.value) {
            errors.value = [];
            emailChange({ email: email.value, emailConfirm: emailConfirm.value, id: userInfo.user._id });
            emailDone((result) => {
                if (result.data.changeEmail.errors.length > 0) {
                    errors.value = result.data.changeEmail.errors;
                } else {
                    userInfo.user.email = result.data.changeEmail.email;
                    showChangeEmailPanel.value = false;
                    email.value = '';
                    emailConfirm.value = '';
                }
            })
        } else {
            errors.value = [{ message: 'Emails are different' }];
        }
    },
    close: () => {
        showChangeEmailPanel.value = false;
    }
}

const passwordInfo = {
    send: () => {
        if (password.value === passwordConfirm.value) {
            errors.value = [];
            passwordChange({ password: password.value, passwordConfirm: passwordConfirm.value, id: userInfo.user._id });
            passwordDone((result) => {
                if (result.data.changePassword.errors.length > 0) {
                    errors.value = result.data.changePassword.errors;
                } else {
                    showChangePasswordPanel.value = false;
                    password.value = '';
                    passwordConfirm.value = '';
                }
            })
        } else {
            errors.value = [{ message: 'Passwords are different' }]
        }
    },
    close: () => {
        showChangePasswordPanel.value = false
    }
}

</script>

<template>
    <section class="flex flex-col w-full gap-y-3">
        <h2 class="font-bold text-xl text-center">Profile</h2>
        <div class="flex flex-col border self-center border-[#003366] p-1 w-[80%] md:w-[60%] ">
            <span>Id: {{ userInfo.user._id }}</span>
            <span>Email: {{ userInfo.user.email }}</span>
            <button type="button" class="bg-[#003366] text-white px-4 py-1 rounded-md uppercase mt-10"
                @click="showChangeEmailPanel = true">Change
                email</button>
            <button type="button" class="bg-[#003366] text-white px-4 py-1 rounded-md uppercase my-1"
                @click="showChangePasswordPanel = true">Change
                password</button>
        </div>
        <ChangePanel v-if="showChangeEmailPanel" v-bind="emailInfo" :errors="errors">
            <h3 class="font-bold text-center mt-5">Type your new email address</h3>
            <label for="email">Email:</label>
            <input type="email" name="email" id="email" class="border border-[#003366] w-[90%] invalid:border-red-500"
                required pattern=".+@.+\..+" v-model="email">
            <label for="">Confirm email:</label>
            <input type="email" name="emailConfirm" id="emailConfirm"
                class="border border-[#003366] w-[90%] invalid:border-red-500" required pattern=".+@.+\..+"
                v-model="emailConfirm">
        </ChangePanel>
        <ChangePanel v-if="showChangePasswordPanel" v-bind="passwordInfo" :errors="errors">
            <h3 class="font-bold text-center mt-5">Type your new password</h3>
            <label for="password">Password:</label>
            <input type="password" name="password" id="password"
                class="border border-[#003366] w-[90%] invalid:border-red-500" required minlength="6"
                v-model="password">
            <label for="passwordConfirm">Confirm password:</label>
            <input type="password" name="passwordConfirm" id="passwordConfirm"
                class="border border-[#003366] w-[90%] invalid:border-red-500" required minlength="6"
                v-model="passwordConfirm">
        </ChangePanel>

    </section>
</template>
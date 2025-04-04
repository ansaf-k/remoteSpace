import { defineStore } from 'pinia';
import { ref } from 'vue';
import {type User } from './userStore';
import { directus, readItems } from 'src/services/directus';
import { useRoute } from 'vue-router';

export const useTeamStore = defineStore('team', () => {
    const user = ref<User[] | null>(null);
    const route = useRoute();

    async function fetchTeamMembers() {
        const userId = route.params.id;
        try {
            const response = await directus.request(readItems('teams',{
                filter:{user_id :{_eq:userId}}
            }));
            user.value = response as User[];
        } catch (err) {
            console.log(err)
        }
    }

    return {
        fetchTeamMembers
    }
})
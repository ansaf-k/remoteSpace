// src/stores/userStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { directus, readUser, readUsers, customEndpoint } from '../services/directus';
import { useRoute } from 'vue-router';
import { type OutputFileType } from 'typescript';


export interface User {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    position?: string;
    avatar?: string;
    active_status?: 'online' | 'offline' | 'away';
    last_access: Date;
}

interface CustomQuery {
    search?: string;
    limit?:number;
    filter?: {
        active_status?: {
            _eq: string;
        };
    };
}

interface UserFilters {
    search?: string;
    status?: User['active_status'] | null;
    limit?: number;
}


export interface Badge {
    id: string;
    image_url: string;
    name: string;
    description: string;
    awarded_at: Date;
    message: object | null;
}


export const useUserStore = defineStore('user', () => {
    const user = ref<User | null>(null); // Store selected user's profile
    const activeUsers = ref<User[]>(); // Store selected user's profile
    const userBadge = ref();
    const teamMembers = ref();
    const users = ref<User[]>();
    const route = useRoute();
    const error = ref('');


    async function fetchUsers(filters: UserFilters) {
        try {

            const params: CustomQuery = {
                limit: filters.limit || 15,

            };

            if (filters.search) {
                params.search = filters.search
            }

            if (filters.status) {
                params.filter = {
                    active_status: { _eq: filters.status }
                };
            }
            console.log(params);

            const data = await directus.request(readUsers(params));
            users.value = data as User[];
            console.log(data);
        } catch (err) {
            console.log(err);
        }
    }


    // Fetch another user by ID
    async function fetchUserById() {
        const userId = route.params.id;
        try {
            const response = await directus.request(readUser(userId as string));
            console.log(response);
            user.value = response as User;
            console.log(user.value);
        } catch (err) {
            console.error('Error fetching user by ID:', err);
        }
    }

    // fetch active users
    async function fetchActiveUsers() {
        try {
            const response = await directus.request(readUsers({
                limit: 5,
                filter: { active_status: { _eq: 'online' } },
            }));
            activeUsers.value = response as User[];
        } catch (err) {
            console.error('Error fetching active users:', err);
        }
    }

    // fetch user badges
    async function fetchUserBadges() {
        const userId = route.params.id as string;
        try {
            const response = await directus.request(customEndpoint<OutputFileType>({
                path: `/badges-user/${userId}`,
                method: 'GET',
            }));
            userBadge.value = response;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to fetch badges';
            console.error('Error fetching badges:', err);
        }
    }


    return {
        user,
        users,
        error,
        activeUsers,
        userBadge,
        teamMembers,
        fetchUserById,
        fetchUsers,
        fetchActiveUsers,
        fetchUserBadges,
    };
});

import { defineStore } from "pinia";
import { directus, createItem, readItems } from "src/services/directus";
import { ref } from "vue";
import { useAuthStore } from "./authStore";

export const useCheckInStore = defineStore('checkin', () => {
    const checkInTime = ref<string | null>(null);
    const checkOutTime = ref<string | null>(null);
    const error = ref<string | null>(null);
    const authStore = useAuthStore();
    const previousStatus = ref<string>()


    async function initializeCheck(userId: string) {
        if (authStore.user?.active_status == 'online') {
            const data = await directus.request(readItems('attendances', {
                filter: {
                    event_type: { _eq: 'check-in' },
                    user_id: { _eq: userId }
                },
                sort: ['-date_created'],
                limit: 1,
                fields: ['*', 'user_id.*']
            }));
            const date = new Date(data[0]?.date_created);
            checkInTime.value = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        } else if (authStore.user?.active_status == 'offline') {
            const data = await directus.request(readItems('attendances', {
                filter: {
                    event_type: { _eq: 'check-out' },
                    user_id: { _eq: userId }
                },
                sort: ['-date_created'],
                limit: 1,
                fields: ['*', 'user_id.*']
            }));
            const date = new Date(data[0]?.date_created);
            checkOutTime.value = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        }
    }


    async function checkIn(userId: string) {
        if (userId === undefined) {
            throw new Error('User ID is required');
        }

        try {
            if (authStore.user) {
                previousStatus.value = authStore.user.active_status;
                authStore.user.active_status = 'checked-in'; // Assume success
            }

            const response = await directus.request(createItem('attendances', {
                "user_id": userId,
                "event_type": 'check-in'
            }));
            const isoDate = response.date_created;
            const date = new Date(isoDate);
            checkInTime.value = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

            await authStore.fetchCurrentUser();
        } catch (err) {

            if (authStore.user) {
                authStore.user.active_status = previousStatus.value as string;
            }
            console.error(error);
            error.value = err instanceof Error ? err.message : 'checkin failed';
        }
    };

    async function checkOut(userId: string) {
        console.log("out");
        if (userId === undefined) {
            throw new Error('User ID is required');
        }
        try {
            if (authStore.user?.active_status === "online") {
                const response = await directus.request(createItem('attendances', {
                    "user_id": userId,
                    "event_type": 'check-out'
                }));
                console.log('out', response);
                const isoDate = response.date_created;
                const date = new Date(isoDate);
                checkOutTime.value = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                await authStore.fetchCurrentUser();
                console.log(authStore.user);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return {
        checkIn,
        checkOut,
        initializeCheck,
        checkInTime,
        checkOutTime,
    }
})
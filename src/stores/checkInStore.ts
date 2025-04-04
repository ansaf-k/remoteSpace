import { defineStore } from "pinia";
import { directus, createItem } from "src/services/directus";
import { ref } from "vue";

export const useCheckInStore = defineStore('checkin', () => {
    const checkInTime = ref<string | null>(null);
    const checkOutTime = ref<string | null>(null);
    const IsCheckedIn = ref(false);
    const error = ref<string | null>(null);


    async function checkIn(userId: string, eventType: string) {
        try {
            if(userId === undefined){
                throw new Error('User ID is required');
            }
            const response = await directus.request(createItem('attendances', {
                "user_id": userId,
                "event_type": eventType
            }));
            IsCheckedIn.value = true;
            const isoDate = response.date_created;
            const date = new Date(isoDate);
            checkInTime.value = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        } catch (err) {
            console.error(error);
            error.value = err instanceof Error ? err.message : 'checkin failed';
        }
    };

    async function checkOut(userId: string, eventType: string) {
        console.log("out");
        try {
            const response = await directus.request(createItem('attendances', {
                "user_id": userId,
                "event_type": eventType
            }));
            IsCheckedIn.value = false;
            const isoDate = response.date_created;
            const date = new Date(isoDate);
            checkOutTime.value = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            console.log(checkOutTime.value);
        } catch (error) {
            console.error(error);
        }
    }

    return {
        checkIn,
        checkOut,
        IsCheckedIn,
        checkInTime,
        checkOutTime,
    }
})
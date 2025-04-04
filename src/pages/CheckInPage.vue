<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const emit = defineEmits<{
    (e: 'check-in-complete', data: {
        type: 'in' | 'out',
        time: string,
        date: string
    }): void
}>();

// State
const showModal = ref(true);
const isCheckIn = ref(true);
const currentTime = ref('');
const currentDate = ref('');
const locationVerified = ref(true);
const employeeName = ref('John Doe');

// Time update interval reference
let timeInterval: number | null = null;

const updateCurrentTime = (): void => {
    const now = new Date();
    currentTime.value = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });
    currentDate.value = now.toLocaleDateString([], {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });
};

const checkLocation = (): void => {
    // Implement actual location checking logic here
    locationVerified.value = true;
};

const onSubmit = (): void => {
    if (!locationVerified.value) {
        // You could use Quasar's notify here
        return;
    }

    emit('check-in-complete', {
        type: isCheckIn.value ? 'in' : 'out',
        time: currentTime.value,
        date: currentDate.value
    });

    showModal.value = false;
};

onMounted(() => {
    updateCurrentTime();
    timeInterval = window.setInterval(updateCurrentTime, 60000);
    checkLocation();
});

onBeforeUnmount(() => {
    if (timeInterval !== null) {
        clearInterval(timeInterval);
    }
});
</script>

<template>
    <q-dialog v-model="showModal" persistent>
        <q-card class="check-in-modal">
            <q-card-section class="bg-primary text-white">
                <div class="text-h6">
                    Remo<span class="text-secondary">Space</span>
                </div>
                <q-btn icon="close" @click="$router.back()" flat size="md" class="absolute-right" />
            </q-card-section>

            <q-card-section class="q-pt-lg">
                <div class="text-center q-mb-md">
                    <h5 class="q-my-sm">{{ isCheckIn ? 'Start Your Day' : 'End Your Day' }}</h5>
                    <p class="text-grey-7 q-mb-lg">Track your attendance and work time</p>
                </div>

                <div class="time-display text-center q-mb-lg">
                    <div class="text-h4 text-primary">{{ currentTime }}</div>
                    <div class="text-caption text-grey">{{ currentDate }}</div>
                </div>

                <div class="q-mb-lg">
                    <q-banner class="bg-blue-1 text-primary">
                        <template v-slot:avatar>
                            <q-icon name="person" color="primary" />
                        </template>
                        Welcome, {{ employeeName }}
                    </q-banner>
                </div>

            </q-card-section>

            <q-separator />

            <q-card-actions align="right">
                <q-btn flat color="grey-7" label="Cancel" v-close-popup />
                <q-btn unelevated color="primary" :label="isCheckIn ? 'Check-In' : 'Check-Out'"
                    :disable="!locationVerified" @click="onSubmit" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<style scoped>
.check-in-modal {
    width: 30vw;
    max-width: 90vw;
    border-radius: 12px;
    background: white;
}

.time-display {
    padding: 1rem;
}

h5 {
    font-weight: 700;
    margin: 0;
}

.text-secondary {
    color: #F59E0B !important;
}

.bg-primary {
    background-color: #1E3A8A !important;
}

.text-primary {
    color: #1E3A8A !important;
}

.text-success,
.bg-success {
    color: #10B981 !important;
    background-color: #10B981 !important;
}

.text-error,
.bg-error {
    color: #EF4444 !important;
    background-color: #EF4444 !important;
}
</style>
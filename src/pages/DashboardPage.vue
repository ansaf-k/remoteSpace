<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, reactive } from 'vue';
import { useAuthStore } from 'src/stores/authStore';
import { useCheckInStore } from 'src/stores/checkInStore';
import { useQuasar } from 'quasar';
import { useUserStore } from 'src/stores/userStore';

const authStore = useAuthStore();
const checkInStore = useCheckInStore();
const userStore = useUserStore();

const $q = useQuasar();
const loadingData = ref(true);
const currentDateTime = ref(new Date());
const showModal = ref(false);
const timeInterval = ref<number | null>(null);

// User state
const user = reactive({
    first_name: '',
    position: '',
    avatar: 'https://cdn.quasar.dev/img/avatar.png',
    status: '',
    checkedInTime: '',
    checkedOutTime: '',
});

// Active teams data
const activeTeams = reactive([
    {
        id: 1,
        name: 'Frontend Development Team',
        members: 8,
        progress: 75,
        leader: 'John Doe',
        color: 'primary',
        ongoingProjects: 3,
        completedProjects: 12
    },
]);


// check-in
const handleCheckIn = async (): Promise<void> => {
    console.log("in");
    try {
        if (authStore.user && authStore.user.id) {
            await checkInStore.checkIn(authStore.user.id, 'check-in');
        } else {
            $q.notify('User is not logged in or ID is missing');
        }
        showModal.value = false;
    } catch (err) {
        $q.notify(err instanceof Error ? err.message : 'Check-in failed');
        console.error('Check-in failed:', err);
    }
};


// check-out
const handleCheckOut = async (): Promise<void> => {
    console.log("out");
    try {
        if (authStore.user && authStore.user.id) {
            await checkInStore.checkOut(authStore.user.id, 'check-out').then(() => {
                $q.notify('Check-out successful');
            });
        } else {
            $q.notify('User is not logged in or ID is missing');
        }
        showModal.value = false;
    } catch (err) {
        $q.notify(err instanceof Error ? err.message : 'Check-in failed');
        console.error('Check-in failed:', err);
    }
};


/** Updates the current date and time */
const updateCurrentTime = (): void => {
    currentDateTime.value = new Date();
};

/** Formats time as hh:mm AM/PM */
const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

/** Formats date as Day of Week, Month Day */
const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
};

/** Fetches the authenticated user data */
const fetchUserData = () => {
    const currentUser = authStore.user as {
        id: string;
        email: string;
        first_name?: string;
        last_name?: string;
        avatar?: string;
    } | null;

    if (currentUser) {
        Object.assign(user, {
            first_name: currentUser.first_name || '',
            position: '',
            avatar: currentUser.avatar || 'https://cdn.quasar.dev/img/avatar.png',
            status: checkInStore.IsCheckedIn ? 'CheckedIn' : 'CheckedOut',
            checkedInTime: checkInStore.checkInTime || '',
            checkedOutTime: checkInStore.checkOutTime || '',
        });
    }
};


onMounted(async () => {
    // Set initial time and start periodic updates
    updateCurrentTime();
    timeInterval.value = window.setInterval(updateCurrentTime, 60000);

    // Simulating data loading
    setTimeout(() => {
        loadingData.value = false;
    }, 1000);


    // Fetch authenticated user data
    fetchUserData();
    await userStore.fetchActiveUsers()
});

// Cleanup on unmount
onBeforeUnmount(() => {
    if (timeInterval.value !== null) {
        clearInterval(timeInterval.value);
    }
});


watch(
    () => [checkInStore.IsCheckedIn, checkInStore.checkInTime, checkInStore.checkOutTime],
    () => {
        fetchUserData();
    },
    { deep: true, immediate: true }
);


</script>



<template>
    <q-page class="bg-soft-white q-pa-md">
        <!-- Welcome Header -->
        <div class="row items-center q-mb-md">
            <div class="col-12 col-md-6">
                <h4 class="q-mt-none q-mb-xs">Welcome back, {{ user.first_name }}!</h4>
                <p class="text-grey-7 q-mb-none">{{ formatDate(currentDateTime) }} · {{
                    formatTime(currentDateTime) }}
                </p>
            </div>
            <div class="col-12 col-md-6 text-right">
                <q-btn color="primary" label="Check In/Out" icon="login" @click="showModal = true" />
            </div>
        </div>

        <!-- Dashboard Content -->
        <div class="row q-col-gutter-md">
            <!-- Main Column -->
            <div class="col-12 col-lg-8">

                <!-- Active Projects -->
                <q-card class="q-mb-md">
                    <q-card-section class="q-pb-none">
                        <div class="row items-center justify-between">
                            <div class="text-h6">Active Teams</div>
                            <q-btn flat color="primary" label="View All Projects" />
                        </div>
                    </q-card-section>

                    <q-card-section>
                        <q-list separator>
                            <q-item v-for="team in activeTeams" :key="team.id" clickable class="team-item">
                                <q-item-section>
                                    <div class="row items-center q-col-gutter-md">
                                        <div class="col-12 col-sm-6">
                                            <q-item-label class="text-weight-medium">{{ team.name }}</q-item-label>
                                            <q-item-label caption>
                                                <q-badge :color="team.color" text-color="white" class="q-mr-xs">
                                                    Leader: {{ team.leader }}
                                                </q-badge>
                                                <span>{{ team.members }} Members</span>
                                            </q-item-label>
                                        </div>

                                        <div class="col-12 col-sm-6">
                                            <div class="row">
                                                <div class="col">
                                                    <q-item-label caption>Ongoing Projects</q-item-label>
                                                    <q-item-label>{{ team.ongoingProjects }}</q-item-label>
                                                </div>
                                                <div class="col text-right">
                                                    <q-item-label caption>Completed Projects</q-item-label>
                                                    <q-item-label>{{ team.completedProjects }}</q-item-label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </q-item-section>

                                <q-item-section side>
                                    <q-btn flat round icon="chevron_right" color="grey-6" />
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </q-card-section>

                </q-card>
            </div>

            <div class="col-12 col-lg-4">
                <!-- My Status -->
                <q-card class="q-mb-md">
                    <q-card-section class="q-pb-xs">
                        <div class="text-h6">My Status</div>
                    </q-card-section>

                    <q-card-section>
                        <div class="row items-center q-mb-md">
                            <div class="col-auto">
                                <q-avatar size="48px">
                                    <img :src="user.avatar" />
                                    <q-badge floating rounded color="green" v-if="user.status === 'CheckedIn'" />
                                </q-avatar>
                            </div>
                            <div class="col q-ml-md">
                                <div class="text-subtitle1">{{ user.first_name }}</div>
                                <div class="text-caption text-grey-7">{{ user.position }}
                                </div>
                                <div class="text-caption q-mt-xs">
                                    <q-badge color="green" v-if="user.status === 'CheckedIn'">
                                        Checked in at {{ user.checkedInTime }}
                                    </q-badge>
                                    <q-badge color="red" v-else-if="user.status === 'CheckedOut'">
                                        Checked out at {{ user.checkedOutTime }}
                                    </q-badge>
                                    <q-badge color="orange" v-else>
                                    </q-badge>
                                </div>
                            </div>
                        </div>

                    </q-card-section>

                </q-card>

                <!-- Team Members -->
                <q-card v-if="userStore.activeUsers?.length" class="q-mb-md">
                    <q-card-section class="q-pb-none">
                        <div class="text-h6">Active Members</div>
                    </q-card-section>

                    <q-card-section>
                        <q-list separator>
                            <q-item v-for="(user, index) in userStore.activeUsers" :key="index" clickable>
                                <q-item-section avatar>
                                    <q-avatar>
                                        <!-- <img :src="user.avatar" /> -->
                                        <q-badge floating color="green" v-if="user.active_status === 'online'" />
                                    </q-avatar>
                                </q-item-section>

                                <q-item-section>
                                    <q-item-label>{{ user.first_name }}{{ user.last_name }}</q-item-label>
                                    <q-item-label caption>
                                        <span class="text-capitalize">{{ user.active_status?.replace('-', ' ')
                                            }}</span> · {{
                                                user.last_access }}
                                    </q-item-label>
                                </q-item-section>

                                <q-item-section side>
                                    <q-btn flat round size="sm" icon="chat_bubble_outline" color="primary" />
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </q-card-section>
                </q-card>

            </div>
        </div>
    </q-page>



    <!-- check-in/out  modal -->
    <q-dialog v-model="showModal" persistent>
        <q-card class="check-in-modal">
            <q-card-section class="bg-primary text-white">
                <div class="text-h6">
                    Remo<span class="text-secondary">Space</span>
                </div>
                <q-btn icon="close" @click="showModal = false" flat size="md" class="absolute-right" />
            </q-card-section>

            <q-card-section class="q-pt-lg">
                <div class="text-center q-mb-md">
                    <h5 class="q-my-sm">{{ user.status == 'CheckedIn' ? 'Start Your Day' : 'End Your Day' }}</h5>
                    <p class="text-grey-7 q-mb-lg">Track your attendance and work time</p>
                </div>

                <div class="time-display text-center q-mb-lg">
                    <div class="text-h4 text-primary">{{ formatTime(currentDateTime) }}</div>
                    <div class="text-caption text-grey">{{ formatDate(currentDateTime) }}</div>
                </div>

                <div class="q-mb-lg">
                    <q-banner class="bg-blue-1 text-primary">
                        <template v-slot:avatar>
                            <q-icon name="person" color="primary" />
                        </template>
                        Welcome, {{ user.first_name }}
                    </q-banner>
                </div>

            </q-card-section>

            <q-separator />

            <q-card-actions align="right">
                <q-btn flat color="grey-7" label="Cancel" v-close-popup />
                <q-btn unelevated color="primary" :label="user.status == 'CheckedIn' ? 'Check-Out' : 'Check-In'"
                    @click="checkInStore.IsCheckedIn ? handleCheckOut() : handleCheckIn()" />
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
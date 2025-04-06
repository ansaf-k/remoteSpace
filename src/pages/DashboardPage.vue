<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from 'src/stores/authStore';
import { useCheckInStore } from 'src/stores/checkInStore';
import { useQuasar } from 'quasar';
import { type User, useUserStore } from 'src/stores/userStore';
import { useDateTime } from 'src/composables/useDateTime'
import { useTeamStore } from 'src/stores/teamStore';


const authStore = useAuthStore();
const checkInStore = useCheckInStore();
const userStore = useUserStore();
const teamStore = useTeamStore();
const { formatDate, updateCurrentTime, formatTime } = useDateTime();

const $q = useQuasar();
const loadingData = ref(true);
const currentDateTime = ref(new Date());
const showModal = ref(false);
const timeInterval = ref<number | null>(null);


// check-in
const handleCheckIn = async (): Promise<void> => {
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

const formattedDate = (isoString: Date, includeTime: boolean) => {
    return formatDate(isoString, includeTime);
}


/** Formats time as hh:mm AM/PM */
const formattedTime = (isoString: Date): string => {
    return formatTime(isoString);
};


/** Fetches the authenticated user data */
const user = computed(() => {
    const currentUser = authStore.user as User

    if (currentUser) {
        return {
            first_name: currentUser.first_name,
            position: currentUser.position,
            avatar: currentUser.avatar || 'https://cdn.quasar.dev/img/avatar.png',
            status: currentUser.active_status,
            checkedInTime: checkInStore.checkInTime,
            checkedOutTime: checkInStore.checkOutTime,
        };
    }
    else {
        return {
            first_name: '',
            position: '',
            avatar: 'https://cdn.quasar.dev/img/avatar.png',
            status: '',
            checkedInTime: '',
            checkedOutTime: '',
        }
    }
});


onMounted(async () => {
    // Set initial time and start periodic updates
    updateCurrentTime();
    timeInterval.value = window.setInterval(updateCurrentTime, 60000);

    // Simulating data loading
    setTimeout(() => {
        loadingData.value = false;
    }, 1000);


    // Fetch authenticated user data
    await userStore.fetchActiveUsers();
    await teamStore.fetchActiveTeams();
});



</script>



<template>
    <q-page class="bg-soft-white q-pa-md">
        <!-- Welcome Header -->
        <div class="row items-center q-mb-md">
            <div class="col-12 col-md-6">
                <h4 class="q-mt-none q-mb-xs">Welcome back, {{ user.first_name }}!</h4>
                <p class="text-grey-7 q-mb-none">{{ formattedDate(currentDateTime, false) }} · {{
                    formattedTime(currentDateTime) }}
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

                <!-- Active Teams -->
                <q-card class="q-mb-md">
                    <q-card-section class="q-pb-none">
                        <div class="row items-center justify-between">
                            <div class="text-h6">Active Teams</div>
                            <q-btn flat color="primary" label="View All Teams" />
                        </div>
                    </q-card-section>

                    <q-card-section>
                        <q-list separator>
                            <q-item v-for="team in teamStore.activeTeams" :key="team.id" clickable class="team-item">
                                <q-item-section>
                                    <div class="row items-center q-col-gutter-md">
                                        <div class="col-12 col-sm-6">
                                            <q-item-label class="text-weight-medium">{{ team.teams }}</q-item-label>
                                            <q-item-label caption>
                                                <q-badge v-if="team.leader" color="primary" text-color="white" class="q-mr-xs">
                                                    Leader: {{ team.leader }}
                                                </q-badge>
                                                <span v-if="team.description?.length < 45">{{ team.description }}</span>
                                                <span v-else>{{ team.description.substring(0, 45) + '...' }}</span>
                                            </q-item-label>
                                        </div>

                                        <div class="col-12 col-sm-6">
                                            <div class="row">
                                                <div class="col">
                                                    <q-item-label caption>Team Members</q-item-label>
                                                    <q-item-label>{{ team.people.length }}</q-item-label>
                                                </div>
                                                <div class="col text-right">
                                                    <q-item-label caption>Created At</q-item-label>
                                                    <q-item-label>{{ formattedDate(team.date_created, false) }}</q-item-label>
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
                                    <q-badge floating rounded color="green" v-if="user.status === 'online'" />
                                </q-avatar>
                            </div>
                            <div class="col q-ml-md">
                                <div class="text-subtitle1">{{ user.first_name }}</div>
                                <div class="text-caption text-grey-7">{{ user.position }}
                                </div>
                                <div class="text-caption q-mt-xs">
                                    <q-badge color="green" v-if="user.status === 'online'">
                                        Checked in at {{ user.checkedInTime }}
                                    </q-badge>
                                    <q-badge color="red" v-else-if="user.status === 'offline'">
                                        Checked out at {{ user.checkedOutTime }}
                                    </q-badge>
                                    <q-badge color="orange" v-else>
                                        You need to check in first!
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
                                        }}</span> · {{ formattedDate(user.last_access, true) }}
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
                    <div class="text-h4 text-primary">{{ formattedTime(currentDateTime) }}</div>
                    <div class="text-caption text-grey">{{ formattedDate(currentDateTime, false) }}</div>
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
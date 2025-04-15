<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from 'src/stores/authStore';
import { useCheckInStore } from 'src/stores/checkInStore';
import { useQuasar } from 'quasar';
import { useUserStore } from 'src/stores/userStore';
import { useDateTime } from 'src/composables/useDateTime'
import { useTeamStore } from 'src/stores/teamStore';


const authStore = useAuthStore();
const checkInStore = useCheckInStore();
const userStore = useUserStore();
const teamStore = useTeamStore();
const { formatDate, formatTime } = useDateTime();

const $q = useQuasar();
const currentDateTime = ref(new Date());
const showModal = ref(false);
const fallbackImage = '/path/to/default-image.jpg';

const safeImageSrc = computed(() => authStore.user?.avatar || fallbackImage);




// check-in
const handleCheckIn = async (): Promise<void> => {
    try {
        if (authStore.user && authStore.user.id) {
            await checkInStore.checkIn(authStore.user.id);
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
            await checkInStore.checkOut(authStore.user.id).then(() => {
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


onMounted(async () => {
    // Fetch authenticated user data
    await userStore.fetchActiveUsers();
    await teamStore.fetchActiveTeams();
    await checkInStore.initializeCheck(authStore.user?.id as string);
});

const buttonLabel = computed(() => {
    if (!authStore.user) return 'Login'

    switch (authStore.user.active_status) {
        case 'online':
            return 'Check Out';
        case 'offline':
            return 'Check In';
        default:
            return 'Check In';
    }
})


</script>



<template>
    <q-page class="bg-soft-white q-pa-md">
        <!-- Welcome Header -->
        <div class="row items-center q-mb-md">
            <div class="col-12 col-md-6">
                <h4 class="q-mt-none q-mb-xs">Welcome back, {{ authStore.user?.first_name }}!</h4>
                <p class="text-grey-7 q-mb-none">{{ formattedDate(currentDateTime, false) }} · {{
                    formattedTime(currentDateTime) }}
                </p>
            </div>
            <div class="col-12 col-md-6 text-right">
                <q-btn color="primary" :label=buttonLabel icon="login" @click="showModal = true" />
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
                            <q-btn to="/dashboard/team" flat color="primary" label="View All Teams" />
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
                                                <q-badge v-if="team.leader" color="primary" text-color="white"
                                                    class="q-mr-xs">
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
                                                    <q-item-label>{{ formattedDate(team.date_created, false)
                                                        }}</q-item-label>
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
                                    <img :src="safeImageSrc" />
                                    <q-badge floating rounded color="green"
                                        v-if="authStore.user?.active_status === 'online'" />
                                </q-avatar>
                            </div>
                            <div class="col q-ml-md">
                                <div class="text-subtitle1">{{ authStore.user?.first_name }}</div>
                                <div class="text-caption text-grey-7">{{ authStore.user?.role }}
                                </div>
                                <div class="text-caption q-mt-xs">
                                    <q-badge color="green" v-if="authStore.user?.active_status === 'online'">
                                        Checked in at {{ checkInStore.checkInTime }}
                                    </q-badge>
                                    <q-badge color="red" v-else-if="authStore.user?.active_status === 'offline'">
                                        Checked out at {{ checkInStore.checkOutTime }}
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
                                    <q-btn flat round :to="`/user/${user?.id}`" size="sm" icon="keyboard_arrow_right" color="primary" />
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
                    <h5 class="q-my-sm">{{ authStore.user?.active_status == 'online' ? 'End Your Day' : 'Start Your Day'
                    }}</h5>
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
                        Welcome, {{ authStore.user?.first_name }}
                    </q-banner>
                </div>

            </q-card-section>

            <q-separator />

            <q-card-actions align="right">
                <q-btn flat color="grey-7" label="Cancel" v-close-popup />
                <q-btn unelevated color="primary"
                    :label="authStore.user?.active_status == 'online' ? 'Check-Out' : 'Check-In'"
                    @click="authStore.user?.active_status == 'online' ? handleCheckOut() : handleCheckIn()" />
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
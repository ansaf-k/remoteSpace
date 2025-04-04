<script setup lang="ts">
import { type User, useUserStore } from 'src/stores/userStore';
import { onMounted, reactive } from 'vue';

// Define interfaces for user data and achievements




const userStore = useUserStore();

// Reactive state for user profile with demo details
const userProfile = reactive<User>({
    id: '',
    first_name: '',
    last_name: '',
    email: '',
    avatar: '',
    active_status: '',
    position: '',
    last_access: new Date(),
});

const fetchUserData = () => {
    const user = userStore.user

    if (user) {
        Object.assign(userProfile, {
            id: user.id,
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            email: user.email,
            avatar: user.avatar || 'data:image/jpeg;base64,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',
            status: user.active_status || '',
            position: user.position || '',
            lastActive: user.last_access,
        });
    }
}


// Status color mapping
const getStatusColor = (status: string) => {
    switch (status) {
        case 'active': return 'positive';
        case 'inactive': return 'negative';
        case 'pending': return 'warning';
        default: return 'grey';
    }
};

onMounted(async () => {
    await userStore.fetchUserById();
    await userStore.fetchUserBadges();
    await userStore.fetchTeamMembers();
    console.log("asdf", userStore.userBadge?.message);
    fetchUserData()
});
</script>

<template>
    <q-layout>
        <q-page-container>
            <q-page class="full-width-profile bg-soft-white">
                <div class="profile-container">
                    <!-- Profile Header -->
                    <div class="profile-header q-pb-md">
                        <div class="avatar-section">
                            <q-avatar size="120px" class="profile-avatar">
                                <!-- <img :src="userProfile.avatar" alt="User Avatar"> -->
                            </q-avatar>
                            <q-badge :color="getStatusColor(userStore.user?.active_status as string)" rounded
                                class="status-badge">
                                {{ userProfile.active_status }}
                            </q-badge>
                        </div>
                        <div class="profile-info">
                            <h4 class="q-mb-xs">{{ `${userStore.user?.first_name}
                                ${userStore.user?.last_name}` }}</h4>
                            <div class="text-subtitle1 text-grey q-mb-sm">
                                {{ userProfile.email }}
                            </div>
                            <div class="text-subtitle2 text-grey">
                                {{ userProfile.position }}
                            </div>
                        </div>
                    </div>

                    <!-- User Stats Section - Elegant Format without Cards -->
                    <div class="user-stats-wrapper q-py-md">
                        <div class="user-stats">
                            <!-- <div class="stat-item">
                                <q-icon name="event" color="primary" size="sm" class="q-mr-xs" />
                                <span class="stat-label">Joined:</span>
                                <span class="stat-value">{{ userProfile.joinDate }}</span>
                            </div> -->
                            <div class="stat-item">
                                <q-icon name="access_time" color="secondary" size="sm" class="q-mr-xs" />
                                <span class="stat-label">Last Active:</span>
                                <span class="stat-value">{{ userProfile.last_access }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Divider -->
                    <q-separator class="q-my-md" />

                    <!-- Achievements Section -->
                    <div v-if="userStore.userBadge" class="achievements-section q-mt-md">
                        <h5 class="section-title">Achievements</h5>
                        <div class="row q-col-gutter-md">
                            <div v-for="achievement in userStore.userBadge.message" :key="achievement.id"
                                class="col-md-4 col-sm-12">
                                <q-card class="achievement-card">
                                    <q-card-section horizontal>
                                        <!-- Badge Icon Section -->
                                        <q-card-section class="col-3 flex items-center justify-center">
                                            <div class="badge-icon-container">
                                                <img :src="achievement.image_url || './src/assets/quasar-logo-vertical.svg'"
                                                    :alt="achievement.name + ' badge'" class="badge-icon">
                                            </div>
                                        </q-card-section>
                                        <q-card-section class="col-9">
                                            <div class="text-h6">{{ achievement.name }}</div>
                                            <div class="text-subtitle2 text-grey">
                                                {{ achievement.description }}
                                            </div>
                                            <div class="text-caption text-grey q-mt-xs">
                                                Earned on: {{ achievement.awarded_at }}
                                            </div>
                                        </q-card-section>
                                    </q-card-section>
                                </q-card>
                            </div>
                        </div>
                    </div>

                    <!-- Divider -->
                    <q-separator class="q-my-md" />

                    <!-- Team Section -->
                    <!-- <div v-if="userStore.teamMembers" class="team-section q-mt-md">
                        <h5 class="section-title">Current Team</h5>
                        <div class="row q-col-gutter-md">
                            <div v-for="member in userStore.teamMembers" :key="member.id" class="col-md-4 col-sm-12">
                                <q-card class="team-member-card">
                                    <q-card-section horizontal>
                                        <q-card-section class="col-4 flex flex-center">
                                            <q-avatar>
                                                <img :src="member.avatar" :alt="member.name">
                                            </q-avatar>
                                        </q-card-section>
                                        <q-card-section class="col-8">
                                            <div class="text-h6">{{ member.name }}</div>
                                            <div class="text-subtitle2 text-grey">
                                                {{ member.position }}
                                            </div>
                                        </q-card-section>
                                    </q-card-section>
                                </q-card>
                            </div>
                        </div>
                    </div> -->
                </div>
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<style scoped>
.badge-icon-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.badge-icon {
    max-width: 80%;
    max-height: 80%;
    object-fit: contain;
}

.full-width-profile {
    width: 100%;
    margin: 0;
    padding: 0;
}

.profile-container {
    width: 100%;
    background: white;
    padding: 2rem;
}

.profile-header {
    display: flex;
    align-items: center;
    gap: 2rem;
    border-bottom: 1px solid #f0f0f0;
}

.avatar-section {
    position: relative;
}

.status-badge {
    position: absolute;
    bottom: 0;
    right: 0;
    text-transform: capitalize;
}

.profile-avatar {
    border: 3px solid var(--q-primary);
}

.user-stats-wrapper {
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 1rem;
}

.user-stats {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    justify-content: flex-start;
}

.stat-item {
    display: flex;
    align-items: center;
}

.stat-label {
    font-weight: 500;
    margin-right: 0.5rem;
    color: #666;
}

.stat-value {
    color: #333;
}

.section-title {
    position: relative;
    padding-left: 1rem;
    font-weight: 600;
    color: #333;
}

.section-title::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 1.2em;
    background-color: var(--q-primary);
    border-radius: 2px;
}

.achievement-card,
.team-member-card {
    height: 100%;
    transition: transform 0.3s ease;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.achievement-card:hover,
.team-member-card:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.bg-soft-white {
    background-color: #F8FAFC;
}

@media (max-width: 768px) {
    .profile-header {
        flex-direction: column;
        text-align: center;
    }

    .user-stats {
        flex-direction: column;
        gap: 0.75rem;
    }
}
</style>
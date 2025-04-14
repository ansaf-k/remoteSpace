<script setup lang="ts">
import { useDateTime } from 'src/composables/useDateTime';
import { useTeamStore } from 'src/stores/teamStore';
import { type Badge, useUserStore } from 'src/stores/userStore';
import { computed, onMounted, ref } from 'vue';
import fallbackImage from 'src/assets/profile.jpg'; // your fallback image


const { formatSmartDate } = useDateTime();
const userStore = useUserStore();
const teamStore = useTeamStore();


const avatarSrc = ref(userStore.user?.avatar || fallbackImage);
const directusUrl = import.meta.env.VITE_DIRECTUS_URL;


// Status color mapping
const getStatusColor = (status: string) => {
    switch (status) {
        case 'active': return 'positive';
        case 'inactive': return 'negative';
        case 'pending': return 'warning';
        default: return 'grey';
    }
};

const badgesUrl = computed(() => {
    return (userStore.userBadge.message).map((item: Badge) =>
        item.image_url ?? 'src/assets/badges.jpg'
    )
});

onMounted(async () => {
    await userStore.fetchUserById();
    await userStore.fetchUserBadges();
    await teamStore.fetchTeamMembers();
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
                                <img :src="avatarSrc"
                                    :alt="userStore.user?.first_name ?? 'Badge img'">
                            </q-avatar>
                            <q-badge :color="getStatusColor(userStore.user?.active_status as string)" rounded
                                class="status-badge">
                                {{ userStore.user?.active_status }}
                            </q-badge>
                        </div>
                        <div class="profile-info">
                            <h4 class="q-mb-xs">{{ `${userStore.user?.first_name}
                                ${userStore.user?.last_name ?? ''}` }}</h4>
                            <div class="text-subtitle1 text-grey q-mb-sm">
                                {{ userStore.user?.email }}
                            </div>
                            <div class="text-subtitle2 text-grey">
                                {{ userStore.user?.position }}
                            </div>
                        </div>
                    </div>

                    <!-- User Stats Section -->
                    <div class="user-stats-wrapper q-py-md">
                        <div class="user-stats">
                            <div class="stat-item">
                                <q-icon name="access_time" color="secondary" size="sm" class="q-mr-xs" />
                                <span class="stat-label">Last Active:</span>
                                <span class="stat-value">{{ formatSmartDate(userStore.user?.last_access as
                                    Date) }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Divider -->
                    <q-separator class="q-my-md" />

                    <!-- badge Section -->
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
                                                <img :src="badgesUrl" :alt="achievement.name + ' badge'"
                                                    class="badge-icon">
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

                    <!-- current team -->
                    <div v-if="teamStore.teamMembers" class="team-section q-mt-md">
                        <h5 class="section-title">Current Team</h5>
                        <div class="row q-col-gutter-md">
                            <div v-for="member in teamStore.teamMembers" :key="member.id" class="col-md-4 col-sm-12">
                                <q-card class="team-member-card">
                                    <q-card-section horizontal>
                                        <q-card-section class="col-4 flex flex-center">
                                            <q-avatar>
                                                <img :src="`${directusUrl}/assets/${member.directus_users_id.avatar?.id}`"
                                                    :alt="member.directus_users_id.avatar?.filename_download as string">
                                            </q-avatar>
                                        </q-card-section>
                                        <q-card-section class="col-8">
                                            <div class="text-h6">{{ member.directus_users_id.first_name }}</div>
                                            <div class="text-subtitle2 text-grey">
                                                {{ member.directus_users_id.role }}
                                            </div>
                                        </q-card-section>
                                    </q-card-section>
                                </q-card>
                            </div>
                        </div>
                    </div>
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
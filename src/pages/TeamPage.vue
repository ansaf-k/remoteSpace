<script setup lang="ts">
import { useDateTime } from 'src/composables/useDateTime';
import { useTeamStore } from 'src/stores/teamStore';
import { onMounted, ref } from 'vue';

const teamStore = useTeamStore();
const { formatSmartDate } = useDateTime();

interface Member {
    name: string;
    role: string;
    joinDate: string;
}

interface Team {
    id: number;
    name: string;
    members: Member[];
    leader: string;
    ongoingProjects: number;
    completedProjects: number;
    description: string;
    technologies: string[];
}

const selectedTeam = ref<Team | null>(null);
const showDialog = ref(false);


const closeTeamDetails = () => {
    selectedTeam.value = null;
    showDialog.value = false;
};

onMounted(async () => {
    await teamStore.fetchTeam();
});

</script>

<template>
    <q-page class="bg-soft-white q-pa-md">
        <!-- Header -->
        <div class="row items-center q-mb-lg">
            <div class="col-12 col-md-6">
                <h4 class="q-mb-xs q-mt-none">Teams Overview</h4>
                <p class="text-grey-7 q-mb-none">Manage and monitor team activities</p>
            </div>
            <div class="col-12 col-md-6 text-right">
                <q-btn color="primary" label="Create New Team" icon="add" />
            </div>
        </div>

        <!-- Teams Grid -->
        <div class="row q-col-gutter-md">
            <div v-for="team in teamStore.team" :key="team.id" class="col-12 col-md-6">
                <q-card class="team-card">
                    <q-card-section>
                        <div class="row items-center">
                            <div class="col">
                                <div class="text-h6">{{ team.teams }}</div>
                                <div class="text-caption text-grey-7">Led by {{ team.leader }}</div>
                            </div>
                            <div class="col-auto">
                                <q-btn flat round icon="more_vert">
                                    <q-menu>
                                        <q-list style="min-width: 100px">
                                            <q-item clickable v-close-popup >
                                                <q-item-section>View Details</q-item-section>
                                            </q-item>
                                        </q-list>
                                    </q-menu>
                                </q-btn>
                            </div>
                        </div>
                    </q-card-section>

                    <q-card-section>
                        <div class="row q-col-gutter-sm">
                            <div class="col-6">
                                <q-item-label caption>Members</q-item-label>
                                <q-item-label>{{ team.people.length }}</q-item-label>
                            </div>
                            <div class="col-6">
                                <q-item-label caption>Team Created</q-item-label>
                                <q-item-label class="text-positive">{{ formatSmartDate(team.date_created) }}</q-item-label>
                            </div>
                        </div>
                    </q-card-section>

                </q-card>
            </div>
        </div>

        <!-- Team Details Dialog -->
        <q-dialog v-model="showDialog" @hide="closeTeamDetails">
            <q-card style="min-width: 350px">
                <q-card-section class="row items-center q-pb-none">
                    <div class="text-h6">{{ selectedTeam?.name }}</div>
                    <q-space />
                    <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>

                <q-card-section v-if="selectedTeam">
                    <div class="q-mb-md">
                        <div class="text-subtitle2">Description</div>
                        <p>{{ selectedTeam.description }}</p>
                    </div>

                    <div class="q-mb-md">
                        <div class="text-subtitle2">Technologies</div>
                        <div class="q-gutter-sm">
                            <q-chip v-for="tech in selectedTeam.technologies" :key="tech" color="primary"
                                text-color="white" size="sm">
                                {{ tech }}
                            </q-chip>
                        </div>
                    </div>

                    <div class="q-mb-md">
                        <div class="text-subtitle2">Team Members</div>
                        <q-list dense>
                            <q-item v-for="(meeting, index) in selectedTeam.members" :key="index">
                                <q-item-section>
                                    <q-item-label>{{ meeting.name }}</q-item-label>
                                    <q-item-label caption>{{ meeting.role }}</q-item-label>
                                    <q-separator />
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </div>
                </q-card-section>

                <!-- <q-card-actions align="right">
                    <q-btn flat :color="selectedTeam?.color" label="Edit Team" v-close-popup />
                </q-card-actions> -->
            </q-card>
        </q-dialog>
    </q-page>
</template>

<style scoped>
.team-card {
    transition: all 0.3s ease;
}

.team-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 25px 0 rgba(0, 0, 0, 0.1);
}
</style>
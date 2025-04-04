<script setup lang="ts">
import { ref } from 'vue';

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

const teams: Team[] = [
    {
        id: 1,
        name: 'Frontend Development Team',
        members: [
            { name: 'Alice Chen', role: 'Senior Developer', joinDate: '2023-01-15' },
            { name: 'Bob Wilson', role: 'Frontend Developer', joinDate: '2023-03-20' },
            { name: 'Carol Taylor', role: 'UI Developer', joinDate: '2023-02-10' },
            { name: 'David Miller', role: 'React Specialist', joinDate: '2023-04-05' },
            { name: 'Eva Brown', role: 'Frontend Developer', joinDate: '2023-05-12' },
            { name: 'Frank Zhang', role: 'TypeScript Developer', joinDate: '2023-06-01' },
            { name: 'Grace Lee', role: 'Junior Developer', joinDate: '2023-07-15' },
            { name: 'Henry Wang', role: 'Frontend Developer', joinDate: '2023-08-20' }
        ],
        leader: 'John Doe',
        ongoingProjects: 3,
        completedProjects: 12,
        description: 'Responsible for building and maintaining user interfaces',
        technologies: ['Vue.js', 'React', 'TypeScript']
    },
    {
        id: 2,
        name: 'UI/UX Design Team',
        members: [
            { name: 'Sarah Jones', role: 'Senior Designer', joinDate: '2023-02-01' },
            { name: 'Mike Davis', role: 'UI Designer', joinDate: '2023-03-15' },
            { name: 'Lisa Park', role: 'UX Researcher', joinDate: '2023-04-10' },
            { name: 'Tom Anderson', role: 'Visual Designer', joinDate: '2023-05-20' },
            { name: 'Rachel Kim', role: 'Junior Designer', joinDate: '2023-06-15' }
        ],
        leader: 'Emily Smith',
        ongoingProjects: 2,
        completedProjects: 8,
        description: 'Creating intuitive and beautiful user experiences',
        technologies: ['Figma', 'Adobe XD', 'Sketch']
    },
    {
        id: 3,
        name: 'Backend Development Team',
        members: [
            { name: 'Alex Johnson', role: 'Senior Backend Developer', joinDate: '2023-01-10' },
            { name: 'Maria Garcia', role: 'Database Specialist', joinDate: '2023-02-15' },
            { name: 'James Wilson', role: 'Node.js Developer', joinDate: '2023-03-01' },
            { name: 'Linda Chen', role: 'Python Developer', joinDate: '2023-04-20' },
            { name: 'Steve Miller', role: 'Backend Developer', joinDate: '2023-05-15' },
            { name: 'Karen Lee', role: 'API Developer', joinDate: '2023-06-10' },
            { name: 'Paul Brown', role: 'DevOps Engineer', joinDate: '2023-07-01' },
            { name: 'Diana Martinez', role: 'Backend Developer', joinDate: '2023-08-15' },
            { name: 'Kevin Taylor', role: 'Security Specialist', joinDate: '2023-09-01' },
            { name: 'Nancy White', role: 'Junior Developer', joinDate: '2023-10-15' }
        ],
        leader: 'Michael Brown',
        ongoingProjects: 4,
        completedProjects: 15,
        description: 'Developing and maintaining server-side applications',
        technologies: ['Node.js', 'Python', 'PostgreSQL']
    },
    {
        id: 4,
        name: 'Marketing & Content Team',
        members: [
            { name: 'Emma Davis', role: 'Content Strategist', joinDate: '2023-03-01' },
            { name: 'Ryan Wilson', role: 'Marketing Specialist', joinDate: '2023-04-15' },
            { name: 'Julia Kim', role: 'Social Media Manager', joinDate: '2023-05-10' },
            { name: 'Mark Thompson', role: 'Content Writer', joinDate: '2023-06-20' },
            { name: 'Amy Chen', role: 'SEO Specialist', joinDate: '2023-07-15' },
            { name: 'Chris Taylor', role: 'Analytics Manager', joinDate: '2023-08-01' }
        ],
        leader: 'Sophia Johnson',
        ongoingProjects: 2,
        completedProjects: 6,
        description: 'Creating and managing marketing content and strategies',
        technologies: ['HubSpot', 'Google Analytics', 'Mailchimp']
    }
];

const selectedTeam = ref<Team | null>(null);
const showDialog = ref(false);

const showTeamDetails = (team: Team) => {
    selectedTeam.value = team;
    showDialog.value = true;
};

const closeTeamDetails = () => {
    selectedTeam.value = null;
    showDialog.value = false;
};
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
            <div v-for="team in teams" :key="team.id" class="col-12 col-md-6">
                <q-card class="team-card">
                    <q-card-section>
                        <div class="row items-center">
                            <div class="col">
                                <div class="text-h6">{{ team.name }}</div>
                                <div class="text-caption text-grey-7">Led by {{ team.leader }}</div>
                            </div>
                            <div class="col-auto">
                                <q-btn flat round icon="more_vert">
                                    <q-menu>
                                        <q-list style="min-width: 100px">
                                            <q-item clickable v-close-popup @click="showTeamDetails(team)">
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
                            <div class="col-4">
                                <q-item-label caption>Members</q-item-label>
                                <q-item-label>{{ team.members.length }}</q-item-label>
                            </div>
                            <div class="col-4">
                                <q-item-label caption>Ongoing Projects</q-item-label>
                                <q-item-label class="text-positive">{{ team.ongoingProjects }}</q-item-label>
                            </div>
                            <div class="col-4">
                                <q-item-label caption>Completed</q-item-label>
                                <q-item-label class="text-primary">{{ team.completedProjects }}</q-item-label>
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
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { directus, readItems } from 'src/services/directus';
import { useRoute } from 'vue-router';


export interface Teams {
    id: string;
    teams: string;
    description: string;
    people: [];
    team_length: number;
    leader?: string;
    date_created: Date;
}

type DirectusUserFields = {
    id?: string;
    first_name?: string;
    avatar?: { id?: boolean, filename_download: string };
    role?: { name: string };
};

interface TeamQuery {
    limit?: number;
    filter?: {
        id?: {
            _eq: string;
        }
    }
}



interface DirectusQuery {
    id: string;
    directus_users_id: DirectusUserFields;
    status: string;
    teams_id: string;
}



export const useTeamStore = defineStore('team', () => {
    const teamMembers = ref<DirectusQuery[]>();
    const route = useRoute();
    const activeTeams = ref<Teams[]>();
    const team = ref<Teams[]>();


    async function fetchTeam(TeamId?: string) {


        const params: TeamQuery = {
            limit: 15,
        }

        if (TeamId) {
            params.filter = {
                id: { _eq: TeamId }
            }
        }

        const data = await directus.request(readItems('teams', params));

        console.log("team", team);
        team.value = data as Teams[];
    }


    async function fetchTeamMembers() {
        const userId = route.params.id;
        try {
            const data = await directus.request(readItems('teams_directus_users', {
                filter: { directus_users_id: { _eq: userId } },
                fields: [
                    'id',
                    'status',
                    'teams_id',
                    { directus_users_id: ['id', 'first_name', 'last_name', { avatar: ['id', 'filename_download'] }, { role: ['name'] }] }
                ],
                limit: 10
            }));
            console.log("teas", data);
            teamMembers.value = data as DirectusQuery[];
        } catch (err) {
            console.log(err)
        }
    };

    async function fetchActiveTeams() {
        try {
            const response = await directus.request(readItems('teams', {
                limit: 5,
                filter: { status: { _eq: 'active' } },
            }));
            activeTeams.value = response as Teams[];
        } catch (err) {
            console.error('Error fetching active teams:', err);
        }
    };

    return {
        teamMembers,
        activeTeams,
        team,
        fetchTeamMembers,
        fetchTeam,
        fetchActiveTeams
    }
})
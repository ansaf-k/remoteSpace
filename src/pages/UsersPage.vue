<template>
    <q-page class="bg-soft-white q-pa-md">
        <!-- Header -->
        <div class="row items-center q-mb-md">
            <div class="col-12 col-md-6">
                <h4 class="q-mt-none q-mb-xs">Peoples</h4>
                <p class="text-grey-7 q-mb-none">
                    Connect with your colleagues
                </p>
            </div>
        </div>

        <!-- Filters -->
        <q-card class="q-mb-md">
            <q-card-section>
                <div class="row items-center q-col-gutter-md">
                    <!-- Search -->
                    <div class="col-12 col-md-4">
                        <q-input v-model="filters.search" dense outlined placeholder="Search members..." clearable
                            @update:model-value="applyFilters">
                            <template v-slot:prepend>
                                <q-icon name="search" />
                            </template>
                        </q-input>
                    </div>

                    <!-- Status Filter -->
                    <div class="col-12 col-md-3">
                        <q-select v-model="filters.status" :options="statusOptions" outlined dense label="Status"
                            emit-value map-options clearable @update:model-value="applyFilters">
                            <template v-slot:prepend>
                                <q-icon name="circle" :color="getStatusColor(filters.status)" v-if="filters.status" />
                                <q-icon name="filter_list" v-else />
                            </template>
                        </q-select>
                    </div>

                    <!-- Department Filter -->
                    <div class="col-12 col-md-3">
                        <q-select v-model="filters.department" :options="departmentOptions" outlined dense
                            label="Department" emit-value map-options clearable @update:model-value="applyFilters">
                            <template v-slot:prepend>
                                <q-icon name="business" />
                            </template>
                        </q-select>
                    </div>

                </div>
            </q-card-section>
        </q-card>

        <!-- List View -->
        <q-card v-if="filteredMembers.length > 0">
            <q-table :rows="filteredMembers" :columns="columns" row-key="name" flat :pagination="{ rowsPerPage: 10 }">
                <template v-slot:body="props">
                    <q-tr :props="props">
                        <q-td key="avatar" :props="props">
                            <q-avatar size="36px">
                                <img :src="props.row.avatar" />
                                <q-badge floating rounded :color="getStatusColorName(props.row.status)" />
                            </q-avatar>
                        </q-td>
                        <q-td key="name" :props="props">{{ props.row.name }}</q-td>
                        <q-td key="position" :props="props">{{ props.row.position }}</q-td>
                        <q-td key="department" :props="props">
                            <q-badge :color="getDepartmentColor(props.row.department)">
                                {{ props.row.department }}
                            </q-badge>
                        </q-td>
                        <q-td key="status" :props="props">
                            <div class="flex items-center">
                                <q-icon :name="getStatusIcon(props.row.status)"
                                    :color="getStatusColorName(props.row.status)" size="xs" class="q-mr-xs" />
                                <span class="text-capitalize">{{ props.row.status.replace('-', ' ') }}</span>
                                <span class="q-ml-xs text-grey-6">· {{ props.row.time }}</span>
                            </div>
                        </q-td>
                        <q-td key="email" :props="props">{{ props.row.email }}</q-td>
                        <q-td key="actions" :props="props">
                            <q-btn flat round size="sm" color="primary" icon="chat_bubble_outline">
                                <q-tooltip>Message</q-tooltip>
                            </q-btn>
                            <q-btn flat round size="sm" color="grey-7" icon="more_vert">
                                <q-menu>
                                    <q-list style="min-width: 100px">
                                        <q-item clickable v-close-popup>
                                            <q-item-section>View Profile</q-item-section>
                                        </q-item>
                                        <q-item clickable v-close-popup>
                                            <q-item-section>Edit</q-item-section>
                                        </q-item>
                                        <q-separator />
                                        <q-item clickable v-close-popup>
                                            <q-item-section class="text-negative">Remove</q-item-section>
                                        </q-item>
                                    </q-list>
                                </q-menu>
                            </q-btn>
                        </q-td>
                    </q-tr>
                </template>
            </q-table>
        </q-card>

        <!-- Empty State -->
        <q-card v-if="filteredMembers.length === 0" class="text-center q-pa-lg">
            <q-icon name="search_off" size="4rem" color="grey-5" />
            <div class="text-h6 q-mt-md">No Results Found</div>
            <p class="text-grey-7">
                Try adjusting your search or filter criteria
            </p>
            <q-btn color="primary" label="Clear Filters" @click="clearFilters" />
        </q-card>
    </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

// Interface definitions
interface Member {
    name: string;
    status: string;
    avatar: string;
    time: string;
    position: string;
    department: string;
    email: string;
}

interface Filters {
    search: string;
    status: string | null;
    department: string | null;
}

// Table columns definition
const columns = [
    { name: 'avatar', label: '', field: 'avatar', align: 'center' as 'center' | 'left' | 'right' },
    { name: 'name', label: 'Name', field: 'name', sortable: true },
    { name: 'position', label: 'Position', field: 'position', sortable: true },
    { name: 'department', label: 'Department', field: 'department', sortable: true },
    { name: 'status', label: 'Status', field: 'status', sortable: true },
    { name: 'email', label: 'Email', field: 'email' },
    { name: 'actions', label: 'Actions', field: 'actions', align: 'center' as 'center' | 'left' | 'right' }
];


// Filter state
const filters = ref<Filters>({
    search: '',
    status: null,
    department: null
});

// Filter options
const statusOptions = [
    { label: 'Active', value: 'checked-in', color: 'green' },
    { label: 'Away', value: 'away', color: 'orange' },
    { label: 'Offline', value: 'offline', color: 'grey' }
];

const departmentOptions = [
    { label: 'Development', value: 'Development' },
    { label: 'Design', value: 'Design' },
    { label: 'Marketing', value: 'Marketing' },
    { label: 'HR', value: 'HR' },
    { label: 'Management', value: 'Management' }
];

// Members data
const members = ref<Member[]>([
    {
        name: 'Sarah Miller',
        status: 'checked-in',
        avatar: 'https://cdn.quasar.dev/img/avatar5.jpg',
        time: '08:32 AM',
        position: 'Frontend Developer',
        department: 'Development',
        email: 'sarah.miller@example.com'
    },
    {
        name: 'David Chen',
        status: 'checked-in',
        avatar: 'https://cdn.quasar.dev/img/avatar3.jpg',
        time: '07:45 AM',
        position: 'UX Designer',
        department: 'Design',
        email: 'david.chen@example.com'
    },
    {
        name: 'Priya Sharma',
        status: 'away',
        avatar: 'https://cdn.quasar.dev/img/avatar4.jpg',
        time: 'Yesterday',
        position: 'Marketing Specialist',
        department: 'Marketing',
        email: 'priya.sharma@example.com'
    },
    {
        name: 'James Wilson',
        status: 'checked-in',
        avatar: 'https://cdn.quasar.dev/img/avatar2.jpg',
        time: '09:05 AM',
        position: 'Backend Developer',
        department: 'Development',
        email: 'james.wilson@example.com'
    },
    {
        name: 'Emma Johnson',
        status: 'offline',
        avatar: 'https://cdn.quasar.dev/img/avatar6.jpg',
        time: '2 days ago',
        position: 'HR Manager',
        department: 'HR',
        email: 'emma.johnson@example.com'
    },
    {
        name: 'Michael Brown',
        status: 'checked-in',
        avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
        time: '08:15 AM',
        position: 'Team Lead',
        department: 'Development',
        email: 'michael.brown@example.com'
    },
    {
        name: 'Jessica Taylor',
        status: 'away',
        avatar: 'https://cdn.quasar.dev/img/avatar1.jpg',
        time: '10:30 AM',
        position: 'UI Designer',
        department: 'Design',
        email: 'jessica.taylor@example.com'
    },
    {
        name: 'Robert Garcia',
        status: 'offline',
        avatar: 'https://cdn.quasar.dev/img/avatar7.jpg',
        time: '3 days ago',
        position: 'Content Writer',
        department: 'Marketing',
        email: 'robert.garcia@example.com'
    },
    {
        name: 'Sophia Lee',
        status: 'checked-in',
        avatar: 'https://cdn.quasar.dev/img/avatar3.jpg',
        time: '09:45 AM',
        position: 'Product Manager',
        department: 'Management',
        email: 'sophia.lee@example.com'
    },
    {
        name: 'John Doe',
        status: 'checked-in',
        avatar: 'https://cdn.quasar.dev/img/avatar.png',
        time: '08:30 AM',
        position: 'UX Designer',
        department: 'Design',
        email: 'john.doe@example.com'
    }
]);

// Filtered members based on search and filters
const filteredMembers = computed(() => {
    return members.value.filter(member => {
        // Search filter
        const searchMatch = !filters.value.search ||
            member.name.toLowerCase().includes(filters.value.search.toLowerCase()) ||
            member.position.toLowerCase().includes(filters.value.search.toLowerCase()) ||
            member.email.toLowerCase().includes(filters.value.search.toLowerCase());

        // Status filter
        const statusMatch = !filters.value.status || member.status === filters.value.status;

        // Department filter
        const deptMatch = !filters.value.department || member.department === filters.value.department;

        return searchMatch && statusMatch && deptMatch;
    });
});


// Helper function to get status color
const getStatusColor = (status: string | null) => {
    if (!status) return 'grey';
    switch (status) {
        case 'checked-in': return 'green';
        case 'away': return 'orange';
        case 'offline': return 'grey';
        default: return 'grey';
    }
};

// Function to get status color name for badges and icons
const getStatusColorName = (status: string) => {
    return getStatusColor(status);
};

// Get status icon
const getStatusIcon = (status: string) => {
    switch (status) {
        case 'checked-in': return 'circle';
        case 'away': return 'access_time';
        case 'offline': return 'do_not_disturb';
        default: return 'circle';
    }
};

// Get department color
const getDepartmentColor = (department: string) => {
    switch (department) {
        case 'Development': return 'primary';
        case 'Design': return 'purple';
        case 'Marketing': return 'orange';
        case 'HR': return 'pink';
        case 'Management': return 'teal';
        default: return 'grey';
    }
};

// Apply filters (for search debounce, etc. if needed)
const applyFilters = () => {
    // You can add debounce logic here if needed
};

// Clear all filters
const clearFilters = () => {
    filters.value = {
        search: '',
        status: null,
        department: null
    };
};

// Lifecycle hooks
onMounted(() => {
    // Could fetch data from API here
});
</script>

<style scoped>
.member-card {
    transition: all 0.3s;
}

.member-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}
</style>
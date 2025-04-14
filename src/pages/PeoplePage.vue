<script setup lang="ts">
import AppPagination from 'src/components/AppPagination.vue';
import { useDateTime } from 'src/composables/useDateTime';
import { type UserFilters, useUserStore } from 'src/stores/userStore';
import { ref, onMounted, watch } from 'vue';



const userStore = useUserStore();
const { formatSmartDate } = useDateTime();

// Table columns definition
const columns = [
    { name: 'avatar', label: '', field: 'avatar', align: 'center' as 'center' | 'left' | 'right' },
    { name: 'name', label: 'Name', field: 'name', sortable: true },
    { name: 'status', label: 'Status', field: 'status', sortable: true },
    { name: 'email', label: 'Email', field: 'email' },
    { name: 'actions', label: 'Actions', field: 'actions', align: 'center' as 'center' | 'left' | 'right' }
];


// Filter state
const filters = ref<UserFilters>({
    search: '',
    status: null,
    limit: 10,
    page: 1
});

// Filter options
const statusOptions = [
    { label: 'online', value: 'online', color: 'green' },
    { label: 'away', value: 'away', color: 'orange' },
    { label: 'offline', value: 'offline', color: 'grey' }
];


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


// Apply filters (for search debounce, etc. if needed)
const applyFilters = () => {
    // You can add debounce logic here if needed
};

// Clear all filters
const clearFilters = () => {
    filters.value = {
        search: '',
        status: null,
        limit: filters.value.limit,
        page: filters.value.page
    };
};

// Lifecycle hooks
onMounted(async () => {
    await userStore.fetchUsers({
        search: filters.value.search,
        status: filters.value.status,
        limit: filters.value.limit,
        page: filters.value.page
    });
});

watch(
    () => filters.value,
    async (newfilters) => {
        await userStore.fetchUsers(newfilters);
    },
    { deep: true }
)
</script>

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


                </div>
            </q-card-section>
        </q-card>

        <!-- List View -->
        <q-card v-if="userStore.users?.length && userStore.users?.length > 0">
            <q-table :rows="userStore.users" :columns="columns" row-key="name" flat
                :pagination="{ rowsPerPage: filters.limit }">
                <template v-slot:body="props">
                    <q-tr :props="props">
                        <q-td key="avatar" :props="props">
                            <q-avatar size="36px">
                                <img :src="props.row.avatar" />
                                <q-badge floating rounded :color="getStatusColorName(props.row.status)" />
                            </q-avatar>
                        </q-td>
                        <q-td key="name" :props="props">{{ props.row.first_name }}</q-td>
                        <q-td key="position" :props="props">{{ props.row.position }}</q-td>
                        <q-td key="status" :props="props">
                            <div class="flex items-center justify-center">
                                <q-icon :name="getStatusIcon(props.row.active_status)"
                                    :color="getStatusColorName(props.row.active_status)" size="xs" class="q-mr-xs" />
                                <span class="text-capitalize">{{ props.row.active_status.replace('-', ' ') }}</span>
                                <span class="q-ml-xs text-grey-6">· {{ formatSmartDate(props.row.last_access) }}</span>
                            </div>
                        </q-td>
                        <q-td key="email" :props="props">{{ props.row.email }}</q-td>
                        <q-td key="actions" :props="props">
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
        <q-card v-if="userStore.users?.length === 0" class="text-center q-pa-lg">
            <q-icon name="search_off" size="4rem" color="grey-5" />
            <div class="text-h6 q-mt-md">No Results Found</div>
            <p class="text-grey-7">
                Try adjusting your search or filter criteria
            </p>
            <q-btn color="primary" label="Clear Filters" @click="clearFilters" />
        </q-card>
        <AppPagination v-model:page="filters.page" :limit="filters.limit" />
    </q-page>
</template>



<style scoped>
.member-card {
    transition: all 0.3s;
}

.member-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}
</style>
<script setup lang="ts">
import { useDateTime } from 'src/composables/useDateTime';
import { ref, computed, onMounted } from 'vue';
import fallbackImage from 'src/assets/profile.jpg';

const { formatSmartDate } = useDateTime();
const directusUrl = import.meta.env.VITE_DIRECTUS_URL || 'https://api.example.com';
const isLoading = ref(false);
const searchQuery = ref('');
const activeFilter = ref('all');
const currentPage = ref(1);

// Demo data based on the structure in your code
const teamMembers = ref([
  {
    id: 1,
    directus_users_id: {
      id: 101,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      position: 'Frontend Developer',
      department: 'Engineering',
      active_status: 'active',
      last_access: new Date('2025-04-10T15:30:00'),
      role: { name: 'Developer' },
      avatar: { id: 'avatar1', filename_download: 'john_avatar.jpg' }
    }
  },
  {
    id: 2,
    directus_users_id: {
      id: 102,
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane.smith@example.com',
      position: 'UI/UX Designer',
      department: 'Design',
      active_status: 'active',
      last_access: new Date('2025-04-14T09:45:00'),
      role: { name: 'Designer' },
      avatar: { id: 'avatar2', filename_download: 'jane_avatar.jpg' }
    }
  },
  {
    id: 3,
    directus_users_id: {
      id: 103,
      first_name: 'Michael',
      last_name: 'Johnson',
      email: 'michael.j@example.com',
      position: 'Backend Developer',
      department: 'Engineering',
      active_status: 'inactive',
      last_access: new Date('2025-03-25T11:20:00'),
      role: { name: 'Developer' },
      avatar: { id: 'avatar3', filename_download: 'michael_avatar.jpg' }
    }
  },
  {
    id: 4,
    directus_users_id: {
      id: 104,
      first_name: 'Emily',
      last_name: 'Wilson',
      email: 'emily.w@example.com',
      position: 'Project Manager',
      department: 'Management',
      active_status: 'active',
      last_access: new Date('2025-04-15T08:15:00'),
      role: { name: 'Manager' },
      avatar: { id: 'avatar4', filename_download: 'emily_avatar.jpg' }
    }
  },
  {
    id: 5,
    directus_users_id: {
      id: 105,
      first_name: 'David',
      last_name: 'Brown',
      email: 'david.b@example.com',
      position: 'DevOps Engineer',
      department: 'Operations',
      active_status: 'pending',
      last_access: new Date('2025-04-12T14:50:00'),
      role: { name: 'Engineer' },
      avatar: null
    }
  },
  {
    id: 6,
    directus_users_id: {
      id: 106,
      first_name: 'Sarah',
      last_name: 'Miller',
      email: 'sarah.m@example.com',
      position: 'QA Specialist',
      department: 'Quality Assurance',
      active_status: 'active',
      last_access: new Date('2025-04-14T16:20:00'),
      role: { name: 'Specialist' },
      avatar: { id: 'avatar6', filename_download: 'sarah_avatar.jpg' }
    }
  }
]);

// Status color mapping (same as your original code)
const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'positive';
    case 'inactive': return 'negative';
    case 'pending': return 'warning';
    default: return 'grey';
  }
};

// Filter team members based on search and active status
const filteredTeamMembers = computed(() => {
  let members = teamMembers.value;
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    members = members.filter(member => 
      member.directus_users_id.first_name?.toLowerCase().includes(query) ||
      (member.directus_users_id.last_name && member.directus_users_id.last_name.toLowerCase().includes(query)) ||
      member.directus_users_id.email?.toLowerCase().includes(query) ||
      member.directus_users_id.role?.name?.toLowerCase().includes(query) ||
      (member.directus_users_id.department && member.directus_users_id.department.toLowerCase().includes(query))
    );
  }
  
  // Filter by status
  if (activeFilter.value !== 'all') {
    members = members.filter(member => 
      member.directus_users_id.active_status === activeFilter.value
    );
  }
  
  return members;
});

// For team statistics
const teamStats = computed(() => {
  const total = teamMembers.value.length;
  const active = teamMembers.value.filter(m => 
    m.directus_users_id.active_status === 'active').length;
  const inactive = teamMembers.value.filter(m => 
    m.directus_users_id.active_status === 'inactive').length;
  const pending = teamMembers.value.filter(m => 
    m.directus_users_id.active_status === 'pending').length;

  return { total, active, inactive, pending };
});

onMounted(() => {
  // Simulate loading
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
  }, 800);
});
</script>

<template>
  <q-layout>
    <q-page-container>
      <q-page class="full-width-team bg-soft-white">
        <div class="team-container">
          <!-- Team Header -->
          <div class="team-header">
            <div class="team-title-section">
              <h2 class="q-my-sm">Team Members</h2>
              <p class="text-grey">Manage and view all team members in your organization</p>
            </div>
            
          </div>
          
          <!-- Team Stats Section -->
          <div class="team-stats-wrapper q-py-md q-mb-md">
            <div class="team-stats">
              <div class="stat-card">
                <div class="stat-value">{{ teamStats.total }}</div>
                <div class="stat-label">Total Members</div>
              </div>
              <div class="stat-card">
                <div class="stat-value text-positive">{{ teamStats.active }}</div>
                <div class="stat-label">Active</div>
              </div>
              <div class="stat-card">
                <div class="stat-value text-negative">{{ teamStats.inactive }}</div>
                <div class="stat-label">Inactive</div>
              </div>
              <div class="stat-card">
                <div class="stat-value text-warning">{{ teamStats.pending }}</div>
                <div class="stat-label">Pending</div>
              </div>
            </div>
          </div>
          
          <!-- Search and Filter Section -->
          <div class="filter-section q-pb-md">
            <q-input v-model="searchQuery" filled dense placeholder="Search team members" class="search-input">
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
              <template v-slot:append>
                <q-icon name="close" v-if="searchQuery" @click="searchQuery = ''" class="cursor-pointer" />
              </template>
            </q-input>
            
            <q-btn-toggle
              v-model="activeFilter"
              toggle-color="primary"
              :options="[
                {label: 'All', value: 'all'},
                {label: 'Active', value: 'active'},
                {label: 'Inactive', value: 'inactive'},
                {label: 'Pending', value: 'pending'}
              ]"
              class="filter-toggle"
            />
          </div>
          
          <!-- Team Members List -->
          <div v-if="isLoading" class="flex flex-center q-pa-xl">
            <q-spinner color="primary" size="3em" />
            <span class="q-ml-md">Loading team members...</span>
          </div>
          
          <div v-else-if="filteredTeamMembers.length === 0" class="empty-state q-pa-xl">
            <q-icon name="people" size="4em" color="grey-5" />
            <h5 class="q-mt-md">No team members found</h5>
            <p class="text-grey">Try adjusting your search or filters</p>
          </div>
          
          <div v-else class="row q-col-gutter-md">
            <div v-for="member in filteredTeamMembers" :key="member.id" class="col-md-4 col-sm-6 col-xs-12">
              <q-card class="team-member-card">
                <!-- Member Header -->
                <q-card-section class="member-header">
                  <q-avatar size="80px" class="q-mb-sm">
                    <img 
                      :src="member.directus_users_id.avatar?.id ? 
                        `${directusUrl}/assets/${member.directus_users_id.avatar.id}` : 
                        fallbackImage"
                      :alt="member.directus_users_id.first_name"
                    >
                  </q-avatar>
                  <q-badge 
                    :color="getStatusColor(member.directus_users_id.active_status)" 
                    rounded 
                    class="status-badge"
                  >
                    {{ member.directus_users_id.active_status }}
                  </q-badge>
                  
                  <div class="text-h6 q-mt-sm">
                    {{ member.directus_users_id.first_name }} {{ member.directus_users_id.last_name ?? '' }}
                  </div>
                  <div class="text-subtitle2 text-grey q-mb-xs">
                    {{ member.directus_users_id.role?.name }}
                  </div>
                  <div class="text-caption text-grey">
                    {{ member.directus_users_id.email }}
                  </div>
                </q-card-section>
                
                <!-- Member Details -->
                <q-separator />
                <q-card-section>
                  <div class="member-details">
                    <div class="detail-item">
                      <q-icon name="access_time" color="secondary" size="sm" class="q-mr-xs" />
                      <span class="detail-label">Last Active:</span>
                      <span class="detail-value">
                        {{ formatSmartDate(member.directus_users_id.last_access) }}
                      </span>
                    </div>
                    
                    <div class="detail-item" v-if="member.directus_users_id.position">
                      <q-icon name="work" color="secondary" size="sm" class="q-mr-xs" />
                      <span class="detail-label">Position:</span>
                      <span class="detail-value">{{ member.directus_users_id.position }}</span>
                    </div>
                    
                    <div class="detail-item" v-if="member.directus_users_id.department">
                      <q-icon name="business" color="secondary" size="sm" class="q-mr-xs" />
                      <span class="detail-label">Department:</span>
                      <span class="detail-value">{{ member.directus_users_id.department }}</span>
                    </div>
                  </div>
                </q-card-section>
                
                <!-- Actions -->
                <q-separator />
                <q-card-actions align="right">
                  <q-btn flat color="primary" icon="mail" size="sm">
                    <q-tooltip>Send Email</q-tooltip>
                  </q-btn>
                  <q-btn flat color="secondary" icon="person" size="sm" :to="`/profile/${member.directus_users_id.id}`">
                    <q-tooltip>View Profile</q-tooltip>
                  </q-btn>
                  <q-btn flat color="accent" icon="edit" size="sm">
                    <q-tooltip>Edit Member</q-tooltip>
                  </q-btn>
                </q-card-actions>
              </q-card>
            </div>
          </div>
          
          <!-- Pagination -->
          <div class="pagination-section q-pt-md q-mt-lg" v-if="filteredTeamMembers.length > 0">
            <q-pagination
              v-model="currentPage"
              :max="5"
              direction-links
              boundary-links
              color="primary"
              class="justify-center"
            />
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.full-width-team {
  width: 100%;
  margin: 0;
  padding: 0;
}

.team-container {
  width: 100%;
  background: white;
  padding: 2rem;
}

.team-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.team-stats-wrapper {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 1rem;
}

.team-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: space-around;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  min-width: 120px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.stat-value {
  font-size: 1.8rem;
  font-weight: bold;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.search-input {
  max-width: 300px;
}

.team-member-card {
  height: 100%;
  transition: transform 0.3s ease;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.team-member-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.member-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
}

.status-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  text-transform: capitalize;
}

.member-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-item {
  display: flex;
  align-items: center;
}

.detail-label {
  font-weight: 500;
  margin-right: 0.5rem;
  color: #666;
}

.detail-value {
  color: #333;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 300px;
}

.bg-soft-white {
  background-color: #F8FAFC;
}

.pagination-section {
  display: flex;
  justify-content: center;
  border-top: 1px solid #f0f0f0;
}

@media (max-width: 768px) {
  .team-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .team-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .filter-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input {
    max-width: none;
  }
}
</style>
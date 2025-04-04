<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores/authStore';
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const currentDateTime = ref(new Date());
const loadingData = ref(true);
const authStore = useAuthStore();
const $q = useQuasar();



// Update date time periodically
onMounted(() => {
    // Set initial time
    updateDateTime();

    // Update time every minute
    setInterval(updateDateTime, 60000);

    // Simulating data loading
    setTimeout(() => {
        loadingData.value = false;
    }, 1000);
});

const updateDateTime = () => {
    currentDateTime.value = new Date();
};

const handleLogout = async () => {
    try {
        const isLoggedOut = await authStore.logout();
        if (isLoggedOut) {
            $q.notify({
                type: 'positive',
                message: 'Logged out successfully',
                position: 'top-right',
                timeout: 1000
            });
            void router.push('/login');
        } else {
            $q.notify({
                type: 'negative',
                message: 'Failed to log out',
                position: 'top-right',
                timeout: 1000
            })
            console.log('Failed to log out');
        }
    } catch (error) {
        console.log((error as Error).message);
    }
};

const goToCheckIn = async () => {
    // This would navigate to your separate check-in page
    await router.push('/checkin');
};

const avatarUrl = computed(() => authStore.user?.avatar || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAh1BMVEX///8AAAD5+fkhISF/f3+5ubnh4eH19fUTExOurq7c3NyFhYXx8fGysrLNzc37+/vp6embm5vW1tZSUlIKCgpqamo/Pz+mpqbCwsJcXFw4ODjR0dG4uLgjIyNFRUXIyMhxcXGPj49iYmKMjIwXFxdsbGxLS0syMjKXl5cqKip4eHhVVVVCQkLKJjdOAAAJaUlEQVR4nO2d6ZqiOhCGDe4IDbixuO+Kff/Xd7KwE1pwCIHz1PtjphvRyWdCVaVSyfR6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA0jWHIboFIzOHM9a5D2c0Qxej5QpSJIrspQti4KORXdltEYL5RzIBeUreX23u/3r9vs+mm88+mhZJse4pzQ2keW9lt/BeUd1rN5nlFeUzZzfwe7cHRk0eT3c6v0fpl9D02stv5PV4JfbsuP4X+Z32vqexG/gvDEj34es+2I9kN/ZYxz2py8Z7dNKansgIJK1V2c6ujVBGI8TsX21ifRaV5dG2o7qoqRJNuSXQqC0Ro2amBev5CITrLbnUFtG8EIqTLbnd5vhmkmGV3UgCD7xQiS3bDS1PdkgbIbnhZxt8KRF1Jxm2+VtgVc6p/rRB1xNY80612nnw1PA7cD2xdLJA2pX4Z77F3J/Tv3JTf2bVxlnxMtv1FOsD8mNGYG3P7jNzcKL0j1EKJqZRoMIc/fZJYMEWcozZKTCqMnLj6IbW4G/M/rJUSEzmod+LyB4NT5CnaKPESNzuV7TXdQnmEosC7hRKnUaOzxv/w51AtSn63T+IhbPIg/9p0WazQL/rA1kkMp4ce99VpcVw+574Bu5sf/GKBJZJD0E8FyV5j+1ug8M1/Q8/AbzgKaut3MJf/x7jaHPkS+U5RwQJdQU39EprR/7tNypRnWFfcW9cFL0iEPIjXj8uCmr7Kpf45bzK89gmkPp8/S8iAg9FjapUxb06UfeuGKOVQZUlJdabPgX+8Hf28MR2nelDfL5IUupcucU8KNLKrynz3IpytGyToR2pJ/pjhpoeo7q0TeJL6UA2Dk1OB18tzZRJHi3wmymxhcmoVDp4Cn8eDGRgfTVqXr+ARPTi83IXuOBw/GMQy027U1mBfaLOfOGnTdY8rPJgm4+jzR1q7y2PG4Vp+BeqErxp5hUGwhqcQjqxmV0CJMxf5vCmtDsoP0+D+n5JxgmzifERumLLFpZzw0OjrhdORdnGLF1iyvcWkm1mFYZJ00LJJYBF6bC+mGSlBJmaRuRyG269ogmiGl9RwPqWZ2Svy0BIz2XtKySK4OkoLpIbJoEY2sMJqoNqOXjYDR0JHuN2gGi5+bBKN024SsntG7tx0r9FlL7p3glBwx5AFDUHJChEUGKFgUDwbVMODzA5jqz8OSd2j5C6P73HnMIW43676lI1ippCYrql+lR8YkFzb2x5WqIw96AOUyAkzhTr980C/LhYMOPRntQWJN1aXWJRXKrr/mPx9Tp/CMe1JPVSo094bt+BJ7JmkS3alw2iS778nwplIocZTqLVBIWZWoXjkkqlR6IbCSwX3PeukQrtCEf6tksJWPIc92srS0YeH9tn3FikctUfhvEJ1THYNhyl06CzlRGckTCH+zAsNBFoxycLf9KzkraNspzCFBnbtCxwHPHrR5NjDNvfdmj1wC9q0MtjZAR2McJXFaGRGFURtwbREUhIxi1X6QbyjV/rCeHGjf5uz9e+F2ivj7FLvql1+1zPZMVvIqOwwLX1j67iXLOLyOzK1z+OwzNMnRt0p2MvxW2qas6jgONvGoczO32mHu9AiK0WfbAj1CKvi51D3aAZyc1u/gyyPdtrvmYE9eVKt6rSfyMIUYrKSRHQsimEndI3AilN1o8hJalLTGUOyfv0YaoHEopmiucThjEaXcGZ8jX2ikBQdu31muEhYg630Ditcyit9d0ix5ZWMKjIIL4X3bZZsGKs0/3/izbaowiMJY5Q16lOxJzplPkhUuKE5RJv1G5HoFgxBK35O5/Q9nAZThXd0Z7ebySmiLIXqPZ3vM8mJERZnmP54qaf0Z89NhQYKSao1oXAsT+FoRdp5SXaaQh6zvpXuR+NAEt+v1D5uh5T19TN10C1TaNLKUj9rwx1qVs92OCUwhz69csoGdVty1UtN/lqlUKMV7Deej9LDqsvH2gurhLjG0ybew0ussbVI4fhEmu0WBWAbP1WSuJgWpKkM6voW0QywPQppUvf+5/kI6vZ5dBeL88Xe/JWj0uhX5QcjmCp06QTSJ3mbYZjO0JtVqBAD81vXIjwb7qwbqUIbD47DhZbWYD8x0bd06aJJheSIj0mdhS+0IpzGoVcatXlxPsNmP1qNRm0afsTuNa/e2oGzfNNQbUzGyEONXmF+85XfYiMGUh5Zf/3VJlijC2zOeBPbaDW4pjQ1r7yJEMhqu9uRc3JQJmNdF9t4XVwqykTYKUEDzl42CVjiVmQNbKEFfXSVVvQTqe3NsA6c6Omz27Az2Im7sPJpH4XsQ2M5acGT6EYlIl+dFFFEML+YyTenWlRggIOq13ZUB3OsKxCmyj+FwA5LvLSibU7f4ETf22920aZx9mEL9FqrX8/oyuYWdlCxKQ01Cn5naFljZGqHw1QTEy+VJ7YEMzSpUeE0Wo5y5R6WgZ1haM1FKXTkxjWHePOuKIXYJZavHqufc+QMhSmU6xLHiWo7YQqlukQ74SGEKex5pWs66mefcMfiFEp0iWpynV6cQoku8ZKsoRCnkCz01/fJVTCudM0rQKDCoSyXeEhN7gUqxC5RzkbgVaogSKBCks6X4RKxM7wlfhWpcC7HJdrpjWYiFUpyiXdSNxAjVKElo+BylKmxEKpQ4x4EI5hLpqBQqMLeW4JL3CWdYU+0wmHzidNDNtMtVqGybNwl3mJnyFyVGIVauCLSuEtU4tMqTmhPlvGEKLQiXZum91hMY2dI6oEGSv0Kzd4Pqd4IF0G9GtOxZUg4Q4OczjZxLnUrnJOv7hEFFQ27xLQzpJVsk5oV0sO0ErGa1mxB/ylrzEl7au5DhM6phddmZ4mPjDPsjQe1K9xljlfYNnnggskpZBkI9YfsHy0uxa0bh5MbEuvxCV6DTt/muF/xCs8NTqGsONUdIV6hH664NYAshf3GFMoapc1FNQfOeu//y9LwvIVwhWa5nXA14dEjrVIIV1hvocAnnnmHKFyh12jUpuWrBkUrdBrexjXLnU0tWKHSb/j/SVRQduOnYIVu4+coHLISxSpcSdhoaqH02Q0iFY7feLbf/JmRVnoOLlDhaIeQJ+M/KyW7ZM6Rqkt4CGkt6Im4kGz3uv11szhUkgtbDSizPVoOamOGh+WR/eiTzSTStvsq2cPzBCHzrBbn/Orv+iLZ3bnbgxvEUAQjVx4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/P/4D6IJhBaRLO27AAAAAElFTkSuQmCC');


</script>

<template>
    <q-layout view="lHh Lpr lFf">
        <q-header elevated class="bg-primary">
            <q-toolbar>
                <q-toolbar-title>
                    Remo<span class="text-secondary">Space</span>
                </q-toolbar-title>

                <q-space />

                <q-btn flat round icon="notifications" class="q-mr-sm">
                    <q-badge color="red" floating>3</q-badge>
                </q-btn>


                <q-btn-dropdown flat>
                    <template v-slot:label>
                        <div class="row items-center no-wrap">
                            <q-avatar size="32px">
                                <img :src="avatarUrl">
                            </q-avatar>
                            <div class="q-ml-sm">
                                {{ authStore.user?.first_name }}
                            </div>
                        </div>
                    </template>

                    <q-list>
                        <q-item clickable v-close-popup @click="() => router.push(`/user/${authStore.user?.id}`)">
                            <q-item-section>My Profile</q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup @click="goToCheckIn">
                            <q-item-section>Check In/Out</q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup @click="() => { }">
                            <q-item-section>Preferences</q-item-section>
                        </q-item>
                        <q-separator />
                        <q-item clickable v-close-popup @click="handleLogout">
                            <q-item-section>Logout</q-item-section>
                        </q-item>
                    </q-list>
                </q-btn-dropdown>
            </q-toolbar>

           <div v-if="!route.meta.hideSomeElements">
                <q-tabs align="left" class="bg-primary text-white">
                    <q-route-tab to="/dashboard" label="Dashboard" icon="dashboard" />
                    <q-route-tab to="/dashboard/team" label="Team" icon="groups" />
                    <q-route-tab to="/dashboard/peoples" label="People" icon="people" />
                </q-tabs>
           </div>
        </q-header>

        <q-page-container>
            <router-view></router-view>
        </q-page-container>
    </q-layout>
</template>

<style scoped>
.bg-soft-white {
    background-color: #F8FAFC;
}

.metric-card {
    border-color: rgba(30, 58, 138, 0.1);
    transition: all 0.2s ease;
}

.metric-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.project-item {
    transition: background-color 0.2s ease;
}

.project-item:hover {
    background-color: rgba(30, 58, 138, 0.04);
}

.weekly-chart .bar-container {
    width: 20px;
    height: 70px;
    display: flex;
    align-items: flex-end;
}

.weekly-chart .time-bar {
    width: 12px;
    border-radius: 6px;
    min-height: 4px;
}

/* Override Quasar theme colors to match our palette */
:deep(.q-btn.bg-primary) {
    background-color: #1E3A8A !important;
}

:deep(.text-secondary) {
    color: #F59E0B !important;
}

:deep(.bg-green-1) {
    background-color: rgba(16, 185, 129, 0.1) !important;
}

:deep(.text-green) {
    color: #10B981 !important;
}

:deep(.bg-red-1) {
    background-color: rgba(239, 68, 68, 0.1) !important;
}

:deep(.text-red) {
    color: #EF4444 !important;
}
</style>
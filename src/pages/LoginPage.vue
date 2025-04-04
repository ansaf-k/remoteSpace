<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/authStore';
import { useQuasar } from 'quasar';


const router = useRouter()
const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const loginError = ref('');
const authStore = useAuthStore();
const $q = useQuasar();

const onSubmit = async () => {

    try {
        await authStore.login({
            email: email.value,
            password: password.value,
        });

        void router.push('/dashboard');
        $q.notify({
            type: authStore.error ? 'negative' : 'positive',
            message: authStore.error ? `${authStore.error}` : 'Login successful!',
            timeout: 1000,
        });

    } catch (error) {
        console.log('Login error:', error);
        $q.notify({
            type: 'negative',
            message: 'Login failed. Please try again.'
        });
    }
}

onMounted(() => {
    if(authStore.isAuthenticated) {
        void router.push('/dashboard');
    }else{
        console.log("token does not exist");
    }
});

</script>


<template>
    <q-layout view="lHh Lpr lFf">
        <q-page-container>
            <q-page class="flex flex-center bg-soft-white">
                <div class="login-container">
                    <!-- Left Panel -->
                    <div class="left-panel bg-primary text-white">
                        <div>
                            <div class="logo q-mb-md">
                                Remo<span class="text-secondary">Space</span>
                            </div>
                            <q-badge color="secondary" class="q-mb-md">Employee Experience Platform</q-badge>
                            <h4 class="tagline q-mt-md q-mb-md">Your integrated workspace</h4>
                            <p class="description q-mb-lg">Start your day, track attendance, earn rewards, and connect
                                with your team - all in one place.</p>
                        </div>

                        <div class="features">
                            <div class="feature q-mb-sm">
                                <q-icon name="check_circle" color="secondary" size="xs" class="q-mr-sm" />
                                <div class="feature-text">Attendance & Mood Tracking</div>
                            </div>
                            <div class="feature q-mb-sm">
                                <q-icon name="check_circle" color="secondary" size="xs" class="q-mr-sm" />
                                <div class="feature-text">Work Location & Timezone Settings</div>
                            </div>
                            <div class="feature q-mb-sm">
                                <q-icon name="check_circle" color="secondary" size="xs" class="q-mr-sm" />
                                <div class="feature-text">Rewards & Gamification</div>
                            </div>
                            <div class="feature q-mb-sm">
                                <q-icon name="check_circle" color="secondary" size="xs" class="q-mr-sm" />
                                <div class="feature-text">Project & Team Visibility</div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Panel -->
                    <div class="right-panel">
                        <div class="form-header q-mb-lg">
                            <h5 class="form-title q-mb-sm">Sign in to your workspace</h5>
                            <p class="form-subtitle text-grey-7">Access your personalized employee dashboard</p>
                        </div>

                        <q-form @submit="onSubmit" class="q-gutter-md">
                            <q-input filled v-model="email" label="Company Email" lazy-rules
                                :rules="[val => val && val.length > 0 || 'Please enter your company email']" />

                            <q-input filled type="password" v-model="password" label="Password" lazy-rules
                                :rules="[val => val && val.length > 0 || 'Please enter your password']">
                                <template v-slot:append>
                                    <q-icon name="visibility_off" class="cursor-pointer" />
                                </template>
                            </q-input>

                            <div class="row items-center q-mb-md">
                                <div class="col">
                                    <q-checkbox v-model="rememberMe" label="Remember me" />
                                </div>
                                <div class="col text-right">
                                    <q-btn flat dense color="primary" to="/reset-password" label="Forgot password?" />
                                </div>
                            </div>

                            <q-btn unelevated color="primary" label="Sign in & Start My Day" type="submit"
                                class="full-width q-py-sm" />

                            <div v-if="loginError" class="status-error">
                                <q-banner class="bg-red-1 text-red">
                                    Invalid credentials. Please try again.
                                </q-banner>
                            </div>



                            <div class="text-center q-mt-md">
                                <p class="text-grey q-mb-xs">New employee?</p>
                                <q-btn flat color="primary" label="Complete your onboarding" />
                            </div>
                        </q-form>
                    </div>
                </div>
            </q-page>
        </q-page-container>
    </q-layout>
</template>


<style scoped>
.login-container {
    display: flex;
    max-width: 900px;
    width: 100%;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
    overflow: hidden;
}

.left-panel {
    flex: 1;
    padding: 3rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.logo {
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.025em;
}

.tagline {
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.2;
    margin: 0;
}

.description {
    font-size: 1rem;
    line-height: 1.6;
    opacity: 0.9;
}

.features {
    margin-top: 2rem;
}

.feature {
    display: flex;
    align-items: center;
}

.feature-text {
    font-size: 0.9rem;
}

.right-panel {
    flex: 1;
    padding: 3rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.form-title {
    font-weight: 700;
    margin: 0;
}

.bg-soft-white {
    background-color: #F8FAFC;
}

.quick-access-card {
    border-color: rgba(30, 58, 138, 0.1);
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .login-container {
        flex-direction: column;
        margin: 1rem;
    }

    .left-panel,
    .right-panel {
        padding: 2rem;
    }
}
</style>
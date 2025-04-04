<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores/authStore';

const router = useRouter();
const $q = useQuasar();
const authStore = useAuthStore();

const email = ref('');
const resetToken = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

const emailSent = ref(false);
const resetError = ref('');

const sendResetEmail = async () => {
    resetError.value = '';

    // Basic email validation
    if (!email.value || !email.value.includes('@')) {
        resetError.value = 'Please enter a valid email address';
        return;
    }

    try {
        const result = await authStore.sendResetRequest(email.value);
        if (result) {
            emailSent.value = true;
            $q.notify({
                type: 'positive',
                message: 'Password reset email sent. Check your inbox.',
                timeout: 1000
            });
        }
    } catch (error) {
        console.log(error);
        resetError.value = 'Failed to send reset email. Please try again.';
        $q.notify({
            type: 'negative',
            message: 'Password reset failed.',
            timeout: 2000
        });
    }
};

const resetPassword = () => {
    resetError.value = '';

    // Validation checks
    if (!resetToken.value) {
        resetError.value = 'Please enter the reset token';
        return;
    }

    if (!newPassword.value) {
        resetError.value = 'Please enter a new password';
        return;
    }

    if (newPassword.value !== confirmPassword.value) {
        resetError.value = 'Passwords do not match';
        return;
    }

    try {
        // Simulate password reset (replace with actual API call)
        // await authStore.resetPassword({
        //     email: email.value,
        //     token: resetToken.value,
        //     newPassword: newPassword.value
        // });

        $q.notify({
            type: 'positive',
            message: 'Password reset successful. Please log in.',
            timeout: 2000
        });

        void router.push('/login');
    } catch (error) {
        console.log(error);
        resetError.value = 'Failed to reset password. Please try again.';
        $q.notify({
            type: 'negative',
            message: 'Password reset failed.',
            timeout: 2000
        });
    }
};

</script>

<template>
    <q-layout view="lHh Lpr lFf">
        <q-page-container>
            <q-page class="flex flex-center bg-soft-white">
                <div class="login-container">
                    <!-- Left Panel (Same as Login Page) -->
                    <div class="left-panel bg-primary text-white">
                        <div>
                            <div class="logo q-mb-md">
                                Remo<span class="text-secondary">Space</span>
                            </div>
                            <q-badge color="secondary" class="q-mb-md">Employee Experience Platform</q-badge>
                            <h4 class="tagline q-mt-md q-mb-md">Reset Your Password</h4>
                            <p class="description q-mb-lg">
                                Forgot your password? No worries. We'll help you reset it securely.
                            </p>
                        </div>

                        <div class="features">
                            <div class="feature q-mb-sm">
                                <q-icon name="check_circle" color="secondary" size="xs" class="q-mr-sm" />
                                <div class="feature-text">Secure Password Reset</div>
                            </div>
                            <div class="feature q-mb-sm">
                                <q-icon name="check_circle" color="secondary" size="xs" class="q-mr-sm" />
                                <div class="feature-text">Email Verification</div>
                            </div>
                            <div class="feature q-mb-sm">
                                <q-icon name="check_circle" color="secondary" size="xs" class="q-mr-sm" />
                                <div class="feature-text">Quick Recovery Process</div>
                            </div>
                            <div class="feature q-mb-sm">
                                <q-icon name="check_circle" color="secondary" size="xs" class="q-mr-sm" />
                                <div class="feature-text">Account Security</div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Panel -->
                    <div class="right-panel">
                        <div class="form-header q-mb-lg">
                            <h5 class="form-title q-mb-sm">
                                {{ !emailSent ? 'Forgot Password' : 'Reset Your Password' }}
                            </h5>
                            <p class="form-subtitle text-grey-7">
                                {{ !emailSent
                                    ? 'Enter your company email to reset password'
                                    : 'Enter the token and new password'
                                }}
                            </p>
                        </div>

                        <!-- Email Send Form -->
                        <q-form v-if="!emailSent" @submit="sendResetEmail" class="q-gutter-md">
                            <q-input filled v-model="email" label="Company Email" lazy-rules
                                :rules="[val => val && val.length > 0 || 'Please enter your company email']" />

                            <q-btn unelevated color="primary" label="Send Reset Link" type="submit"
                                class="full-width q-py-sm" />

                            <div v-if="resetError" class="status-error">
                                <q-banner class="bg-red-1 text-red">
                                    {{ resetError }}
                                </q-banner>
                            </div>

                            <div class="text-center q-mt-md">
                                <q-btn flat color="primary" label="Back to Login" @click="router.push('/login')" />
                            </div>
                        </q-form>

                        <!-- Password Reset Form -->
                        <q-form v-else @submit="resetPassword" class="q-gutter-md">
                            <q-input filled v-model="resetToken" label="Reset Token" lazy-rules
                                :rules="[val => val && val.length > 0 || 'Please enter the reset token']" />

                            <q-input filled type="password" v-model="newPassword" label="New Password" lazy-rules
                                :rules="[val => val && val.length >= 8 || 'Password must be at least 8 characters']">
                                <template v-slot:append>
                                    <q-icon name="visibility_off" class="cursor-pointer" />
                                </template>
                            </q-input>

                            <q-input filled type="password" v-model="confirmPassword" label="Confirm New Password"
                                lazy-rules
                                :rules="[val => val && val.length >= 8 || 'Password must be at least 8 characters']">
                                <template v-slot:append>
                                    <q-icon name="visibility_off" class="cursor-pointer" />
                                </template>
                            </q-input>

                            <q-btn unelevated color="primary" label="Reset Password" type="submit"
                                class="full-width q-py-sm" />

                            <div v-if="resetError" class="status-error">
                                <q-banner class="bg-red-1 text-red">
                                    {{ resetError }}
                                </q-banner>
                            </div>

                            <div class="text-center q-mt-md">
                                <q-btn flat color="primary" label="Back to Login" @click="router.push('/login')" />
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
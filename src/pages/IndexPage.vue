<template>
    <q-layout class="fullscreen" view="lHh Lpr lFf">
        <q-header elevated class="bg-primary text-white">
            <q-toolbar>
                <q-toolbar-title>
                    Remo<span class="text-secondary">Space</span>
                </q-toolbar-title>
                <q-btn to="/login" flat color="white">
                    login
                </q-btn>
            </q-toolbar>
        </q-header>

        <q-page-container>
            <q-page class="bg-soft-white">
                <!-- Hero Section -->
                <section class="hero-section bg-primary content-center text-white q-pa-xl text-center">
                    <div class="text-h3 q-mb-md">
                        <span class="text-weight-bold">RemoSpace</span>: Your Integrated Workspace
                    </div>
                    <div class="text-subtitle1 q-mb-lg">
                        Transforming Employee Experience Through Technology
                    </div>
                    <q-btn to="/login" color="secondary" label="Explore Features" size="lg" class="q-px-xl" />
                </section>

            </q-page>
        </q-page-container>
    </q-layout>
</template>

<script setup lang="ts">



</script>

<style scoped>
:root {
    --q-primary: #1E3A8A;
    --q-secondary: #F59E0B;
    --q-background: #F8FAFC;
}

.bg-soft-white {
    background-color: #F8FAFC;
}

.hero-section {
    height: 94vh;
    background: linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%);
}

.full-height {
    height: 100%;
}

blockquote {
    font-style: italic;
    position: relative;
    quotes: "" " " "" "'" "'";
}
</style>
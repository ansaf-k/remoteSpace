<script setup lang="ts">
import { type Mood } from 'src/services/moodModel';
import { ref, watch } from 'vue';


const emit = defineEmits(['update:modelValue', 'mood-selected']);

const showModal = ref(true);
const selectedMood = ref<Mood | null>(null);
const moodNote = ref('');

// Premium mood options with detailed descriptions
const moodOptions = [
    {
        value: 'energized',
        label: 'Energized',
        icon: 'bolt',
        color: 'amber-8',
        description: 'Ready to tackle challenges and be productive'
    },
    {
        value: 'focused',
        label: 'Focused',
        icon: 'center_focus_strong',
        color: 'blue-7',
        description: 'In the zone and ready to concentrate'
    },
    {
        value: 'creative',
        label: 'Creative',
        icon: 'brush',
        color: 'deep-purple-6',
        description: 'Innovative and full of new ideas'
    },
    {
        value: 'relaxed',
        label: 'Relaxed',
        icon: 'spa',
        color: 'teal-6',
        description: 'Calm, collected and in control'
    },
    {
        value: 'tired',
        label: 'Tired',
        icon: 'nights_stay',
        color: 'blue-grey-6',
        description: 'Low energy but still pushing through'
    },
    {
        value: 'stressed',
        label: 'Stressed',
        icon: 'priority_high',
        color: 'red-6',
        description: 'Feeling pressure and could use support'
    }
];

watch(() => showModal.value, (newVal) => {
    emit('update:modelValue', newVal);
});

const handleMoodSelection = (mood: Mood) => {
    selectedMood.value = mood;
};

const submitMood = () => {
    emit('mood-selected', {
        ...selectedMood.value,
        note: moodNote.value
    });
    moodNote.value = '';
    selectedMood.value = null;
};


</script>

<template>
    <q-dialog v-model="showModal" persistent maximized transition-show="fade" transition-hide="fade">
        <div class="modal-backdrop" @click="$router.back">
            <q-card class="mood-modal-card" @click.stop>
                <!-- Header with decorative elements -->
                <div class="modal-header">
                    <q-btn round flat icon="close" color="blue-grey-6" class="close-button" @click="$router.back" />
                </div>

                <q-card-section class="text-center q-pa-sm">
                    <h3 class="text-h4 text-royal-blue q-mb-sm">How are you feeling today?</h3>
                    <p class="text-body1 text-blue-grey-8 q-mb-xs">
                        Track your mood to improve your wellbeing and productivity insights.
                    </p>
                </q-card-section>

                <q-card-section class="q-px-lg">
                    <div class="row q-col-gutter-md">
                        <div v-for="mood in moodOptions" :key="mood.value" class="col-6 col-sm-4 q-mb-sm">
                            <q-card clickable flat :class="{
                                'mood-card': true,
                                'mood-selected': selectedMood && selectedMood.value === mood.value
                            }" @click="handleMoodSelection(mood)" v-ripple>
                                <q-card-section class="text-center q-pa-sm">
                                    <div class="mood-icon-wrapper" :class="`bg-${mood.color}-1`">
                                        <q-icon :name="mood.icon" :color="mood.color" size="34px" />
                                    </div>
                                    <div class="text-h6 q-mt-sm text-royal-blue">{{ mood.label }}</div>
                                    <div class="text-caption q-mt-sm text-blue-grey-8">{{ mood.description }}</div>
                                </q-card-section>
                            </q-card>
                        </div>
                    </div>
                </q-card-section>

                <q-card-section class="q-px-xl" v-if="selectedMood">
                    <q-input v-model="moodNote" outlined label="Add a note about how you're feeling (optional)"
                        class="premium-input" />
                </q-card-section>

                <q-card-section class="text-center q-py-sm">
                    <q-btn label="Confirm Selection" color="primary" class="premium-button" size="lg"
                        :disable="!selectedMood" @click="submitMood" />
                    <div class="text-caption q-mt-md text-blue-grey-7" v-if="!selectedMood">
                        Please select a mood to continue
                    </div>
                </q-card-section>

            </q-card>
        </div>
    </q-dialog>
</template>

<style scoped>
.modal-backdrop {
    background: rgba(17, 24, 39, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
}

.mood-modal-card {
    border-radius: 24px;
    max-width: 650px;
    width: 90%;
    background: linear-gradient(135deg, #ffffff, #f8fafc);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.9);
}


.close-button {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 10;
}

.mood-card {
    border-radius: 16px;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    background: white;
    border: 2px solid transparent;
    height: 100%;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.mood-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);
}

.mood-selected {
    border-color: #1E3A8A;
    background: linear-gradient(135deg, #ffffff, #f0f7ff);
    box-shadow: 0 12px 20px rgba(30, 58, 138, 0.15);
}

.mood-icon-wrapper {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    transition: all 0.3s ease;
}

.mood-selected .mood-icon-wrapper {
    transform: scale(1.1);
}

.premium-button {
    border-radius: 12px;
    height: 54px;
    font-weight: 600;
    box-shadow: 0 10px 20px rgba(30, 58, 138, 0.15);
    background: linear-gradient(135deg, #1E3A8A, #1e4cab);
    border: none;
    min-width: 240px;
}

.premium-input :deep(.q-field__control) {
    border-radius: 12px;
    height: 56px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
    border: 1px solid rgba(30, 58, 138, 0.1);
}

.modal-footer {
    height: 8px;
    background: linear-gradient(90deg, #F59E0B, #1E3A8A);
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
}

.text-royal-blue {
    color: #1E3A8A;
}
</style>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';


const totalPages = ref<number>();

const props = defineProps({
    page: {
        type: Number,
        required: true
    },
    limit: {
        type: Number,
        required: true
    },
    count: {
        type: Number,
        required: true
    }
});

const emit = defineEmits(['update:page']);
const currentPage = ref(props.page);

watch(() => props.page, (newPage) => {
    currentPage.value = newPage
});

const updatePage = (val: number) => {
    emit('update:page', val)
}

onMounted(() => {
    totalPages.value = Math.ceil(props.count / props.limit);
});


</script>


<template>
    <div class="q-pa-lg flex flex-center">
        <q-pagination v-model="currentPage" :max="totalPages ?? 0" :max-pages="3" :boundary-numbers="false"
            direction-links @update:model-value="updatePage" />
    </div>
</template>

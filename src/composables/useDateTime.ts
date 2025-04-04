import { onBeforeUnmount, onMounted, ref } from "vue";

export function useDateTime() {
  const formatDate = (isoString: Date, includeTime = false) => {
    const date = new Date(isoString);
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    };

    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }

    return date.toLocaleDateString('en-US', options);

  };

  const updateCurrentTime = () => {
    const timeInterval = ref<number | null>(null);
    const currentDateTime = ref(new Date());
    currentDateTime.value = new Date();
    onMounted(() => {
      updateCurrentTime();
      timeInterval.value = window.setInterval(updateCurrentTime, 60000);
    });

    onBeforeUnmount(() => {
      if (timeInterval.value !== null) {
        clearInterval(timeInterval.value);
      }
    });

    return currentDateTime;
  };

  return { formatDate, updateCurrentTime };
}
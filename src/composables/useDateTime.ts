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

  const formatTime = (isoString: Date) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

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

  const formatSmartDate = (isoString: Date) => {
    if (!isoString) return "N/A";
    const date: Date = new Date(isoString);
    const now: Date = new Date();
    const diffInMilliseconds: number = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));

    if (diffInDays <= 0) {
      if(diffInHours<=0){
        return new Intl.RelativeTimeFormat('en',{style:'short'}).format(-diffInMinutes,'minute');
      }
      else {
        return new Intl.RelativeTimeFormat('en',{style:'short'}).format(-diffInHours,'hour')
      }
    }
    // Show relative time if ≤ 30 days ago
    else if (diffInDays <= 30) {
      return new Intl.RelativeTimeFormat('en', { style: 'short' }).format(-diffInDays, 'day');
    }
    // Otherwise, show a formatted date
    else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  }

  // }

  return { formatDate, updateCurrentTime, formatTime, formatSmartDate };
}
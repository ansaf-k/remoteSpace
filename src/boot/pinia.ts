import { boot } from 'quasar/wrappers';
import { createPinia } from 'pinia';
import piniaPersistedState from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(piniaPersistedState); 

export default boot(({ app }) => {
  app.use(pinia);
});

export { pinia };
import {
    createDirectus,
    authentication,
    rest,
    createItem as createItemOperation,
    deleteItem as deleteItemOperation,
    readItems,
    readMe,
    readCollections,
    updateItem as updateItemOperation,
    passwordRequest,
    passwordReset,
    type AuthenticationData,
    readUser,
    readUsers,
    customEndpoint,
    readItem
} from '@directus/sdk';


class LocalStorage {
    get(): AuthenticationData | null {
        const authData = localStorage.getItem('directus_auth_data');
        return authData ? JSON.parse(authData) : null;
    }

    set(data: AuthenticationData | null): void {
        if (data) {
            localStorage.setItem('directus_auth_data', JSON.stringify(data));
        } else {
            localStorage.removeItem('directus_auth_data');
        }
    }
}

const directus = createDirectus(import.meta.env.VITE_DIRECTUS_URL)
    .with(rest())
    .with(authentication('json', {
        storage: new LocalStorage(),
        autoRefresh: true,
    }));


export {
    createItemOperation as createItem, deleteItemOperation as deleteItem, directus,
    readItems, readMe, updateItemOperation as updateItem, readCollections, passwordRequest,
    passwordReset, readUser, readUsers, customEndpoint,readItem
};
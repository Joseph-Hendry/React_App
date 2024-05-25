import { create } from 'zustand';

// Define store
type UserStore = {
    userId: number;
    userToken: string | null;
    userChangeFlag: number;
    setUserId: (id: number) => void;
    setUserToken: (token: string | null) => void;
    setUserChangeFlag: (count: number) => void;
}

// Default user state
const defaultUserState: UserStored = {
    userId: -1,
    userToken: '',
    userChangeFlag: 0,
};

// Local Storage Get & Set
const getLocalStorage = (key: string): UserStored => {
    const storedValue = window.localStorage.getItem(key);
    if (storedValue) {
        try {
            return JSON.parse(storedValue);
        } catch (error) {
            console.error("Error parsing local storage item", error);
        }
    }
    return defaultUserState;
};
const setLocalStorage = (key: string, value: UserStore) => {
    window.localStorage.setItem(key, JSON.stringify(value));
};

// Create store
const useUserStore = create<UserStore>((set) => ({
    // Get user methods
    userId: getLocalStorage('user').userId,
    userToken: getLocalStorage('user').userToken,
    userChangeFlag: getLocalStorage('user').userChangeFlag,

    // Set user methods
    setUserId: (id) => set((state) => {
        const newState = { ...state, userId: id };
        setLocalStorage('user', newState);
        return { userId: id };
    }),
    setUserToken: (token) => set((state) => {
        const newState = { ...state, userToken: token };
        setLocalStorage('user', newState);
        return { userToken: token };
    }),
    setUserChangeFlag: (count) => set((state) => {
        const newState = { ...state, userChangeFlag: count };
        setLocalStorage('user', newState);
        return { userChangeFlag: count };
    }),
}));

export { useUserStore };
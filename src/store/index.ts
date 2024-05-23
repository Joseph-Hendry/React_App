import { create } from 'zustand';

// Define store
type UserStore = {
    userId: number;
    userToken: string | null;
    userImgURL: string;
    setUserId: (id: number) => void;
    setUserToken: (token: string | null) => void;
    setUserImgURL: (url: string) => void;
}

// Default user state
const defaultUserState: UserStored = {
    userId: -1,
    userToken: '',
    userImgURL: 'https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png',
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
    userImgURL: getLocalStorage('user').userImgURL,

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
    setUserImgURL: (url) => set((state) => {
        const newState = { ...state, userImgURL: url || defaultUserState.userImgURL };
        setLocalStorage('user', newState);
        return { userImgURL: newState.userImgURL };
    }),
}));

export { useUserStore };
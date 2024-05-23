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

// Local Storage Get & Set
const getLocalStorage = (key: string): UserStore => JSON.parse(window.localStorage.getItem(key) as string) || { userId: -1, userToken: '', userImgURL: 'https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png' };
const setLocalStorage = (key: string, value: UserStore) => window.localStorage.setItem(key, JSON.stringify(value));

// Create store
const useUserStore = create<UserStore>((set) => ({
    // Get user methods
    userId: getLocalStorage('user').userId,
    userToken: getLocalStorage('user').userToken,
    userImgURL: getLocalStorage('user').userImgURL,

    // Set user methods
    setUserId: (id) => set(() => {
        // Get current value
        const temp = getLocalStorage('user');
        temp.userId = id;

        // Store
        setLocalStorage('user', temp);
        return { userId: id };
    }),
    setUserToken: (token) => set(() => {
        // Get current value
        const temp = getLocalStorage('user');
        temp.userToken = token;

        // Store
        setLocalStorage('user', temp);
        return { userToken: token };
    }),
    setUserImgURL: (url) => set(() => {
        // Get current value
        const temp = getLocalStorage('user');
        temp.userImgURL = url === '' ? 'https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png' : url;

        // Store
        setLocalStorage('user', temp);
        return { userImgURL: temp.userImgURL };
    }),
}));

export { useUserStore };
import create from 'zustand';

// Define store
type UserStore = {
    userId: number;
    userToken: string | null;
    setUserId: (id: number) => void;
    setUserToken: (token: string | null) => void;
}

interface PetitonSearchI {
    petitionSearch: PetitionSearch;
    setPetitionSearch: (petitionSearch: PetitionSearch) => void;
}

const getLocalStorage = (key: string): UserStore => JSON.parse(window.localStorage.getItem(key) as string) || { userId: -1, userToken: '' };
const setLocalStorage = (key: string, value: UserStore) => window.localStorage.setItem(key, JSON.stringify(value));

// Create store
const useUserStore = create<UserStore>((set) => ({
    // Get user methods
    userId: getLocalStorage('user').userId,
    userToken: getLocalStorage('user').userToken,

    // Set user methods
    setUserId: (id) => set((state) => {

        // Get current value
        const temp = getLocalStorage('user');
        temp.userId = id;

        // Store
        setLocalStorage('user', temp);
        return { userId: id };
    }),
    setUserToken: (token) => set((state) => {

        // Get current value
        const temp = getLocalStorage('user');
        temp.userToken = token;

        // Store
        setLocalStorage('user', temp);
        return { userToken: token };
    }),
}));

const usePetitionSearchStore = create<PetitonSearchI>((set) => ({
    petitionSearch: { startIndex: 0, sortBy: "CREATED_ASC" },
    setPetitionSearch: (newSearch) => set({ petitionSearch: newSearch })
}));

export { useUserStore, usePetitionSearchStore };
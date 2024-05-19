import create from 'zustand';

// Define store
type UserStore = {
    userId: number;
    userToken: string;
    setUserId: (id: number) => void;
    setUserToken: (token: string) => void;
}

type PetitionsStore = {
    petitions: Petitions | null;
    categories: Category[];
    setPetitions: (petitions: Petitions | null) => void;
    setCategories: (categories: Category[]) => void;
}

interface PetitonSearchI {
    petitionSearch: PetitionSearch;
    setPetitionSearch: (petitionSearch: PetitionSearch) => void;
}

const getLocalStorage = (key: string): PetitionSearch => JSON.parse(window.localStorage.getItem(key) as string) || {startIndex: 0};
const setLocalStorage = (key: string, value: PetitionSearch) => window.localStorage.setItem(key, JSON.stringify(value));

// Create store
const useUserStore = create<UserStore>((set) => ({
    userId: -1,
    userToken: "",
    setUserId: (id) => set({ userId: id }),
    setUserToken: (token) => set({ userToken: token })
}));

const usePetitionStore = create<PetitionsStore>((set) => ({
    petitions: null,
    categories: [],
    setPetitions: (petitions) => set({ petitions }),
    setCategories: (newCategories) => set({ categories: newCategories })
}));

const usePetitionSearchStore = create<PetitonSearchI>((set) => ({
    petitionSearch: { startIndex: 0, sortBy: "CREATED_ASC" },
    setPetitionSearch: (newSearch) => set({ petitionSearch: newSearch })
}));

export { useUserStore, usePetitionStore, usePetitionSearchStore };
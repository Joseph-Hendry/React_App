import create from 'zustand';

// Define store
type UserStore = {
    user: User | null;
    loginInfo: UserLogin | null;
    registerInfo: UserRegister | null;
    setUser: (user: User | null) => void;
    setLoginInfo: (loginInfo: UserLogin | null) => void;
    setRegisterInfo: (registerInfo: UserRegister | null) => void;
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
    user: null,
    loginInfo: null,
    registerInfo: null,
    setUser: (user) => set({ user }),
    setLoginInfo: (loginInfo) => set({ loginInfo }),
    setRegisterInfo: (registerInfo) => set({ registerInfo })
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
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
    categories: Category[] | null;
    setPetitions: (petitions: Petitions | null) => void;
    setCategories: (categories: Category[] | null) => void;
}

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
    categories: null,
    setPetitions: (petitions) => set({ petitions }),
    setCategories: (categories) => set({ categories })
}));

export { useUserStore, usePetitionStore };
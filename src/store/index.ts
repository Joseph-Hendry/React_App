import create from 'zustand';

interface UserState {
    users: User[];
    setUsers: (users: User[]) => void;
    editUser: (user: User, newUsername: string) => void;
    removeUser: (user: User) => void;
}

const getLocalStorage = (key: string): User[] => JSON.parse(window.localStorage.getItem(key) as string) || [];
const setLocalStorage = (key: string, value: User[]) => window.localStorage.setItem(key, JSON.stringify(value));

const useStore = create<UserState>((set) => ({
    users: getLocalStorage('users'),
    setUsers: (users: User[]) => set(() => {
        setLocalStorage('users', users);
        return { users };
    }),
    editUser: (user: User, newUsername: string) => set((state) => {
        const temp = state.users.map(u => u.user_id === user.user_id ? { ...u, username: newUsername } : u);
        setLocalStorage('users', temp);
        return { users: temp };
    }),
    removeUser: (user: User) => set((state) => {
        const temp = state.users.filter(u => u.user_id !== user.user_id);
        setLocalStorage('users', temp);
        return { users: temp };
    })
}));

export const useUserStore = useStore;
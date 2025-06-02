import {create} from 'zustand';

type Store = {
    balance: number;
    setBalance: (b: number) => void;
};

// @ts-ignore
export const useFinanceStore = create<Store>((set) => ({
    balance: 0,
    setBalance: (b) => set({ balance: b }),
}));

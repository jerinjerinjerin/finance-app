import {create} from "zustand";

type NewTransacrionState = {
    isOpen: boolean,
    onOpen: () => void;
    onClose: () => void;
}

export const useNewTransaction = create<NewTransacrionState>((set) =>({
    isOpen: false,
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false}),
}))
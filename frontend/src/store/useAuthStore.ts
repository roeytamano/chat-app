import {create} from "zustand";

export const useAuthStore = create((set, get) => ({
    authUser: {name: "john", _id: 123, age: 25},
    isLoggedIn: false,
    isLoading: false,

    login: () => {
        console.log("login");
        set({isLoggedIn: true, isLoading: false});
    }
}))
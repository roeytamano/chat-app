import {create} from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export interface AuthUser {
    id?: string;
    name?: string;
    email?: string;
    [key: string]: any;
}

export type SignupForm = Record<string, unknown> | FormData;

export interface UseAuthStore {
    authUser: AuthUser | null;
    isCheckingAuth: boolean;
    isSigningUp: boolean;
    checkAuth: () => Promise<void>;
    signup: (data: SignupForm) => Promise<void>;
}

export const useAuthStore = create<UseAuthStore>((set, _get) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,

    checkAuth: async (): Promise<void> => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({authUser: res.data});
        } catch (error) {
                console.log("Auth check failed:", error);
            set({authUser: null});
        } finally {
            set({isCheckingAuth: false});
        }
    },

    signup: async (data: SignupForm): Promise<void> => {
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({authUser: res.data});
            toast.success("Signup successful!");
        } catch (error: any) {
            console.log("Signup failed:", error);
            toast.error(error.response.data.message || "Signup failed. Please try again.");
        } finally {
            set({isSigningUp: false});
        }
    }
}))
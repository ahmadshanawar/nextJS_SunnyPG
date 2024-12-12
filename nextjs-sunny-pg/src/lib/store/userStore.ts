import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserStore {
  userId: string | null;
  role: string | null;
  status: string;
  setUserId: (id: string | null) => void;
  setRole: (role: string | null) => void;
  resetUser: () => void;
  setStatus: (id: string | null) => void;
}

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userId: null,
      role: null,
      status: "Pending",
      setUserId: (id) => set({ userId: id }),
      setRole: (role) => set({ role }),
      resetUser: () => set({ userId: null, role: null }),
      setStatus: (status: any) => set({ status }),
    }),
    {
      name: "user-store", // key for localStorage
    }
  )
);

export default useUserStore;

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserStore {
  userId: string | null;
  role: string | null;
  status: string | null;
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
      status: null,
      setUserId: (id) => set({ userId: id }),
      setRole: (role) => set({ role }),
      resetUser: () => set({ userId: null, role: null }),
      setStatus: (status) => set({ status }),
    }),
    {
      name: "user-store", // key for localStorage
    }
  )
);

export default useUserStore;

import {create} from "zustand";
import {OrganizationRole} from "../../models/types/OrganizationRole";

/**
 * Trenutna uloga ulogovanog korisnika za AKTIVNI dokument/organizaciju.
 * Postavlja je file-explorer pri izboru organizacije (jedno mesto upisa).
 * Zustand se koristi da bi UI reaktivno reagovao na promenu uloge.
 */
interface AccessState {
    role: OrganizationRole | null;
    setRole: (role: OrganizationRole | null) => void;
}

export const useAccessStore = create<AccessState>((set) => ({
    role: null,
    setRole: (role) => set({role}),
}));

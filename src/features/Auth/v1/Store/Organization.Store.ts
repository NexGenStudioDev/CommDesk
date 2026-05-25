import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CommunitySchema } from "../Types/Organization.Type";


const useOrganizationStore = create<{
  organization: CommunitySchema | null;
  setOrganization: (organization: CommunitySchema) => void;
}>()(
  persist(
    (set) => ({
      organization: null,
      setOrganization: (organization: CommunitySchema) =>
        set({
          organization,
        }),
    }),
    {
      name: "organization-storage",
    },
  ),
);

export default useOrganizationStore;

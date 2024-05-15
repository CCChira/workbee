import create from 'zustand';

Request;
interface RequestsStore {
  requests: any[]; // Adjust the type according to your data structure
  setRequests: (requests: any[]) => void;
}

export const useStore = create<StoreState>((set) => ({
  requests: [],
  setRequests: (requests) => set({ requests }),
}));

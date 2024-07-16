import create from 'zustand';

Request;
interface RequestsStore {
  requests: any[];
  setRequests: (requests: any[]) => void;
}

export const useStore = create<StoreState>((set) => ({
  requests: [],
  setRequests: (requests) => set({ requests }),
}));

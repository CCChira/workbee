import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CreateContractFormStore = {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  startDate: Date;
  setStartDate: (startDate: Date) => void;
  endDate: Date;
  setEndDate: (endDate: Date) => void;
  formErrors: {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
  };
  setFormErrors: (formErrors: { title: string; description: string; startDate: string; endDate: string }) => void;
};

export const useCreateContractFormStore = create(
  persist<CreateContractFormStore>(
    (set) => ({
      title: '',
      setTitle: (title: string) => set({ title }),
      description: '',
      setDescription: (description: string) => set({ description }),
      startDate: new Date(),
      setStartDate: (startDate: Date) => set({ startDate }),
      endDate: new Date(),
      setEndDate: (endDate: Date) => set({ endDate }),
      formErrors: {
        title: '',
        description: '',
        startDate: '',
        endDate: '',
      },
      setFormErrors: (formErrors: { title: string; description: string; startDate: string; endDate: string }) =>
        set({ formErrors }),
    }),
    {
      name: 'contractFormStorage',
    },
  ),
);

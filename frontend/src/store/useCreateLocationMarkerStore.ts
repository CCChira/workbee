import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Marker coordinates interface
interface MarkerCoordinates {
  longitude: number;
  latitude: number;
  address?: string;
  name?: string;
}

// Store structure
interface MarkerStore {
  markers: MarkerCoordinates[];
  addMarker: (marker: MarkerCoordinates) => void;
  updateMarker: (index: number, updatedMarker: MarkerCoordinates) => void;
  removeMarker: (index: number) => void;
  deleteMarkers: () => void;
}

export const useCreateLocationMarkerStore = create(
  persist<MarkerStore>(
    (set) => ({
      markers: [],
      addMarker: (marker: MarkerCoordinates) => set((state) => ({ markers: [...state.markers, marker] })),
      updateMarker: (index: number, updatedMarker: MarkerCoordinates) =>
        set((state) => ({
          markers: state.markers.map((marker, i) => (i === index ? updatedMarker : marker)),
        })),
      removeMarker: (index: number) =>
        set((state) => ({
          markers: state.markers.filter((_, i) => i !== index),
        })),
      deleteMarkers: () => set({ markers: [] }),
    }),
    {
      name: 'marker-storage', // Unique key for persisted storage
    },
  ),
);

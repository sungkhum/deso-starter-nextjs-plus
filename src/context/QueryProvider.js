'use client';

import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

// Create a persister
let localStoragePersister;
// Check if window is defined (i.e., we're on the client side)
if (typeof window !== 'undefined') {
  localStoragePersister = createSyncStoragePersister({
    storage: window.localStorage,
  });
}

export function QueryProvider({ children }) {
  // If localStoragePersister is not created (e.g. SSR or localStorage disabled),
  // fall back to the basic QueryClientProvider without persistence.
  if (!localStoragePersister) {
    // Need to import QueryClientProvider for this path
    const { QueryClientProvider: BasicProvider } = require('@tanstack/react-query'); 
    return (
      <BasicProvider client={queryClient}>
        {children}
      </BasicProvider>
    );
  }

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: localStoragePersister,
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}

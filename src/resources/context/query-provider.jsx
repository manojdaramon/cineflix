"use client";

/** React imports */
import React, { useState } from "react";

/** Libraries */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * QueryProvider — wraps the app with TanStack Query's context.
 *
 * Creates a single QueryClient instance (via useState so it's stable
 * across re-renders) and provides it to all child components.
 *
 * This lets any component use useQuery() / useMutation() hooks.
 *
 * @param {{ children: React.ReactNode }} props
 * @returns {JSX.Element}
 */
const QueryProvider = ({ children }) => {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        /**
                         * staleTime: how long (ms) fetched data is considered "fresh".
                         * While fresh, React Query won't refetch — it serves from cache.
                         * 5 minutes is a good default for most apps.
                         */
                        staleTime: 5 * 60 * 1000,

                        /**
                         * retry: how many times to retry a failed request.
                         * 1 = try once more after the initial failure.
                         */
                        retry: 1,

                        /**
                         * refetchOnWindowFocus: refetch data when the user
                         * switches back to the browser tab. Keeps data current.
                         */
                        refetchOnWindowFocus: false,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

export default QueryProvider;

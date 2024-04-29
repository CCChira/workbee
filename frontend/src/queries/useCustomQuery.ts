// import { QueryKey, UseQueryOptions, useQuery, useQueryClient } from 'react-query';
//
// const refreshAccessToken = async (): Promise<boolean> => {
//   try {
//     const response = await fetch('/api/auth/refresh', {
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//       },
//       method: 'POST',
//     });
//     return true;
//   } catch (e) {
//     console.log(e);
//     return false;
//   }
// };
//
// function useCustomQuery<T>(key: QueryKey, queryFn: () => Promise<T>, options?: UseQueryOptions<T, Error>) {
//   const queryClient = useQueryClient();
//   return useQuery<T, Error>(key, queryFn, {
//     ...options,
//     retry: async (failureCount, error) => {
//       if (error === 401 && failureCount < 2) {
//         awail refreshAccessToken();
//         return true;
//       }
//       return false;
//     },
//   });
// }

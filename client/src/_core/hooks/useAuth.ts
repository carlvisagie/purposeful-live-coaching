/**
 * Stub useAuth hook - OAuth removed
 * Returns null user for guest mode
 */
export function useAuth() {
  return {
    user: null,
    loading: false,
    logout: () => {
      window.location.href = "/";
    },
  };
}

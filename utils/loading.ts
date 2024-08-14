export const fetchLazy = async <T>(fetchPromise: Promise<T>) => {
  if (import.meta.server) {
    await fetchPromise
  }
}

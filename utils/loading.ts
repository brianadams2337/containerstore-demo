export const fetchLazy = async <T = any>(fetchPromise: Promise<T>) => {
  if (import.meta.server) {
    await fetchPromise
  }
}

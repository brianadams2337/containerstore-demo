export const fetchLazy = async (fetchPromise: Promise<any>) => {
  if (import.meta.server) {
    await fetchPromise
  }
}

export async function useCampaign() {
  const { data, fetch } = await useRpc('getCampaignKey', 'getCampaignKey')

  return { data: computed(() => data.value || undefined), fetch }
}

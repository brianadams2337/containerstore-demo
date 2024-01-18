export async function useCampaign() {
  const { data, fetch } = await useRpc('getCampaignKey', 'getCampaignKey')

  const campaign = computed(() => data.value)

  return { data: campaign, fetch }
}

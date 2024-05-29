export async function useCampaign() {
  const promise = useRpc('getCampaignKey', 'getCampaignKey')
  const { data, fetch } = promise

  const campaign = computed(() => data.value)

  await promise

  return { data: campaign, fetch }
}

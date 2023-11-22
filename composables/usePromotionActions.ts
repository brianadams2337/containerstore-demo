export default () => {
  const isShown = useState('promotion-list-shown', () => false)

  const togglePromotionList = () => {
    isShown.value = !isShown.value
  }

  const isPromotionListShown = computed(() => isShown.value)

  return {
    togglePromotionList,
    isPromotionListShown,
  }
}

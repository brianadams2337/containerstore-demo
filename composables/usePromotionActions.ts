export default () => {
  const isPromotionListShown = useState('promotion-list-shown', () => false)

  const togglePromotionList = () => {
    isPromotionListShown.value = !isPromotionListShown.value
  }

  return {
    togglePromotionList,
    isPromotionListShown,
  }
}

export default () => {
  const viewport = useViewport()
  return {
    '2xl': computed(() => viewport.isGreaterOrEquals('2xl')),
    xl: computed(() => viewport.isGreaterOrEquals('xl')),
    lg: computed(() => viewport.isGreaterOrEquals('lg')),
    md: computed(() => viewport.isGreaterOrEquals('md')),
    sm: computed(() => viewport.isLessThan('md')),
    xs: computed(() => viewport.isLessThan('sm')),
  }
}

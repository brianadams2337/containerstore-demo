export const isScrolledToBottom = (event: Event) => {
  const target = event.target as HTMLElement
  return (
    Math.ceil(target.offsetHeight + target.scrollTop) >= target.scrollHeight
  )
}

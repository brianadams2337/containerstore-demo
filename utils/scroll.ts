export const isScrolledToBottom = (el: any) => {
  const target = el.target as HTMLElement
  return (
    Math.ceil(target.offsetHeight + target.scrollTop) >= target.scrollHeight
  )
}

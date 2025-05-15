function throwError() {
  throw new Error('Test')
}
//@ts-expect-error ignore for now
export default defineEventHandler(() => {
  throwError()
  return {
    hello: 'world',
  }
})

---
'@scayle/storefront-boilerplate-nuxt': minor
---

[E2E] Introduced an RPC fixture to streamline end-to-end testing. This fixture allows direct RPC calls from test code, enabling efficient setup of server-side state without requiring UI interaction. This significantly reduces test execution time and complexity.

      ```ts
      test('Some description', async ({ rpc }) => {
        const res = await rpc.call('addItemToWishlist', {
          productId: 123,
        })

        expect(res).toMatchObject({ productId: 123 })
      })
      ```

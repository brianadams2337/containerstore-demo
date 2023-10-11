<template>
  <AccountWrapper
    :title="$t('my_account.profile_menu')"
    is-account-page
    class="mb-6">
    <Headline class="mt-8 hidden md:block" size="xl" tag="h3">
      {{ $t('my_account.profile_menu') }}
    </Headline>
    <UserPersonalInfoForm />
    <UpdatePasswordForm />
  </AccountWrapper>
</template>

<script setup lang="ts">
await useUser()

definePageMeta({ pageType: 'account_area:user' })
</script>

<script lang="ts">
export default {
  name: 'UserAccountDetailsPage',
}
</script>

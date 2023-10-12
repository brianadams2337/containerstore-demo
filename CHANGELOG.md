## Replaced `useUiState` with smaller specific composables

- In Nuxt 2 we had the `useUiState` composables that was bloated with the mixed
  logic for flyouts, modal, side navigation and mobile search. Now we removed the
  ui state composable and replaced it with the dedicated ones
  (`useFlyouts`, `useMobileSearch`, `useModal` & `useSideNavigation`). Now we have
  claner code and the composables with the dedicated purpose.

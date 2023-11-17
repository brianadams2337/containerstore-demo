<template>
  <div class="flex justify-center">
    <div
      class="relative inline-flex items-center justify-center space-x-1 bg-white p-4"
    >
      <span
        v-show="currentPage > 1"
        class="absolute -left-6 top-1/2 inline-block -translate-y-1/2 cursor-pointer p-2"
        @click="changePage(currentPage - 1)"
      >
        <IconArrowLeft class="h-4 w-4" />
      </span>

      <span
        v-for="page in firstOptionSet"
        :key="page"
        class="inline-block cursor-pointer p-2 text-center"
        :class="{ 'font-bold': page === currentPage }"
        @click="changePageAndScroll(page)"
      >
        {{ page }}
      </span>

      <div v-if="firstDotsVisible" class="mt-3">...</div>

      <span
        v-for="page in middleOptionSet"
        :key="page"
        class="inline-block cursor-pointer p-2 text-center"
        :class="{ 'font-bold': page === currentPage }"
        @click="changePageAndScroll(page)"
      >
        {{ page }}
      </span>

      <div v-if="lastDotsVisible" class="mt-3">...</div>
      <span
        v-for="page in lastOptionSet"
        :key="page"
        class="inline-block cursor-pointer p-2 text-center"
        :class="{ 'font-bold': page === currentPage }"
        @click="changePageAndScroll(page)"
      >
        {{ page }}
      </span>

      <span
        v-show="currentPage && lastPage"
        size="sm"
        class="absolute -right-6 top-1/2 inline-block -translate-y-1/2 cursor-pointer p-2"
        @click="changePage(currentPage + 1)"
      >
        <IconArrowRight class="h-4 w-4" />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
const _props = defineProps({
  recordCount: {
    type: Number,
    default: 1,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  perPage: {
    type: Number,
    default: 8,
  },
})

const emit = defineEmits(['change:page'])

const props = toRefs(_props)
const lastPage = computed(() => {
  return Math.ceil(props.recordCount.value / props.perPage.value)
})

/**
 * If the size of the dataset is less than on eequal to
 * this value, then all options (without dot separators) will
 * be shown
 */
const MAX_SIZE_FOR_ALL_OPTIONS = 5

const firstDotsVisible = ref(
  lastPage.value > MAX_SIZE_FOR_ALL_OPTIONS && props.currentPage.value > 3,
)

const lastDotsVisible = ref(
  lastPage.value > MAX_SIZE_FOR_ALL_OPTIONS &&
    props.currentPage.value < lastPage.value - 2,
)

/**
 * If size of dataset is less than on eequal to MAX_SIZE_FOR_ALL_OPTIONS,
 * then all options are added to the first set of options
 * If number of options are more than MAX_SIZE_FOR_ALL_OPTIONS, then this set
 * will contain the first 3 pages. If current-page is more than 2, then only the first
 * option will be shown
 */

const getFirstOptions = () => {
  const options: number[] = []
  if (lastPage.value <= MAX_SIZE_FOR_ALL_OPTIONS) {
    let index = 1
    while (index <= MAX_SIZE_FOR_ALL_OPTIONS && index <= lastPage.value) {
      options.push(index)
      index += 1
    }
  } else {
    options.push(1)
    if (props.currentPage.value < 3) {
      options.push(2)
      options.push(3)
    }
  }
  return options
}

/**
 * This set will contain 3 options, only when the current-page is
 * greater than 2 and less than last-page - 2. This set will contain
 * the previous-page, current-page and next-page
 */
const getMiddleOptions = () => {
  const options: number[] = []
  if (
    lastPage.value > MAX_SIZE_FOR_ALL_OPTIONS &&
    props.currentPage.value >= 3 &&
    props.currentPage.value < lastPage.value - 2
  ) {
    const index = props.currentPage.value
    options.push(index - 1)
    options.push(index)
    options.push(index + 1)
  }
  return options
}

/**
 * This set will contain the last set of pages. If the size of dataset is greater than
 * MAX_SIZE_FOR_ALL_OPTIONS, this set will show the last 4 options.
 * When current-page is not within the last options, only the last-page is shown
 */
const getLastOptions = () => {
  const options: number[] = []
  if (lastPage.value > MAX_SIZE_FOR_ALL_OPTIONS) {
    if (props.currentPage.value >= lastPage.value - 2) {
      const index = lastPage.value - 2
      options.push(index - 1)
      options.push(index)
      options.push(index + 1)
    }
    options.push(lastPage.value)
  }
  return options
}

const firstOptionSet = ref(getFirstOptions())
const middleOptionSet = ref(getMiddleOptions())
const lastOptionSet = ref(getLastOptions())

watch(props.currentPage, () => {
  firstOptionSet.value = getFirstOptions()
  middleOptionSet.value = getMiddleOptions()
  lastOptionSet.value = getLastOptions()
  firstDotsVisible.value =
    lastPage.value > MAX_SIZE_FOR_ALL_OPTIONS && props.currentPage.value > 3
  lastDotsVisible.value =
    lastPage.value > MAX_SIZE_FOR_ALL_OPTIONS &&
    (!!middleOptionSet.value.length || props.currentPage.value <= 3)
})

const scrollToTop = () => window.scroll({ behavior: 'smooth', top: 0 })

const changePage = (page: number) => emit('change:page', page)

const changePageAndScroll = (page: number): void => {
  changePage(page)
  scrollToTop()
}
</script>

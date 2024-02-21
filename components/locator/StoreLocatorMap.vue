<template>
  <div ref="googleMapContainer" class="size-full"></div>
</template>

<script setup lang="ts">
import { Loader } from '@googlemaps/js-api-loader'

const currentShop = useCurrentShop()
const formatter = new Intl.NumberFormat(currentShop.value.locale, {
  maximumSignificantDigits: 3,
})
const formatDistance = (num: number): string => {
  return num < 2000 ? num + ' m' : formatter.format(num / 1000) + ' km'
}

const props = defineProps({
  stores: {
    type: Array, // TODO: add type
    default: () => [],
  },
  apiKey: {
    type: String,
    default: '',
  },
  selectedStoreId: {
    type: Number,
    default: undefined,
  },
})

const mapSettings = {
  clickableIcons: false,
  streetViewControl: false,
  gestureHandling: 'cooperative',
  mapTypeControl: false,
  zoom: 7,
  minZoom: 7,
  maxZoom: 15,
  mapId: 'DEMO_MAP_ID',
  center: {
    lat: 53.550734392966135,
    lng: 9.993024893651084,
  },
}

const googleMapContainer = ref<HTMLElement>()
const map = ref<google.maps.Map>()
const infoWindows = ref<{ [key: number]: google.maps.InfoWindow }>({})
const markers = ref<{
  [key: number]: google.maps.Marker
}>({})

onMounted(async () => {
  // import all required goolge map api classes
  await new Loader({
    apiKey: props.apiKey,
    libraries: ['marker', 'maps', 'core'],
  }).load()

  // init google map
  map.value = new google.maps.Map(googleMapContainer.value!, mapSettings)

  watch(
    () => props.stores,
    () => {
      if (!process.server && window.google) {
        removeOldMarkers()
        setMarkers()
      }
    },
    { immediate: true },
  )

  watch(
    () => props.selectedStoreId,
    (storeId) => {
      if (storeId) {
        selectStoreMarker(storeId)
      }
    },
  )
})

const removeOldMarkers = () => {
  Object.values(markers.value).forEach((marker) => marker.setMap(null))
  Object.values(infoWindows.value).forEach((info) => info.close())

  markers.value = {}
  infoWindows.value = {}
}

const setMarkers = () => {
  const bounds = new google.maps.LatLngBounds()

  props.stores.forEach((store: any) => {
    // map marker represents an arrow on the google map
    const marker = new google.maps.Marker({
      map: map.value,
      title: store.name,
      position: store.geoPoint,
    })

    // infoWindow is a tooltip above the map marker, which shows the name of the store
    const infoWindow = new google.maps.InfoWindow({
      content: getInfoWindowMarkup(store.name, store.distance),
    })

    marker.addListener('click', () => {
      infoWindow.open(map.value, marker)
    })

    // set the position of the google map, to make all markers visible
    const position = marker.getPosition()
    if (position) {
      bounds.extend(position)
      map.value!.fitBounds(bounds, { left: 500, top: 0, right: 300, bottom: 0 })
    }

    // save infoWindows & markers for later access
    infoWindows.value[store.id] = infoWindow
    markers.value[store.id] = marker
  })
}

const getInfoWindowMarkup = (title: string, distance: number) =>
  `<div class="font-medium">
    <span class="ml-2">
      ${title}
    </span>
    <span class="ml-4 inline-block bg-gray-100 py-2 px-3 rounded-3xl">
      ${formatDistance(distance)}
    </span>
  </div>`

const selectStoreMarker = (storeId: number) => {
  const infoWindow = infoWindows.value[storeId]
  const advancedMarkerElement = markers.value[storeId]

  // close all info windows
  Object.values(infoWindows.value).forEach((infoWindow) => infoWindow.close())

  if (infoWindow && advancedMarkerElement) {
    infoWindow.open({ anchor: advancedMarkerElement, map: map.value })
  }
}
</script>

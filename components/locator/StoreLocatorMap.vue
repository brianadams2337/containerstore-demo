<template>
  <div ref="googleMapContainer" class="h-full w-full"></div>
</template>

<script setup lang="ts">
import { Loader } from '@googlemaps/js-api-loader'

const getDistanceUnit = (num: number): string => { return num + ' km' } // TODO

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

const emit = defineEmits(['markerclick'])

// const currentShop = useCurrentShop()

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
  // center: currentShop.value.baseCoord,
}

const googleMapContainer = ref<HTMLElement>()
const map = ref<google.maps.Map>()
const infoWindows = ref<{ [key: number]: google.maps.InfoWindow }>({})
const advancedMarkerElements = ref<{
  [key: number]: google.maps.marker.AdvancedMarkerElement
}>({})

onMounted(async () => {
  // import all required goolge map api classes
  await new Loader({
    apiKey: props.apiKey,
    libraries: ['marker', 'maps', 'core'],
  }).load()

  // init google map
  map.value = new google.maps.Map(googleMapContainer.value!, mapSettings)
})

const removeOldMarkers = () => {
  // TODO: implement me
}

const setMarkers = () => {
  const bounds = new google.maps.LatLngBounds()

  props.stores.forEach((store: any) => {
    // map marker represents an arrow on the google map
    const advancedMarkerElement = new google.maps.marker.AdvancedMarkerElement({
      map: map.value,
      position: { lat: store.geoPoint.lat, lng: store.geoPoint.lng },
      title: store.name,
      content: getMarkerIconElement(),
    })

    // infoWindow is a tooltip above the map marker, which shows the name of the store
    const infoWindow = new google.maps.InfoWindow({
      content: getInfoWindowMarkup(store.name, store.distance),
    })

    advancedMarkerElement.addListener('click', () =>
      emit('markerclick', store.id),
    )

    // set the position of the google map, to make all markers visible
    if (advancedMarkerElement.position) {
      bounds.extend(advancedMarkerElement?.position)
      map.value!.fitBounds(bounds, { left: 500, top: 0, right: 300, bottom: 0 })
    }

    // save infoWindows & advancedMarkerElements for later access
    infoWindows.value[store.id] = infoWindow
    advancedMarkerElements.value[store.id] = advancedMarkerElement
  })
}

// we need to create an image element for each marker
const getMarkerIconElement = () => {
  const markerIcon = document.createElement('img')

  markerIcon.src = '/icons/map_marker.svg'
  return markerIcon
}

const getInfoWindowMarkup = (title: string, distance: number) =>
  `<div class="font-medium">
    <span class="ml-2">
      ${title}
    </span>
    <span class="ml-4 inline-block bg-gray-100 py-2 px-3 rounded-3xl">
      ${getDistanceUnit(distance)}
    </span>
  </div>`

const selectStoreMarker = (storeId: number) => {
  const infoWindow = infoWindows.value[storeId]
  const advancedMarkerElement = advancedMarkerElements.value[storeId]

  // close all info windows
  Object.values(infoWindows.value).forEach((infoWindow) => infoWindow.close())

  if (infoWindow && advancedMarkerElement) {
    infoWindow.open({ anchor: advancedMarkerElement, map: map.value })
  }
}

/*
watch(
  () => props.stores,
  () => {
    removeOldMarkers()
    setMarkers()
  },
)

watch(
  () => props.selectedStoreId,
  (storeId) => {
    selectStoreMarker(storeId)
  },
)
*/
</script>

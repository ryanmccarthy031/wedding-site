<template>
    <GMap
    ref="gMap"
    language="en"
    :options="options"
    :zoom="14"
    >
    <GMapMarker
        v-for="(location, index) in coordArray"
        :key="`location_${index}`"
        :position="{lat: location.lat, lng: location.lng}"
        :options="marker"
        @click="currentLocation = location"
    >
        <GMapInfoWindow :options="{maxWidth: 200}">
        <code>
            lat: {{ location.lat }},
            lng: {{ location.lng }}
        </code>
        </GMapInfoWindow>
    </GMapMarker>
    <GMapCircle :options="circleOptions"/>
    </GMap>

</template>

<script>
    export default {
        props: {
            places: Array,
        },
        data() {
            return {
                currentLocation: {},
                circleOptions: {},
                pins: {}
            }
        },
        computed: {
            marker () {
                // TODO: Add fill color and stroke color variables
                return {
                    icon: {
                        path: 'M 0,0 C -12,-20 -10,-22 -10,-25 A 10,10 0 1,1 10,-25 C 10,-25 12,-20 0,0 z',
                        fillColor: '#ff0000',
                        fillOpacity: 1,
                        strokeColor: '#00ff00',
                        strokeWeight: 1,
                        scale: 1.25,
                        label: "S"
                    }
                }
            },
            coordArray () {
                const array = []
                console.log(this.places)
                for (let i=0; i<this.places.length; i++) {
                    if (this.places[i].latitude && this.places[i].longitude) {
                        array.push({
                            lat: this.places[i].latitude, 
                            lng: this.places[i].longitude
                        })
                    }
                }
                return array
            },
            mapStyle () {
                return [
                    {
                        featureType: "road",
                        elementType: "geometry",
                        // TODO: Set color variables for use here
                        // stylers: [{ color: '#ff0000' }]
                    }, 
                    {
                        featureType: 'all',
                        elementType: 'labels.text.stroke',
                        // TODO: Set color variables for use here
                        // stylers: [{ color: '#0000ff'}]
                    }
                ]
            },
            options () {
                return {
                    fullscreenControl: false,
                        center: { lat: 44.9380, lng: -123.0280 },
                        zoom: 14,
                        styles: this.mapStyle,
                        streetViewControl: false,
                        mapTypeControlOptions: {
                            mapTypeIds: [],
                        },
                        controlSize: 25,
                }
            }
        }

    }
</script>

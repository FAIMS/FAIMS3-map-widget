// react
import React, { useState, useEffect, useRef } from 'react';

// openlayers
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import XYZ from 'ol/source/XYZ'
import {fromLonLat, transform} from 'ol/proj'
import {toStringXY} from 'ol/coordinate';

import './MapWrapper.css'

interface MapProps {
    features: any
}

function MapWrapper(props: MapProps) {

  // set intial state
  const [ map, setMap ] = useState<Map|undefined>()
  const [ featuresLayer, setFeaturesLayer ] = useState<VectorLayer<VectorSource<any>>>()
  const [ selectedCoord , setSelectedCoord ] = useState<number []>()

  // pull refs
  const mapElement = useRef<HTMLDivElement>(null);

  // create state ref that can be accessed in OpenLayers onclick callback function
  //  https://stackoverflow.com/a/60643670
  const mapRef = useRef<Map|undefined>()
  mapRef.current = map

  // initialize map on first render - logic formerly put into componentDidMount
  useEffect( () => {

    // create and add vector source layer
    const initalFeaturesLayer = new VectorLayer({
      source: new VectorSource()
    })

    if (mapElement.current) {
        // create map
        const initialMap = new Map({
        target: mapElement.current,
        layers: [
            new TileLayer({
            source: new XYZ({
                url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                })
            }),
            initalFeaturesLayer
            
        ],
        view: new View({
            projection: 'EPSG:3857',
            center: fromLonLat([151.048, -33.79255]),
            zoom: 5
        }),
        controls: []
        })

        // set map onclick handler
        initialMap.on('click', handleMapClick)

        // save map and vector layer references to state
        setMap(initialMap)
        setFeaturesLayer(initalFeaturesLayer)
    }

  },[])

  // update map if features prop changes - logic formerly put into componentDidUpdate
  useEffect( () => {

    if (props.features.length) { // may be null on first render

        // set features to map
        if (featuresLayer) {
            featuresLayer.setSource(
                new VectorSource({
                features: props.features // make sure features is an array
                })
            )
        
            // fit map to feature extent (with 100px of padding)
            if (map) {
                map.getView().fit(featuresLayer.getSource().getExtent(), {
                    padding: [100,100,100,100]
                })
            }
        }

    }

  },[props.features, map, featuresLayer])

  useEffect( () => {
    if (map && selectedCoord) {
        console.log("recenter", selectedCoord)
        map.getView().animate({center: fromLonLat(selectedCoord)})
    }
  }, [map, selectedCoord])

  // map click handler
  const handleMapClick = (event:any) => {
    
    if (mapRef.current) {
        // get clicked coordinate using mapRef to access current React state inside OpenLayers callback
        //  https://stackoverflow.com/a/60643670
        const clickedCoord = mapRef.current.getCoordinateFromPixel(event.pixel);

        // transform coord to EPSG 4326 standard Lat Long
        const transformedCoord = transform(clickedCoord, 'EPSG:3857', 'EPSG:4326')

        console.log(clickedCoord)
        console.log(transformedCoord)
        // set React state
        setSelectedCoord( transformedCoord )
    }
  }

  // render component
  return (      
    <div>
      
      <div ref={mapElement} className="map-container"></div>
      
      <div className="clicked-coord-label">
        <p>{ (selectedCoord) ? toStringXY(selectedCoord, 5) : '' }</p>
      </div>

    </div>
  ) 

}

export default MapWrapper
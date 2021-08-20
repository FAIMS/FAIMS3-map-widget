// react
import React, { useState, useEffect, useRef, useCallback } from 'react';

// openlayers
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import {Draw, Modify, Snap} from 'ol/interaction';
import XYZ from 'ol/source/XYZ' 
import {fromLonLat} from 'ol/proj';

import './MapWrapper.css'
import { Collection, Feature } from 'ol';

type FeaturesType = Feature<any>[] | Collection<Feature<any>> | undefined
interface MapProps {
    features: any
}

function MapWrapper(props: MapProps) {

    // set intial state
    const [map, setMap ] = useState<Map|undefined>()
    const [featuresLayer, setFeaturesLayer ] = useState<VectorLayer<VectorSource<any>>>()
    const [drawnFeatures, setDrawnFeatures] = useState<string []>([])

    // pull refs
    const mapElement = useRef<HTMLDivElement>(null);

    // create state ref that can be accessed in OpenLayers onclick callback function
    //  https://stackoverflow.com/a/60643670
    const mapRef = useRef<Map|undefined>()
    mapRef.current = map

    const createBaseLayer = (features: FeaturesType): VectorLayer<any> =>  {
        return new VectorLayer({
            source: new VectorSource({
                features: features
            }),
            style: new Style({
                    fill: new Fill({color: 'rgba(255, 255, 255, 0.2)'}),
                    stroke: new Stroke({
                            color: '#ff3333',
                            width: 4,
                        }),
                    image: new CircleStyle({
                            radius: 7,
                            fill: new Fill({color: '#ffcc33'}),
                        }),
                    })
            })
    };

    const createMap = useCallback( (element: HTMLElement, features: FeaturesType): Map => {
        
        const featuresLayer = createBaseLayer(features);

        const theMap = new Map({
            target: element,
            layers: [
                new TileLayer({
                source: new XYZ({
                    url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    })
                }),
                featuresLayer
            ],
            view: new View({
                projection: 'EPSG:3857'
            }),
            controls: []
        })

        // fit map to feature extent (with 100px of padding)
        theMap.getView().fit(featuresLayer.getSource().getExtent(), {
            padding: [100,100,100,100]
        })

        return theMap;
    }, [])

    // initialize map on first render
    useEffect( () => {
 
        // don't do this if we have already made a map or if there are no
        // features to overlay
        if (!map && props.features.length > 0) {
            // create and add vector source layer containing the passed in features
            if (mapElement.current) {
                // create map
                const initialMap = createMap(mapElement.current, props.features)
                setMap(initialMap)
            }
        }
    }, [map, createMap, props])

  // render component
  return (      
    <div>
      <div ref={mapElement} className="map-container"></div>
    </div>
  ) 

}

export default MapWrapper
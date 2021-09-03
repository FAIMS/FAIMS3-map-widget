
import { useEffect, useState } from 'react';
import GeoJSON from 'ol/format/GeoJSON';
import Feature from 'ol/Feature';
import './MapFormField.css';
import MapWrapper from './MapWrapper';
import { toStringXY } from 'ol/coordinate';
import {toLonLat} from 'ol/proj';
import Button from '@material-ui/core/Button'
import { FieldProps } from 'formik';

function MapFormField({
  field,
  form, 
  ...props
}:FieldProps) {

  const [ showMap, setShowMap ] = useState(false)
  const [ features, setFeatures ] = useState<Array<Feature<any>>>([])
  const [ drawnFeatures, setDrawnFeatures ] = useState<Array<Feature<any>>>([])

  //const zoom = 12;
  //const center = [151.048, -33.79255];

  // initialization - retrieve GeoJSON features from Mock JSON API get features from mock 
  //  GeoJson API (read from flat .json file in public directory)
  useEffect( () => {

    fetch('/tracks.geojson')
      .then(response => response.json())
      .then( (fetchedFeatures) => {

        // parse fetched geojson into OpenLayers features
        //  use options to convert feature from EPSG:4326 to EPSG:3857
        const wktOptions = {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857'
        }
        const parsedFeatures = new GeoJSON().readFeatures(fetchedFeatures, wktOptions)

        // set features into state (which will be passed into OpenLayers
        //  map component as props)
        setFeatures(parsedFeatures)
      })

  },[])

  const mapCallback = (theFeatures: any) => {
    setDrawnFeatures(theFeatures)
    setShowMap(false);

    form.setFieldValue(field.name, theFeatures)
  }
  
  if (showMap) {
    return (
      <div>
        <MapWrapper features={features} callbackFn={mapCallback} />
      </div>
    );
  } else {
    return (
    <div>
      <Button variant='contained' className={'map-button'} onClick={() => setShowMap(true)}>Get Map Data</Button>

      {drawnFeatures.map( (df, findex) => 
        (<div><p>Feature {findex}</p><ul>
          {df.getGeometry().getCoordinates()[0].map((p:any, index: number) => 
            (<li key={index}>{toStringXY(toLonLat(p), 5)}</li>))}
         </ul>
         </div>))
        }
    </div>
    )
  }
}

export default MapFormField;
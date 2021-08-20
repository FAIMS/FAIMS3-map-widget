
import { useEffect, useState } from 'react';
import GeoJSON from 'ol/format/GeoJSON';
import Feature from 'ol/Feature';
import './App.css';
import MapWrapper from './components/MapWrapper';


// inspiration from https://github.com/tcallsen/react-func-openlayers

function App() {


  // set intial state
  const [ features, setFeatures ] = useState<Array<Feature<any>>>([])

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



  return (
    <div className="App">
      <MapWrapper features={features} />
    </div>
  );
}

export default App;
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Input,
  SkeletonText,
} from '@chakra-ui/react'
import { FaLocationArrow, FaTimes } from 'react-icons/fa'

import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
} from '@react-google-maps/api'
import { useRef, useState } from 'react'

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  })

  const [center, setCenter] = useState({ lat: 37.7749, lng: -122.4194 })

  const [map, setMap] = useState(/** @type google.maps.Map */ (null))

  const location = useRef()

  if (!isLoaded) {
    return <SkeletonText />
  }

  async function find() {
    if (location.current.value === '') {
      return
    }

    // eslint-disable-next-line no-undef
    const geocoder = new google.maps.Geocoder()

    geocoder.geocode( { 'address': location.current.value}, function(results, status) {
      // eslint-disable-next-line no-undef
      if (status == google.maps.GeocoderStatus.OK)
      {
          setCenter({
            lat:results[0].geometry.location.lat(),
            lng:results[0].geometry.location.lng()
          })
          console.log(center)
      }
    })

    map.panTo(center)
  }

  function clearLocation() {
    location.current.value = ''
  }

  return (
    <Flex
      position='relative'
      flexDirection='column'
      alignItems='center'
      h='100vh'
      w='100vw'
    >
      <Box position='center' left={0} top={0} h='75%' w='75%'>
        {/* Google Map Box */}
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
          }}
          onLoad={map => setMap(map)}
        >
          <Marker position={center} />
        </GoogleMap>
      </Box>
      <Box
        p={4}
        borderRadius='lg'
        m={4}
        bgColor='white'
        shadow='base'
        minW='container.md'
        zIndex='1'
      >
        <HStack spacing={2} justifyContent='space-between'>
          <Box flexGrow={1}>
            <Autocomplete>
              <Input type='text' placeholder='Search Location' ref={location} />
            </Autocomplete>
          </Box>

          <ButtonGroup>
            <Button colorScheme='pink' type='submit' onClick={find}>
              Find
            </Button>
            <IconButton
              aria-label='center back'
              icon={<FaTimes />}
              onClick={clearLocation}
            />
          </ButtonGroup>
        </HStack>
        <HStack spacing={4} mt={4} justifyContent='space-between'>
          <IconButton
            aria-label='center back'
            icon={<FaLocationArrow />}
            isRound
            onClick={() => {
              map.panTo(center)
              map.setZoom(15)
            }}
          />
        </HStack>
      </Box>
    </Flex>
  )
}

export default App

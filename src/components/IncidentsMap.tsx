import mapTranslations from '@/data/map-translations.json'
import { Incident } from '@/types/incident'
import { DateTime } from 'luxon'
import type maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import React, { useRef, useState } from 'react'
import Map, {
  MapRef,
  Marker,
  NavigationControl,
  Popup,
} from 'react-map-gl/maplibre'
// Use dynamic import for SosChat since it uses browser APIs
import dynamic from 'next/dynamic'

const SosChat = dynamic(() => import('./SosChat'), { ssr: false })

interface IncidentsMapProps {
  incidents: Incident[]
  focusedIncident?: Incident | null
}

// Extracted function to apply Turkish translations to map labels
function applyTurkishLabels(map: maplibregl.Map): void {
  const layers = [
    'label_city',
    'label_city_capital',
    'label_town',
    'label_village',
    'label_other',
  ]
  const matchExpression: unknown[] = ['match', ['get', 'name']]

  Object.entries(mapTranslations).forEach(([english, turkish]) => {
    matchExpression.push(english, turkish)
  })
  matchExpression.push(['get', 'name'])

  const finalExpression = ['coalesce', ['get', 'name:tr'], matchExpression]

  layers.forEach((layer) => {
    if (map.getLayer(layer)) {
      map.setLayoutProperty(layer, 'text-field', finalExpression)
    }
  })
}

// eslint-disable-next-line max-lines-per-function
export default function IncidentsMap({
  incidents,
  focusedIncident,
}: IncidentsMapProps): JSX.Element {
  const mapRef = useRef<MapRef>(null)
  // Center of North Cyprus
  const [viewState, setViewState] = React.useState({
    longitude: 33.3823,
    latitude: 35.1856,
    zoom: 9,
  })

  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
    null
  )

  // Update view state when focusedIncident changes
  React.useEffect(() => {
    console.log('[IncidentsMap] focusedIncident changed:', focusedIncident)
    console.log('[IncidentsMap] mapRef.current:', mapRef.current)

    if (focusedIncident && mapRef.current) {
      const map = mapRef.current.getMap()
      console.log('[IncidentsMap] map instance:', map)
      console.log('[IncidentsMap] Calling flyTo with:', {
        center: [focusedIncident.lng, focusedIncident.lat],
        zoom: 14,
      })
      map?.flyTo({
        center: [focusedIncident.lng, focusedIncident.lat],
        zoom: 14,
        duration: 3000, // Slower animation (3 seconds)
      })
      setSelectedIncident(focusedIncident)
      console.log('[IncidentsMap] setSelectedIncident called')
    } else {
      console.log(
        '[IncidentsMap] Skipping flyTo - focusedIncident:',
        !!focusedIncident,
        'mapRef.current:',
        !!mapRef.current
      )
    }
  }, [focusedIncident])

  // Filter toggles for incident types
  const [filters, setFilters] = useState({
    FIRE: true,
    MEDICAL: true,
  })

  const toggleFilter = (type: 'FIRE' | 'MEDICAL'): void => {
    setFilters((prev) => ({ ...prev, [type]: !prev[type] }))
  }

  // Filter incidents based on toggle state
  const filteredIncidents = incidents.filter(
    (incident) =>
      incident.type && filters[incident.type as keyof typeof filters]
  )

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Filter Toggle Panel */}
      <div className="absolute left-4 top-4 z-10 flex gap-2 rounded-lg bg-white/90 p-2 shadow-lg backdrop-blur-sm">
        <button
          onClick={(): void => toggleFilter('FIRE')}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
            filters.FIRE
              ? 'bg-orange-500 text-white'
              : 'bg-gray-200 text-gray-500'
          }`}
          title="Toggle Fire Incidents"
        >
          <span className="text-lg">🔥</span>
          <span>Fire</span>
        </button>
        <button
          onClick={(): void => toggleFilter('MEDICAL')}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
            filters.MEDICAL
              ? 'bg-red-500 text-white'
              : 'bg-gray-200 text-gray-500'
          }`}
          title="Toggle Medical Incidents"
        >
          <span className="text-lg">🚑</span>
          <span>Medical</span>
        </button>
      </div>

      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt): void => setViewState(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle="https://tiles.openfreemap.org/styles/liberty"
        dragRotate={false}
        onLoad={(e): void => applyTurkishLabels(e.target as maplibregl.Map)}
      >
        <NavigationControl position="top-right" />

        {filteredIncidents.map((incident) => (
          <Marker
            key={incident.id}
            longitude={incident.lng}
            latitude={incident.lat}
            anchor="bottom"
            onClick={(e): void => {
              e.originalEvent.stopPropagation()
              setSelectedIncident(incident)
            }}
          >
            <div className="relative flex h-4 w-4 cursor-pointer items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-red-600"></span>
            </div>
          </Marker>
        ))}

        {selectedIncident && (
          <Popup
            longitude={selectedIncident.lng}
            latitude={selectedIncident.lat}
            anchor="top"
            onClose={(): void => setSelectedIncident(null)}
            closeOnClick={true}
            maxWidth="450px"
          >
            <div className="w-[400px] p-1 text-black">
              <div className="mb-4 border-b pb-2">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-lg font-bold">
                    {selectedIncident.type === 'FIRE' ? '🔥' : '🚑'}
                    {selectedIncident.type}
                  </h3>
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-bold ${
                      selectedIncident.status === 'OPEN'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-blue-100 text-blue-600'
                    }`}
                  >
                    {selectedIncident.status}
                  </span>
                </div>

                <div className="flex justify-between text-xs text-gray-500">
                  <span>
                    Created:{' '}
                    {typeof selectedIncident.createdAt === 'number'
                      ? DateTime.fromMillis(
                          selectedIncident.createdAt
                        ).toLocaleString(DateTime.DATETIME_MED)
                      : new Date(
                          selectedIncident.createdAt || ''
                        ).toLocaleString()}
                  </span>
                  <span>
                    ({selectedIncident.lat.toFixed(4)},{' '}
                    {selectedIncident.lng.toFixed(4)})
                  </span>
                </div>
              </div>

              {/* Chat Interface */}
              <div className="mt-2">
                <h4 className="mb-2 text-sm font-semibold text-gray-700">
                  Live Communication
                </h4>
                <SosChat sosId={selectedIncident.id} />
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  )
}

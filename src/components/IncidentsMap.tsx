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
import SosChat, { SosChatRef } from './SosChat'

type VehicleType = 'CAR' | 'AMBULANCE' | 'TRUCK' | 'EXCAVATOR'

const VEHICLE_ICONS: Record<VehicleType, string> = {
  AMBULANCE: '/ambulance.png',
  CAR: '/car.png',
  TRUCK: '/delivery-truck.png',
  EXCAVATOR: '/excavator.png',
}

const VEHICLES: Record<VehicleType, { plate: string; name: string }[]> = {
  AMBULANCE: [
    { plate: '34 AC 112', name: 'Ambulance A1' },
    { plate: '34 AC 113', name: 'Ambulance A2' },
  ],
  CAR: [
    { plate: '34 XY 789', name: 'Patrol 1' },
    { plate: '34 ZW 001', name: 'Patrol 2' },
  ],
  TRUCK: [{ plate: '34 TR 555', name: 'Truck T1' }],
  EXCAVATOR: [{ plate: '34 EX 999', name: 'Excavator E1' }],
}

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
  const [selectedVehicleType, setSelectedVehicleType] =
    useState<VehicleType | null>(null)
  const sosChatRef = useRef<SosChatRef>(null)

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
  // Filter incidents based on toggle state
  const filteredIncidents = incidents.filter(
    (incident) =>
      incident.type && filters[incident.type as keyof typeof filters]
  )

  const [locallyClosedIds, setLocallyClosedIds] = useState<Set<string>>(
    new Set()
  )

  const isCaseClosed = (incident: Incident): boolean => {
    return (
      incident.status === 'CLOSED' ||
      incident.status === 'RESOLVED' ||
      locallyClosedIds.has(incident.id)
    )
  }

  const handleCloseCase = (id: string): void => {
    if (window.confirm('Are you sure you want to close this case?')) {
      setLocallyClosedIds((prev) => {
        const newSet = new Set(prev)
        newSet.add(id)
        return newSet
      })
      setSelectedIncident(null)
    }
  }

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

      {/* Sidebar - All Cases */}
      <div className="absolute left-0 top-20 z-10 flex flex-col gap-1 p-1">
        {incidents.map((incident) => {
          const closed = isCaseClosed(incident)
          return (
            <button
              key={incident.id}
              onClick={(): void => setSelectedIncident(incident)}
              className={`flex h-8 w-8 items-center justify-center rounded-r-md text-white shadow-md transition-all hover:w-10 hover:shadow-lg ${
                closed ? 'bg-green-500' : 'bg-red-500'
              }`}
              title={`${incident.type} - ${closed ? 'CLOSED' : 'OPEN'}`}
            >
              <span className="text-xs">
                {incident.type === 'FIRE' ? '🔥' : '🚑'}
              </span>
            </button>
          )
        })}
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
              <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                  isCaseClosed(incident) ? 'bg-green-400' : 'bg-red-400'
                }`}
              ></span>
              <span
                className={`relative inline-flex h-3 w-3 rounded-full ${
                  isCaseClosed(incident) ? 'bg-green-600' : 'bg-red-600'
                }`}
              ></span>
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
            maxWidth="850px"
          >
            <div className="flex w-[800px] gap-4 p-1 text-black">
              {/* Left Column: Info & Chat */}
              <div className="w-[400px]">
                <div className="mb-4 border-b pb-2">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-lg font-bold">
                      {selectedIncident.type === 'FIRE' ? '🔥' : '🚑'}
                      {selectedIncident.type}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-bold ${
                          isCaseClosed(selectedIncident)
                            ? 'bg-green-100 text-green-600'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {isCaseClosed(selectedIncident) ? 'CLOSED' : 'OPEN'}
                      </span>
                      {!isCaseClosed(selectedIncident) && (
                        <button
                          onClick={(): void =>
                            handleCloseCase(selectedIncident.id)
                          }
                          className="rounded bg-red-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-red-700"
                        >
                          CLOSE CASE
                        </button>
                      )}
                    </div>
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
                  <SosChat sosId={selectedIncident.id} ref={sosChatRef} />
                </div>
              </div>

              {/* Right Column: Vehicle Dispatch */}
              <div className="w-[350px] border-l pl-4">
                <h4 className="mb-4 text-sm font-semibold text-gray-700">
                  Dispatch Vehicle
                </h4>
                <div className="mb-4 grid grid-cols-4 gap-2">
                  {(
                    Object.entries(VEHICLE_ICONS) as [VehicleType, string][]
                  ).map(([type, src]) => (
                    <button
                      key={type}
                      onClick={(): void => setSelectedVehicleType(type)}
                      className={`flex flex-col items-center justify-center rounded-lg border p-1.5 transition-all hover:bg-gray-50 ${
                        selectedVehicleType === type
                          ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-200'
                          : 'border-gray-200'
                      }`}
                      title={type}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={type}
                        className="mb-1 h-8 w-8 object-contain"
                      />
                      <span className="text-[9px] font-bold text-gray-600">
                        {type}
                      </span>
                    </button>
                  ))}
                </div>

                {selectedVehicleType && (
                  <div className="duration-200 animate-in fade-in slide-in-from-top-2">
                    <h5 className="mb-2 text-xs font-bold uppercase text-gray-500">
                      Available {selectedVehicleType}s
                    </h5>
                    <div className="max-h-[200px] space-y-2 overflow-y-auto">
                      {VEHICLES[selectedVehicleType].map((vehicle) => (
                        <button
                          key={vehicle.plate}
                          onClick={(): void => {
                            if (
                              window.confirm(
                                `Dispatch ${vehicle.name} (${vehicle.plate})?`
                              )
                            ) {
                              const msg = `${vehicle.plate} plakali ${
                                selectedVehicleType === 'AMBULANCE'
                                  ? 'Ambulans'
                                  : selectedVehicleType === 'CAR'
                                    ? 'Arac'
                                    : selectedVehicleType === 'TRUCK'
                                      ? 'Kamyon'
                                      : 'Kepce'
                              } yardim icin gonderilmistir`
                              sosChatRef.current?.sendMessage(msg)
                            }
                          }}
                          className="flex w-full items-center justify-between rounded-md border border-gray-100 bg-white p-2 text-left shadow-sm transition-all hover:bg-gray-50 hover:shadow-md"
                        >
                          <div>
                            <div className="text-sm font-semibold text-gray-800">
                              {vehicle.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              Plate: {vehicle.plate}
                            </div>
                          </div>
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  )
}

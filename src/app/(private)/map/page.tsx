'use client'

import { Incident } from '@/types/incident'
import type { IStompSocket, Client as StompClient } from '@stomp/stompjs'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

// Dynamic import with SSR disabled to prevent WebGL class inheritance issues
const IncidentsMap = dynamic(() => import('@/components/IncidentsMap'), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-gray-200" />,
})

const Page = (): JSX.Element => {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [focusedIncident, setFocusedIncident] = useState<Incident | null>(null)

  useEffect(() => {
    let stompClient: StompClient | null = null

    const initWebSocket = async (): Promise<void> => {
      // Dynamic imports to prevent SSR issues with class inheritance
      const [{ default: SockJS }, { Client }] = await Promise.all([
        import('sockjs-client'),
        import('@stomp/stompjs'),
      ])

      // Configure Stomp client
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
      const socketUrl = `${apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl}/ws`
      const socket = new SockJS(socketUrl)
      stompClient = new Client({
        webSocketFactory: (): IStompSocket => socket as unknown as IStompSocket,
        debug: (str: string): void => {
          console.log(str)
        },
        onConnect: (): void => {
          console.log('Connected to WebSocket')
          stompClient?.subscribe('/topic/sos', (message) => {
            console.log('[MapPage] Received WebSocket message:', message.body)
            if (message.body) {
              try {
                const sosData = JSON.parse(message.body)

                console.log(
                  '[MapPage] Parsed SOS data:',
                  JSON.stringify(sosData)
                )

                // Handle both field name formats (lat/lng vs latitude/longitude)
                const lat = sosData.latitude ?? sosData.lat
                const lng = sosData.longitude ?? sosData.lng

                // Validate coordinates
                if (typeof lat !== 'number' || typeof lng !== 'number') {
                  console.error(
                    '[MapPage] Invalid coordinates - lat:',
                    lat,
                    'lng:',
                    lng
                  )
                  return
                }

                // Map backend SosEntity to frontend Incident
                const newIncident: Incident = {
                  id: sosData.id,
                  lat: lat,
                  lng: lng,
                  type: 'MEDICAL', // Default to MEDICAL or infer from message if possible
                  status: 'OPEN',
                  createdAt: sosData.createdAt || Date.now(),
                  message: sosData.message,
                }

                console.log(
                  '[MapPage] Created newIncident:',
                  JSON.stringify(newIncident)
                )
                setIncidents((prev) => {
                  console.log(
                    '[MapPage] Previous incidents count:',
                    prev.length
                  )
                  return [...prev, newIncident]
                })

                console.log('[MapPage] Calling setFocusedIncident')
                setFocusedIncident(newIncident)
              } catch (error) {
                console.error('Error parsing WebSocket message:', error)
              }
            }
          })
        },
        onStompError: (frame): void => {
          console.error('Broker reported error: ' + frame.headers['message'])
          console.error('Additional details: ' + frame.body)
        },
      })

      stompClient.activate()
    }

    initWebSocket()

    return (): void => {
      stompClient?.deactivate()
    }
  }, [])

  return (
    <div className="h-[calc(100vh-64px)] w-full">
      <IncidentsMap incidents={incidents} focusedIncident={focusedIncident} />
    </div>
  )
}
export default Page

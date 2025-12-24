'use client'

import IncidentsMap from '@/components/IncidentsMap'
import { Incident } from '@/types/incident'
import { Client, IStompSocket } from '@stomp/stompjs'
import { useEffect, useState } from 'react'
import SockJS from 'sockjs-client'

const Page = (): JSX.Element => {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [focusedIncident, setFocusedIncident] = useState<Incident | null>(null)

  useEffect(() => {
    // Configure Stomp client
    const socket = new SockJS('http://localhost:8080/ws')
    const stompClient = new Client({
      webSocketFactory: (): IStompSocket => socket as unknown as IStompSocket,
      debug: (str: string): void => {
        console.log(str)
      },
      onConnect: (): void => {
        console.log('Connected to WebSocket')
        stompClient.subscribe('/topic/sos', (message) => {
          if (message.body) {
            try {
              const sosData = JSON.parse(message.body)
              // Map backend SosEntity to frontend Incident
              const newIncident: Incident = {
                id: sosData.id,
                lat: sosData.latitude,
                lng: sosData.longitude,
                type: 'MEDICAL', // Default to MEDICAL or infer from message if possible
                status: 'OPEN',
                createdAt: sosData.createdAt || new Date().toISOString(),
                message: sosData.message,
              }
              setIncidents((prev) => [...prev, newIncident])
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

    return (): void => {
      stompClient.deactivate()
    }
  }, [])

  return (
    <div className="h-[calc(100vh-64px)] w-full">
      <IncidentsMap incidents={incidents} focusedIncident={focusedIncident} />
    </div>
  )
}
export default Page

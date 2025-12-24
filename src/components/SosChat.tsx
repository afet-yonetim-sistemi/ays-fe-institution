'use client'

import { Button, Input } from '@/components/ui'
import axiosInstance from '@/configs/axiosConfig'
import { SosMessage, SosMessageRequest } from '@/types/chat'
import { IStompSocket, Client as StompClient } from '@stomp/stompjs'
import { Send } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface SosChatProps {
  sosId: string
}

interface MessageItemProps {
  msg: SosMessage
}

const MessageItem = ({ msg }: MessageItemProps): JSX.Element => (
  <div
    className={`flex ${
      msg.senderType === 'OPERATOR' ? 'justify-end' : 'justify-start'
    }`}
  >
    <div
      className={`max-w-[80%] rounded-lg p-3 ${
        msg.senderType === 'OPERATOR'
          ? 'rounded-br-none bg-blue-600 text-white'
          : 'rounded-bl-none border border-gray-200 bg-white text-gray-800 shadow-sm'
      }`}
    >
      {msg.senderType === 'USER' && (
        <div className="mb-1 text-xs font-semibold text-blue-600">
          Mobile User
        </div>
      )}
      <p className="text-sm">{msg.message}</p>
      {msg.imageUrl && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={msg.imageUrl}
          alt="Shared content"
          className="mt-2 max-h-40 rounded-md object-cover"
        />
      )}
      <div
        className={`mt-1 text-right text-[10px] ${
          msg.senderType === 'OPERATOR' ? 'text-blue-100' : 'text-gray-400'
        }`}
      >
        {new Date(msg.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>
    </div>
  </div>
)

export default function SosChat({ sosId }: SosChatProps): JSX.Element {
  const [messages, setMessages] = useState<SosMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const stompClientRef = useRef<StompClient | null>(null)

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async (): Promise<void> => {
      try {
        setIsLoading(true)
        const response = await axiosInstance.get<{
          response: SosMessage[]
          isSuccess: boolean
        }>(`/api/institution/v1/sos/${sosId}/messages`)

        if (response.data.isSuccess) {
          setMessages(response.data.response)
          setTimeout(scrollToBottom, 100)
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMessages()
  }, [sosId])

  // WebSocket connection
  useEffect(() => {
    const initWebSocket = async (): Promise<void> => {
      // Dynamic imports to prevent SSR issues
      const [{ default: SockJS }, { Client }] = await Promise.all([
        import('sockjs-client'),
        import('@stomp/stompjs'),
      ])

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
      const socketUrl = `${
        apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl
      }/ws`
      const socket = new SockJS(socketUrl)

      const client = new Client({
        webSocketFactory: (): IStompSocket => socket as unknown as IStompSocket,
        debug: (str: string): void => {
          console.log('[SosChat WS]', str)
        },
        reconnectDelay: 5000,
        onConnect: (): void => {
          console.log('[SosChat] Connected to WebSocket')
          client.subscribe(`/topic/sos/${sosId}/messages`, (message) => {
            if (message.body) {
              const newMsg: SosMessage = JSON.parse(message.body)
              setMessages((prev) => {
                // Prevent duplicates
                if (prev.some((m) => m.id === newMsg.id)) return prev
                return [...prev, newMsg]
              })
              setTimeout(scrollToBottom, 100)
            }
          })
        },
      })

      client.activate()
      stompClientRef.current = client
    }

    initWebSocket()

    return (): void => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate()
      }
    }
  }, [sosId])

  const handleSendMessage = async (e?: React.FormEvent): Promise<void> => {
    e?.preventDefault()
    if (!newMessage.trim()) return

    try {
      const request: SosMessageRequest = {
        message: newMessage.trim(),
      }

      const response = await axiosInstance.post<{
        response: SosMessage
        isSuccess: boolean
      }>(`/api/institution/v1/sos/${sosId}/messages`, request)

      if (response.data.isSuccess) {
        setNewMessage('')
        // Message will be added via WebSocket
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  return (
    <div className="flex h-[400px] w-full flex-col">
      <div className="mb-4 flex-1 space-y-4 overflow-y-auto rounded-lg bg-gray-50 p-4">
        {isLoading && messages.length === 0 ? (
          <div className="py-4 text-center text-gray-500">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="py-4 text-center text-gray-500">No messages yet</div>
        ) : (
          messages.map((msg) => <MessageItem key={msg.id} msg={msg} />)
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-2">
        <Input
          value={newMessage}
          onChange={(e): void => setNewMessage(e.target.value)}
          placeholder="Type a reply..."
          className="flex-1"
        />
        <Button
          type="submit"
          size="icon"
          disabled={!newMessage.trim()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}

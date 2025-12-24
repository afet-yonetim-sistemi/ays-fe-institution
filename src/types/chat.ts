export type SosMessage = {
  id: string
  sosId: string
  senderType: 'USER' | 'OPERATOR'
  senderId: string
  message: string
  imageUrl?: string
  createdAt: number
}

export type SosMessageRequest = {
  message: string
  imageUrl?: string
}

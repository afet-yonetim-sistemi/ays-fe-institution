'use client'
import { useModal } from '@/contexts/modalContext'

const GlobalModals = () => {
  const { isOpen, content } = useModal()
  return isOpen && content ? <>{content}</> : null
}

export default GlobalModals

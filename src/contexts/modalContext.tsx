'use client'
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from 'react'

interface ModalContextType {
  isOpen: boolean
  content: ReactNode | null
  openModal: (content: ReactNode) => void
  closeModal: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return context
}

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState<ReactNode | null>(null)

  const openModal = (modalContent: ReactNode) => {
    setContent(modalContent)
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    setContent(null)
  }

  const value = useMemo(
    () => ({
      isOpen,
      content,
      openModal,
      closeModal,
    }),
    [isOpen, content]
  )

  return (
    <ModalContext.Provider value={value}>
      {children}
      {isOpen && content}
    </ModalContext.Provider>
  )
}

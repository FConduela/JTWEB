"use client"

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from "react"

type CartUIContextValue = {
  openCart: () => void
  closeCart: () => void
  scheduleOpenCartAfterAdd: () => void
  isOpenCartAfterAddPending: () => boolean
  clearOpenCartAfterAddPending: () => void
  registerCartHandlers: (
    open: () => void,
    close: () => void
  ) => () => void
}

const CartUIContext = createContext<CartUIContextValue | null>(null)

export const CartUIProvider = ({ children }: { children: React.ReactNode }) => {
  const openHandlerRef = useRef<(() => void) | null>(null)
  const closeHandlerRef = useRef<(() => void) | null>(null)
  const pendingOpenAfterAddRef = useRef(false)

  const registerCartHandlers = useCallback(
    (open: () => void, close: () => void) => {
      openHandlerRef.current = open
      closeHandlerRef.current = close

      return () => {
        if (openHandlerRef.current === open) {
          openHandlerRef.current = null
        }

        if (closeHandlerRef.current === close) {
          closeHandlerRef.current = null
        }
      }
    },
    []
  )

  const openCart = useCallback(() => {
    openHandlerRef.current?.()
  }, [])

  const closeCart = useCallback(() => {
    closeHandlerRef.current?.()
  }, [])

  const scheduleOpenCartAfterAdd = useCallback(() => {
    pendingOpenAfterAddRef.current = true
  }, [])

  const isOpenCartAfterAddPending = useCallback(() => {
    return pendingOpenAfterAddRef.current
  }, [])

  const clearOpenCartAfterAddPending = useCallback(() => {
    pendingOpenAfterAddRef.current = false
  }, [])

  const value = useMemo(
    () => ({
      openCart,
      closeCart,
      scheduleOpenCartAfterAdd,
      isOpenCartAfterAddPending,
      clearOpenCartAfterAddPending,
      registerCartHandlers,
    }),
    [
      openCart,
      closeCart,
      scheduleOpenCartAfterAdd,
      isOpenCartAfterAddPending,
      clearOpenCartAfterAddPending,
      registerCartHandlers,
    ]
  )

  return (
    <CartUIContext.Provider value={value}>{children}</CartUIContext.Provider>
  )
}

export const useCartUI = () => {
  const context = useContext(CartUIContext)

  if (context === null) {
    throw new Error("useCartUI must be used within a CartUIProvider")
  }

  return context
}

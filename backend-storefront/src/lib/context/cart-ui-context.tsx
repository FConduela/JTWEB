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
  registerCartHandlers: (
    open: () => void,
    close: () => void
  ) => () => void
}

const CartUIContext = createContext<CartUIContextValue | null>(null)

export const CartUIProvider = ({ children }: { children: React.ReactNode }) => {
  const openHandlerRef = useRef<(() => void) | null>(null)
  const closeHandlerRef = useRef<(() => void) | null>(null)

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

  const value = useMemo(
    () => ({
      openCart,
      closeCart,
      registerCartHandlers,
    }),
    [openCart, closeCart, registerCartHandlers]
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

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type SuccessPayload = {
  title?: string;
  message?: string;
};

type ContactModalContextValue = {
  isContactOpen: boolean;
  isSuccessOpen: boolean;
  successPayload: SuccessPayload | null;
  openContactModal: () => void;
  closeContactModal: () => void;
  openSuccessModal: (payload?: SuccessPayload) => void;
  closeSuccessModal: () => void;
};

const ContactModalContext = createContext<ContactModalContextValue | null>(null);

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successPayload, setSuccessPayload] = useState<SuccessPayload | null>(null);

  const openContactModal = useCallback(() => {
    setIsContactOpen(true);
  }, []);

  const closeContactModal = useCallback(() => {
    setIsContactOpen(false);
  }, []);

  const openSuccessModal = useCallback((payload?: SuccessPayload) => {
    if (payload) setSuccessPayload(payload);
    setIsSuccessOpen(true);
  }, []);

  const closeSuccessModal = useCallback(() => {
    setIsSuccessOpen(false);
    setSuccessPayload(null);
  }, []);

  const value = useMemo<ContactModalContextValue>(
    () => ({
      isContactOpen,
      isSuccessOpen,
      successPayload,
      openContactModal,
      closeContactModal,
      openSuccessModal,
      closeSuccessModal,
    }),
    [
      isContactOpen,
      isSuccessOpen,
      successPayload,
      openContactModal,
      closeContactModal,
      openSuccessModal,
      closeSuccessModal,
    ]
  );

  return <ContactModalContext.Provider value={value}>{children}</ContactModalContext.Provider>;
}

export function useContactModal() {
  const ctx = useContext(ContactModalContext);
  if (!ctx) {
    throw new Error("useContactModal must be used within ContactModalProvider");
  }
  return ctx;
}

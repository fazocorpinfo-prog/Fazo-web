"use client";

import { useTranslations } from "next-intl";
import { ContactModal } from "@/components/ui/ContactModal";
import { CosmicModal } from "@/components/ui/CosmicModal";
import { useContactModal } from "@/contexts/ContactModalContext";

export function ContactModalHost() {
  const tModal = useTranslations("modal");
  const { isSuccessOpen, closeSuccessModal, successPayload } = useContactModal();

  return (
    <>
      <ContactModal />
      <CosmicModal
        open={isSuccessOpen}
        title={successPayload?.title ?? tModal("successTitle")}
        message={successPayload?.message ?? tModal("successMessage")}
        closeLabel={tModal("close")}
        onClose={closeSuccessModal}
      />
    </>
  );
}

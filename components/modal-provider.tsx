import React, { createContext, useState, ReactNode } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type ModalSize = "sm" | "md" | "lg" | "xl";

export interface ModalContextType {
  openModal: <T = any, R = any>(
    content: React.ComponentType<any>,
    data?: T,
    options?: ModalOptions,
    onClose?: (result: R) => void
  ) => void;
  closeModal: <R = any>(result?: R) => void;
}

export interface ModalOptions {
  size?: ModalSize;
  showCloseButton?: boolean;
  className?: string;
}

export const ModalContext = createContext<ModalContextType | undefined>(
  undefined
);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] =
    useState<React.ComponentType<any> | null>(null);
  const [modalData, setModalData] = useState<any | null>(null);
  const [modalOptions, setModalOptions] = useState<ModalOptions>({});
  const [onCloseCallback, setOnCloseCallback] = useState<
    ((result: any) => void) | null
  >(null);

  const openModal = (
    content: React.ComponentType<any>,
    data: any = {},
    options?: ModalOptions,
    onClose: ((result: any) => void) | null = null
  ) => {
    setModalContent(() => content); // Use a functional update to avoid stale closures
    setModalData(data);
    setModalOptions(options || {});
    setOnCloseCallback(() => onClose); // Use a functional update to store the callback
    setIsModalOpen(true);
  };

  const closeModal = (result: any = null) => {
    setIsModalOpen(false);
    if (onCloseCallback) {
      onCloseCallback(result);
    }
    // Reset state after a small delay to allow for exit animation
    setTimeout(() => {
      setModalContent(null);
      setModalData(null);
      setOnCloseCallback(null);
    }, 300);
  };

  const dynamicContent = modalContent
    ? React.createElement(modalContent, {
        ...modalData,
        onConfirm: closeModal, // Pass the closeModal function as a prop for the child to use
      })
    : null;

  const sizeClasses = {
    sm: "sm:max-w-md",
    md: "sm:max-w-lg",
    lg: "sm:max-w-2xl",
    xl: "sm:max-w-4xl",
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          className={cn(sizeClasses[modalOptions.size ?? "md"], modalOptions.className)}
          showCloseButton={modalOptions.showCloseButton ?? true}
        >
          {dynamicContent}
        </DialogContent>
      </Dialog>
    </ModalContext.Provider>
  );
};

import { useState } from "react";

export function useModal(estadoInicial = false) {
    const [isOpen, setIsOpen] = useState(estadoInicial);

    const abrirModal = () => setIsOpen(true);
    const fecharModal = () => setIsOpen(false);

    return {
        isOpen,
        abrirModal,
        fecharModal,
        toggleModal: () => setIsOpen(!isOpen)
    };

}
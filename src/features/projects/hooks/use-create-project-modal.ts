import { parseAsBoolean, useQueryState } from "nuqs";

export const useCreateProjectModal = () => {
    const [isOpen, setIsOpen] = useQueryState(
        "create-project",
        parseAsBoolean.withDefault(false),
    );
    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    return {
        isOpen,
        open,
        close,
        setIsOpen,
    };
};

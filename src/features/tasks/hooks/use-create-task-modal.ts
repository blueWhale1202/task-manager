import { parseAsBoolean, useQueryState } from "nuqs";

export const useCreateTaskModal = () => {
    const [isOpen, setIsOpen] = useQueryState(
        "create-task",
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

import { MobileSidebar } from "./mobile-sidebar";
import { UserButton } from "./user-button";

export const Navbar = () => {
    return (
        <nav className="fixed left-0 right-0 top-0 z-20 flex items-center justify-between bg-white px-6 pt-4 shadow-sm lg:left-[264px]">
            <div className="hidden flex-col lg:flex">
                <h1 className="text-2xl font-semibold">Home</h1>
                <p className="text-muted-foreground">
                    Monitor all of your projects and tasks here
                </p>
            </div>
            <MobileSidebar />
            <UserButton />
        </nav>
    );
};

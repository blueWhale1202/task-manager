import Image from "next/image";

type Props = {
    children: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
    return (
        <main className="min-h-screen bg-neutral-100">
            <div className="mx-auto max-w-screen-2xl p-4">
                <nav className="flex items-center justify-between">
                    <div className="relative h-14 w-[152px] object-cover">
                        <Image src="/logo.svg" alt="Logo" fill priority />
                    </div>
                </nav>

                <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
                    {children}
                </div>
            </div>
        </main>
    );
}

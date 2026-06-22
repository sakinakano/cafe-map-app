export default function Container({
    children,
    }: {
    children: React.ReactNode;
    }) {
    return (
        <main className="mx-auto w-full max-w-[1000px] px-4 py-8">
            {children}
        </main>
    );
}
import BottomNav from "@/components/BottomNav";

export default function AppLayout({ children }) {
  return (
    <>
      <div className="mx-auto min-h-screen max-w-md pb-24">{children}</div>
      <BottomNav />
    </>
  );
}
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0B0D12] flex items-center justify-center">
      {children}
    </div>
  );
}

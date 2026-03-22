import { TopNav } from '@/components/layout/top-nav';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav />
      <div className="pt-[52px]">
        {children}
      </div>
    </>
  );
}

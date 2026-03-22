import { TopNav } from '@/components/layout/top-nav';
import { Sidebar } from '@/components/layout/sidebar';
import { Footer } from '@/components/layout/footer';
import { GridOverlay } from '@/components/shared/grid-overlay';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav />
      <GridOverlay />
      <div className="flex pt-[52px] min-h-screen relative z-[1]">
        <Sidebar />
        <main className="ml-[220px] flex-1 px-14 py-7 max-w-[1040px] relative z-[2]">
          {children}
        </main>
      </div>
      <Footer />
    </>
  );
}

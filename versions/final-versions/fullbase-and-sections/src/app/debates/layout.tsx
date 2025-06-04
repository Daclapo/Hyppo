import LayoutWithSidebar from '../layout-with-sidebar';

export default function DebatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutWithSidebar>{children}</LayoutWithSidebar>;
}

import LayoutWithSidebar from '../layout-with-sidebar';

export default function SugerenciasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutWithSidebar>{children}</LayoutWithSidebar>;
}

import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { DispatchDemoProvider } from "@/features/dispatch/dispatch-demo-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pampanga Dispatch",
  description:
    "A modern web foundation for a Pampanga logistics and delivery management project.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <DispatchDemoProvider>
          <AppShell>{children}</AppShell>
        </DispatchDemoProvider>
      </body>
    </html>
  );
}

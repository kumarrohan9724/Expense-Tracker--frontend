// src/app/layout.tsx
import { Providers } from "@/components/Providers";

export const metadata = {
  title: "FlowFinance",
  description: "Modern Expense Tracker",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* The Providers component (which is a Client Component)
        must wrap the children inside the <body> tag. 
      */}
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
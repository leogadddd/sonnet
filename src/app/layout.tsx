import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ConvexClientProvider } from "@/components/providers/convex-provider";
import { ModalProvider } from "@/components/providers/modal-provider";

import "@/styles/globals.css";

import { EdgeStoreProvider } from "@/lib/edgestore";
import { PostHogProvider } from "@/components/providers/posthog-provider";
import { DexieProvider } from "./components/providers/dexie-provider";
import { SyncProvider } from "./components/providers/sync-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { UserProvider } from "./components/providers/user-provider";

const poppins = Poppins({
  subsets: ["latin"], // Ensures support for Latin characters
  weight: ["400", "700"], // Specifies the font weights you need
  variable: "--font-poppins", // Defines a CSS variable for global usage
});

export const metadata: Metadata = {
  title: `Sonnet ${
    process.env.NODE_ENV === "production"
      ? "– Where Ideas Flow Like Poetry"
      : "- Development"
  }`,
  description:
    "Sonnet is a sleek and powerful MDX editor designed for seamless note-taking, documentation, and creative writing. Elevate your ideas with structured markdown and dynamic components—all in a beautifully minimal workspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable}`}>
        <ClerkProvider>
          <DexieProvider>
            <SyncProvider>
              <PostHogProvider>
                <ConvexClientProvider>
                  <UserProvider>
                    <EdgeStoreProvider>
                      <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                        storageKey="sonnet-theme-2"
                      >
                        <Toaster position="bottom-right" />
                        <ModalProvider />
                        {children}
                      </ThemeProvider>
                    </EdgeStoreProvider>
                  </UserProvider>
                </ConvexClientProvider>
              </PostHogProvider>
            </SyncProvider>
          </DexieProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}

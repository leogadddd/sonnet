import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "@/styles/globals.css";
import "@/styles/prosemirror.css";
import SideBarComponent from "@/components/sidebar/sidebar.component";

const globalFont = Poppins({
  display: "swap",
  weight: ["300", "400", "700", "500"],
  subsets: ["latin", "latin-ext"],
});
export const metadata: Metadata = {
  title: "MDX Editor",
  description: "A tool created to edit mdx for leogadil.com",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${globalFont.className} bg-[--color-dark] text-white antialiased`}
      >
        <div className="flex h-max">
          <SideBarComponent></SideBarComponent>
          <div className="flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}

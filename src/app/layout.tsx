import type { Metadata } from "next";
import { Montserrat, Open_Sans, Roboto_Condensed, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700"],
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  weight: ["400", "600"],
});

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  variable: "--font-roboto-condensed",
  weight: ["500", "600", "700", "800"],
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Nationwide Advance – Empower your business with our flexible business financing.",
    template: "%s | Nationwide Advance",
  },
  description:
    "Empower your business with flexible business financing from Nationwide Advance. Apply for funding online.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${openSans.variable} ${robotoCondensed.variable} ${sourceSans.variable}`}
      >
        {children}
      </body>
    </html>
  );
}

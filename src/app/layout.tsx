import localFont from "next/font/local";
import "./globals.css";
import { ReactNode } from "react";

const robotoMono = localFont({
  src: [
    {
      path: "./fonts/RobotoMono-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/RobotoMono-Bold.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "./fonts/RobotoMono-Light.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "./fonts/RobotoMono-SemiBold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/RobotoMono-Medium.ttf",
      weight: "300",
      style: "normal",
    },
  ],
  variable: "--font-roboto-mono",
  weight: "100 900",
});

const geistSans = localFont({
  src: "../../Geist-VariableFont_wght.ttf",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata = {
  title: "Elviswohlken.com",
  description: "Lets build something together",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${robotoMono.variable} ${geistSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

import localFont from "next/font/local";

export const robotoMono = localFont({
  src: [
    {
      path: "../fonts/RobotoMono-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/RobotoMono-Bold.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../fonts/RobotoMono-Light.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../fonts/RobotoMono-SemiBold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/RobotoMono-Medium.ttf",
      weight: "300",
      style: "normal",
    },
  ],
  variable: "--font-roboto-mono",
  weight: "100 900",
});

export const geistSans = localFont({
  src: "../fonts/Geist-VariableFont_wght.ttf",
  variable: "--font-geist-sans",
  weight: "100 900",
});

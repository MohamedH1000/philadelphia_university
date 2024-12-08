import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Tajawal } from "next/font/google";

// const geistTajwal = localFont({
//   src: "./fonts/Tajawal-Bold.ttf",
//   variable: "--font-tajwal-bold",
//   weight: "100 900",
// });

const tajwal = Tajawal({
  subsets: ["latin"],
  weight: ["400", "700"], // specify the weights you need
});

export const metadata: Metadata = {
  title: "الصفحة الرئيسية",
  description: "الصفحة الرئيسية للطالب",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={` ${tajwal.className} antialiased`}>
        {children}
        <Toaster position="bottom-right" reverseOrder={false} />
      </body>
    </html>
  );
}

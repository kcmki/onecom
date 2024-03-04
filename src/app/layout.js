import { Inter } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });


export const metadata = {
  title: "Kim Shop",
  description: "Kim Shop online store",
};

export default async function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className={inter.className + " w-screen overflow-x-hidden"}>
            {children}
      </body>
    </html>
  );
}
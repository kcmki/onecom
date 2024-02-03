import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "oneShop",
  description: "oneShop online store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className + " w-screen overflow-x-hidden"}>
        <header className='w-screen h-auto p-4 flex justify-center items-center'>
          <h1 className='text-2xl font-bold'>oneShop</h1>
        </header>
        	{children}
		<footer className='w-screen h-10 flex justify-center items-center p-5'>
			<span>
				&copy; {new Date().getFullYear()} oneShop {process.env.Owner} - All rights reserved
			</span>
		</footer>
      </body>
    </html>
  );
}

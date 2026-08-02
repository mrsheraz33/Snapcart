import type { Metadata } from "next";
import "./globals.css";
import Provider from "@/Provider";
import StoreProvider from "@/redux/StoreProvider";
import User from "@/User";




export const metadata: Metadata = {
  title: "Snapcart | 10 minutes grocery Delivery app",
  description: "10 minutes grocery Delivery app", 
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en">
      <body className="w-full min-h-[200vh] bg-linear-to-b from-green-50 to-white">
       <Provider>
        <StoreProvider>
          <User/>
        {children}
        </StoreProvider>
        </Provider>

        </body>
    </html>
  );
}

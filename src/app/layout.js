import { Inter } from "next/font/google";
import "./globals.css";

import Profile from "../../src/config/Profile.json";

const { Username } = Profile;
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: Username + "'s Portfolio",
  description: "Roblox Portfolio made with 💖 by CoIorEvent8",
};

export default function RootLayout({ children }) {
  return (
    <>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </>
  );
}

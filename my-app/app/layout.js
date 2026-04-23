import { Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../lib/context/AuthContext";
import { RoomProvider } from "../lib/context/RoomContext";
import { BookingProvider } from "../lib/context/BookingContext";
import { RoomKeyProvider } from "../lib/context/RoomKeyContext";
import { HousekeepingProvider } from "../lib/context/HousekeepingContext";
import { NotificationProvider } from "../lib/context/NotificationContext";
import { StaffProvider } from "../lib/context/StaffContext";
import { InvoiceProvider } from "../lib/context/InvoiceContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "Hotel Management System",
  description: "Complete hotel management solution",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <RoomProvider>
            <BookingProvider>
              <RoomKeyProvider>
                <HousekeepingProvider>
                  <NotificationProvider>
                    <StaffProvider>
                      <InvoiceProvider>
                        {children}
                      </InvoiceProvider>
                    </StaffProvider>
                  </NotificationProvider>
                </HousekeepingProvider>
              </RoomKeyProvider>
            </BookingProvider>
          </RoomProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

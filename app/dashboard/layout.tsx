import Header from "@/components/Header";
import { Toaster } from "@/components/ui/toaster";
import { ClerkLoaded } from "@clerk/nextjs";
import React from "react";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkLoaded>
      <div className="flex-1 flex flex-col h-screen">
        <Header />

        <main className="flex-1 overflow-auto bg-gray-100">
          <Toaster />
          {children}
        </main>
      </div>
    </ClerkLoaded>
  );
}

export default DashboardLayout;

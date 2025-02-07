"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";

interface AuthLayoutProps {
  children: React.ReactNode;
}
const AuthLayout = ({ children }: AuthLayoutProps) => {
  const pathname = usePathname();
  const isSignedIn = pathname === "/sign-in";

  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center">
          <Image src="/logo.svg" alt="logo" width={150} height={25} />
          <div className="flex items-center gap-2">
            <Button variant="secondary">
              <Link href={isSignedIn ? "/sign-up" : "/sign-in"}>
                {isSignedIn ? "Sign Up" : "Login"}
              </Link>
            </Button>
          </div>
        </nav>
        <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
          {children}
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;

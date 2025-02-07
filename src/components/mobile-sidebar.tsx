"use client";
import { MenuIcon } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { Sidebar } from "./sidebar";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export const MobileSidebar = () => {
  const [isOpened, setIsOpened] = useState(false);
  const pathName = usePathname();

  useEffect(() => {
    setIsOpened(false);
  }, [pathName]);

  return (
    <Sheet modal={false} open={isOpened} onOpenChange={setIsOpened}>
      <SheetTrigger asChild>
        <Button variant="secondary" className="lg:hidden">
          <MenuIcon className="size-4 text-neutral-500" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};

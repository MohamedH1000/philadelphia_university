import { Button } from "@/components/ui/button";
// import { auth, signOut } from '@/lib/auth';
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { getCurrentUser } from "@/lib/actions/user.action";
import SignOut from "./components/SignOut";
import { redirect } from "next/navigation";

export async function User() {
  const currentUser = await getCurrentUser();
  if (currentUser?.role.name !== "university") {
    redirect("/");
  }
  // let session = await auth();
  // let user = session?.user || "";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full"
        >
          {currentUser?.name.slice(0, 2)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>حسابي</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>الاعدادات</DropdownMenuItem>
        <DropdownMenuItem>الدعم</DropdownMenuItem>
        <DropdownMenuSeparator />
        {currentUser ? (
          <SignOut />
        ) : (
          <DropdownMenuItem>
            <Link href="/sign-in">تسجيل الدخول</Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import { UserButton } from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="flex w-full items-center justify-end py-4">
      <UserButton afterSignOutUrl="/" />
    </header>
  );
}

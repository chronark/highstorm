import Link from "next/link";
import { Logo } from "@/components/logo";

export const Header: React.FC = () => {
  return (
    <header className="absolute w-full z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="shrink-0 mr-4">
            <Logo className="stroke-zinc-300 w-8 h-8 hover:stroke-white duration-500" />
          </Link>

          {/* Desktop navigation */}
          <nav className="flex grow">
            {/* Desktop sign in links */}
            <ul className="flex grow justify-end flex-wrap items-center">
              <li>
                <Link
                  className="font-medium text-sm text-zinc-300 hover:text-white duration-500"
                  href="/overview"
                >
                  Sign in
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

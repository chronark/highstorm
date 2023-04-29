"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

type Props = {
  channelName: string;
};

export const Navbar: React.FC<Props> = ({ channelName }) => {
  const items = [
    { name: "Analytics", href: `/channels/${channelName}` },
    { name: "Reports", href: `/channels/${channelName}/reports` },
    { name: "Webhooks", href: `/channels/${channelName}/webhooks` },
  ];

  return (
    <NavigationMenu className="border-b border-white/10 px-4 h-16 flex justify-start">
      <NavigationMenuList>
        {items.map((item) => (
          <NavigationMenuItem>
            <Link href={item.href} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                {item.name}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

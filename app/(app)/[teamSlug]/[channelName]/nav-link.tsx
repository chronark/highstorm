'use client';

import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import { PropsWithChildren } from "react";

type Props = {
    href: string
    segment: string | null
    className?: string

}

export const NavLink: React.FC<PropsWithChildren<Props>> = ({
    href,
    segment,
    children,
    className
}) => {
    
    const isActive = segment === useSelectedLayoutSegment();

    return (
        <Link
            href={href}
        >
            <Button
                variant={isActive ? "default" : "outline"}
                size="sm"
                className={className}
            >
                {children}
            </Button>
        </Link>
    );
}
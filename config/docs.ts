import { MainNavItem, SidebarNavItem } from "types/nav"

interface DocsConfig {
    mainNav: MainNavItem[]
    sidebarNav: SidebarNavItem[]
}

export const docsConfig: DocsConfig = {
    mainNav: [
        {
            title: "Documentation",
            href: "/docs",
        },
        {
            title: "GitHub",
            href: "https://github.com/chronark/highstorm",
            external: true,
        },
        {
            title: "Twitter",
            href: "https://twitter.com/chronark_",
            external: true,
        },
    ],
    sidebarNav: [
        {
            title: "Getting Started",
            items: [
                {
                    title: "Introduction",
                    href: "/docs",
                    items: [],
                },
                {
                    title: "Installation",
                    href: "/docs/installation",
                    items: [],
                },
                {
                    title: "Typography",
                    href: "/docs/primitives/typography",
                    items: [],
                },
            ],
        },

        {
            title: "API",
            items: [
                {
                    title: "Events",
                    href: "/docs/api/events",
                    items: [
                        {
                            title: "Ingest Event",
                            href: "/docs/api/events/#post",
                            label: "POST"
                        },
                        {
                            title: "Delete Event",
                            href: "/docs/api/events/delete",
                            label: "DELETE"
                        }
                    ],
                },

            ],
        },
    ],
}
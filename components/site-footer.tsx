import { siteConfig } from "@/config/site"
import { Icons } from "@/components/icons"

export function SiteFooter() {
  return (
    <footer className="container">
      <div className="flex flex-col items-center justify-between py-10 border-t  gap-4 border-t-neutral-200 dark:border-t-neutral-700 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center px-8 gap-4 md:flex-row md:gap-2 md:px-0">
          <Icons.logo className="w-6 h-6" />
          <p className="text-sm leading-loose text-center text-neutral-600 dark:text-neutral-400 md:text-left">
            Built by{" "}
            <a
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              shadcn
            </a>
            . The source code is available on{" "}
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  )
}

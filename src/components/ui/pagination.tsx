import * as React from "react"
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react"

import { cn } from "@/lib/utils"

const Pagination = ({
  className,
  ...props
}: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
)

const PaginationContent = ({
  className,
  ...props
}: React.ComponentProps<"ul">) => (
  <ul
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
)

const PaginationItem = ({
  className,
  ...props
}: React.ComponentProps<"li">) => (
  <li className={cn("", className)} {...props} />
)

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}: {
  isActive?: boolean
  size?: "default" | "sm" | "lg" | "icon"
} & React.ComponentProps<"a">) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      "flex h-9 w-9 items-center justify-center rounded-md border text-sm transition-colors",
      "hover:bg-accent hover:text-accent-foreground",
      {
        "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground": isActive,
        "bg-transparent": !isActive,
        "h-8 w-8": size === "sm",
        "h-10 w-10": size === "lg",
        "h-9 w-9": size === "icon",
      },
      className
    )}
    {...props}
  />
)

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<"a">) => (
  <a
    aria-label="Go to previous page"
    className={cn("flex h-9 w-9 items-center justify-center rounded-md border text-sm transition-colors hover:bg-accent hover:text-accent-foreground", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
  </a>
)

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<"a">) => (
  <a
    aria-label="Go to next page"
    className={cn("flex h-9 w-9 items-center justify-center rounded-md border text-sm transition-colors hover:bg-accent hover:text-accent-foreground", className)}
    {...props}
  >
    <ChevronRight className="h-4 w-4" />
  </a>
)

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}

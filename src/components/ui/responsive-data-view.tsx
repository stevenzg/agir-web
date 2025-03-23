"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table"
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export interface Column<T> {
  accessorKey: string
  header: string
  cell?: (value: unknown, row: T) => React.ReactNode
  enableSorting?: boolean
  enableFiltering?: boolean
}

export interface ResponsiveDataViewProps<T> {
  data: T[]
  columns: Column<T>[]
  caption?: string
  className?: string
  cardTitleKey?: string
  cardDescriptionKey?: string
  // Pagination props
  currentPage?: number
  pageSize?: number
  totalItems?: number
  onPageChange?: (page: number) => void
  // Loading state
  loading?: boolean
  // Custom card component
  cardComponent?: (item: T) => React.ReactElement
}

/**
 * Safely get object property value
 */
function getPropertyValue<T>(obj: T, key: string): unknown {
  return key in (obj as Record<string, unknown>)
    ? (obj as Record<string, unknown>)[key]
    : undefined
}

/**
 * Generates an array of page numbers for pagination
 */
function generatePagination(currentPage: number, totalPages: number): (number | 'ellipsis')[] {
  // For small number of pages, show all
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  // For current page near the start
  if (currentPage <= 3) {
    return [1, 2, 3, 4, 5, 'ellipsis', totalPages]
  }

  // For current page near the end
  if (currentPage >= totalPages - 2) {
    return [1, 'ellipsis', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  }

  // For current page in the middle
  return [
    1,
    'ellipsis',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    'ellipsis',
    totalPages
  ]
}

export function ResponsiveDataView<T>({
  data,
  columns,
  caption,
  className,
  cardTitleKey,
  cardDescriptionKey,
  currentPage = 1,
  pageSize = 10,
  totalItems = 0,
  onPageChange,
  loading = false,
  cardComponent,
}: ResponsiveDataViewProps<T>) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const pagination = generatePagination(currentPage, totalPages)

  // Show skeleton loader if loading
  if (loading) {
    return (
      <div className={cn("w-full space-y-4", className)}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border rounded-md p-4 animate-pulse">
            <div className="flex justify-between">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            </div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mt-3"></div>
            <div className="flex justify-between mt-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/5"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Desktop view - Table
  if (isDesktop) {
    return (
      <div className={cn("w-full", className)}>
        <Table>
          {caption && <TableCaption>{caption}</TableCaption>}
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.accessorKey}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-6">
                  No data to display
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column) => {
                    const value = getPropertyValue(row, column.accessorKey)
                    return (
                      <TableCell key={`${rowIndex}-${column.accessorKey}`}>
                        {column.cell
                          ? column.cell(value, row)
                          : value as React.ReactNode}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && onPageChange && (
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      e.preventDefault()
                      if (currentPage > 1) onPageChange(currentPage - 1)
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {pagination.map((page, i) => (
                  <PaginationItem key={i}>
                    {page === 'ellipsis' ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        href="#"
                        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                          e.preventDefault()
                          onPageChange(page as number)
                        }}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      e.preventDefault()
                      if (currentPage < totalPages) onPageChange(currentPage + 1)
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    )
  }

  // Mobile view - Card list
  return (
    <div className={cn("w-full space-y-4", className)}>
      {caption && <h2 className="text-lg font-semibold mb-2">{caption}</h2>}

      {data.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          No data to display
        </div>
      ) : (
        <>
          {data.map((row, rowIndex) => {
            // Use custom card component if provided
            if (cardComponent) {
              return cardComponent(row)
            }

            const titleValue = cardTitleKey
              ? getPropertyValue(row, cardTitleKey) as React.ReactNode
              : undefined
            const descriptionValue = cardDescriptionKey
              ? getPropertyValue(row, cardDescriptionKey) as React.ReactNode
              : undefined

            return (
              <Card key={rowIndex} className="overflow-hidden">
                {(cardTitleKey || cardDescriptionKey) && (
                  <CardHeader>
                    {cardTitleKey && titleValue && (
                      <CardTitle>{titleValue}</CardTitle>
                    )}
                    {cardDescriptionKey && descriptionValue && (
                      <CardDescription>{descriptionValue}</CardDescription>
                    )}
                  </CardHeader>
                )}
                <CardContent className="grid gap-2">
                  {columns.map((column) => {
                    const value = getPropertyValue(row, column.accessorKey)
                    return (
                      <div key={column.accessorKey} className="grid grid-cols-2 gap-2">
                        <div className="text-sm font-medium text-muted-foreground">
                          {column.header}
                        </div>
                        <div className="text-sm">
                          {column.cell
                            ? column.cell(value, row)
                            : value as React.ReactNode}
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            )
          })}

          {/* Pagination */}
          {totalPages > 1 && onPageChange && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      e.preventDefault()
                      if (currentPage > 1) onPageChange(currentPage - 1)
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {pagination.map((page, i) => (
                  <PaginationItem key={i}>
                    {page === 'ellipsis' ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        href="#"
                        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                          e.preventDefault()
                          onPageChange(page as number)
                        }}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      e.preventDefault()
                      if (currentPage < totalPages) onPageChange(currentPage + 1)
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  )
} 
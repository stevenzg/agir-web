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

export interface Column<T = Record<string, unknown>> {
  accessorKey: string
  header: string
  cell?: (value: any, row: T) => React.ReactNode
  enableSorting?: boolean
  enableFiltering?: boolean
}

export interface ResponsiveDataViewProps<T = Record<string, unknown>> {
  data: T[]
  columns: Column<T>[]
  caption?: string
  className?: string
  cardTitleKey?: string
  cardDescriptionKey?: string
}

export function ResponsiveDataView<T = Record<string, unknown>>({
  data,
  columns,
  caption,
  className,
  cardTitleKey,
  cardDescriptionKey,
}: ResponsiveDataViewProps<T>) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  // 桌面视图 - 表格
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
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column) => (
                  <TableCell key={`${rowIndex}-${column.accessorKey}`}>
                    {column.cell
                      ? column.cell((row as any)[column.accessorKey], row)
                      : (row as any)[column.accessorKey] as React.ReactNode}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  // 移动视图 - 卡片列表
  return (
    <div className={cn("w-full space-y-4", className)}>
      {caption && <h2 className="text-lg font-semibold mb-2">{caption}</h2>}
      {data.map((row, rowIndex) => (
        <Card key={rowIndex} className="overflow-hidden">
          {(cardTitleKey || cardDescriptionKey) && (
            <CardHeader>
              {cardTitleKey && (
                <CardTitle>{(row as any)[cardTitleKey] as React.ReactNode}</CardTitle>
              )}
              {cardDescriptionKey && (
                <CardDescription>{(row as any)[cardDescriptionKey] as React.ReactNode}</CardDescription>
              )}
            </CardHeader>
          )}
          <CardContent className="grid gap-2">
            {columns.map((column) => (
              <div key={column.accessorKey} className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium text-muted-foreground">
                  {column.header}
                </div>
                <div className="text-sm">
                  {column.cell
                    ? column.cell((row as any)[column.accessorKey], row)
                    : (row as any)[column.accessorKey] as React.ReactNode}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 
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
}

/**
 * 安全地获取对象属性值
 */
function getPropertyValue<T>(obj: T, key: string): unknown {
  return key in (obj as Record<string, unknown>)
    ? (obj as Record<string, unknown>)[key]
    : undefined
}

export function ResponsiveDataView<T>({
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
      {data.map((row, rowIndex) => {
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
    </div>
  )
} 
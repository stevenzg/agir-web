"use client"

import { useEffect, useState } from "react"

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    
    // 设置初始值
    setMatches(media.matches)
    
    // 监听媒体查询变化
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }
    
    // 添加事件监听
    media.addEventListener("change", listener)
    
    // 清理函数
    return () => {
      media.removeEventListener("change", listener)
    }
  }, [query])

  return matches
} 
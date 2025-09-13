"use client"

import { EnvironmentalIntelligence } from "@/components/environmental-intelligence"
import { useSearch } from "@/lib/SearchContext"

export default function EnvironmentalPage() {
  const { query } = useSearch() // ✅ read global search query

  return <EnvironmentalIntelligence searchQuery={query} /> // ✅ pass it down
}

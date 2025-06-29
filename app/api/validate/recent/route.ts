import { type NextRequest, NextResponse } from "next/server"
import { StudentService } from "@/lib/services/studentService"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const recentScans = await StudentService.getRecentScans(limit)
    return NextResponse.json({ recentScans })
  } catch (error) {
    console.error("Error fetching recent scans:", error)
    return NextResponse.json({ error: "Failed to fetch recent scans" }, { status: 500 })
  }
}

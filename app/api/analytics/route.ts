import { NextResponse } from "next/server"
import { StudentService } from "@/lib/services/studentService"

export async function GET() {
  try {
    const analytics = await StudentService.getAnalytics()
    return NextResponse.json({ analytics })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}

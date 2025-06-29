import { type NextRequest, NextResponse } from "next/server"
import { StudentService } from "@/lib/services/studentService"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const student = await StudentService.getStudentById(params.id)

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    return NextResponse.json({ student })
  } catch (error) {
    console.error("Error fetching student:", error)
    return NextResponse.json({ error: "Failed to fetch student" }, { status: 500 })
  }
}

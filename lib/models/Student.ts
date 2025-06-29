import type { ObjectId } from "mongodb"

export interface Student {
  _id?: ObjectId
  id: string
  name: string
  email: string
  phone: string
  college: string
  role: "participant" | "volunteer" | "organizer" | "judge" | "sponsor"
  registeredAt: Date
  validated: boolean
  validatedAt?: Date
  qrCodeData?: string
}

export interface CreateStudentData {
  name: string
  email: string
  phone: string
  college: string
  role: "participant" | "volunteer" | "organizer" | "judge" | "sponsor"
}

export interface ValidationScan {
  _id?: ObjectId
  studentId: string
  scannedAt: Date
  scannedBy?: string
  method: "qr" | "manual"
}

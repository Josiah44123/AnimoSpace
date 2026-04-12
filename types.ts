export type RoomStatus = 'free' | 'occupied' | 'reserved';

export interface Room {
  id: string;
  name: string;
  floor: number;
  capacity: number;
  // If manualOverride is set, it takes precedence over scheduled classes
  manualOverride: RoomStatus | null;
  // Helper property for UI, calculated based on override + schedule
  computedStatus?: RoomStatus;
  currentClass?: string | null;
}

export interface ClassSchedule {
  id: string;
  roomId: string;
  courseName: string;
  instructor: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  startTime: string; // "HH:MM" 24h format
  endTime: string; // "HH:MM" 24h format
}

export interface AuditLog {
  id: string;
  roomId: string;
  roomName: string;
  action: string; // e.g., "Changed status to Occupied"
  timestamp: Date;
  user: string; // "Admin"
}

export interface MaintenanceRequest {
  id: string;
  roomId: string;
  issueType: 'AC' | 'Electrical' | 'Plumbing' | 'Furniture' | 'Cleanliness' | 'Other';
  description: string;
  status: 'pending' | 'in-progress' | 'resolved';
  reportedAt: Date;
  reportedBy: string;
}

export interface LostItem {
  id: string;
  type: 'lost' | 'found';
  itemName: string;
  description: string;
  location: string;
  contactInfo: string;
  status: 'open' | 'resolved';
  date: Date;
}

export interface EnvironmentalData {
  roomId: string;
  temperature: number; // Celsius
  humidity: number; // Percentage
  co2Level: number; // ppm
  occupancyCount: number;
  timestamp: Date;
}

export type UserRole = 'user' | 'admin' | 'maintenance' | 'lab-officer' | 'sdfo';

export interface LabBooking {
  id: string;
  labType: 'Science Lab' | 'Computer Lab';
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g., "09:00 - 10:00"
  bookedBy: string; // User name or ID
  email: string; // Contact email
  purpose: string;
  status: 'pending' | 'confirmed' | 'rejected';
  requestDate: Date;
}

export interface FloorData {
  floorNumber: number;
  rooms: Room[];
}

// Equipment Management Types
export interface Equipment {
  id: string;
  name: string;
  quantity: number;
  category: 'Chemistry' | 'Physics' | 'Biology' | 'General' | 'Computing';
  condition: 'good' | 'damaged' | 'lost';
  lastCheckedBy?: string;
  lastCheckedDate?: Date;
}

export interface BorrowingSlip {
  id: string;
  studentId: string;
  studentName: string;
  equipmentId: string;
  equipmentName: string;
  quantity: number;
  borrowDate: Date;
  expectedReturnDate?: Date;
  actualReturnDate?: Date;
  status: 'borrowed' | 'returned' | 'pending-return' | 'damaged' | 'lost';
  damageReport?: string;
  borrowType: 'in-class' | 'multi-day' | 'out-of-class';
}

export interface EquipmentRequisition {
  id: string;
  submittedBy: string;
  professorEmail: string;
  sectionName: string;
  labDate: string;
  equipmentList: Array<{ equipmentId: string; equipmentName: string; quantityNeeded: number }>;
  status: 'pending' | 'approved' | 'rejected' | 'prepared';
  preparedBy?: string;
  submittedDate: Date;
  notes?: string;
}

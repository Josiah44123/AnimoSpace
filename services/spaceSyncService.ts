import { Room, ClassSchedule, RoomStatus, AuditLog, MaintenanceRequest, LostItem, EnvironmentalData, LabBooking, Equipment, BorrowingSlip, EquipmentRequisition } from '../types';
import { INITIAL_FLOORS, INITIAL_SCHEDULES } from './mockData';

// Simulating a backend store in memory
let floorsStore = JSON.parse(JSON.stringify(INITIAL_FLOORS));
let schedulesStore = JSON.parse(JSON.stringify(INITIAL_SCHEDULES));
let logsStore: AuditLog[] = [];
let maintenanceStore: MaintenanceRequest[] = [
    {
        id: '1',
        roomId: 'MB-204',
        issueType: 'AC',
        description: 'Air conditioning unit is leaking water.',
        status: 'pending',
        reportedAt: new Date(Date.now() - 10000000),
        reportedBy: 'Faculty'
    },
    {
        id: '2',
        roomId: 'MB-101',
        issueType: 'Furniture',
        description: 'Broken chair leg in the back row.',
        status: 'in-progress',
        reportedAt: new Date(Date.now() - 50000000),
        reportedBy: 'Student'
    }
];
let lostAndFoundStore: LostItem[] = [
  {
    id: '1',
    type: 'found',
    itemName: 'Blue Umbrella',
    description: 'Found under a chair near the back.',
    location: 'MB-102',
    contactInfo: 'Turned over to guard',
    status: 'open',
    date: new Date()
  },
  {
    id: '2',
    type: 'lost',
    itemName: 'Calculus Textbook',
    description: 'Hardcover, slightly worn.',
    location: '3rd Floor Hallway',
    contactInfo: 'student@dlsl.edu.ph',
    status: 'open',
    date: new Date(Date.now() - 86400000)
  }
];

let labBookingsStore: LabBooking[] = [
    {
        id: '1',
        labType: 'Computer Lab',
        date: new Date().toISOString().split('T')[0], // Today
        timeSlot: '10:00 - 11:00',
        bookedBy: 'John Doe',
        email: 'john.doe@dlsl.edu.ph',
        purpose: 'Research Project',
        status: 'confirmed',
        requestDate: new Date(Date.now() - 86400000)
    },
    {
        id: '2',
        labType: 'Science Lab',
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
        timeSlot: '14:00 - 15:00',
        bookedBy: 'Jane Smith',
        email: 'jane.smith@dlsl.edu.ph',
        purpose: 'Chemistry Experiment',
        status: 'pending',
        requestDate: new Date()
    }
];

// Equipment Management Stores
let equipmentStore: Equipment[] = [
    { id: '1', name: 'Beaker (500ml)', quantity: 20, category: 'Chemistry', condition: 'good' },
    { id: '2', name: 'Test Tubes', quantity: 100, category: 'Chemistry', condition: 'good' },
    { id: '3', name: 'Microscope', quantity: 5, category: 'Biology', condition: 'good' },
    { id: '4', name: 'Bunsen Burner', quantity: 8, category: 'Chemistry', condition: 'good' },
    { id: '5', name: 'Power Supply Unit', quantity: 12, category: 'Physics', condition: 'good' },
];

let borrowingSlipsStore: BorrowingSlip[] = [
    {
        id: '1',
        studentId: '2023001',
        studentName: 'Maria Santos',
        equipmentId: '1',
        equipmentName: 'Beaker (500ml)',
        quantity: 2,
        borrowDate: new Date(),
        expectedReturnDate: new Date(Date.now() + 86400000),
        status: 'borrowed',
        borrowType: 'in-class'
    }
];

let requisitionsStore: EquipmentRequisition[] = [
    {
        id: '1',
        submittedBy: 'Dr. Juan Dela Cruz',
        professorEmail: 'juan.delacruz@dlsl.edu.ph',
        sectionName: 'Chemistry 101 - Section A',
        labDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
        equipmentList: [
            { equipmentId: '1', equipmentName: 'Beaker (500ml)', quantityNeeded: 30 },
            { equipmentId: '4', equipmentName: 'Bunsen Burner', quantityNeeded: 8 }
        ],
        status: 'pending',
        submittedDate: new Date()
    }
];

// Helper to check if current time is within a slot
const isTimeInSlot = (currentTime: Date, start: string, end: string): boolean => {
  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  
  const [startH, startM] = start.split(':').map(Number);
  const startMinutes = startH * 60 + startM;
  
  const [endH, endM] = end.split(':').map(Number);
  const endMinutes = endH * 60 + endM;

  return currentMinutes >= startMinutes && currentMinutes < endMinutes;
};

export const getFloors = async () => {
  // Simulate network delay
  return new Promise<typeof floorsStore>((resolve) => {
    setTimeout(() => resolve([...floorsStore]), 300);
  });
};

export const getSchedulesByRoom = async (roomId: string) => {
  return new Promise<ClassSchedule[]>((resolve) => {
    const roomSchedules = schedulesStore.filter((s: ClassSchedule) => s.roomId === roomId);
    setTimeout(() => resolve(roomSchedules), 200);
  });
};

export const updateRoomOverride = async (roomId: string, status: RoomStatus | null, user: string) => {
  return new Promise<void>((resolve) => {
    floorsStore = floorsStore.map((floor: any) => ({
      ...floor,
      rooms: floor.rooms.map((room: Room) => {
        if (room.id === roomId) {
            // Log the change
            const log: AuditLog = {
                id: Date.now().toString(),
                roomId: room.id,
                roomName: room.name,
                action: status ? `Manual override set to ${status}` : 'Manual override cleared',
                timestamp: new Date(),
                user: user
            };
            logsStore.unshift(log); // Add to beginning
            return { ...room, manualOverride: status };
        }
        return room;
      })
    }));
    setTimeout(() => resolve(), 200);
  });
};

export const getAuditLogs = async () => {
    return new Promise<AuditLog[]>((resolve) => {
        setTimeout(() => resolve([...logsStore]), 200);
    });
}

// Maintenance Services
export const getMaintenanceRequests = async (roomId?: string) => {
  return new Promise<MaintenanceRequest[]>((resolve) => {
    const requests = roomId 
        ? maintenanceStore.filter(r => r.roomId === roomId)
        : maintenanceStore;
    setTimeout(() => resolve(requests), 200);
  });
};

export const reportMaintenanceIssue = async (request: Omit<MaintenanceRequest, 'id' | 'reportedAt' | 'status'>) => {
  return new Promise<void>((resolve) => {
    const newRequest: MaintenanceRequest = {
      ...request,
      id: Date.now().toString(),
      reportedAt: new Date(),
      status: 'pending'
    };
    maintenanceStore.unshift(newRequest);
    setTimeout(() => resolve(), 300);
  });
};

export const updateMaintenanceStatus = async (id: string, status: MaintenanceRequest['status']) => {
  return new Promise<void>((resolve) => {
    maintenanceStore = maintenanceStore.map(req => 
      req.id === id ? { ...req, status } : req
    );
    setTimeout(() => resolve(), 200);
  });
};

// Environmental Data Service (Mock)
export const getEnvironmentalData = async (roomId: string): Promise<EnvironmentalData> => {
    return new Promise((resolve) => {
        // Generate somewhat realistic random data based on room ID hash
        const hash = roomId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const baseTemp = 22 + (hash % 5); // 22-26 degrees
        const baseHumidity = 45 + (hash % 15); // 45-60%
        const baseCo2 = 400 + (hash % 400); // 400-800 ppm
        
        // Add some noise
        const noise = () => (Math.random() - 0.5) * 2;

        resolve({
            roomId,
            temperature: parseFloat((baseTemp + noise()).toFixed(1)),
            humidity: Math.round(baseHumidity + noise() * 5),
            co2Level: Math.round(baseCo2 + noise() * 50),
            occupancyCount: Math.round((hash % 30) * Math.random()), // 0-30 people
            timestamp: new Date()
        });
    });
}

// Email Simulation
export const sendEmailNotification = async (to: string, subject: string, body: string) => {
    return new Promise<void>((resolve) => {
        console.log(`[EMAIL SENT] To: ${to} | Subject: ${subject} | Body: ${body}`);
        setTimeout(() => resolve(), 500);
    });
};

export const checkSimilarItems = async (itemName: string, type: 'lost' | 'found'): Promise<LostItem[]> => {
    return new Promise<LostItem[]>((resolve) => {
        // Simple case-insensitive inclusion check
        const matches = lostAndFoundStore.filter(item => 
            item.type !== type && // Look for opposite type (Lost -> Found, Found -> Lost)
            (item.itemName.toLowerCase().includes(itemName.toLowerCase()) || 
             itemName.toLowerCase().includes(item.itemName.toLowerCase()))
        );
        setTimeout(() => resolve(matches), 300);
    });
};

// Lost & Found Services
export const getLostAndFoundItems = async () => {
  return new Promise<LostItem[]>((resolve) => {
    setTimeout(() => resolve([...lostAndFoundStore]), 300);
  });
};

export const reportLostItem = async (item: Omit<LostItem, 'id' | 'date' | 'status'>) => {
  return new Promise<void>((resolve) => {
    const newItem: LostItem = {
      ...item,
      id: Date.now().toString(),
      date: new Date(),
      status: 'open'
    };
    lostAndFoundStore.unshift(newItem);
    setTimeout(() => resolve(), 300);
  });
};

export const resolveLostItem = async (id: string) => {
    return new Promise<void>((resolve) => {
        lostAndFoundStore = lostAndFoundStore.map(item => 
            item.id === id ? { ...item, status: 'resolved' } : item
        );
        setTimeout(() => resolve(), 200);
    });
}

// Lab Booking Services
export const getLabBookings = async () => {
    return new Promise<LabBooking[]>((resolve) => {
        setTimeout(() => resolve([...labBookingsStore]), 200);
    });
};

export const createLabBooking = async (booking: Omit<LabBooking, 'id' | 'status' | 'requestDate'>) => {
    return new Promise<void>((resolve) => {
        const newBooking: LabBooking = {
            ...booking,
            id: Date.now().toString(),
            status: 'pending',
            requestDate: new Date()
        };
        labBookingsStore.unshift(newBooking);
        setTimeout(() => resolve(), 300);
    });
};

export const updateLabBookingStatus = async (id: string, status: LabBooking['status']) => {
    return new Promise<void>((resolve) => {
        labBookingsStore = labBookingsStore.map(booking => 
            booking.id === id ? { ...booking, status } : booking
        );
        setTimeout(() => resolve(), 200);
    });
};

// The core logic to merge schedule + manual override
export const calculateRoomStatus = (room: Room, schedules: ClassSchedule[]): Room => {
  const now = new Date();
  const currentDay = now.getDay(); // 0-6

  // 1. Check Manual Override first
  if (room.manualOverride) {
    return {
      ...room,
      computedStatus: room.manualOverride,
      currentClass: room.manualOverride === 'occupied' ? 'Manual Override' : null
    };
  }

  // 2. Check Schedule
  const activeClass = schedules.find(s => 
    s.roomId === room.id && 
    s.dayOfWeek === currentDay && 
    isTimeInSlot(now, s.startTime, s.endTime)
  );

  if (activeClass) {
    return {
      ...room,
      computedStatus: 'occupied',
      currentClass: activeClass.courseName
    };
  }

  // 3. Default Free
  return {
    ...room,
    computedStatus: 'free',
    currentClass: null
  };
};

// ==================== EQUIPMENT MANAGEMENT ====================

// Get all equipment
export const getEquipment = async (): Promise<Equipment[]> => {
    return new Promise<Equipment[]>((resolve) => {
        setTimeout(() => resolve([...equipmentStore]), 200);
    });
};

// Get borrowing slips (all or filtered by student)
export const getBorrowingSlips = async (studentId?: string): Promise<BorrowingSlip[]> => {
    return new Promise<BorrowingSlip[]>((resolve) => {
        const slips = studentId 
            ? borrowingSlipsStore.filter(s => s.studentId === studentId)
            : borrowingSlipsStore;
        setTimeout(() => resolve([...slips]), 200);
    });
};

// Create a new borrowing slip (in-class borrowing)
export const createBorrowingSlip = async (slip: Omit<BorrowingSlip, 'id'>) => {
    return new Promise<void>((resolve) => {
        const newSlip: BorrowingSlip = {
            ...slip,
            id: Date.now().toString()
        };
        borrowingSlipsStore.unshift(newSlip);
        setTimeout(() => resolve(), 200);
    });
};

// Update borrowing slip status (return, damage, etc)
export const updateBorrowingSlipStatus = async (id: string, status: BorrowingSlip['status'], damageReport?: string) => {
    return new Promise<void>((resolve) => {
        borrowingSlipsStore = borrowingSlipsStore.map(slip =>
            slip.id === id 
                ? { ...slip, status, actualReturnDate: status === 'returned' ? new Date() : slip.actualReturnDate, damageReport }
                : slip
        );
        setTimeout(() => resolve(), 200);
    });
};

// Submit equipment requisition (advance requisition for experiments)
export const submitEquipmentRequisition = async (req: Omit<EquipmentRequisition, 'id' | 'submittedDate'>) => {
    return new Promise<void>((resolve) => {
        const newReq: EquipmentRequisition = {
            ...req,
            id: Date.now().toString(),
            submittedDate: new Date()
        };
        requisitionsStore.unshift(newReq);
        setTimeout(() => resolve(), 200);
    });
};

// Get pending requisitions
export const getEquipmentRequisitions = async (status?: EquipmentRequisition['status']): Promise<EquipmentRequisition[]> => {
    return new Promise<EquipmentRequisition[]>((resolve) => {
        const reqs = status 
            ? requisitionsStore.filter(r => r.status === status)
            : requisitionsStore;
        setTimeout(() => resolve([...reqs]), 200);
    });
};

// Update requisition status (approve, prepare, etc)
export const updateRequisitionStatus = async (id: string, status: EquipmentRequisition['status'], preparedBy?: string) => {
    return new Promise<void>((resolve) => {
        requisitionsStore = requisitionsStore.map(req =>
            req.id === id 
                ? { ...req, status, preparedBy: status === 'prepared' ? preparedBy : req.preparedBy }
                : req
        );
        setTimeout(() => resolve(), 200);
    });
};

// Check pending returns (equipment that should be returned)
export const getPendingReturns = async (): Promise<BorrowingSlip[]> => {
    return new Promise<BorrowingSlip[]>((resolve) => {
        const pending = borrowingSlipsStore.filter(s => s.status === 'pending-return' || s.status === 'borrowed');
        setTimeout(() => resolve([...pending]), 200);
    });
};

// Get damaged/lost items for accountability
export const getDamagedOrLostEquipment = async (): Promise<BorrowingSlip[]> => {
    return new Promise<BorrowingSlip[]>((resolve) => {
        const items = borrowingSlipsStore.filter(s => s.status === 'damaged' || s.status === 'lost');
        setTimeout(() => resolve([...items]), 200);
    });
};

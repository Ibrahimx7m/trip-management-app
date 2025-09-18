import { NextRequest, NextResponse } from 'next/server';
import type { Vehicle, VehicleFormData } from '@/types/vehicle';

// Mock data store
let vehicles: Vehicle[] = [
  {
    id: '1',
    plateNumber: 'ABC-1234',
    vehicleType: 'Truck',
    model: 'Toyota Hiace',
    year: 2022,
    status: 'Available',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z',
  },
  {
    id: '2',
    plateNumber: 'XYZ-5678',
    vehicleType: 'Car',
    model: 'Honda Civic',
    year: 2021,
    status: 'Maintenance',
    createdAt: '2024-01-10T10:30:00Z',
    updatedAt: '2024-01-16T14:20:00Z',
  },
  {
    id: '3',
    plateNumber: 'DEF-9012',
    vehicleType: 'Bus',
    model: 'Mercedes Sprinter',
    year: 2023,
    status: 'Available',
    createdAt: '2024-01-12T12:15:00Z',
    updatedAt: '2024-01-12T12:15:00Z',
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const plateNumber = searchParams.get('plateNumber');
    const status = searchParams.get('status');
    const vehicleType = searchParams.get('vehicleType');

    let filteredVehicles = [...vehicles];

    // Apply filters
    if (plateNumber) {
      filteredVehicles = filteredVehicles.filter(v => 
        v.plateNumber.toLowerCase().includes(plateNumber.toLowerCase())
      );
    }
    if (status) {
      filteredVehicles = filteredVehicles.filter(v => v.status === status);
    }
    if (vehicleType) {
      filteredVehicles = filteredVehicles.filter(v => v.vehicleType === vehicleType);
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedVehicles = filteredVehicles.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedVehicles,
      total: filteredVehicles.length,
      page,
      limit,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch vehicles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: VehicleFormData = await request.json();
    
    // Validate required fields
    if (!data.plateNumber || !data.vehicleType || !data.model || !data.year || !data.status) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if plate number already exists
    const existingVehicle = vehicles.find(v => v.plateNumber === data.plateNumber);
    if (existingVehicle) {
      return NextResponse.json(
        { success: false, message: 'Vehicle with this plate number already exists' },
        { status: 400 }
      );
    }

    const newVehicle: Vehicle = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    vehicles.push(newVehicle);

    return NextResponse.json({
      success: true,
      data: newVehicle,
      message: 'Vehicle created successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to create vehicle' },
      { status: 500 }
    );
  }
}

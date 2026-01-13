import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CV from '@/models/CV';

// GET all CVs or a specific CV by ID
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const userId = searchParams.get('userId');

        if (id) {
            const cv = await CV.findById(id);
            if (!cv) {
                return NextResponse.json(
                    { success: false, error: 'CV not found' },
                    { status: 404 }
                );
            }
            return NextResponse.json({ success: true, data: cv }, { status: 200 });
        }

        if (userId) {
            const cvs = await CV.find({ userId }).sort({ createdAt: -1 });
            return NextResponse.json({ success: true, data: cvs }, { status: 200 });
        }

        const cvs = await CV.find().sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: cvs }, { status: 200 });
    } catch (error) {
        console.error('Error fetching CVs:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch CVs' },
            { status: 500 }
        );
    }
}

// POST - Create a new CV
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();

        // Validate required fields
        if (!body.personalInfo || !body.personalInfo.fullName || !body.personalInfo.email) {
            return NextResponse.json(
                { success: false, error: 'Personal information (name and email) is required' },
                { status: 400 }
            );
        }

        const cv = await CV.create(body);

        return NextResponse.json(
            { success: true, data: cv, message: 'CV created successfully' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating CV:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create CV' },
            { status: 500 }
        );
    }
}

// PUT - Update an existing CV
export async function PUT(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'CV ID is required' },
                { status: 400 }
            );
        }

        const body = await request.json();

        const cv = await CV.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!cv) {
            return NextResponse.json(
                { success: false, error: 'CV not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, data: cv, message: 'CV updated successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating CV:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update CV' },
            { status: 500 }
        );
    }
}

// DELETE - Delete a CV
export async function DELETE(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'CV ID is required' },
                { status: 400 }
            );
        }

        const cv = await CV.findByIdAndDelete(id);

        if (!cv) {
            return NextResponse.json(
                { success: false, error: 'CV not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: 'CV deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting CV:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete CV' },
            { status: 500 }
        );
    }
}

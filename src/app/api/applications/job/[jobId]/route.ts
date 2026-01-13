import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Application from '@/models/Application';

export async function GET(request: NextRequest, { params }: { params: { jobId: string } }) {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const statusFilter = searchParams.get('status');
    
    try {
        let query: any = { jobId: params.jobId };
        
        if (statusFilter && statusFilter !== 'all') {
            query.status = statusFilter;
        }
        
        const skip = (page - 1) * limit;
        const totalApplications = await Application.countDocuments(query);
        
        // Exclude heavy fields for list views
        const applications = await Application.find(query)
            .select('-resumeData -atsAnalysis')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();
            
        return NextResponse.json({
            success: true,
            data: applications,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalApplications / limit),
                totalApplications: totalApplications,
                limit: limit,
            },
        });
    } catch (error) {
        const err = error as Error;
        return NextResponse.json({ success: false, error: err.message }, { status: 400 });
    }
}
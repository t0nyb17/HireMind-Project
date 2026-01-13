import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Application from '@/models/Application';
import Job from '@/models/Job';
import { sendApplicationStatusEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
    await dbConnect();
    try {
        const { jobId } = await request.json();

        if (!jobId) {
            return NextResponse.json({ success: false, error: 'Job ID is required' }, { status: 400 });
        }

        const applicationsToUpdate = await Application.find({ jobId: jobId, status: 'Approved' }).populate('jobId', 'title company');

        if (applicationsToUpdate.length > 0) {
            const applicationIds = applicationsToUpdate.map(app => app._id);
            
            // Bulk update applications
            await Application.updateMany(
                { _id: { $in: applicationIds } },
                { $set: { status: 'Interviewing' } }
            );

            // Send email notifications for each updated application
            for (const app of applicationsToUpdate) {
                let job = app.jobId as any;
                
                // If jobId is not populated or is just an ObjectId, fetch it separately
                if (!job || (typeof job === 'object' && !job.title && !job.company)) {
                    const jobId = typeof job === 'object' && job._id ? job._id : app.jobId;
                    if (jobId) {
                        const fetchedJob = await Job.findById(jobId).select('title company').lean();
                        if (fetchedJob) {
                            job = fetchedJob;
                        }
                    }
                }
                
                const jobTitle = job?.title || 'the position';
                const companyName = job?.company || 'the company';
                
                if (job && (job.title || job.company)) {
                    await sendApplicationStatusEmail({
                        to: app.candidateEmail,
                        jobTitle: jobTitle,
                        companyName: companyName,
                        candidateName: app.candidateName || 'Candidate',
                        status: 'approved'
                    }).catch(error => {
                        console.error(`Failed to send email to ${app.candidateEmail}:`, error);
                    });
                } else {
                    console.error('Missing job details for application:', { 
                        applicationId: app._id, 
                        jobId: app.jobId,
                        job,
                        jobIdType: typeof app.jobId
                    });
                }
            }
        }

        return NextResponse.json({ success: true, message: 'All approved candidates moved to interviewing stage.' });
    } catch (error) {
        const err = error as Error;
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
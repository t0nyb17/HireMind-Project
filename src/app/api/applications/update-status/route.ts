// import { Resend } from 'resend';

// const resend = new Resend(process.env.RESEND_API_KEY);

// interface EmailOptions {
//   to: string;
//   jobTitle: string;
//   companyName: string;
//   candidateName: string;
//   status?: 'approved' | 'selected' | 'rejected';
// }

// function getEmailTemplate({
//   candidateName,
//   jobTitle,
//   companyName,
//   status
// }: Omit<EmailOptions, 'to'>) {
//   const templates = {
//     approved: `
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <style>
//             body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//             .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//             .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
//             .content { padding: 20px; }
//             .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
//           </style>
//         </head>
//         <body>
//           <div class="container">
//             <div class="header">
//               <h2>Interview Invitation</h2>
//             </div>
//             <div class="content">
//               <p>Dear ${candidateName},</p>
//               <p>We are pleased to inform you that your application for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong> has been approved for the next stage.</p>
//               <p>Our hiring team will contact you shortly with the interview details including:</p>
//               <ul>
//                 <li>Interview date and time</li>
//                 <li>Interview format (in-person/virtual)</li>
//                 <li>Any preparation materials or requirements</li>
//               </ul>
//               <p>Please ensure your contact information is up to date in your profile.</p>
//               <p>Best regards,<br/>${companyName} Hiring Team</p>
//             </div>
//             <div class="footer">
//               <p>This is an automated message from Hiremind. Please do not reply to this email.</p>
//             </div>
//           </div>
//         </body>
//       </html>
//     `,
//     selected: `
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <style>
//             body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//             .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//             .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
//             .content { padding: 20px; }
//             .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
//           </style>
//         </head>
//         <body>
//           <div class="container">
//             <div class="header">
//               <h2>🎉 Congratulations!</h2>
//             </div>
//             <div class="content">
//               <p>Dear ${candidateName},</p>
//               <p>We are delighted to inform you that you have been selected for the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong>!</p>
//               <p>This is a testament to your skills, experience, and the great impression you made during the interview process.</p>
//               <p>Our HR team will be reaching out to you shortly with:</p>
//               <ul>
//                 <li>Official offer letter</li>
//                 <li>Compensation details</li>
//                 <li>Next steps for onboarding</li>
//               </ul>
//               <p>Once again, congratulations on your selection!</p>
//               <p>Best regards,<br/>${companyName} Hiring Team</p>
//             </div>
//             <div class="footer">
//               <p>This is an automated message from Hiremind. Please do not reply to this email.</p>
//             </div>
//           </div>
//         </body>
//       </html>
//     `,
//     rejected: `
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <style>
//             body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//             .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//             .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
//             .content { padding: 20px; }
//             .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
//           </style>
//         </head>
//         <body>
//           <div class="container">
//             <div class="header">
//               <h2>Application Status Update</h2>
//             </div>
//             <div class="content">
//               <p>Dear ${candidateName},</p>
//               <p>Thank you for your interest in the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong> and for taking the time to participate in our selection process.</p>
//               <p>After careful consideration of your application and the requirements of the role, we regret to inform you that we have decided to move forward with other candidates whose qualifications more closely match our current needs.</p>
//               <p>We encourage you to:</p>
//               <ul>
//                 <li>Continue exploring other opportunities on our platform</li>
//                 <li>Update your profile with new skills and experiences</li>
//                 <li>Set up job alerts for similar positions</li>
//               </ul>
//               <p>We wish you the best in your job search and future endeavors.</p>
//               <p>Best regards,<br/>${companyName} Hiring Team</p>
//             </div>
//             <div class="footer">
//               <p>This is an automated message from Hiremind. Please do not reply to this email.</p>
//             </div>
//           </div>
//         </body>
//       </html>
//     `
//   };

//   return templates[status || 'approved'];
// }

// export async function sendApplicationStatusEmail({
//   to,
//   jobTitle,
//   companyName,
//   candidateName,
//   status = 'approved'
// }: EmailOptions) {
//   const subjects = {
//     approved: `Interview Invitation: ${jobTitle} at ${companyName}`,
//     selected: `Congratulations! You've been selected for ${jobTitle} at ${companyName}`,
//     rejected: `Update on your application for ${jobTitle} at ${companyName}`
//   };

//   try {
//     const data = await resend.emails.send({
//       from: 'Hiremind <notifications@resend.dev>',
//       to: [to],
//       subject: subjects[status],
//       html: getEmailTemplate({ candidateName, jobTitle, companyName, status }),
//     });

//     console.log('Email sent successfully:', data);
//     return { success: true, data };
//   } catch (error) {
//     console.error('Failed to send email:', error);
//     return { success: false, error };
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Application from '@/models/Application';
import Job from '@/models/Job';
import { sendApplicationStatusEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
    await dbConnect();
    try {
        const { applicationId, status } = await request.json();

        if (!applicationId || !status) {
            return NextResponse.json({ success: false, error: 'Application ID and status are required' }, { status: 400 });
        }

        const application = await Application.findById(applicationId).populate('jobId', 'title company');

        if (!application) {
            return NextResponse.json({ success: false, error: 'Application not found' }, { status: 404 });
        }

        // Update application status
        application.status = status;
        await application.save();

        // Send email notification based on status
        let emailSent = false;
        let emailError: any = null;
        if (['Approved', 'Selected', 'Rejected'].includes(status)) {
            const emailStatus = status === 'Selected' ? 'selected' : 
                              status === 'Rejected' ? 'rejected' : 'approved';
            
            let job = application.jobId as any;
            
            // If jobId is not populated or is just an ObjectId, fetch it separately
            if (!job || (typeof job === 'object' && !job.title && !job.company)) {
                const jobId = typeof job === 'object' && job._id ? job._id : application.jobId;
                if (jobId) {
                    const fetchedJob = await Job.findById(jobId).select('title company').lean();
                    if (fetchedJob) {
                        job = fetchedJob;
                    }
                }
            }
            
            // Get job details with fallbacks
            const jobTitle = job?.title || 'the position';
            const companyName = job?.company || 'the company';
            
            if (!job || (!job.title && !job.company)) {
                console.error('Missing job details:', { 
                    job, 
                    applicationId, 
                    jobId: application.jobId,
                    jobIdType: typeof application.jobId 
                });
                emailError = 'Missing required job details for email notification';
            } else {
                const emailResult = await sendApplicationStatusEmail({
                    to: application.candidateEmail,
                    jobTitle: jobTitle,
                    companyName: companyName,
                    candidateName: application.candidateName || 'Candidate',
                    status: emailStatus as 'approved' | 'selected' | 'rejected'
                });
                if (emailResult && emailResult.success) {
                    emailSent = true;
                } else {
                    emailError = emailResult?.error || 'unknown error';
                    console.error('Failed to send email notification:', emailError);
                }
            }
        }

        // Return updated application with populated jobId
        const updatedApplication = await Application.findById(applicationId).populate('jobId');

        let message = 'Status updated successfully';
        if (['Approved', 'Selected', 'Rejected'].includes(status)) {
            message = emailSent
                ? 'Status updated successfully and email notification sent'
                : 'Status updated successfully but email notification failed (see emailError)';
        }

        return NextResponse.json({ 
            success: true, 
            data: updatedApplication, 
            message,
            emailSent,
            emailError
        });
    } catch (error) {
        console.error('Error updating application status:', error);
        const err = error as Error;
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
import { Query } from 'node-appwrite';
import { DATABASE_ID, databases, DOCTOR_COLLECTION_ID, PATIENT_COLLECTION_ID } from './appwrite.config';
import { sendEmail } from './mailgun';   

// Function to get daily patient stats for a specific doctor
async function getDailyPatientStatsForDoctor(doctorId: string) {
    const now = new Date(); // Get the current time in local timezone
    const startOfDay = new Date(now.setHours(0, 0, 0, 0)).toISOString(); // Start of today
    const endOfDay = new Date(now.setHours(23, 59, 59, 999)).toISOString(); // End of today

    // Fetch patients seen today
    const patientsToday = await databases.listDocuments(DATABASE_ID!, PATIENT_COLLECTION_ID!, [
        Query.equal('doctorId', doctorId),
        Query.between('addedAt', startOfDay, endOfDay),
    ]);

    const totalPatients = patientsToday.total;

    // Prepare patient details for the summary
    const reasons = patientsToday.documents.map((patient: any) => patient.reason);
    const commonReason = reasons.reduce((acc: string, reason: string, _, arr: string[]) =>
        arr.filter((r) => r === reason).length > arr.filter((r) => r === acc).length ? reason : acc,
        ''
    );

    const hours = patientsToday.documents.map((patient: any) => new Date(patient.addedAt).getHours());
    const peakHour = hours.reduce((acc: number, hour: number, _, arr: number[]) =>
        arr.filter((h) => h === hour).length > arr.filter((h) => h === acc).length ? hour : acc,
        -1
    );

    const followUpVisits = patientsToday.documents.filter((patient: any) => patient.notes && patient.notes.includes('Follow-up')).length;

    // Calculate total male and female patients
    const genderCount = patientsToday.documents.reduce((acc: { male: number; female: number }, patient: any) => {
        if (patient.gender === 'Male') acc.male++;
        if (patient.gender === 'Female') acc.female++;
        return acc;
    }, { male: 0, female: 0 });

    return { totalPatients, commonReason, peakHour, followUpVisits, genderCount };
}

// Function to send daily report to all doctors
export async function sendDailyReport() {
    try {
        // Fetch all doctors
        const doctors = await databases.listDocuments(DATABASE_ID!, DOCTOR_COLLECTION_ID!);

        // Loop through each doctor and send a personalized report
        const emailPromises = doctors.documents.map(async (doctor: any) => {
            // Get stats for this doctor
            const { totalPatients, commonReason, peakHour, followUpVisits, genderCount } = await getDailyPatientStatsForDoctor(doctor.doctorId);

            // Prepare the summary email body with HTML
            const emailBody = `
                <html>
                <body>
                    <h2 style="color: #000FFFF;">Hello Dr. ${doctor.doctorName},</h2>
                    <p>Here is the summary report for your patients today:</p>
                    <table style="border-collapse: collapse; width: 100%;">
                        <tr style="background-color: #f2f2f2;">
                            <th style="border: 1px solid #ddd; padding: 8px;">Total Patients</th>
                            <th style="border: 1px solid #ddd; padding: 8px;">Common Reason for Visit</th>
                            <th style="border: 1px solid #ddd; padding: 8px;">Peak Hour</th>
                            <th style="border: 1px solid #ddd; padding: 8px;">Follow-Up Visits</th>
                            <th style="border: 1px solid #ddd; padding: 8px;">Total Male Patients</th>
                            <th style="border: 1px solid #ddd; padding: 8px;">Total Female Patients</th>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 8px;">${totalPatients}</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">${commonReason}</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">${peakHour}:00</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">${followUpVisits}</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">${genderCount.male}</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">${genderCount.female}</td>
                        </tr>
                    </table>
                    <p>Thank you,<br/> doctorsClub Team</p>
                </body>
                </html>
            `;

            // Send the email
            await sendEmail(doctor.email, `Daily Summary Report`, emailBody,{ attachments: [] });  
        });

        // Await all email promises to complete  
        await Promise.all(emailPromises);

        console.log('Emails sent successfully');
    } catch (error) {
        console.error('Error sending daily reports:', error);
    }
}   
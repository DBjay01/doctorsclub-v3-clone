import fetch from 'node-fetch';

export async function sendEmail(to: string, subject: string, text: string, p0: { attachments: { filename: string; content: any; cid: string; }[]; }) {
    const apiKey = process.env.MAILGUN_API_KEY;
    const domain = 'bydoctorsclub.com';  

    if (!apiKey) {
        throw new Error("Mailgun API key is not set.");
    }

    const emailDetails = new URLSearchParams();   
    emailDetails.append('from', 'doctorsClub <notify@bydoctorsclub.com>');  
    emailDetails.append("to", to);      
    emailDetails.append('subject', subject);
    emailDetails.append('text', text);    
    emailDetails.append('html', text); // Adding HTML content

    try {
        const response = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
            method: 'POST',
            headers: {
                Authorization: `Basic ${Buffer.from(`api:${apiKey}`).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: emailDetails.toString(),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error sending email:', errorData);
            throw new Error('Failed to send email');
        }

        const data = await response.json();
        console.log('Email sent successfully');
        return data;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}


////// Final and working code :) 
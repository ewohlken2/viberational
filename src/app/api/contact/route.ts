import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from 'next/server';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function POST(request: NextRequest) {
  if (request.method !== "POST") {
    return NextResponse.json({ status: 405, message: "Method Not Allowed" });
  }

  const data: ContactFormData = await request.json();

  const { name, email, subject, message } = data;

  if (!name || !email || !message || !subject) {
    return NextResponse.json({ status: 400, message: "Missing required fields" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_TO, // your email
      subject: `New Contact Form Submission from ${name}`,
      text: message,
      html: `
        <h2>New Submission from the Contact Form on your portfolio!</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>

        <p><strong>Message:</strong></p>
    
        <p>${message}</p>
      `,
    });

    return NextResponse.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ status: 500, message: "Error sending email", error });
  }
}

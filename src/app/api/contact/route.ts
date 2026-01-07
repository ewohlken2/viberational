import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from 'next/server';

const { RecaptchaEnterpriseServiceClient } = require('@google-cloud/recaptcha-enterprise');

interface AssessmentRequest {
  assessment: {
    event: {
      token: string;
      siteKey: string;
    };
  };
  parent: string;
}

/**
  * Create an assessment to analyze the risk of a UI action.
  *
  * projectID: Your Google Cloud Project ID.
  * recaptchaSiteKey: The reCAPTCHA key associated with the site/app
  * token: The generated token obtained from the client.
  * recaptchaAction: Action name corresponding to the token.
  */
async function createAssessment(): Promise<number | null> {
  // TODO: Replace the token and reCAPTCHA action variables before running the sample.
  const projectID = "api-project-701451519161";
  const recaptchaKey = "6LfzK9srAAAAALfi8uXVylKcG9lzDWL4Mv1FyxG2";
  const token = "action-token";
  const recaptchaAction = "verify-captcha";
  // Create the reCAPTCHA client.
  // TODO: Cache the client generation code (recommended) or call client.close() before exiting the method.
  const client = new RecaptchaEnterpriseServiceClient();
  const projectPath = client.projectPath(projectID);

  // Build the assessment request.
  const request: AssessmentRequest = {
    assessment: {
      event: {
        token: token,
        siteKey: recaptchaKey,
      },
    },
    parent: projectPath,
  };

  const [response] = await client.createAssessment(request);

  // Check if the token is valid.
  if (!response.tokenProperties.valid) {
    console.log(`The CreateAssessment call failed because the token was: ${response.tokenProperties.invalidReason}`);
    return null;
  }

  // Check if the expected action was executed.
  // The `action` property is set by user client in the grecaptcha.enterprise.execute() method.
  if (response.tokenProperties.action === recaptchaAction) {
    // Get the risk score and the reason(s).
    // For more information on interpreting the assessment, see:
    // https://cloud.google.com/recaptcha-enterprise/docs/interpret-assessment
    console.log(`The reCAPTCHA score is: ${response.riskAnalysis.score}`);
    response.riskAnalysis.reasons.forEach((reason: unknown) => {
      console.log(reason);
    });

    return response.riskAnalysis.score;
  } else {
    console.log("The action attribute in your reCAPTCHA tag does not match the action you are expecting to score");
    return null;
  }
}

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  captcha: string;
}

export async function POST(request: NextRequest) {
  if (request.method !== "POST") {
    return NextResponse.json({ status: 405, message: "Method Not Allowed" });
  }

  const data: ContactFormData = await request.json();

  const { name, email, subject, message, captcha } = data;

  if (!name || !email || !message || !subject || !captcha) {
    return NextResponse.json({ status: 400, message: "Missing required fields" });
  }

  // validate captcha with Google
  const secretKey = process.env.NEXT_SECRET_RECAPTCHA_SITE_KEY;
  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}`;

  const result = await fetch(verifyUrl, { method: 'POST' }).then(res => res.json());
  if (!result.success) {
    return NextResponse.json({ status: 400, message: "Captcha verification failed" });
  }

  // assess if this request is dangerous/botted
  const score = await createAssessment();

  if (score === null || score < 0.5) { // threshold can be adjusted
    return NextResponse.json({ status: 400, message: "Captcha assessment failed" });
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

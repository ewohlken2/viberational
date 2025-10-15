'use client';

import "./contact.css";


import ReCAPTCHA from "react-google-recaptcha";


import React, { useState } from 'react';
import Button from '../button';

function ContactForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [captcha, setCaptcha] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const isValid = () => {
        return name && email && subject && message && captcha;
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        setSuccessMessage('');
        setErrorMessage('');

        try {
            const response = await fetch('/api/contact', { // Or use a Server Action
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, message, subject, captcha }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage(data.message);
                setName('');
                setEmail('');
                setMessage('');
            } else {
                setErrorMessage(data.message || 'Something went wrong.');
            }
        } catch (error) {
            console.error('Submission error:', error);
            setErrorMessage('Failed to submit form.');
        } finally {
            setLoading(false);
        }
    };


    function onChange(value) {
        console.log("Captcha value:", value);
        setCaptcha(value);
    }

    return (
        <div className="contact-form-wrapper" >
            <form className="contact-form" onSubmit={onSubmit}>
                <h1 className="h1">    {!successMessage ? "Contact Me" : "Thank you!"}</h1>

                {!successMessage &&

                    <>
                        <div className="form-inputs">
                            <div className='input-container'>
                                <label className='label' htmlFor="name">Name:</label>
                                <input className='input' placeholder='NAME *' type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div className='input-container'>
                                <label className='label' htmlFor="email">Email:</label>
                                <input className='input' placeholder='EMAIL *' type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <div className='input-container'>
                                <label className='label' htmlFor="subject">Subject:</label>
                                <input className='input' placeholder='SUBJECT *' type="subject" id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
                            </div>
                            <div className='input-container'>
                                <label className='label' htmlFor="message">Message:</label>
                                <textarea className='input' placeholder="MESSAGE *" id="message" value={message} onChange={(e) => setMessage(e.target.value)} required />
                            </div>
                            <div className='input-container'>
                                <label className='label' htmlFor="captcha">Captcha:</label>
                                <ReCAPTCHA
                                    id="captcha"
                                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                                    onChange={onChange}
                                />
                            </div>
                        </div>

                        <Button type="submit" disabled={!isValid() || loading}>
                            {loading ? 'Sending...' : 'Send Message'}
                        </Button>
                    </>
                }

                {successMessage && <div className="success-message" > I&apos;ll get back to you as soon as possible.</div>}
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}


            </form>


        </div>
    );
}

export default ContactForm;
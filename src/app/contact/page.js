'use client';

import "./contact.css";


import React, { useState } from 'react';
import Button from '../button';

function ContactForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

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
                body: JSON.stringify({ name, email, message, subject }),
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

    return (
        <form className="contact-form" onSubmit={onSubmit}>

            <h1 className="h1">Contact me</h1>

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

            <Button type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'}
            </Button>





            {successMessage && <div className="message" style={{ color: 'green' }}>{successMessage}</div>}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </form>
    );
}

export default ContactForm;
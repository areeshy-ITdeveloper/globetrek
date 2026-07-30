import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GlobeTrekSupport.css';

export function HelpCenter() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    { q: "Do I need to create an account to use GlobeTrek?", a: "No! GlobeTrek is completely free and requires no sign-ups or login. You can start planning your adventure instantly." },
    { q: "Where is my itinerary data saved?", a: "Your travel plans and expenses are automatically saved in your browser's local storage. This means your data stays private and safe on your own device." },
    { q: "How does the Live Budget Estimator calculate costs?", a: "Whenever you add an activity with a ticket price in the Control Panel, the estimator instantly sums up the costs in real-time so you never overspend." },
    { q: "What is the S-Shaped Interactive Timeline?", a: "It is a custom visual grid pathway that automatically chains your daily schedules together, mimicking a real-life journey flow." }
  ];

  return (
    <div className="gt-support-page">
      <button className="gt-support-back-btn" onClick={() => navigate('/')}>← Back to Home</button>
      <div className="gt-support-card">
        <h2 className="gt-support-title"> GlobeTrek Help Center</h2>
        <p className="gt-support-subtitle">Frequently Asked Questions to get you moving smoothly.</p>
        
        <div className="gt-faq-container">
          {faqs.map((faq, index) => (
            <div key={index} className={`gt-faq-item ${activeIndex === index ? 'active' : ''}`} onClick={() => setActiveIndex(activeIndex === index ? null : index)}>
              <div className="gt-faq-question">
                <span>{faq.q}</span>
                <span className="gt-faq-icon">{activeIndex === index ? '▲' : '▼'}</span>
              </div>
              {activeIndex === index && <div className="gt-faq-answer">{faq.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ContactUs() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="gt-support-page">
      <button className="gt-support-back-btn" onClick={() => navigate('/')}>← Back to Home</button>
      <div className="gt-support-card">
        <h2 className="gt-support-title"> Contact GlobeTrek Support</h2>
        <p className="gt-support-subtitle">Have a feature request or found a bug? Let us know!</p>

        {submitted ? (
          <div className="gt-contact-success">
            🎉 Thank you! Your message has been sent successfully. We will get back to you shortly.
          </div>
        ) : (
          <form className="gt-contact-form" onSubmit={handleSubmit}>
            <div className="gt-form-group">
              <label>Full Name</label>
              <input type="text" placeholder="Your Name" required />
            </div>
            <div className="gt-form-group">
              <label>Email Address</label>
              <input type="email" placeholder="name@example.com" required />
            </div>
            <div className="gt-form-group">
              <label>How can we help?</label>
              <select required>
                <option value="general">General Inquiry</option>
                <option value="bug">Report a Bug</option>
                <option value="feature">Feature Request</option>
              </select>
            </div>
            <div className="gt-form-group">
              <label>Message</label>
              <textarea rows="5" placeholder="Write your message here..." required></textarea>
            </div>
            <button type="submit" className="gt-contact-submit-btn">Send Message ➔</button>
          </form>
        )}
      </div>
    </div>
  );
}
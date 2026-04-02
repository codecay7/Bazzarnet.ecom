import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

const ContactUs = () => (
  <section className="w-full max-w-[1200px] my-10">
    <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-8 mx-4">
      <h2 className="text-3xl font-bold mb-5 md:text-4xl text-center">Contact Us</h2>
      <p className="text-lg opacity-80 text-center mb-8">We'd love to hear from you! Reach out to us through any of the methods below.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-6 flex flex-col items-center text-center shadow-lg">
          <FontAwesomeIcon icon={faEnvelope} className="text-5xl text-[var(--accent)] mb-4" />
          <h3 className="text-xl font-semibold mb-2">Email Support</h3>
          <p className="text-base md:text-lg">For general inquiries or support, email us at:</p>
          <a href="mailto:support@bazzarnet.com" className="text-[var(--accent)] hover:underline font-medium mt-2">support@bazzarnet.com</a>
        </div>

        <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-6 flex flex-col items-center text-center shadow-lg">
          <FontAwesomeIcon icon={faPhone} className="text-5xl text-[var(--accent)] mb-4" />
          <h3 className="text-xl font-semibold mb-2">Call Us</h3>
          <p className="text-base md:text-lg">Speak to our customer service team:</p>
          <a href="tel:+911234567890" className="text-[var(--accent)] hover:underline font-medium mt-2">+91 12345 67890</a>
        </div>

        <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-6 flex flex-col items-center text-center shadow-lg">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="text-5xl text-[var(--accent)] mb-4" />
          <h3 className="text-xl font-semibold mb-2">Our Office</h3>
          <p className="text-base md:text-lg">Visit us at our headquarters:</p>
          <p className="font-medium mt-2">BazzarNet HQ, 123 Main Street, City, State, 123456</p>
        </div>
      </div>
    </div>
  </section>
);

export default ContactUs;
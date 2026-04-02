import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

const About = () => (
  <section className="w-full max-w-[1200px] my-10">
    <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-8 mx-4">
      <h2 className="text-3xl font-bold mb-5 md:text-4xl">About Us</h2>
      <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-5 mb-4 m-2 flex flex-col gap-4">
        <h3 className="text-2xl font-semibold md:text-3xl">Our Story</h3>
        <p className="text-base md:text-lg">BazzarNet was founded to empower local businesses and make shopping convenient for customers.</p>
      </div>
      <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-5 m-2 flex flex-col gap-4">
        <h3 className="text-2xl font-semibold md:text-3xl">Careers</h3>
        <p className="text-base md:text-lg">Join our team to build the future of local commerce.</p>
        <a
          href="#"
          className="bg-[var(--accent)] w-fit text-white border-none py-2 px-6 rounded-lg flex items-center gap-2 font-medium hover:bg-[var(--accent-dark)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0_2px_10px_rgba(0,0,0,0.1)] transition-all duration-300 no-underline"
          onClick={(e) => {
            e.preventDefault();
            toast('Careers page coming soon!');
          }}
        >
          <FontAwesomeIcon icon={faBriefcase} /> View Openings
        </a>
      </div>
    </div>
  </section>
);

export default About;
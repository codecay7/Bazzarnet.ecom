import React from 'react';

const Careers = () => (
  <section className="w-full max-w-[1200px] my-10">
    <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-8 mx-4">
      <h2 className="text-3xl font-bold mb-5 md:text-4xl">Careers at BazzarNet</h2>
      <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-5 mb-4 m-2 flex flex-col gap-4">
        <h3 className="text-2xl font-semibold md:text-3xl">Join Our Team!</h3>
        <p className="text-base md:text-lg">We're always looking for passionate individuals to help us build the future of local commerce. Explore exciting opportunities and grow with us.</p>
      </div>
      <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-5 m-2 flex flex-col gap-4">
        <h3 className="text-2xl font-semibold md:text-3xl">Current Openings</h3>
        <p className="text-base md:text-lg">Check back soon for available positions in engineering, marketing, operations, and more!</p>
      </div>
    </div>
  </section>
);

export default Careers;
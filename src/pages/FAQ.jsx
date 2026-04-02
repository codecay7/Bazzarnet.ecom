import React from 'react';

const FAQ = () => (
  <section className="w-full max-w-[1200px] my-10">
    <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-8 mx-4">
      <h2 className="text-3xl font-bold mb-5 md:text-4xl">Frequently Asked Questions</h2>
      <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-5 mb-4 m-2 flex flex-col gap-4">
        <h3 className="text-2xl font-semibold md:text-3xl">What is BazzarNet?</h3>
        <p className="text-base md:text-lg">BazzarNet is a platform connecting local stores with customers for fast and reliable delivery.</p>
      </div>
      <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-5 m-2 flex flex-col gap-4">
        <h3 className="text-2xl font-semibold md:text-3xl">How fast is delivery?</h3>
        <p className="text-base md:text-lg">Most orders are delivered within 30-60 minutes, depending on your location.</p>
      </div>
    </div>
  </section>
);

export default FAQ;
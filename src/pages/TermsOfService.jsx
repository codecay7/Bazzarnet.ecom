import React from 'react';

const TermsOfService = () => (
  <section className="w-full max-w-[1200px] my-10">
    <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-8 mx-4">
      <h2 className="text-3xl font-bold mb-5 md:text-4xl">Terms of Service</h2>
      <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-5 mb-4 m-2 flex flex-col gap-4">
        <h3 className="text-2xl font-semibold md:text-3xl">Agreement to Terms</h3>
        <p className="text-base md:text-lg">By accessing or using the BazzarNet platform, you agree to be bound by these Terms of Service and all terms incorporated by reference.</p>
      </div>
      <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-5 m-2 flex flex-col gap-4">
        <h3 className="text-2xl font-semibold md:text-3xl">User Accounts</h3>
        <p className="text-base md:text-lg">You may need to register for an account to access some features of our services. You are responsible for maintaining the confidentiality of your account password and for all activities that occur under your account.</p>
      </div>
      <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-5 m-2 flex flex-col gap-4">
        <h3 className="text-2xl font-semibold md:text-3xl">Prohibited Conduct</h3>
        <p className="text-base md:text-lg">You agree not to use the service for any unlawful purpose or in any way that could damage, disable, overburden, or impair the service.</p>
      </div>
    </div>
  </section>
);

export default TermsOfService;
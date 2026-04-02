import React from 'react';

const PrivacyPolicy = () => (
  <section className="w-full max-w-[1200px] my-10">
    <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-8 mx-4">
      <h2 className="text-3xl font-bold mb-5 md:text-4xl">Privacy Policy</h2>
      <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-5 mb-4 m-2 flex flex-col gap-4">
        <h3 className="text-2xl font-semibold md:text-3xl">Your Privacy Matters</h3>
        <p className="text-base md:text-lg">At BazzarNet, we are committed to protecting your privacy. This policy explains how we collect, use, and disclose your personal information.</p>
      </div>
      <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-5 m-2 flex flex-col gap-4">
        <h3 className="text-2xl font-semibold md:text-3xl">Information We Collect</h3>
        <p className="text-base md:text-lg">We collect information you provide directly to us, such as when you create an account, place an order, or contact customer support. This may include your name, email address, phone number, shipping address, and payment information.</p>
      </div>
      <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-5 m-2 flex flex-col gap-4">
        <h3 className="text-2xl font-semibold md:text-3xl">How We Use Your Information</h3>
        <p className="text-base md:text-lg">We use the information we collect to provide, maintain, and improve our services, process your transactions, send you order confirmations, and communicate with you about products, services, and promotions.</p>
      </div>
    </div>
  </section>
);

export default PrivacyPolicy;
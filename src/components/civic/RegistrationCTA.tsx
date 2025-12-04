'use client';
import { useState } from 'react';

export default function RegistrationCTA() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    track: '',
    team: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    alert('Thank you for registering! We will contact you soon with more details.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="register" className="relative z-30 w-full py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4 md:px-8">
        {/* Heading */}
        <h2
          className="text-center mb-6"
          style={{
            fontFamily: 'Decoy, sans-serif',
            fontSize: 'clamp(3rem, 8vw, 5rem)',
            fontWeight: 500,
            color: '#1e1e1e',
            transform: 'rotate(-1.5deg)',
          }}
        >
          REGISTER NOW
        </h2>

        <p
          className="text-center text-lg mb-12"
          style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 600, color: '#403f3e' }}
        >
          Secure your spot at Sierra Leone's premier civic innovation event
        </p>

        {/* Registration Form */}
        <div
          className="border-2 border-[#1e1e1e] rounded-[28px] bg-white p-8 md:p-12"
          style={{ transform: 'rotate(-0.5deg)' }}
        >
          <div
            className="absolute inset-0 opacity-5 pointer-events-none rounded-[28px]"
            style={{
              backgroundImage: 'url(/images/6707b45e1c28f88fc781209a_noise.webp)',
              backgroundSize: '200px 200px',
              backgroundRepeat: 'repeat',
            }}
          />

          <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block mb-2"
                style={{
                  fontFamily: 'Raleway, sans-serif',
                  fontWeight: 700,
                  fontSize: '14px',
                  color: '#1e1e1e',
                }}
              >
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-[#1e1e1e] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E6B800]"
                style={{ fontFamily: 'Raleway, sans-serif' }}
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block mb-2"
                style={{
                  fontFamily: 'Raleway, sans-serif',
                  fontWeight: 700,
                  fontSize: '14px',
                  color: '#1e1e1e',
                }}
              >
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-[#1e1e1e] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E6B800]"
                style={{ fontFamily: 'Raleway, sans-serif' }}
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block mb-2"
                style={{
                  fontFamily: 'Raleway, sans-serif',
                  fontWeight: 700,
                  fontSize: '14px',
                  color: '#1e1e1e',
                }}
              >
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-[#1e1e1e] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E6B800]"
                style={{ fontFamily: 'Raleway, sans-serif' }}
              />
            </div>

            {/* Experience Level */}
            <div>
              <label
                htmlFor="experience"
                className="block mb-2"
                style={{
                  fontFamily: 'Raleway, sans-serif',
                  fontWeight: 700,
                  fontSize: '14px',
                  color: '#1e1e1e',
                }}
              >
                Experience Level *
              </label>
              <select
                id="experience"
                name="experience"
                required
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-[#1e1e1e] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E6B800]"
                style={{ fontFamily: 'Raleway, sans-serif' }}
              >
                <option value="">Select your experience level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="professional">Professional</option>
              </select>
            </div>

            {/* Preferred Track */}
            <div>
              <label
                htmlFor="track"
                className="block mb-2"
                style={{
                  fontFamily: 'Raleway, sans-serif',
                  fontWeight: 700,
                  fontSize: '14px',
                  color: '#1e1e1e',
                }}
              >
                Preferred Challenge Track *
              </label>
              <select
                id="track"
                name="track"
                required
                value={formData.track}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-[#1e1e1e] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E6B800]"
                style={{ fontFamily: 'Raleway, sans-serif' }}
              >
                <option value="">Select a track</option>
                <option value="digital-governance">Digital Governance</option>
                <option value="healthcare">Healthcare Access</option>
                <option value="education">Education & Skills</option>
                <option value="economic">Economic Empowerment</option>
                <option value="safety">Public Safety</option>
                <option value="environment">Environmental Sustainability</option>
              </select>
            </div>

            {/* Team Status */}
            <div>
              <label
                htmlFor="team"
                className="block mb-2"
                style={{
                  fontFamily: 'Raleway, sans-serif',
                  fontWeight: 700,
                  fontSize: '14px',
                  color: '#1e1e1e',
                }}
              >
                Do you have a team? *
              </label>
              <select
                id="team"
                name="team"
                required
                value={formData.team}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-[#1e1e1e] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E6B800]"
                style={{ fontFamily: 'Raleway, sans-serif' }}
              >
                <option value="">Select an option</option>
                <option value="yes">Yes, I have a team</option>
                <option value="looking">No, looking for teammates</option>
                <option value="solo">No, participating solo</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="group relative overflow-hidden w-full px-8 py-4 rounded-full bg-[#E6B800] border-2 border-[#1e1e1e] text-[#1e1e1e] font-medium text-lg transition-all duration-300 hover:scale-105"
            >
              <div
                className="absolute inset-0 opacity-20 mix-blend-overlay"
                style={{
                  backgroundImage: 'url(/images/6707b45e1c28f88fc781209a_noise.webp)',
                  backgroundSize: '200px 200px',
                  backgroundRepeat: 'repeat',
                }}
              />
              <div className="absolute inset-0 bg-black transform scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100 rounded-full" />
              <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                Submit Registration
              </span>
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="mt-12 text-center space-y-4">
          <p
            className="text-base"
            style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 600, color: '#403f3e' }}
          >
            Questions about the event?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="mailto:civic@example.com"
              className="text-[#E6B800] hover:underline"
              style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 700 }}
            >
              civic@example.com
            </a>
            <span className="hidden sm:inline" style={{ color: '#403f3e' }}>
              |
            </span>
            <a
              href="https://discord.com/invite/christexfndn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#E6B800] hover:underline"
              style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 700 }}
            >
              Join Our Discord
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

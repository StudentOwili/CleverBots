'use client';

import React, { useState, useRef, useEffect } from 'react';
import ContactForm from '@/components/ContactForm';
import Link from 'next/link';
import ProfessorGreeting from '@/components/ProfessorGreeting';

// Color palette
// - 00FF41 (lime green)
// - 0D0D0D (near black)
// - 1A1A1A (dark gray)

// BestSellerBadge component for bouncing "Best Seller" sign
const BestSellerBadge = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show the badge when the component mounts
    setIsVisible(true);
  }, []);

  return (
    <div 
      className={`absolute -top-3 -left-3 bg-[#00FF41] text-[#0D0D0D] font-bold py-2 px-4 rounded-lg transition-all duration-500 shadow-glow ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } animate-bounce`}
      style={{ zIndex: 20 }}
    >
      <span className="text-sm sm:text-base">🔥 HOT</span>
    </div>
  );
};

// StarField component for animated background
const StarField = ({ speedFactor = 0.05, starCount = 1000 }) => {
  useEffect(() => {
    const canvas = document.getElementById('starfield') as HTMLCanvasElement;

    if (canvas) {
      const c = canvas.getContext('2d');

      if (c) {
        let w = window.innerWidth;
        let h = window.innerHeight;

        const setCanvasExtents = () => {
          canvas.width = w;
          canvas.height = h;
        };

        setCanvasExtents();

        window.onresize = () => {
          w = window.innerWidth;
          h = window.innerHeight;
          setCanvasExtents();
        };

        const makeStars = (count: number) => {
          const out = [];
          for (let i = 0; i < count; i++) {
            const s = {
              x: Math.random() * 1600 - 800,
              y: Math.random() * 900 - 450,
              z: Math.random() * 1000,
            };
            out.push(s);
          }
          return out;
        };

        let stars = makeStars(starCount);

        const clear = () => {
          c.fillStyle = '#0D0D0D'; // Near black background
          c.fillRect(0, 0, canvas.width, canvas.height);
        };

        const putPixel = (x: number, y: number, brightness: number) => {
          const rgb = `rgba(0, 255, 65, ${brightness})`; // Lime green for stars
          c.fillStyle = rgb;
          c.fillRect(x, y, 1, 1);
        };

        const moveStars = (distance: number) => {
          const count = stars.length;
          for (var i = 0; i < count; i++) {
            const s = stars[i];
            s.z -= distance;
            while (s.z <= 1) {
              s.z += 1000;
            }
          }
        };

        let prevTime: number;
        const init = (time: number) => {
          prevTime = time;
          requestAnimationFrame(tick);
        };

        const tick = (time: number) => {
          let elapsed = time - prevTime;
          prevTime = time;

          moveStars(elapsed * speedFactor);

          clear();

          const cx = w / 2;
          const cy = h / 2;

          const count = stars.length;
          for (var i = 0; i < count; i++) {
            const star = stars[i];

            const x = cx + star.x / (star.z * 0.001);
            const y = cy + star.y / (star.z * 0.001);

            if (x < 0 || x >= w || y < 0 || y >= h) {
              continue;
            }

            const d = star.z / 1000.0;
            const b = 1 - d * d;

            putPixel(x, y, b);
          }

          requestAnimationFrame(tick);
        };

        requestAnimationFrame(init);

        return () => {
          window.onresize = null;
        };
      }
    }
  }, [starCount, speedFactor]);

  return (
    <canvas
      id="starfield"
      style={{
        padding: 0,
        margin: 0,
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 1,
        opacity: 0.7,
        pointerEvents: 'none',
      }}
    ></canvas>
  );
};

// Scroll to the next section
const scrollToSection = (sectionRef: React.RefObject<HTMLElement>) => {
  if (sectionRef.current) {
    sectionRef.current.scrollIntoView({ behavior: 'smooth' });
  }
};

export default function Home() {
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);
  const section4Ref = useRef<HTMLDivElement>(null);
  const [currentSection, setCurrentSection] = useState(0);
  
  // Enable normal scrolling with snap functionality
  useEffect(() => {
    // Check for hash fragments in URL and scroll to appropriate section
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      
      if (hash === '#services') {
        section2Ref.current?.scrollIntoView({ behavior: 'smooth' });
        setCurrentSection(1);
      } else if (hash === '#contact-section') {
        section4Ref.current?.scrollIntoView({ behavior: 'smooth' });
        setCurrentSection(3);
      }
    }
    
    // Set up intersection observer to track current section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            if (sectionId === 'hero-section') setCurrentSection(0);
            else if (sectionId === 'services') setCurrentSection(1);
            else if (sectionId === 'why-choose-us') setCurrentSection(2);
            else if (sectionId === 'contact-section') setCurrentSection(3);
          }
        });
      },
      { threshold: 0.6 } // Trigger when section is 60% visible
    );
    
    // Observe all sections
    if (section1Ref.current) observer.observe(section1Ref.current);
    if (section2Ref.current) observer.observe(section2Ref.current);
    if (section3Ref.current) observer.observe(section3Ref.current);
    if (section4Ref.current) observer.observe(section4Ref.current);
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  // Handle button clicks to scroll to sections
  const scrollToServices = () => {
    section2Ref.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const scrollToContact = () => {
    section4Ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-[#0D0D0D] text-white min-h-screen w-full overflow-y-auto">
      {/* Professor Greeting Popup */}
      <ProfessorGreeting />
      
      {/* Star background */}
      <StarField starCount={1500} speedFactor={0.03} />
      
      {/* Main content with snap scroll */}
      <div className="relative z-10">
        {/* Section 1: Hero */}
        <div 
          id="hero-section" 
          ref={section1Ref} 
          className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-16 sm:py-0"
        >
          <div className="max-w-4xl text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 text-white">
              Free Up Time, Reduce Cost, Scale Faster.
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-8 sm:mb-10 text-[#00FF41]">
              Like hiring 4 assistants that work 24/7 for the price of one.
            </p>
            <button 
              onClick={scrollToServices}
              className="bg-[#00FF41] text-[#0D0D0D] font-bold py-4 px-8 rounded-lg text-lg sm:text-xl hover:bg-opacity-90 transition-colors duration-300 w-full sm:w-auto"
            >
              I want this
            </button>
          </div>
        </div>
        
        {/* Section 2: Services */}
        <div 
          id="services" 
          ref={section2Ref} 
          className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-16 sm:py-0 relative"
        >
          <div className="max-w-6xl w-full">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8 sm:mb-12 text-center text-white">
              We deploy AI that solves:
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* WhatsApp Customer Service */}
              <div className="bg-[#0D0D0D] bg-opacity-80 p-6 sm:p-8 rounded-lg border border-[#00FF41] h-full flex flex-col relative">
                {/* Best Seller Badge */}
                <BestSellerBadge />
                
                <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">WhatsApp Customer Service</h3>
                <ul className="list-disc list-inside text-base sm:text-lg text-white space-y-3">
                  <li>24/7 automated responses</li>
                  <li>Multilingual and multi-dialect capabilities</li>
                  <li>Seamless human handoff</li>
                  <li>Knowledge base integration</li>
                  <li>Understands how your clients interact</li>
                  <li>Schedules appointments and gathers client data</li>
                </ul>
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6 pt-4">
                  <Link 
                    href="/WhatsAppMockup" 
                    className="bg-[#00FF41] text-[#0D0D0D] font-bold py-3 px-5 rounded-lg hover:bg-opacity-90 transition-colors duration-300 w-full text-center flex items-center justify-center min-h-[48px]"
                  >
                    What this looks like
                  </Link>
                  <Link 
                    href="/WhatsAppTimeline" 
                    className="bg-[#1A1A1A] text-[#00FF41] font-bold py-3 px-5 rounded-lg hover:bg-opacity-90 transition-colors duration-300 w-full text-center flex items-center justify-center min-h-[48px]"
                  >
                    How this usually goes
                  </Link>
                </div>
              </div>
              
              {/* Custom Website */}
              <div className="bg-[#0D0D0D] bg-opacity-80 p-6 sm:p-8 rounded-lg border border-[#00FF41] h-full flex flex-col">
                <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">Custom Website</h3>
                <ul className="list-disc list-inside text-base sm:text-lg text-white space-y-3">
                  <li>Responsive design for all devices</li>
                  <li>SEO optimization</li>
                  <li>Modern UI/UX</li>
                  <li>AI integration</li>
                  <li>Content management system</li>
                  <li>Analytics and performance tracking</li>
                </ul>
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6 pt-4">
                  <Link 
                    href="/WebsiteDemo" 
                    className="bg-[#00FF41] text-[#0D0D0D] font-bold py-3 px-5 rounded-lg hover:bg-opacity-90 transition-colors duration-300 w-full text-center flex items-center justify-center min-h-[48px]"
                  >
                    What this looks like
                  </Link>
                  <Link 
                    href="/WebsiteTimeline" 
                    className="bg-[#1A1A1A] text-[#00FF41] font-bold py-3 px-5 rounded-lg hover:bg-opacity-90 transition-colors duration-300 w-full text-center flex items-center justify-center min-h-[48px]"
                  >
                    How this usually goes
                  </Link>
                </div>
              </div>
              
              {/* Custom Plan */}
              <div className="bg-[#0D0D0D] bg-opacity-80 p-6 sm:p-8 rounded-lg border border-[#00FF41] h-full flex flex-col">
                <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">Custom Plan</h3>
                <p className="text-base sm:text-lg text-white mb-4">
                  We create tailored AI solutions designed specifically for your business needs and challenges.
                </p>
                <ul className="list-disc list-inside text-base sm:text-lg text-white space-y-3">
                  <li>Personalized consultation</li>
                  <li>Custom AI development</li>
                  <li>Integration with existing systems</li>
                  <li>Ongoing support and optimization</li>
                  <li>Scalable solutions that grow with you</li>
                </ul>
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-auto pt-4">
                  <Link 
                    href="/CustomPlanTimeline" 
                    className="bg-[#1A1A1A] text-[#00FF41] font-bold py-3 px-5 rounded-lg hover:bg-opacity-90 transition-colors duration-300 w-full text-center flex items-center justify-center min-h-[48px]"
                  >
                    How this usually goes
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Section 3: Why Choose Us */}
        <div 
          id="why-choose-us" 
          ref={section3Ref} 
          className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-16 sm:py-0 relative"
        >
          <div className="max-w-6xl w-full">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-white text-center">
              Why Choose Us
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              {/* Benefit 1 */}
              <div className="bg-[#0D0D0D] bg-opacity-80 p-6 sm:p-8 rounded-lg border border-[#00FF41] h-full flex flex-col">
                <div className="flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#00FF41] mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">Fast Implementation</h3>
                </div>
                <ul className="list-disc list-inside text-base text-white space-y-2 ml-2">
                  <li>Quick integration with existing systems</li>
                  <li>Minimal disruption to operations</li>
                  <li>Immediate ROI visibility</li>
                </ul>
              </div>
              
              {/* Benefit 2 */}
              <div className="bg-[#0D0D0D] bg-opacity-80 p-6 sm:p-8 rounded-lg border border-[#00FF41] h-full flex flex-col">
                <div className="flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#00FF41] mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">Proven Results</h3>
                </div>
                <ul className="list-disc list-inside text-base text-white space-y-2 ml-2">
                  <li>AI WhatsApp integration for Transarabianseas (Saudi Arabia)</li>
                  <li>40% reduction in operational costs</li>
                  <li>24/7 customer service availability</li>
                  <li>95% customer satisfaction rate</li>
                </ul>
              </div>
              
              {/* Benefit 3 */}
              <div className="bg-[#0D0D0D] bg-opacity-80 p-6 sm:p-8 rounded-lg border border-[#00FF41] h-full flex flex-col">
                <div className="flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#00FF41] mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">Expert Support</h3>
                </div>
                <ul className="list-disc list-inside text-base text-white space-y-2 ml-2">
                  <li>Dedicated implementation manager</li>
                  <li>Ongoing optimization and updates</li>
                  <li>Regular performance reviews</li>
                </ul>
              </div>
            </div>
            
            {/* Money Back Guarantee */}
            <div className="bg-[#0D0D0D] bg-opacity-90 p-6 sm:p-8 rounded-lg border-2 border-[#00FF41] max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0 md:mr-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#00FF41] mx-auto md:mx-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 text-[#00FF41] text-center md:text-left">
                    30-Day Money Back Guarantee
                  </h3>
                  <p className="text-base sm:text-lg text-white mb-4 text-center md:text-left">
                    We're so confident in our AI solutions that if you don't see measurable improvements within 30 days, we'll refund your investment. No questions asked.
                  </p>
                  <div className="flex justify-center md:justify-start">
                    <button 
                      onClick={scrollToContact}
                      className="bg-[#00FF41] text-[#0D0D0D] font-bold py-3 px-6 rounded-lg text-lg hover:bg-opacity-90 transition-colors duration-300 min-h-[48px]"
                    >
                      Get Started Risk-Free
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Section 4: Contact */}
        <div 
          id="contact-section" 
          ref={section4Ref} 
          className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-16 sm:py-0 relative"
        >
          <div className="max-w-4xl w-full">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white text-center">
              Your business is already smart. It's time for your operations to catch up.
            </h2>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
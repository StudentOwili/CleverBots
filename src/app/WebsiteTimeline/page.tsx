'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

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
          c.fillStyle = `rgba(0, 255, 65, ${brightness})`; // Lime green for stars
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

// Timeline step component
interface TimelineStepProps {
  title: string;
  description: string;
  index: number;
  isLast?: boolean;
}

const TimelineStep: React.FC<TimelineStepProps> = ({ title, description, index, isLast = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div className="relative">
      {/* Timeline connector line */}
      {!isLast && (
        <div className="absolute left-6 top-6 h-full w-0.5 bg-[#00FF41] opacity-70"></div>
      )}
      
      {/* Timeline point and content */}
      <div className="flex items-start mb-12">
        {/* Timeline point */}
        <div 
          className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-[#1A1A1A] border-2 border-[#00FF41] shadow-glow"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <span className="text-[#00FF41] font-bold">{index + 1}</span>
        </div>
        
        {/* Timeline content */}
        <div 
          className={`ml-6 transition-all duration-300 ${isHovered ? 'scale-105' : 'scale-100'}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
          <div 
            className={`bg-[#1A1A1A] border border-[#00FF41] p-4 rounded-lg shadow-lg transition-all duration-300 max-w-lg ${
              isHovered ? 'opacity-100 max-h-96' : 'opacity-80 max-h-24 overflow-hidden'
            }`}
          >
            <p className="text-white">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function WebsiteTimeline() {
  const timelineSteps = [
    {
      title: "Discovery & Requirements",
      description: "Let us know that you need a custom website to save you time and expand your online presence. We'll discuss your business goals, target audience, desired features, and analyze any existing website you may have."
    },
    {
      title: "Design Consultation",
      description: "Book a 15-minute Zoom call to discuss your design preferences, branding requirements, and content needs. We'll show you examples of our previous work and discuss layout options that would work best for your business."
    },
    {
      title: "Project Kickoff",
      description: "After confirming the project scope, you'll pay a fixed $243 downpayment to begin the website development process. We'll create a detailed project timeline with key milestones and deliverables."
    },
    {
      title: "Design & Development",
      description: "During our 1-week development process, we'll create wireframes and mockups for your approval, then build a responsive website with modern UI/UX principles. We'll incorporate your branding elements and optimize for all devices."
    },
    {
      title: "Content Integration",
      description: "We'll integrate your content, images, and any required functionality such as contact forms, booking systems, or e-commerce features. We'll also set up analytics to track visitor behavior and performance."
    },
    {
      title: "SEO Optimization",
      description: "We'll optimize your website for search engines with proper meta tags, fast loading speeds, mobile responsiveness, and structured data. This helps improve your visibility in search results and drives organic traffic."
    },
    {
      title: "Testing & Launch",
      description: "We'll thoroughly test your website across different devices and browsers to ensure everything works perfectly. After your approval, we'll launch the site and provide training on how to manage and update content."
    },
    {
      title: "Ongoing Support",
      description: "Your monthly subscription includes technical support, security updates, performance monitoring, and regular backups. We'll ensure your website stays secure, fast, and up-to-date with the latest web standards."
    }
  ];

  return (
    <div className="bg-[#0D0D0D] text-white min-h-screen">
      {/* Star background */}
      <StarField starCount={1500} speedFactor={0.03} />
      
      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Back button */}
        <div className="mb-8">
          <Link 
            href="/#services" 
            className="inline-flex items-center text-[#00FF41] hover:text-white transition-colors"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Services
          </Link>
        </div>
        
        {/* Page header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-white">
            Custom Website Development
          </h1>
          <p className="text-xl text-[#00FF41] max-w-3xl mx-auto">
            Our process for creating your modern, responsive, and SEO-optimized website
          </p>
        </div>
        
        {/* Timeline */}
        <div className="max-w-3xl mx-auto pl-4">
          {timelineSteps.map((step, index) => (
            <TimelineStep
              key={index}
              title={step.title}
              description={step.description}
              index={index}
              isLast={index === timelineSteps.length - 1}
            />
          ))}
        </div>
        
        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white">
            Ready to build your custom website?
          </h2>
          <Link 
            href="/#contact-section" 
            className="inline-block bg-[#00FF41] text-[#0D0D0D] font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-colors duration-300"
          >
            Contact Us Now
          </Link>
        </div>
      </div>
    </div>
  );
} 
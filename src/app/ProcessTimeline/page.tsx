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

export default function ProcessTimeline() {
  const timelineSteps = [
    {
      title: "Initial Consultation",
      description: "Let us know that this is the service you need to save you some time. We'll help you understand how our AI solution can address your specific needs and challenges."
    },
    {
      title: "Quick Compatibility Call",
      description: "Book a 15 minute quick zoom call to make sure we're a good match to work together. We'll discuss your requirements in more detail and ensure our solution aligns with your business goals."
    },
    {
      title: "Project Kickoff",
      description: "If we're good, you'll pay us a downpayment of a fixed 243$ of any service you choose, and we start working right away. This commitment allows us to begin the development process immediately."
    },
    {
      title: "Development Process",
      description: "During our 1 week development process, we'll need samples of chats between you and your customers so that we can train the AI on. This helps us create a solution that accurately represents your business voice and handles common customer inquiries effectively."
    },
    {
      title: "Implementation & Handover",
      description: "After we're done, you'll enjoy working on the important things, knowing that this is handled well. We'll provide comprehensive training on how to manage and get the most out of your new AI system."
    },
    {
      title: "Ongoing Support",
      description: "Your monthly payment will include 24/7 support, and maintainence to anything that goes wrong. We're committed to ensuring your AI solution continues to perform optimally and evolves with your business needs."
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
            Back to Home
          </Link>
        </div>
        
        {/* Page header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-white">
            How This Usually Goes
          </h1>
          <p className="text-xl text-[#00FF41] max-w-3xl mx-auto">
            Our streamlined process to get your AI customer service up and running
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
            Ready to get started?
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
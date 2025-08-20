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

export default function CustomPlanTimeline() {
  const timelineSteps = [
    {
      title: "Problem Discovery",
      description: "Let us know about the specific business challenges you're facing that could be solved with AI. We'll discuss your current processes, pain points, and the areas where automation could have the biggest impact on your operations."
    },
    {
      title: "Solution Planning",
      description: "Book a 15-minute Zoom call where our AI specialists will explore potential custom solutions tailored to your unique business needs. We'll discuss technical requirements, integration possibilities, and expected outcomes."
    },
    {
      title: "Proposal & Agreement",
      description: "We'll create a detailed proposal outlining the custom AI solution, including scope, timeline, and pricing. After your approval, you'll pay a fixed $243 downpayment to begin the development process."
    },
    {
      title: "Data Collection",
      description: "During our development process, we'll collect and analyze relevant data from your business operations. This might include customer interactions, business processes, or specific datasets needed to train your custom AI solution."
    },
    {
      title: "AI Model Development",
      description: "Our team will develop a custom AI solution specifically designed for your business needs. This may include machine learning models, natural language processing, computer vision, or other AI technologies as required."
    },
    {
      title: "Integration & Testing",
      description: "We'll integrate the AI solution with your existing systems and conduct thorough testing to ensure everything works seamlessly. You'll have the opportunity to provide feedback and request adjustments before final deployment."
    },
    {
      title: "Training & Deployment",
      description: "Once the solution is ready, we'll provide comprehensive training for your team on how to use and manage the new AI system. We'll then deploy the solution in your business environment and monitor initial performance."
    },
    {
      title: "Ongoing Support & Optimization",
      description: "Your monthly subscription includes dedicated technical support, regular performance reviews, and continuous optimization of your AI solution. We'll work with you to identify new opportunities for improvement and scale the solution as your business grows."
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
            Custom AI Solution
          </h1>
          <p className="text-xl text-[#00FF41] max-w-3xl mx-auto">
            Our process for developing tailored AI solutions for your unique business needs
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
            Ready for a custom AI solution?
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
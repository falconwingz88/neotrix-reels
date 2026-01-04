import { useState, useEffect, useRef } from 'react';
export const StatsCounter = () => {
  const [projectsCount, setProjectsCount] = useState(0);
  const [brandsCount, setBrandsCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);

  // Intersection Observer to detect when component is in view
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isVisible) {
        setIsVisible(true);
      }
    }, {
      threshold: 0.5
    } // Trigger when 50% of the component is visible
    );
    if (counterRef.current) {
      observer.observe(counterRef.current);
    }
    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, [isVisible]);

  // Counter animation
  useEffect(() => {
    if (!isVisible) return;
    const animateCount = (setValue: (value: number) => void, target: number) => {
      let start = 13;
      const duration = 6000; // 6 seconds
      const startTime = Date.now();
      const updateCount = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(easeOut * target);
        setValue(currentValue);
        if (progress < 1) {
          requestAnimationFrame(updateCount);
        }
      };
      requestAnimationFrame(updateCount);
    };
    const timer = setTimeout(() => {
      animateCount(setProjectsCount, 148);
      animateCount(setBrandsCount, 50);
    }, 500); // Delay start by 500ms

    return () => clearTimeout(timer);
  }, [isVisible]);
  return <div ref={counterRef} className="max-w-7xl mx-auto w-full py-16">
      <div className="flex justify-center gap-16 md:gap-32">
        <div className="text-center animate-fade-in">
          <div className="text-white/70 text-lg md:text-xl mb-2">Projects</div>
          <div className="text-white text-7xl md:text-9xl font-bold">
            {projectsCount}+
          </div>
        </div>
        <div className="text-center animate-fade-in">
          <div className="text-white/70 text-lg md:text-xl mb-2">Clients</div>
          <div className="text-white text-7xl md:text-9xl font-bold">
            {brandsCount}+
          </div>
        </div>
      </div>
    </div>;
};
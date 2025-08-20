import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './ScrollReveal.css';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: React.ReactNode;
  scrollContainerRef?: React.RefObject<HTMLElement>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  rotationEnd?: string;
  animationEnd?: string;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = "",
  rotationEnd = "bottom bottom",
  animationEnd = "bottom bottom"
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller =
      scrollContainerRef && scrollContainerRef.current
        ? scrollContainerRef.current
        : window;

    // Rotation animation for the container
    gsap.fromTo(
      el,
      { transformOrigin: '0% 50%', rotate: baseRotation },
      {
        ease: 'none',
        rotate: 0,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: 'top bottom',
          end: rotationEnd,
          scrub: true,
        },
      }
    );

    // Opacity animation for text elements (paragraphs, headings, etc.)
    const textElements = el.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, div, span');

    if (textElements.length > 0) {
      gsap.fromTo(
        textElements,
        { opacity: baseOpacity, willChange: 'opacity' },
        {
          ease: 'none',
          opacity: 1,
          stagger: 0.1,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: 'top bottom-=20%',
            end: animationEnd,
            scrub: true,
          },
        }
      );

      // Blur animation if enabled
      if (enableBlur) {
        gsap.fromTo(
          textElements,
          { filter: `blur(${blurStrength}px)` },
          {
            ease: 'none',
            filter: 'blur(0px)',
            stagger: 0.1,
            scrollTrigger: {
              trigger: el,
              scroller,
              start: 'top bottom-=20%',
              end: animationEnd,
              scrub: true,
            },
          }
        );
      }
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, rotationEnd, animationEnd, blurStrength]);

  return (
    <div ref={containerRef} className={`scroll-reveal ${containerClassName}`}>
      {children}
    </div>
  );
};

export default ScrollReveal;
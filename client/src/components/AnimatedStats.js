import React, { useState, useEffect, useRef } from 'react';
import { Heart, Users, Home, Award } from 'lucide-react';

const AnimatedCounter = ({ end, duration = 2000, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(end * easeOutQuart));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, isVisible]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString('pt-BR')}{suffix}
    </span>
  );
};

const AnimatedStats = ({ stats }) => {
  const defaultStats = {
    totalAdoptions: 1247,
    availableAnimals: 89,
    totalCastrations: 2156,
    estimatedStreetAnimals: 15000
  };

  const finalStats = { ...defaultStats, ...stats };

  const statsConfig = [
    {
      icon: Heart,
      label: 'Animais Adotados',
      value: finalStats.totalAdoptions || 1247,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      icon: Home,
      label: 'Disponíveis para Adoção',
      value: finalStats.availableAnimals || 89,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: Award,
      label: 'Castrações Realizadas',
      value: finalStats.totalCastrations || 2156,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: Users,
      label: 'Estimativa na Rua',
      value: finalStats.estimatedStreetAnimals || 15000,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {statsConfig.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 text-center transform hover:scale-105 transition-transform duration-300"
          >
            <div className={`${stat.bgColor} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}>
              <Icon className={`h-8 w-8 ${stat.color}`} />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              <AnimatedCounter end={stat.value} />
            </div>
            <p className="text-gray-600 font-medium">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
};

export default AnimatedStats;

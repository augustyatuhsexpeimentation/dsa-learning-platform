"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Confetti({ show }: { show: boolean }) {
  const [particles, setParticles] = useState<{ x: number; y: number; color: string; delay: number }[]>([]);

  useEffect(() => {
    if (show) {
      setParticles(
        Array.from({ length: 20 }, () => ({
          x: Math.random() * 100,
          y: Math.random() * -50,
          color: ["#6366f1", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"][Math.floor(Math.random() * 5)],
          delay: Math.random() * 0.3,
        }))
      );
    } else {
      setParticles([]);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          initial={{ x: `${p.x}vw`, y: "-10px", opacity: 1, rotate: 0 }}
          animate={{ y: "110vh", opacity: 0, rotate: 360 }}
          transition={{ duration: 1.5, delay: p.delay, ease: "easeIn" }}
          className="absolute w-2 h-2 rounded-sm"
          style={{ backgroundColor: p.color }}
        />
      ))}
    </div>
  );
}

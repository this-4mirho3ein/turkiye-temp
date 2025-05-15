"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const LoginBackground = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900" />

      {/* Animated stars effect */}
      <div className="absolute inset-0 opacity-70">
        <div className="stars-container">
          <div id="stars"></div>
          <div id="stars2"></div>
          <div id="stars3"></div>
        </div>
      </div>

      {/* Animated city skyline silhouette */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
        <div className="city-silhouette"></div>
      </div>

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 opacity-30 overflow-hidden">
        <div className="gradient-animation"></div>
      </div>

      {/* Top light effect */}
      <div className="absolute top-0 left-1/4 right-1/4 h-1/3 bg-blue-500/20 blur-[100px] rounded-full transform -translate-y-1/2"></div>

      {/* Animated floating elements */}
      <div className="absolute inset-0">
        <motion.div
          initial={{ opacity: 0.7, y: 0 }}
          animate={{
            opacity: [0.7, 0.4, 0.7],
            y: [0, -20, 0],
            rotateZ: [0, 5, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 12,
            ease: "easeInOut",
          }}
          className="absolute top-[15%] left-[20%] w-32 h-32 backdrop-blur-2xl bg-white/5 rounded-full border border-white/10"
        />

        <motion.div
          initial={{ opacity: 0.5, y: 0 }}
          animate={{
            opacity: [0.5, 0.3, 0.5],
            y: [0, 30, 0],
            rotateZ: [0, -3, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 18,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute top-[35%] right-[15%] w-48 h-48 backdrop-blur-xl bg-white/5 rounded-full border border-white/10"
        />

        <motion.div
          initial={{ opacity: 0.3, y: 0 }}
          animate={{
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.1, 1],
            rotateZ: [0, 2, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 15,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-[60%] left-[30%] w-24 h-24 backdrop-blur-lg bg-blue-500/10 rounded-full border border-white/10"
        />

        {/* Additional floating elements */}
        <motion.div
          initial={{ opacity: 0.4, x: 0 }}
          animate={{
            opacity: [0.4, 0.6, 0.4],
            x: [0, 15, 0],
            y: [0, -10, 0],
            rotateZ: [0, -5, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: "easeInOut",
            delay: 3,
          }}
          className="absolute top-[25%] right-[35%] w-36 h-36 backdrop-blur-xl bg-purple-500/10 rounded-full border border-white/10"
        />

        <motion.div
          initial={{ opacity: 0.3, y: 0 }}
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.15, 1],
            y: [0, 15, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 22,
            ease: "easeInOut",
            delay: 4,
          }}
          className="absolute top-[70%] right-[25%] w-28 h-28 backdrop-blur-lg bg-indigo-500/10 rounded-full border border-white/10"
        />
      </div>

      {/* Reflective floor effect */}
      <div className="absolute bottom-0 left-0 right-0 h-[30vh] bg-gradient-to-t from-blue-900/90 to-transparent backdrop-blur-sm"></div>

      {/* Particles overlay */}
      <div className="absolute inset-0 opacity-30">
        <div id="particles"></div>
      </div>

      {/* Nebula effects */}
      <div className="absolute opacity-20 top-0 left-0 w-full h-full overflow-hidden">
        <div className="nebula nebula-1"></div>
        <div className="nebula nebula-2"></div>
        <div className="nebula nebula-3"></div>
      </div>

      {/* CSS for the animated effects */}
      <style jsx global>{`
        /* Stars animation */
        .stars-container {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
          transform: translateZ(0);
        }

        #stars {
          width: 1px;
          height: 1px;
          background: transparent;
          box-shadow: ${generateStars(700)};
          animation: animateStars 50s linear infinite;
        }

        #stars2 {
          width: 2px;
          height: 2px;
          background: transparent;
          box-shadow: ${generateStars(200)};
          animation: animateStars 100s linear infinite;
        }

        #stars3 {
          width: 3px;
          height: 3px;
          background: transparent;
          box-shadow: ${generateStars(100)};
          animation: animateStars 150s linear infinite;
        }

        @keyframes animateStars {
          0% {
            transform: translateY(0px);
          }
          100% {
            transform: translateY(-2000px);
          }
        }

        /* City silhouette */
        .city-silhouette {
          width: 100%;
          height: 25vh;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23000B18' d='M0,224L48,224C96,224,192,224,288,218.7C384,213,480,203,576,181.3C672,160,768,128,864,117.3C960,107,1056,117,1152,122.7C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E");
          background-size: cover;
          background-position: center bottom;
          position: absolute;
          bottom: 0;
          opacity: 0.9;
        }

        /* Gradient animation */
        .gradient-animation {
          width: 100%;
          height: 100%;
          background: linear-gradient(
            -45deg,
            #172554,
            #0c4a6e,
            #1e3a8a,
            #1e1b4b
          );
          background-size: 400% 400%;
          animation: gradientBG 15s ease infinite;
        }

        @keyframes gradientBG {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        /* Particles effect */
        #particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3Ccircle cx='13' cy='13' r='1'/%3E%3C/g%3E%3C/svg%3E");
          animation: animateParticles 60s linear infinite;
        }

        @keyframes animateParticles {
          0% {
            background-position: 0px 0px;
          }
          100% {
            background-position: 1000px 1000px;
          }
        }

        /* Nebula effects */
        .nebula {
          position: absolute;
          border-radius: 50%;
          filter: blur(40px);
        }

        .nebula-1 {
          top: 20%;
          left: 30%;
          width: 300px;
          height: 300px;
          background: radial-gradient(
            circle,
            rgba(106, 90, 205, 0.2) 0%,
            rgba(65, 105, 225, 0) 70%
          );
          animation: nebulaFloat 25s ease-in-out infinite alternate;
        }

        .nebula-2 {
          top: 50%;
          right: 20%;
          width: 250px;
          height: 250px;
          background: radial-gradient(
            circle,
            rgba(135, 206, 250, 0.15) 0%,
            rgba(65, 105, 225, 0) 70%
          );
          animation: nebulaFloat 30s ease-in-out infinite alternate-reverse;
        }

        .nebula-3 {
          bottom: 30%;
          left: 10%;
          width: 350px;
          height: 350px;
          background: radial-gradient(
            circle,
            rgba(176, 224, 230, 0.1) 0%,
            rgba(65, 105, 225, 0) 70%
          );
          animation: nebulaFloat 35s ease-in-out infinite alternate;
        }

        @keyframes nebulaFloat {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translate(30px, -20px) scale(1.2);
            opacity: 0.5;
          }
          100% {
            transform: translate(-30px, 20px) scale(1);
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
};

// Helper function to generate stars
function generateStars(count: number): string {
  let stars = "";
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * 2000);
    const y = Math.floor(Math.random() * 2000);
    const opacity = Math.random();
    const size = Math.random() * 2;
    stars += `${x}px ${y}px rgba(255, 255, 255, ${opacity})${
      i < count - 1 ? "," : ""
    }`;
  }
  return stars;
}

export default LoginBackground;

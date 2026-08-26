import { GridBackgroundDemo } from "../../components/Background/Background";
import { FeaturesSectionDemo } from "../../components/Features/Features";
import { motion, type Variants } from "framer-motion";
import BaseLayout from "../../components/Layout/BaseLayout";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Github } from "lucide-react";

export default function LandingPage() {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  } as Variants;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  } as Variants;

  // Hover animation for buttons
  const buttonHoverVariants = {
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: {
      scale: 0.95,
    },
  } as Variants;

  return (
    <BaseLayout>
      <motion.div
        className="relative flex flex-col justify-center min-h-screen px-6 py-12 bg-white dark:bg-black overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated Background */}
        <motion.div
          className="absolute inset-2 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <GridBackgroundDemo />
        </motion.div>

        {/* Hero section */}
        <motion.div
          className="flex sm:flex-row m-30"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="relative z-10 max-w-3xl text-left leading-4">
            {/* Tagline with letter animation */}
            <motion.div className="mb-6" variants={itemVariants}>
              <motion.h1
                className="text-9xl font-extrabold leading-tight text-gray-900 dark:text-white sm:text-5xl"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, type: "spring" }}
              >
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  Tailor your resume <br className="hidden sm:inline" />
                </motion.span>
                <motion.span
                  className="text-indigo-600"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  to job in seconds
                </motion.span>
              </motion.h1>
            </motion.div>

            {/* Motto with fade-in effect */}
            <motion.p
              className="mb-8 text-2xl text-gray-700 dark:text-gray-300 relative top-3"
              variants={itemVariants}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              Upload your resume, paste a job description, and let{" "}
              <motion.span
                initial={{ color: "#4F46E5" }}
                animate={{ color: ["#4F46E5", "#818CF8", "#4F46E5"] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Nexume
              </motion.span>
              <motion.span
                className="font-semibold text-indigo-600"
                whileHover={{ scale: 1.1 }}
              >
                .ai
              </motion.span>{" "}
              optimize your resume with the right keywords, skills, and
              formatting — all in one click.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-5 relative top-7"
              variants={containerVariants}
            >
              {isSignedIn && (
                <motion.button
                  onClick={() => navigate("/dashboard")}
                  className="px-8 py-3 text-white bg-indigo-600 rounded-2xl shadow-md hover:bg-indigo-700 transition"
                  variants={buttonHoverVariants}
                  whileHover="hover"
                  whileTap="tap"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.5 }}
                >
                  Dashboard
                </motion.button>
              )}
              <motion.a
                href="https://github.com/Abhinab04/NexsumeAI"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 text-md text-white bg-gradient-to-r from-black via-gray-900 to-gray-800 border border-indigo-600 shadow-lg rounded-2xl"
                variants={buttonHoverVariants}
                whileHover="hover"
                whileTap="tap"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
              >
                <Github size={20} className="text-indigo-400" />
                Github
              </motion.a>
            </motion.div>
          </div>
        </motion.div>

        {/* Features Section with Scroll Animation */}
        <motion.section
          id="features"
          className="z-10 leading-4 ml-28"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1 }}
        >
          {/* Animated Features heading */}
          <motion.div
            className="flex sm:flex-row"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-1xl mb-9 font-extrabold leading-tight text-gray-900 dark:text-white sm:text-5xl"
              whileHover={{ scale: 1.05 }}
            >
              Why{" "}
              <motion.span
                initial={{ color: "#4F46E5" }}
                animate={{ color: ["#4F46E5", "#818CF8", "#4F46E5"] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Nexsume
              </motion.span>
              <motion.span
                className="text-indigo-600"
                whileHover={{ scale: 1.1 }}
              >
                .ai
              </motion.span>{" "}
              ?
            </motion.h1>
          </motion.div>
        </motion.section>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <FeaturesSectionDemo />
        </motion.div>
        {/* Pricing Section */}
        <section id="pricing" className="py-20 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6">Simple Pricing</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
            Start tailoring your resume for free. Upgrade when you need unlimited access.
          </p>
          <div className="bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-3xl p-10 max-w-sm mx-auto shadow-xl">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Pro Plan</h3>
            <div className="text-5xl font-extrabold text-indigo-600 mb-6">$9<span className="text-lg text-gray-500 font-medium">/mo</span></div>
            <ul className="text-left space-y-3 mb-8 text-gray-700 dark:text-gray-300">
              <li>✅ Unlimited Resume Analysis</li>
              <li>✅ ATS Optimization</li>
              <li>✅ Export to PDF & DOCX</li>
              <li>✅ Priority Support</li>
            </ul>
            <button className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition">Get Started</button>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 text-center mb-10">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6">Get in Touch</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            Have questions or need support? Send us a message and we'll get back to you shortly.
          </p>

          <form 
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const email = (form.elements.namedItem('email') as HTMLInputElement).value;
              const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;
              const btn = form.querySelector('button');
              if (btn) btn.disabled = true;

              try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/features/contact`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email, message }),
                });

                if (!response.ok) throw new Error('Failed to send message');
                
                alert('Message sent successfully! We will get back to you soon.');
                form.reset();
              } catch (err) {
                alert('Failed to send message. Please try again later.');
              } finally {
                if (btn) btn.disabled = false;
              }
            }}
            className="max-w-md mx-auto flex flex-col gap-4 text-left"
          >
            <input 
              name="email"
              type="email" 
              required 
              placeholder="Your email address" 
              className="w-full p-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <textarea 
              name="message"
              required 
              rows={4}
              placeholder="How can we help you?" 
              className="w-full p-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button 
              type="submit" 
              className="w-full py-4 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black font-bold hover:scale-[1.02] transition shadow-lg disabled:opacity-50"
            >
              Send Message
            </button>
          </form>
        </section>

      </motion.div>
    </BaseLayout>
  );
}

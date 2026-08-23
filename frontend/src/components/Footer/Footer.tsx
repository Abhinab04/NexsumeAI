import { motion } from "framer-motion";

function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="bg-white dark:bg-black w-full py-12 px-6 border-t border-gray-200 dark:border-gray-800 text-center font-mono"
    >
      <p className="italic text-sm max-w-2xl mx-auto text-gray-500 dark:text-gray-400 mb-6">
        "The right fit, every time — powered by intelligent resume matching."
      </p>

      <p className="text-sm text-gray-400 dark:text-gray-500">
        &copy; {new Date().getFullYear()} Nexsume.ai. All rights reserved.
      </p>
    </motion.footer>
  );
}

export default Footer;

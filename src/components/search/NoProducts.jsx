import { motion } from "framer-motion";

export default function NoProducts() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-4 text-center w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      exit={{ opacity: 0, y: -10 }}
      aria-live="polite"
      role="status"
    >
      <motion.div 
        className="relative mb-8"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-28 w-28 text-gray-400 dark:text-gray-400 opacity-90"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <motion.div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="h-20 w-20 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 blur-lg" />
        </motion.div>
      </motion.div>

      <motion.h3 
        className="text-2xl font-bold text-gray-900  mb-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        لم يتم العثور على نتائج
      </motion.h3>
      
      <motion.p 
        className="text-gray-600 dark:text-gray-600 max-w-md leading-relaxed mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        لا توجد منتجات تطابق معايير البحث الخاصة بك. حاول تعديل الفلاتر أو البحث باستخدام كلمات أخرى.
      </motion.p>

      <motion.div 
        className="mt-8 h-1.5 w-24 bg-gradient-to-r from-teal-400 to-teal-600 rounded-full opacity-90"
        initial={{ width: 0 }}
        animate={{ width: "6rem" }}
        transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
      />
    </motion.div>
  );
}
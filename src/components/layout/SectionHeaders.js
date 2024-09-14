import { motion } from "framer-motion";

export default function SectionHeaders({ subHeader, mainHeader }) {
  return (
    <div className="text-center mb-8">
      <motion.h3
        className="uppercase text-orange-500 font-semibold text-sm tracking-wider mb-2"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {subHeader}
      </motion.h3>
      <motion.h2
        className="text-3xl md:text-4xl font-bold text-gray-800 relative inline-block"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {mainHeader}
        <motion.span
          className="absolute -bottom-2 left-0 w-full h-1 bg-orange-500"
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          transition={{ duration: 0.5, delay: 0.4 }}
        />
      </motion.h2>
    </div>
  );
}

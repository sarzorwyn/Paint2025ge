import { motion } from "framer-motion";

const AccordionMotion = ({ children }: { children: React.ReactNode; }) => {
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto"}}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="overflow-hidden"
      >
        {children}
      </motion.div>
    );
  };

export default AccordionMotion;
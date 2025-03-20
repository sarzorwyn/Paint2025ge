
import { motion } from "framer-motion";

const TableMotion = ({children}: { children: React.ReactNode }) => {
    return (
        <motion.tr
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 50 }}
            className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors"
      >
        {children}
      </motion.tr>
    )
}

export default TableMotion;
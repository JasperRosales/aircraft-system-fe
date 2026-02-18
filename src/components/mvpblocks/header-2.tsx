import { useState, useEffect } from "react";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import { Menu, X, Plane, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header({ onLogout }: { onLogout?: () => void }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0 },
    };

    const mobileMenuVariants = {
        closed: {
            opacity: 0,
            x: "100%",
            transition: { duration: 0.3, ease: easeInOut },
        },
        open: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.3, ease: easeInOut },
        },
    };

    return (
        <>
            <motion.header
                className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ${
                    isScrolled
                        ? "border-border/50 bg-background/80 border-b shadow-sm backdrop-blur-md"
                        : "bg-transparent"
                }`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <motion.div
                            className="flex items-center space-x-3"
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 25,
                            }}
                        >
                            <Link
                                to="/"
                                className="flex items-center space-x-3"
                            >
                                <div className="relative">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-500 shadow-lg">
                                        <Plane className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="absolute -top-1 -right-1 h-3 w-3 animate-pulse rounded-full bg-green-400" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="md:text-lg font-bold text-gray-500 text-shadow-2xs">
                                        Aircraft System
                                    </span>
                                    <span className="text-muted-foreground -mt-1 text-xs text-shadow-2xs">
                                        Monitor Planes
                                    </span>
                                </div>
                            </Link>
                        </motion.div>

                        {/* Desktop actions */}
                        <motion.div
                            className="hidden items-center lg:flex"
                            variants={itemVariants}
                        >
                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 rounded-lg bg-gray-500 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-gray-800/70"
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    onLogout?.();
                                }}
                            >
                                <LogOut className="h-4 w-4" />
                                <span>Logout</span>
                            </motion.button>
                        </motion.div>

                        {/* Mobile menu toggle */}
                        <motion.button
                            className="text-foreground hover:bg-muted rounded-lg p-2 transition-colors duration-200 lg:hidden"
                            onClick={() =>
                                setIsMobileMenuOpen(!isMobileMenuOpen)
                            }
                            variants={itemVariants}
                            whileTap={{ scale: 0.95 }}
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </motion.button>
                    </div>
                </div>
            </motion.header>

            {/* Mobile menu (actions only) */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <motion.div
                            className="border-border bg-background fixed top-16 right-4 z-50 w-80 overflow-hidden rounded-2xl border shadow-2xl lg:hidden"
                            variants={mobileMenuVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                        >
                            <div className="space-y-6 p-6">
                                <div className="border-border space-y-3 border-t pt-6">
                                    <button
                                        type="button"
                                        className="text-background flex w-full items-center justify-center gap-2 rounded-lg bg-gray-500 py-3 text-center font-medium transition-all duration-200 hover:bg-gray-800/70"
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            onLogout?.();
                                        }}
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

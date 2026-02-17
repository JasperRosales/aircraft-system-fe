import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plane, Lock, User, ArrowRight } from "lucide-react";
import { authService } from "@/service/auth.service";

interface LoginPageProps {
    onLogin: (role: "user" | "mechanic") => void;
    onRegisterClick: () => void;
}

export default function LoginPage({
    onLogin,
    onRegisterClick,
}: LoginPageProps) {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !password) {
            setError("Please enter both name and password");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const user = await authService.login(name, password);

            // Map backend role to frontend role
            if (user.role === "mechanic" || name.toLowerCase() === "mechanic") {
                onLogin("mechanic");
            } else {
                onLogin("user");
            }
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Login failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-x-hidden">
            <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-gray-400 blur-3xl animate-[float_8s_ease-in-out_infinite]" />
            <div className="absolute top-1/3 -right-32 h-72 w-72 rounded-full bg-gray-400 blur-3xl animate-[float_10s_ease-in-out_infinite]" />
            <div className="absolute bottom-10 left-1/3 h-56 w-56 rounded-full bg-gray-400 blur-2xl animate-[float_12s_ease-in-out_infinite]" />

            <div className="relative w-90 max-w-md space-y-6 rounded-xl bg-white p-8 shadow-2xl md:w-100">
                <div className="space-y-2 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border bg-gray-500 shadow-2xl">
                        <Plane className="h-8 w-8 text-white text-shadow-2xs" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-500 text-shadow-2xs">
                        Aircraft System
                    </h1>
                    <p className="-mt-2.5 text-slate-500 text-shadow-2xs">
                        Sign in to continue
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label
                            htmlFor="name"
                            className="text-sm font-medium text-gray-500 text-shadow-2xs"
                        >
                            Username
                        </label>
                        <div className="relative">
                            <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your username"
                                className="w-full rounded-lg border py-2 pr-4 pl-10 text-gray-500 shadow-2xl shadow-gray-700/40 focus:outline-none"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="password"
                            className="text-sm font-medium text-gray-500 text-shadow-2xs"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full rounded-lg border py-2 pr-4 pl-10 text-gray-500 shadow-2xl shadow-gray-700/40 focus:outline-none "
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <Button
                        type="submit"
                        className="w-full rounded-lg border border-gray-400 bg-gray-500 py-2 font-semibold text-white shadow-lg shadow-gray-700/40 transition-all hover:bg-gray-700/90"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </Button>
                </form>

                <div className="text-center">
                    <button
                        type="button"
                        onClick={onRegisterClick}
                        className="flex items-center justify-center gap-1 text-sm text-gray-500 hover:underline focus:outline-none"
                    >
                        Don't have an account? Register
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    // Bright Form: White background with luxury gold borders
                    "flex min-h-[48px] w-full rounded-md",
                    "border-2 border-luxury-gold/40 bg-white",
                    "px-4 py-3 text-base text-luxury-black",
                    "ring-offset-background",
                    "file:border-0 file:bg-transparent file:text-base file:font-medium",
                    // No placeholder styling - labels guide users instead
                    "placeholder:text-transparent",
                    // Clear focus states with solid gold border
                    "focus-visible:outline-none focus-visible:border-luxury-gold",
                    "focus-visible:ring-2 focus-visible:ring-luxury-gold/30",
                    "disabled:cursor-not-allowed disabled:opacity-60",
                    "transition-all duration-200",
                    className
                )}
                ref={ref}
                {...props}
                suppressHydrationWarning
            />
        )
    }
)
Input.displayName = "Input"

export { Input }

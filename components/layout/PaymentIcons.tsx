import React from "react";
import Image from "next/image";

export function PaymentIcons() {
    return (
        <div className="flex gap-2 items-center opacity-90 transition-all duration-500">
            {/* Visa - Dark Blue Background */}
            <div className="bg-[#1434CB] border border-white/10 rounded-sm w-12 h-8 flex items-center justify-center relative overflow-hidden shrink-0">
                <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                    alt="Visa"
                    width={36}
                    height={36}
                    className="object-contain w-10 h-auto brightness-200 contrast-200"
                />
            </div>

            {/* MasterCard */}
            <div className="bg-white border border-white/10 rounded-sm w-12 h-8 flex items-center justify-center relative overflow-hidden shrink-0">
                <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                    alt="MasterCard"
                    width={36}
                    height={36}
                    className="object-contain w-10 h-auto"
                />
            </div>

            {/* Amex - White Background, Blue Logo */}
            <div className="bg-white border border-white/10 rounded-sm w-12 h-8 flex items-center justify-center relative overflow-hidden shrink-0">
                <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg"
                    alt="American Express"
                    width={36}
                    height={36}
                    className="object-contain w-10 h-auto"
                />
            </div>

            {/* Discover - White bg */}
            <div className="bg-white border border-white/10 rounded-sm w-12 h-8 flex items-center justify-center relative overflow-hidden shrink-0">
                <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/5/57/Discover_Card_logo.svg"
                    alt="Discover"
                    width={36}
                    height={36}
                    className="object-contain w-10 h-auto"
                />
            </div>

            {/* Bitcoin - White/Grey bg */}
            <div className="bg-[#EAEAEA] border border-white/10 rounded-sm w-12 h-8 flex items-center justify-center relative overflow-hidden shrink-0">
                <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/4/46/Bitcoin.svg"
                    alt="Bitcoin"
                    width={36}
                    height={36}
                    className="object-contain w-8 h-auto"
                />
            </div>

            {/* PayPal - White bg */}
            <div className="bg-white border border-white/10 rounded-sm w-12 h-8 flex items-center justify-center relative overflow-hidden shrink-0">
                <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                    alt="PayPal"
                    width={36}
                    height={36}
                    className="object-contain w-10 h-auto"
                />
            </div>
        </div>
    );
}

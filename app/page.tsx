'use client'
import Link from 'next/link';

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-5xl font-extrabold text-white mb-4">
                Welcome to LiveStocX
            </h1>
            <p className="text-xl text-gray-400 mb-8">
                The Future of Fractional Livestock Ownership
            </p>
            {/* This link now correctly points to your new token marketplace */}
            <Link href="/tokens">
                <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors duration-200">
                    View Token Marketplace
                </button>
            </Link>
        </div>
    );
}
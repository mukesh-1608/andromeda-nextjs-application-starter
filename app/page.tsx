'use client'
import Link from 'next/link';
import { Fragment } from 'react';

export default function Home() {
    return (
        <Fragment>
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <h1 className="text-5xl font-extrabold text-white mb-4">
                    Welcome to LiveStocX
                </h1>
                <p className="text-xl text-gray-400 mb-8">
                    The Future of Fractional Livestock Ownership
                </p>
                <Link href="/marketplace">
                    <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors duration-200">
                        View Marketplace
                    </button>
                </Link>
            </div>
        </Fragment>
    );
}
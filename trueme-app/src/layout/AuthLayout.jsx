import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AuthLayout = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <Link to="/" className="text-4xl font-bold font-serif italic text-primary">TrueMe</Link>
                    <h2 className="mt-2 text-center text-sm text-gray-600">
                        Your journey to authentic beauty starts here.
                    </h2>
                </div>

                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <Outlet />
                    </div>
                </div>

                <div className="text-center text-xs text-gray-500">
                    &copy; {new Date().getFullYear()} TrueMe. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;

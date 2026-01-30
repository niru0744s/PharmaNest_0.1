import React from 'react';
import HostSidebar from './HostSidebar';

const HostLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="flex min-h-[calc(100vh-64px)] bg-gray-50">
            <HostSidebar />
            <main className="flex-grow ml-64 p-8 pt-28">
                {children}
            </main>
        </div>
    );
};

export default HostLayout;

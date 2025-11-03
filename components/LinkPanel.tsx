import React, { useState } from 'react';
import type { NicheData, Channel } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface LinkPanelProps {
  selectedNiche: string | null;
  data: NicheData | null;
  isLoading: boolean;
  error: string | null;
}

const PlatformIcon = ({ platform }: { platform: Channel['platform'] }) => {
  const icons = {
    Facebook: (
      <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
      </svg>
    ),
    YouTube: (
      <svg className="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M19.777 4.869a2.448 2.448 0 0 0-1.73-1.731C16.4 2.7 12 2.7 12 2.7s-4.4 0-6.047.438a2.448 2.448 0 0 0-1.73 1.731C3.785 6.55 3.75 12 3.75 12s.035 5.45 1.47 7.131a2.448 2.448 0 0 0 1.73 1.731C8.6 21.3 12 21.3 12 21.3s4.4 0 6.047-.438a2.448 2.448 0 0 0 1.73-1.731C20.215 17.45 20.25 12 20.25 12s-.035-5.45-1.473-7.131ZM9.75 15.3V8.7l5.25 3.3-5.25 3.3z" clipRule="evenodd" />
      </svg>
    ),
    TikTok: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.05-4.84-.94-6.37-2.96-2.29-3.05-2.5-6.72-1.7-9.71.2-1.51.86-2.93 1.87-4.12 2.24-2.62 5.6-3.95 9.07-3.93v.01z" />
      </svg>
    )
  };
  return icons[platform] || null;
};

const LinkPanel: React.FC<LinkPanelProps> = ({ selectedNiche, data, isLoading, error }) => {
    const [isOpeningWebsites, setIsOpeningWebsites] = useState(false);
    const [isOpeningSearches, setIsOpeningSearches] = useState(false);
    const [isOpeningChannels, setIsOpeningChannels] = useState(false);

    const openLinksWithDelay = async (urls: string[], delay: number, setLoading: (isLoading: boolean) => void) => {
        setLoading(true);
        try {
            for (const url of urls) {
                window.open(url, '_blank', 'noopener,noreferrer');
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAllWebsites = () => {
        if (data?.websites) {
            const urls = data.websites.map(link => link.url);
            openLinksWithDelay(urls, 1500, setIsOpeningWebsites);
        }
    };

    const handleOpenAllSearches = () => {
        if (data?.searchQueries) {
            const urls = data.searchQueries.map(query => `https://www.google.com/search?q=${encodeURIComponent(query)}`);
            openLinksWithDelay(urls, 1500, setIsOpeningSearches);
        }
    };

    const handleOpenAllChannels = () => {
        if (data?.popularChannels) {
            const urls = data.popularChannels.map(channel => channel.url);
            openLinksWithDelay(urls, 1500, setIsOpeningChannels);
        }
    };
    
    const anyButtonOpening = isOpeningWebsites || isOpeningSearches || isOpeningChannels;

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <LoadingSpinner />
                    <p className="mt-4 text-lg text-slate-300">Generating data for</p>
                    <p className="font-semibold text-teal-400 text-xl">{selectedNiche}...</p>
                </div>
            );
        }

        if (error) {
             return (
                 <div className="flex flex-col items-center justify-center h-full text-center p-8">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                     <h3 className="mt-4 text-xl font-semibold text-red-400">Generation Failed</h3>
                     <p className="mt-2 text-slate-300">{error}</p>
                 </div>
             );
        }

        if (!selectedNiche) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                    </svg>
                    <h3 className="mt-4 text-2xl font-bold text-slate-300">Select a Niche</h3>
                    <p className="mt-2 text-slate-400">Choose a niche from the list to generate relevant data.</p>
                </div>
            );
        }
        
        if (!data) return null;

        return (
            <div className="h-full overflow-y-auto">
                <p className="text-slate-400 mb-4">Showing results for: <span className="font-semibold text-slate-200">{selectedNiche}</span></p>

                {/* Websites Section (used by all categories) */}
                {data.websites && data.websites.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-teal-400 mb-4">{data.popularChannels ? "Social Media Sites" : "Generated Websites"}</h2>
                        <button onClick={handleOpenAllWebsites} disabled={anyButtonOpening} className="w-full mb-2 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                            {isOpeningWebsites ? 'Opening...' : 'Open All Links'}
                        </button>
                         <p className="text-xs text-slate-500 text-center mb-4">Note: Your browser may block pop-ups. Please allow them for this site.</p>
                        <ul className="space-y-3">
                            {data.websites.map((link, index) => (
                                <li key={index} className="bg-slate-800 rounded-lg hover:bg-slate-700/50 transition-all duration-200 shadow-md">
                                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 group">
                                        <div>
                                            <p className="font-semibold text-teal-400 group-hover:text-teal-300">{link.name}</p>
                                            <p className="text-xs text-slate-400 group-hover:text-slate-300 truncate">{link.url}</p>
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500 group-hover:text-teal-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                
                {/* Popular Channels Section (TikTok category) */}
                {data.popularChannels && data.popularChannels.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-teal-400 mb-4">Popular Channels</h2>
                        <button onClick={handleOpenAllChannels} disabled={anyButtonOpening} className="w-full mb-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10
import React, { useState, useEffect, useCallback } from 'react';
// FIX: Import `generateNicheData` from `geminiService` to be used when a niche is selected.
import { fetchNichesByCategory, generateNicheData } from './services/geminiService';
import type { NicheData } from './types';
import Header from './components/Header';
import NicheList from './components/NicheList';
import LinkPanel from './components/LinkPanel';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';

const CATEGORIES = ['High-Paying', 'Entertainment', 'Pinterest', 'TikTok'];

const App: React.FC = () => {
  const [allNiches, setAllNiches] = useState<{ [key: string]: string[] }>({});
  const [activeCategory, setActiveCategory] = useState<string>(CATEGORIES[0]);
  const [selectedNiche, setSelectedNiche] = useState<string | null>(null);
  const [generatedData, setGeneratedData] = useState<NicheData | null>(null);
  const [isLoadingNiches, setIsLoadingNiches] = useState<boolean>(true);
  const [isGeneratingLinks, setIsGeneratingLinks] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadAllNiches = useCallback(async () => {
    try {
      setError(null);
      setIsLoadingNiches(true);
      
      const results = await Promise.allSettled(
        CATEGORIES.map(category => fetchNichesByCategory(category))
      );

      const newAllNiches = CATEGORIES.reduce((acc, category, index) => {
        const result = results[index];
        if (result.status === 'fulfilled') {
          acc[category] = result.value;
        } else {
          console.error(`Failed to load niches for ${category}`, result.reason);
          acc[category] = []; // Assign empty array on failure
        }
        return acc;
      }, {} as { [key: string]: string[] });

      setAllNiches(newAllNiches);

      if (Object.values(newAllNiches).every(list => list.length === 0)) {
        setError("Could not load any niche lists. Please try refreshing the page.");
      }

    } catch (err) {
      console.error("An unexpected error occurred while fetching niches:", err);
      setError("An unexpected error occurred. Please try refreshing the page.");
    } finally {
      setIsLoadingNiches(false);
    }
  }, []);

  useEffect(() => {
    loadAllNiches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
    setSelectedNiche(null);
    setGeneratedData(null);
    setError(null);
  };

  const handleNicheSelect = async (niche: string) => {
    if (niche === selectedNiche) return;

    setSelectedNiche(niche);
    setIsGeneratingLinks(true);
    setGeneratedData(null);
    setError(null);

    try {
      const data = await generateNicheData(niche, activeCategory);
      setGeneratedData(data);
    } catch (err) {
      console.error(`Failed to generate data for ${niche}:`, err);
      setError(`Could not generate links for "${niche}". Please try again or select a different niche.`);
    } finally {
      setIsGeneratingLinks(false);
    }
  };

  const currentNiches = allNiches[activeCategory] || [];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-teal-400 mb-4">Select a Niche</h2>
            
            <div className="flex space-x-1 sm:space-x-2 border-b border-slate-700 mb-4 overflow-x-auto pb-1">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  disabled={isLoadingNiches}
                  className={`px-3 py-2 text-sm font-semibold transition-colors duration-200 ease-in-out focus:outline-none rounded-t-lg flex-shrink-0 ${
                    activeCategory === category
                      ? 'border-b-2 border-teal-400 text-teal-400 bg-slate-800/60'
                      : 'text-slate-400 hover:text-slate-200'
                  } ${isLoadingNiches ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  {category}
                </button>
              ))}
            </div>

            {isLoadingNiches ? (
              <div className="flex justify-center items-center h-96 bg-slate-800/50 rounded-lg">
                <LoadingSpinner />
              </div>
            ) : error && currentNiches.length === 0 ? (
               <ErrorDisplay message={error} onRetry={loadAllNiches} />
            ) : (
              <NicheList
                niches={currentNiches}
                selectedNiche={selectedNiche}
                onNicheSelect={handleNicheSelect}
                isDisabled={isGeneratingLinks}
              />
            )}
          </div>

          <div className="lg:col-span-2">
             <LinkPanel
                selectedNiche={selectedNiche}
                data={generatedData}
                isLoading={isGeneratingLinks}
                error={error}
             />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;

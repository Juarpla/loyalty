"use client";

import { useSocialIdeas } from "@/hooks/use-social.hook";
import { ContextForm } from "@/components/social/context-form.component";
import { SuggestionsCards } from "@/components/social/suggestions-cards.component";
import type { Suggestion } from "@/components/social/suggestions-cards.component";

export default function ManagerSocialPage() {
  const {
    context,
    ideas,
    loading,
    error,
    successMessage,
    setContext,
    generateIdeas,
  } = useSocialIdeas();

  const suggestions: Suggestion[] = ideas.map((idea, index) => ({
    id: `idea-${index}`,
    title: idea.title,
    body: idea.body,
    hashtags: Array.isArray(idea.hashtags) ? idea.hashtags.join(" ") : idea.hashtags,
    visualPrompt: idea.visualPrompt,
  }));

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-zinc-100 mb-8 tracking-tight">
          Social Content Ideas
        </h1>
        
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8">
          {/* Left Column: Form */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-zinc-900/40 rounded-xl p-6 border border-zinc-800/50 mb-2">
              <h2 className="text-xl font-semibold text-zinc-200 mb-2">
                Generate Content
              </h2>
              <p className="text-sm text-zinc-400">
                Provide a brief context or topic, and we&apos;ll generate ideas for your next social media post, complete with titles, captions, visual prompts, and hashtags.
              </p>
            </div>

            <ContextForm
              context={context}
              loading={loading}
              error={error}
              successMessage={successMessage}
              setContext={setContext}
              onSubmit={generateIdeas}
            />
          </div>

          {/* Right Column: Suggestions */}
          <div className="lg:col-span-7">
            {loading ? (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-zinc-200 px-2">
                  Generating Suggestions...
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="animate-pulse bg-zinc-900/50 rounded-2xl border border-zinc-800/50 p-6 h-64 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="h-4 bg-zinc-800/80 rounded w-3/4"></div>
                        <div className="h-4 bg-zinc-800/80 rounded w-1/2"></div>
                        <div className="h-20 bg-zinc-800/80 rounded w-full"></div>
                      </div>
                      <div className="h-8 bg-zinc-800/80 rounded w-full mt-4"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : suggestions && suggestions.length > 0 ? (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-zinc-200 px-2">
                  Generated Suggestions
                </h2>
                <SuggestionsCards suggestions={suggestions} />
              </div>
            ) : (
              <div className="h-full min-h-[300px] flex items-center justify-center p-8 text-zinc-500 bg-zinc-900/30 rounded-2xl border border-zinc-800/40 border-dashed">
                <p className="text-center text-sm">
                  Fill out the context on the left to generate social media posts.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { SuggestionsCards } from '@/components/social/suggestions-cards.component';

export default function TestSocialCardsPage() {
  const sampleSuggestions = [
    {
      id: '1',
      title: 'Sunny Weekend Sale',
      body: 'Come grab a coffee and enjoy 20% off!\nValid this weekend only.',
      hashtags: '#WeekendSale #Coffee',
      visualPrompt: 'A bright, sunny photo of our storefront'
    }
  ];

  return (
    <div className="p-8 max-w-2xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Test Harness: Suggestions Cards</h1>
      <SuggestionsCards suggestions={sampleSuggestions} />
    </div>
  );
}

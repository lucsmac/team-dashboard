import { BlockersPanel } from './BlockersPanel';
import { AchievementsPanel } from './AchievementsPanel';
import { ImportantInfoPanel } from './ImportantInfoPanel';

/**
 * Grid com os três painéis de highlights
 */
export const HighlightsGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <BlockersPanel />
      <AchievementsPanel />
      <ImportantInfoPanel />
    </div>
  );
};

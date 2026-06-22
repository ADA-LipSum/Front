import { EventCard } from './RightWidget/EventCard';
import { ProfileCard } from './RightWidget/ProfileCard';
import { PopularTagsCard } from './RightWidget/PopularTagsCard';

export const RightWidget = () => {
  return (
    <div className="flex flex-col gap-4 py-8 w-72">
      <EventCard />
      <ProfileCard />
      <PopularTagsCard />
    </div>
  );
};

import BlogCards from './BlogCards';
import ChannelSection from './ChannelSection';
import ContributorRanking from './ContributorRanking';
import EventBanner from './EventBanner';
import LatestPosts from './LatestPosts';

const Home = () => {
    return (
        <div className="flex flex-col lg:flex-row gap-6 px-4 lg:px-8 py-8 bg-gray-50">
            <ContributorRanking />

            <main className="flex-1 flex flex-col gap-6">
                <EventBanner />
                <ChannelSection />
                <BlogCards />
            </main>

            <LatestPosts />
        </div>
    );
};

export default Home;

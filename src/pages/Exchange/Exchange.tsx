import { ExchangeBanner } from '@/components/exchange/ExchangeBanner';
import { UserCoinBanner } from '@/components/exchange/UserInfo';

export const Exchange = () => {
  return (
    <div>
      <ExchangeBanner />
      <UserCoinBanner />
    </div>
  );
};

import { useEffect, useState } from 'react';
import { getOfferDeadline, renewOfferDeadline } from '@/lib/quickCareerOffer';

/**
 * useOfferCountdown — live mm:ss countdown for the ad discount window.
 * The window refreshes itself once it lapses, so the offer never dead-ends.
 */
export default function useOfferCountdown() {
  const [deadline, setDeadline] = useState(getOfferDeadline);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (deadline <= now) setDeadline(renewOfferDeadline());
  }, [deadline, now]);

  const totalSeconds = Math.max(0, Math.floor((deadline - now) / 1000));

  return {
    minutes: String(Math.floor(totalSeconds / 60)).padStart(2, '0'),
    seconds: String(totalSeconds % 60).padStart(2, '0'),
    urgent: totalSeconds <= 300,
  };
}
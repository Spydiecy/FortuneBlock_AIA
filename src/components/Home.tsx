import React from 'react';
import { motion } from 'framer-motion';
import { LightBulbIcon, CurrencyDollarIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Decentralized Lottery',
    description: 'Participate in fair and transparent lotteries powered by blockchain technology.',
    icon: LightBulbIcon,
  },
  {
    name: 'Instant Payouts',
    description: 'Winners receive their prizes immediately after the lottery ends.',
    icon: CurrencyDollarIcon,
  },
  {
    name: 'Secure and Trustless',
    description: 'Smart contracts ensure the integrity of every lottery draw.',
    icon: ShieldCheckIcon,
  },
];

const Home: React.FC = () => {
  return (
    <div className="py-12 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-neon-green font-semibold tracking-wide uppercase">FortuneBlock</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            A new era of digital lotteries
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
            Join the revolution of decentralized lotteries and experience the future of fair gaming.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <motion.div
                key={feature.name}
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-neon-green text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">{feature.name}</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-300">{feature.description}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Home;
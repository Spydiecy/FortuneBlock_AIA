import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ethers } from 'ethers';

interface ProfileProps {
  contract: ethers.Contract | null;
  account: string | null;
  username: string;
}

interface UserProfile {
  username: string;
  participatedLotteries: number[];
  wonLotteries: number[];
  totalWinnings: string;
}

const Profile: React.FC<ProfileProps> = ({ contract, account, username }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (contract && account) {
        try {
          const profile = await contract.getUserProfile(account);
          setUserProfile({
            username: profile.username,
            participatedLotteries: profile.participatedLotteries.map((id: ethers.BigNumber) => id.toNumber()),
            wonLotteries: profile.wonLotteries.map((id: ethers.BigNumber) => id.toNumber()),
            totalWinnings: ethers.utils.formatEther(profile.totalWinnings)
          });
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
        }
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, [contract, account]);

  if (loading) {
    return <div className="text-center">Loading profile...</div>;
  }

  if (!userProfile) {
    return <div className="text-center">No profile found. Please register a username.</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">User Profile</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-300">Personal details and lottery history.</p>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700">
          <dl>
            <div className="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">Username</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{userProfile.username}</dd>
            </div>
            <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">Wallet Address</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{account}</dd>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">Participated Lotteries</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                {userProfile.participatedLotteries.join(', ') || 'None'}
              </dd>
            </div>
            <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">Won Lotteries</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                {userProfile.wonLotteries.join(', ') || 'None'}
              </dd>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">Total Winnings</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{userProfile.totalWinnings} GAS</dd>
            </div>
          </dl>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
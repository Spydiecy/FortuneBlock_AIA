import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ethers } from 'ethers';
import { User, Ticket, Trophy, DollarSign } from 'lucide-react';

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
  totalParticipations: number;
}

const Profile: React.FC<ProfileProps> = ({ contract, account, username }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (contract && account) {
        try {
          setLoading(true);
          const profile = await contract.getUserProfile(account);
          setUserProfile({
            username: profile.username,
            participatedLotteries: profile.participatedLotteries.map((id: ethers.BigNumber) => id.toNumber()),
            wonLotteries: profile.wonLotteries.map((id: ethers.BigNumber) => id.toNumber()),
            totalWinnings: ethers.utils.formatEther(profile.totalWinnings),
            totalParticipations: profile.totalParticipations.toNumber()
          });
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserProfile();
  }, [contract, account]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="text-center text-gray-600 dark:text-gray-300">
        No profile found. Please register a username.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black text-gray-900 dark:text-white transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow overflow-hidden sm:rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-300">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">User Profile</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-300">Personal details and lottery history.</p>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700">
              <dl>
                {[
                  { label: 'Username', value: userProfile.username, icon: User },
                  { label: 'Participated Lotteries', value: userProfile.participatedLotteries.join(', ') || 'None', icon: Ticket },
                  { label: 'Won Lotteries', value: userProfile.wonLotteries.join(', ') || 'None', icon: Trophy },
                  { label: 'Total Winnings', value: `${userProfile.totalWinnings} GAS`, icon: DollarSign },
                  { label: 'Total Participations', value: userProfile.totalParticipations.toString(), icon: Ticket },
                ].map((item, index) => (
                  <motion.div 
                    key={item.label}
                    className={`${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-900' : 'bg-white dark:bg-gray-800'} px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-300 flex items-center">
                      <item.icon className="h-5 w-5 mr-2 text-emerald-500" />
                      {item.label}
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{item.value}</dd>
                  </motion.div>
                ))}
              </dl>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
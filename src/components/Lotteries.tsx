import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { ethers } from 'ethers';

interface LotteriesProps {
  contract: ethers.Contract | null;
  account: string | null;
}

interface Lottery {
  id: number;
  endTime: Date;
  prizePool: string;
  participants: number;
}

const Lotteries: React.FC<LotteriesProps> = ({ contract, account }) => {
  const [lotteries, setLotteries] = useState<Lottery[]>([]);
  const [loading, setLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState('');

  useEffect(() => {
    const fetchLotteries = async () => {
      if (contract) {
        try {
          // Assuming the contract has a method to get all active lotteries
          const activeLotteries = await contract.getActiveLotteries();
          const formattedLotteries = await Promise.all(activeLotteries.map(async (id: ethers.BigNumber) => {
            const details = await contract.getLotteryDetails(id);
            return {
              id: id.toNumber(),
              endTime: new Date(details.endTime.toNumber() * 1000),
              prizePool: ethers.utils.formatEther(details.prizePool),
              participants: details.participants.length,
            };
          }));
          setLotteries(formattedLotteries);
        } catch (error) {
          console.error('Failed to fetch lotteries:', error);
          toast.error('Failed to fetch lotteries');
        }
      }
      setLoading(false);
    };

    fetchLotteries();
  }, [contract]);

  const handleDeposit = async (lotteryId: number) => {
    if (!account) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast.error('Please enter a valid deposit amount');
      return;
    }

    if (contract) {
      try {
        const tx = await contract.deposit(lotteryId, {
          value: ethers.utils.parseEther(depositAmount)
        });
        await tx.wait();
        toast.success('Deposit successful!');
        // Refresh lotteries after deposit
        const updatedLottery = await contract.getLotteryDetails(lotteryId);
        setLotteries(lotteries.map(lottery => 
          lottery.id === lotteryId 
            ? { 
                ...lottery, 
                prizePool: ethers.utils.formatEther(updatedLottery.prizePool),
                participants: updatedLottery.participants.length
              }
            : lottery
        ));
      } catch (error) {
        console.error('Deposit failed:', error);
        toast.error('Deposit failed. Please try again.');
      }
    }
  };

  if (loading) {
    return <div className="text-center">Loading lotteries...</div>;
  }

  return (
    <div className="py-12">
      <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-8">Active Lotteries</h2>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {lotteries.map((lottery) => (
          <motion.div
            key={lottery.id}
            className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Lottery #{lottery.id}</h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-300">
                <p>End Time: {lottery.endTime.toLocaleString()}</p>
                <p>Prize Pool: {lottery.prizePool} GAS</p>
                <p>Participants: {lottery.participants}</p>
              </div>
              <div className="mt-5">
                <input
                  type="number"
                  placeholder="Deposit amount"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-neon-green focus:border-neon-green sm:text-sm"
                />
                <button
                  onClick={() => handleDeposit(lottery.id)}
                  className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-neon-green hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neon-green"
                >
                  Deposit
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Lotteries;
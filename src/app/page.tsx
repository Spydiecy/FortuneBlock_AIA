'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ethers } from 'ethers';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Home from '../components/Home';
import Lotteries from '../components/Lotteries';
import Profile from '../components/Profile';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contract';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum as any);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        setContract(contract);

        const accounts = await provider.send("eth_requestAccounts", []);
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          const username = await contract.getUserProfile(accounts[0]);
          setUsername(username);
        }
      }
    };
    init();
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum as any);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    }
  };

  const registerUsername = async (newUsername: string) => {
    if (contract && account) {
      try {
        const tx = await contract.registerUsername(newUsername);
        await tx.wait();
        setUsername(newUsername);
      } catch (error) {
        console.error('Failed to register username:', error);
      }
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'lotteries':
        return <Lotteries contract={contract} account={account} />;
      case 'profile':
        return <Profile contract={contract} account={account} username={username} />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <Navbar
        account={account}
        username={username}
        connectWallet={connectWallet}
        setCurrentPage={setCurrentPage}
        registerUsername={registerUsername}
      />
      <main className="container mx-auto p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {renderPage()}
        </motion.div>
      </main>
      <Toaster position="bottom-right" />
    </div>
  );
}
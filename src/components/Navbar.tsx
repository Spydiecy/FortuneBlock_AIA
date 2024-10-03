import React, { useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { UserCircleIcon, WalletIcon } from '@heroicons/react/24/outline';

interface NavbarProps {
  account: string | null;
  username: string;
  connectWallet: () => Promise<void>;
  setCurrentPage: (page: string) => void;
  registerUsername: (username: string) => Promise<void>;
}

const Navbar: React.FC<NavbarProps> = ({ account, username, connectWallet, setCurrentPage, registerUsername }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [newUsername, setNewUsername] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    registerUsername(newUsername);
    setIsRegistering(false);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold text-neon-green animate-glow">FortuneBlock</span>
          </div>
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-4">
                <button onClick={() => setCurrentPage('home')} className="text-gray-800 dark:text-white hover:bg-neon-green hover:text-black px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">Home</button>
                <button onClick={() => setCurrentPage('lotteries')} className="text-gray-800 dark:text-white hover:bg-neon-green hover:text-black px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">Lotteries</button>
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {account ? (
              username ? (
                <Menu as="div" className="ml-3 relative">
                  <div>
                    <Menu.Button className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                      <span className="sr-only">Open user menu</span>
                      <UserCircleIcon className="h-8 w-8 text-neon-green" aria-hidden="true" />
                    </Menu.Button>
                  </div>
                  <Transition
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => setCurrentPage('profile')}
                            className={`${
                              active ? 'bg-gray-100' : ''
                            } block px-4 py-2 text-sm text-gray-700 w-full text-left`}
                          >
                            Profile
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => {
                              // Implement logout functionality here
                              console.log('Logout clicked');
                            }}
                            className={`${
                              active ? 'bg-gray-100' : ''
                            } block px-4 py-2 text-sm text-gray-700 w-full text-left`}
                          >
                            Disconnect
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              ) : isRegistering ? (
                <form onSubmit={handleRegister} className="flex items-center">
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Enter username"
                    className="rounded-l-md px-3 py-2 border-t mr-0 border-b border-l text-gray-800 border-gray-200 bg-white"
                  />
                  <button type="submit" className="px-4 py-2 rounded-r-md bg-neon-green text-black font-bold">Register</button>
                </form>
              ) : (
                <button onClick={() => setIsRegistering(true)} className="bg-neon-green text-black px-4 py-2 rounded-md font-bold hover:bg-opacity-80 transition-colors duration-200">
                  Register Username
                </button>
              )
            ) : (
              <button onClick={connectWallet} className="bg-neon-green text-black px-4 py-2 rounded-md font-bold hover:bg-opacity-80 transition-colors duration-200">
                <WalletIcon className="h-5 w-5 inline-block mr-2" />
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
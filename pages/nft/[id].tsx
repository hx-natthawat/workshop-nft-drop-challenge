import React from 'react'
import { useAddress, useDisconnect, useMetamask } from '@thirdweb-dev/react'

function NFTDropPage() {
  // Auth
  const connectWithMetaMask = useMetamask()
  const walletAddress = useAddress()
  const disconnectWallet = useDisconnect()

  //--
  //   console.log(walletAddress)

  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
      {/* <div> */}

      {/* Left */}
      <div className="bg-gradient-to-br from-cyan-800 to-rose-500 lg:col-span-4">
        <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
          <div className=" rounded-xl bg-gradient-to-br from-yellow-400 to-purple-600 p-2">
            <img
              className="lg:h-99 w-44 rounded-xl object-cover lg:w-72"
              src="https://links.papareact.com/8sg"
              alt=""
            />
          </div>
          <div className="space-y-2 p-5 text-center">
            <h1 className="text-4xl font-bold text-white">HX NFT DROP Apps</h1>
            <h2 className="text-xl text-gray-300">A collecion of HX Apps.</h2>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-1 flex-col p-12 lg:col-span-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <h1 className="w-52 cursor-pointer text-xl font-extralight sm:w-80">
            The{' '}
            <span className="font-extrabold underline decoration-pink-600/50">
              HX
            </span>{' '}
            NFT Market Place
          </h1>
          <button
            onClick={() =>
              walletAddress ? disconnectWallet() : connectWithMetaMask()
            }
            className="rounded-full bg-rose-400 px-4 py-2 text-xs font-bold text-white lg:px-5 lg:py-3 lg:text-base"
          >
            {walletAddress ? 'Sign Out' : 'Sign In'}
          </button>
        </header>

        <hr className="my-2 border" />

        {/* Notification */}
        <div>
          {walletAddress ? (
            <p className="text-center text-rose-400">
              You are logged in with wallet {walletAddress.substring(0, 5)}...
              {walletAddress.substring(walletAddress.length - 5)}
            </p>
          ) : (
            ''
          )}
        </div>

        {/* Content */}
        <div className="mt-10 flex flex-1 flex-col items-center space-y-6 text-center lg:justify-center lg:space-y-0">
          <img
            className="w-80 object-cover pb-10 lg:h-40"
            src="https://links.papareact.com/bdy"
            alt=""
          />

          <h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold">
            The HX Ape Coding Club | NFT DROP
          </h1>

          <p className="pt-2 text-xl text-green-500">12 May NFT Claimed</p>
        </div>

        {/* Mint Button */}
        <button className="mt-10 h-16 w-full rounded-full bg-red-500 text-white">
          Mint NFT (0.01 ETH)
        </button>
      </div>
    </div>
  )
}

export default NFTDropPage

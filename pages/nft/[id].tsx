import React, { useEffect, useState } from 'react'
import {
  useAddress,
  useDisconnect,
  useMetamask,
  useNFTDrop,
} from '@thirdweb-dev/react'
import { GetServerSideProps } from 'next'
import { sanityClient, urlFor } from '../../sanity'
import { Collection } from '../../sanity/typings'
import Link from 'next/link'
import { BigNumber } from 'ethers'
import toast, { Toaster } from 'react-hot-toast'

interface Props {
  collection: Collection
}

function NFTDropPage({ collection }: Props) {
  const [claimedSupply, setClaimedSupply] = useState<number>(0)
  const [totalSupply, setTotalSupply] = useState<BigNumber>()
  const [priceInEth, setPriceInEth] = useState<string>()
  const [loading, setLoading] = useState<boolean>(true)
  const nftDrop = useNFTDrop(collection.address)

  // Auth
  const connectWithMetaMask = useMetamask()
  const walletAddress = useAddress()
  const disconnectWallet = useDisconnect()

  // Price update
  useEffect(() => {
    if (!nftDrop) return

    // setLoading(true)
    const fetchPrice = async () => {
      const claimConditions = await nftDrop?.claimConditions.getAll()
      setPriceInEth(claimConditions?.[0].currencyMetadata.displayValue)
      // setLoading(false)
    }

    fetchPrice()
  }, [nftDrop])

  // Data Update
  useEffect(() => {
    if (!nftDrop) return

    const fetchNFTDropData = async () => {
      setLoading(true)

      const claimed = await nftDrop.getAllClaimed()
      const total = await nftDrop.totalSupply()

      setClaimedSupply(claimed.length)
      setTotalSupply(total)

      setLoading(false)
    }

    fetchNFTDropData()
  }, [nftDrop])

  // Mint NFT
  const mintNft = () => {
    if (!nftDrop || !walletAddress) return

    const quantity = 1 // How many NFT's you want to claim?

    setLoading(true)

    const notification = toast.loading('Minting...', {
      style: {
        background: 'white',
        color: 'green',
        fontWeight: 'bolder',
        fontSize: '17px',
        padding: '20px',
      },
    })

    nftDrop
      .claimTo(walletAddress, quantity)
      .then(async (tx) => {
        const receipt = tx[0].receipt
        const claimedTokenId = tx[0].id
        const claimedNFT = await tx[0].data()

        toast('HOORAY... You are successful minted!', {
          style: {
            background: 'green',
            color: 'white',
            fontWeight: 'bolder',
            fontSize: '17px',
            padding: '20px',
          },
        })

        console.log(receipt)
        console.log(claimedTokenId)
        console.log(claimedNFT)
      })
      .catch((err) => {
        console.log(err)
        toast('Opps... Something went wrong!', {
          style: {
            background: 'red',
            color: 'white',
            fontWeight: 'bolder',
            fontSize: '17px',
            padding: '20px',
          },
        })
      })
      .finally(() => {
        setLoading(false)
        toast.dismiss(notification)
      })
  }

  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
      <Toaster position="bottom-center" />

      {/* Left */}
      <div className="bg-gradient-to-br from-cyan-800 to-rose-500 lg:col-span-4">
        <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
          <div className=" rounded-xl bg-gradient-to-br from-yellow-400 to-purple-600 p-2">
            <img
              className="lg:h-99 w-44 rounded-xl object-cover lg:w-72"
              src={urlFor(collection.previewImage).url()}
              alt=""
            />
          </div>
          <div className="space-y-2 p-5 text-center">
            <h1 className="text-4xl font-bold text-white">
              {collection.nftCollectionName}
            </h1>
            <h2 className="text-xl text-gray-300">{collection.description}</h2>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-1 flex-col p-12 lg:col-span-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <Link href={'/'}>
            <h1 className="w-52 cursor-pointer text-xl font-extralight sm:w-80">
              The{' '}
              <span className="font-extrabold underline decoration-pink-600/50">
                HX
              </span>{' '}
              NFT Market Place
            </h1>
          </Link>
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
            src={urlFor(collection.mainImage).url()}
            alt=""
          />

          <h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold">
            {collection.title}
          </h1>

          {/* Loading */}
          {loading ? (
            <p className="animate-pulse pt-2 text-xl text-green-500">
              Loading Supply Count...
            </p>
          ) : (
            <p className="pt-2 text-xl text-green-500">
              {claimedSupply} / {totalSupply?.toString()} NFT's Claimed
            </p>
          )}

          {loading && (
            <img
              className="h-80 w-80 object-contain"
              src="https://miro.medium.com/max/1400/1*CsJ05WEGfunYMLGfsT2sXA.gif"
              alt=""
            />
          )}
        </div>

        {/* Mint Button */}
        <button
          onClick={mintNft}
          disabled={
            loading ||
            claimedSupply === totalSupply?.toNumber() ||
            !walletAddress
          }
          className="mt-10 h-16 w-full rounded-full bg-red-500 font-bold text-white disabled:bg-gray-400"
        >
          {loading ? (
            <>loading</>
          ) : claimedSupply === totalSupply?.toNumber() ? (
            <>SOLD OUT</>
          ) : !walletAddress ? (
            <>Sign in to Mint</>
          ) : (
            <span className="font-bold">Mint NFT ({priceInEth} ETH)</span>
          )}
        </button>
      </div>
    </div>
  )
}

export default NFTDropPage

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const query = `
  *[_type == "collection" && slug.current == $id][0]{
    _id,
    title,
    address,
    description,
    nftCollectionName,
    mainImage {
      asset
    },
    previewImage {
      asset
    },
    slug {
      current
    },
    creator-> {
      _id,
      name,
      address,
      slug {
        current
      },
    },
  }`

  const collection = await sanityClient.fetch(query, {
    id: params?.id,
  })

  if (!collection) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      collection,
    },
  }
}

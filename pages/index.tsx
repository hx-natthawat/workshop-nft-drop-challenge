import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { cloneElement } from 'react'
import { sanityClient, urlFor } from '../sanity'
import { Collection } from '../sanity/typings'

interface Props {
  collections: Collection
}

const Home = ({ collections }: Props) => {
  return (
    <div className="">
      <Head>
        <title>NFT Drop</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-red-500">Welcome to the NFT DROP CHALLENGE</h1>
    </div>
  )
}

export default Home

// Call Backend server to render as a SSR mode
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const query = `
  *[_type == "collection"]{
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

  const collections = await sanityClient.fetch(query)
  console.log(collections)

  return {
    props: {
      collections,
    },
  }
}

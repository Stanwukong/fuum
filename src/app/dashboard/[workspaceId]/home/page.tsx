import { getWixContent } from '@/actions/workspace'
import React from 'react'

type Props = {}

const Home = async (props: Props) => {
    const video = await getWixContent()
  return (
    <div>Home</div>
  )
}

export default Home
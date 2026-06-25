import React from 'react'

const Navbar = () => {
  return (
    <div className='  flex justify-around bg-slate-800 h-14 w-full text-white items-center'>
      <div className='font-bold text-2xl'>
        <span className='text-green-400'>&lt;</span>
        <span>Pass</span>
        <span className='text-green-400'>OP/&gt;</span>
      </div>
      <button className='cursor-pointer'>
        <img src="/github.svg" alt="github-icon" className='invert'/>
      </button>
    </div>
  )
}

export default Navbar

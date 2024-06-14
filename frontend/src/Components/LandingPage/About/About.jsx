import React from 'react';
import './About.css'

const About = () => {
  return (
    <div className="p-4 m-4 flex flex-col justify-center items-center bg-black BG-image">
      <p className="text-white text-6xl text-center m-2">
        Meet the team behind the platform
      </p>
      <div className='flex flex-wrap w-auto h-auto gap-8 mt-10'>
        <div className='circle items-center justify-center bg-sky-400'>C1</div>
        <div className='circle items-center justify-center bg-sky-400'>C1</div>
        <div className='circle items-center justify-center bg-sky-400'>C1</div>
        <div className='circle items-center justify-center bg-sky-400'>C1</div>
        <div className='circle items-center justify-center bg-sky-400'>C1</div>
      </div>
    </div>
  )
}

export default About
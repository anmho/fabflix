import React from 'react';
import Link from 'next/link';

export const Navbar = () => {
  return (
    <>
      <div
        id="navbar"
        className="navbar-area navbar-style-two z-[2] py-[20px] lg:py-[15px] xl:py-0"
      >
        <div className="container mx-auto max-w-[1760px] xl:px-[30px]">
          <nav className={`navbar relative flex flex-wrap`}>
            <div className="flex justify-around w-full">
              <Link href="/" className="hover:text-[#FBAD9C] mx-5">
                Home
              </Link>
              <Link href="/movies" className="hover:text-[#FBAD9C] mx-5">
                Top 20 Movies
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

'use client'
import React from 'react'
import Link from 'next/link'
import { Facebook, Twitter, Instagram } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-[#222831] text-[#EEEEEE] py-6 mt-auto">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        {/* Brand and Copyright */}
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <h2 className="text-2xl font-bold">Farm Mart</h2>
          <p className="mt-2 text-sm">
            &copy; {new Date().getFullYear()} Farm Mart. All rights reserved.
          </p>
        </div>
        {/* Navigation Links */}
        <div className="flex flex-col md:flex-row gap-4 text-center">
          <Link href="/about" className="hover:text-white">
            About Us
          </Link>
          <Link href="/contact" className="hover:text-white">
            Contact
          </Link>
          <Link href="/privacy" className="hover:text-white">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-white">
            Terms of Service
          </Link>
        </div>
        {/* Social Media Icons */}
        <div className="flex gap-4 mt-4 md:mt-0">
          <Link href="#" className="hover:text-white">
            <Facebook className="w-5 h-5" />
          </Link>
          <Link href="#" className="hover:text-white">
            <Twitter className="w-5 h-5" />
          </Link>
          <Link href="#" className="hover:text-white">
            <Instagram className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer

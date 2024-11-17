"use client"; 

import * as React from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Image from "next/image";
import { Button } from '@/components/ui/button' 
import {
  Sheet,
  SheetContent,  
  SheetTrigger,
} from '@/components/ui/sheet'

const navItems = [ 
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Doctors', href: '/doctors' },
  { name: 'Contact', href: '/contact' },
]

const menuVariants = {
  closed: {
    opacity: 0,
    y: -20,
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  closed: { opacity: 0, y: 20 },
  open: { opacity: 1, y: 0 },
}

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
      <style jsx global>{`
        [data-radix-collection-item] {
          display: none !important;
        }
      `}</style>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-auto">
          <Link href="/" className="flex items-center">
          <Image
            src="/assets/icons/logo-doctorsclub.svg"
            alt="Company Logo"
            width={108}
            height={52}
            priority
            />  
          </Link> 
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0  h-12 w-12">
                <Menu style={{ width: '26px', height: '26px' }} className='text-blue-700'/>  
                <span className="sr-only">Toggle menu</span>  
              </Button>
            </SheetTrigger>  
            <AnimatePresence>
              {isOpen && (
                <SheetContent 
                  className="fixed inset-0 w-full h-full bg-black z-50 p-0 overflow-hidden [&>button]:hidden" 
                  side="top"
                >
                  <motion.div 
                    className="h-full flex flex-col items-center justify-center"
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={menuVariants}
                  >
                    <motion.div 
                      variants={itemVariants}
                      className="absolute top-8 right-8 z-50"
                    >
                      <X 
                        className="h-12 w-12 cursor-pointer hover:text-primary transition-colors"
                        onClick={() => setIsOpen(false)}
                      />
                    </motion.div>

                    <motion.div className="flex flex-col items-center justify-center space-y-8">
                      {navItems.map((item) => (
                        <motion.div key={item.name} variants={itemVariants}>
                          <Link
                            href={item.href}
                            className="text-7xl font-medium text-foreground hover:text-primary transition-colors inline-block"
                            onClick={() => setIsOpen(false)}
                          >
                            {item.name} 
                          </Link>
                        </motion.div> 
                      ))}
                    </motion.div>  
                  </motion.div>
                </SheetContent>
              )}
            </AnimatePresence>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
'use client'; // Mark as Client Component

import dynamic from 'next/dynamic';
// import { Navbar } from "@/components/Navbar"; 
import { Footer } from "@/components/Footer"; 
import styles from "./MainLayout.module.css";

const Navbar = dynamic(() => 
  import('@/components/Navbar').then(mod => mod.Navbar), 
  { ssr: false }
);

export const MainLayout = ({ children }) => {
  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.mainContainer}>{children}</main>
      <Footer />
    </div>
  );
};
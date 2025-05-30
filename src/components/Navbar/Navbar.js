"use client";

import styles from "./Navbar.module.css";
import Link from "next/link";
// import dynamic from 'next/dynamic'; // Will re-add if needed for UserMenu

import { SearchProfiles } from "@/components/SearchProfiles"; 
import { ThemeSelector } from "@/components/ThemeSelector"; 

import { 
  Home as HomeIcon
} from '@/assets/icons';

// import dynamic from 'next/dynamic'; // Reverted
import { UserMenu } from "@/components/UserMenu"; // Reverted to static

export const Navbar = () => {

  return (
    <nav className={styles.container}>
      <div className={styles.start}>
        <Link href="/" className={styles.logo}><HomeIcon label="Home" /></Link>
      </div>

      <div className={styles.middle}>
        <SearchProfiles />
      </div>

      <div className={styles.end}>
        <UserMenu />
        <ThemeSelector />
      </div>
    </nav>
  );
};

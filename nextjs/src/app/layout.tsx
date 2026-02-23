import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import styles from './layout.module.scss';
import './cleaner.css';
import React from 'react';
import Providers from "@/componets/Provider";

const montserrat = Montserrat({
	weight: ["800", "600"],
	subsets: ['latin', 'cyrillic'],
	display: 'swap',
	variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "За Горизонт",
  description: "Проект на хакатон от команды За Горизонт",
	icons: {
		icon: '/favicon.svg'
	}
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {	
  return (
		<html lang="ru">
			<body className={`${montserrat} ${styles.layout} ${montserrat.className}`} style={{fontWeight: 800	}}>
				<Providers>
					{children}
				</Providers>
			</body>
		</html>
  );
}

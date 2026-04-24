'use client'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

const NAV_LINKS = ['services', 'portfolio', 'process', 'team', 'contact'] as const

export function Header() {
	const t = useTranslations('nav')
	return (
		<motion.header
			className='fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-8'
			initial={{ opacity: 0, y: -12 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
		>
			<div
				className='mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-[var(--border-subtle)] px-5 py-3'
				style={{
					background: 'rgba(11,3,36,0.65)',
					backdropFilter: 'blur(16px)',
				}}
			>
				<a href='#' className='flex items-center gap-2.5'>
					<Image
						src='/fazo-logo.svg'
						alt='FAZO'
						width={36}
						height={36}
						className='h-9 w-9 object-contain'
					/>
					<span className='font-orbitron text-sm font-bold tracking-widest text-[var(--text-primary)]'>
						FAZO
					</span>
				</a>

				<nav className='hidden items-center gap-6 md:flex'>
					{NAV_LINKS.map(key => (
						<a
							key={key}
							href={`#${key}`}
							className='text-xs font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-cyan)]'
						>
							{t(key)}
						</a>
					))}
				</nav>

				<div className='flex items-center gap-3'>
					<LanguageSwitcher />
				</div>
			</div>
		</motion.header>
	)
}

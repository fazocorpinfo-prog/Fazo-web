'use client'
import { motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
	const { theme, setTheme } = useTheme()
	const [mounted, setMounted] = useState(false)
	useEffect(() => setMounted(true), [])
	if (!mounted) return <div className='h-9 w-9' />

	return (
		<motion.button
			onClick={() => setTheme(theme === 'dark' ? 'dark' : 'dark')}
			className='flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-subtle)] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-accent)] hover:text-[var(--accent-cyan)]'
			whileHover={{ scale: 1.08 }}
			whileTap={{ scale: 0.94 }}
			aria-label='Toggle theme'
		>
			{theme === 'dark' ? (
				<Sun size={16} strokeWidth={1.5} />
			) : (
				<Moon size={16} strokeWidth={1.5} />
			)}
		</motion.button>
	)
}

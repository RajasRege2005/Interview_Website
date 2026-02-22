'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { usePathname, useRouter } from 'next/navigation'
import { Box, Burger, Button, Drawer, Group, ScrollArea, Divider } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useEffect } from 'react'
import classes from './Navbar.module.css'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false)

  useEffect(() => {
    router.prefetch('/interview')
    router.prefetch('/reports')
    router.prefetch('/profile')
    router.prefetch('/coding')
    router.prefetch('/login')
    router.prefetch('/signup')
  }, [router])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const navigate = (path: string) => {
    closeDrawer()
    router.push(path)
  }

  return (
    <Box pb={0}>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <Link href="/" className={classes.logo}>
            RehearseAI
          </Link>

          <Group h="100%" gap={0} visibleFrom="sm">
            <Link href="/" className={pathname === '/' ? classes.linkActive : classes.link} prefetch={true}>
              Home
            </Link>
            <Link href='/coding' className={pathname === '/coding' ? classes.linkActive : classes.link} prefetch={true}>
              Coding
            </Link>
            <Link href="/interview" className={pathname === '/interview' ? classes.linkActive : classes.link} prefetch={true}>
              Interview
            </Link>
            <Link href="/reports" className={pathname === '/reports' ? classes.linkActive : classes.link} prefetch={true}>
              Reports
            </Link>
          </Group>

          <Group visibleFrom="sm">
            {user ? (
              <>
                <Button variant="default" onClick={() => router.push('/profile')}>Profile</Button>
                <Button onClick={handleSignOut}>Sign Out</Button>
              </>
            ) : (
              <>
                <Button variant="default" onClick={() => router.push('/login')}>Login</Button>
                <Button onClick={() => router.push('/signup')}>Sign Up</Button>
              </>
            )}
          </Group>

          <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
        </Group>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h="calc(100vh - 80px)" mx="-md">
          <Divider my="sm" />
          <Link href="/" className={classes.link} onClick={closeDrawer} prefetch={true}>Home</Link>
          <Link href="/coding" className={classes.link} onClick={closeDrawer} prefetch={true}>Coding</Link>
          <Link href="/interview" className={classes.link} onClick={closeDrawer} prefetch={true}>Interview</Link>
          <Link href="/reports" className={classes.link} onClick={closeDrawer} prefetch={true}>Reports</Link>
          <Divider my="sm" />
          <Group justify="center" grow pb="xl" px="md">
            {user ? (
              <>
                <Button variant="default" fullWidth onClick={() => navigate('/profile')}>Profile</Button>
                <Button onClick={() => { handleSignOut(); closeDrawer(); }}>Sign Out</Button>
              </>
            ) : (
              <>
                <Button variant="default" fullWidth onClick={() => navigate('/login')}>Login</Button>
                <Button fullWidth onClick={() => navigate('/signup')}>Sign Up</Button>
              </>
            )}
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  )
}

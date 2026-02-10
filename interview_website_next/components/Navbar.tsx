'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { usePathname } from 'next/navigation'
import { Box, Burger, Button, Drawer, Group, ScrollArea, Divider } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import classes from './Navbar.module.css'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const pathname = usePathname()
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false)

  const handleSignOut = async () => {
    try {
      await signOut()
      window.location.href = '/'
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <Box pb={0}>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <Link href="/" className={classes.logo}>
            Rehearse
          </Link>

          <Group h="100%" gap={0} visibleFrom="sm">
            <Link href="/" className={pathname === '/' ? classes.linkActive : classes.link}>
              Home
            </Link>
            <Link href="/interview" className={pathname === '/interview' ? classes.linkActive : classes.link}>
              Practice
            </Link>
            <Link href="/reports" className={pathname === '/reports' ? classes.linkActive : classes.link}>
              Reports
            </Link>
          </Group>

          <Group visibleFrom="sm">
            {user ? (
              <>
                <Link href="/profile">
                  <Button variant="default">Profile</Button>
                </Link>
                <Button onClick={handleSignOut}>Sign Out</Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="default">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button>Sign Up</Button>
                </Link>
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
          <Link href="/" className={classes.link} onClick={closeDrawer}>Home</Link>
          <Link href="/interview" className={classes.link} onClick={closeDrawer}>Practice</Link>
          <Link href="/reports" className={classes.link} onClick={closeDrawer}>Reports</Link>
          <Divider my="sm" />
          <Group justify="center" grow pb="xl" px="md">
            {user ? (
              <>
                <Link href="/profile"><Button variant="default" fullWidth onClick={closeDrawer}>Profile</Button></Link>
                <Button onClick={() => { handleSignOut(); closeDrawer(); }}>Sign Out</Button>
              </>
            ) : (
              <>
                <Link href="/login"><Button variant="default" fullWidth onClick={closeDrawer}>Login</Button></Link>
                <Link href="/signup"><Button fullWidth onClick={closeDrawer}>Sign Up</Button></Link>
              </>
            )}
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  )
}

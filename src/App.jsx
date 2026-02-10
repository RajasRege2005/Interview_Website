import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate, useLocation } from 'react-router-dom'
import { FloatingDock } from './components/ui/floating-deck'
import DarkVeil from './components/ui/dark-veil'
import {Button} from './components/ui/moving-border'
import { IconHome, IconUser, IconCode, IconChartBar } from '@tabler/icons-react'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Interview from './pages/Interview'
import InterviewSession from './pages/InterviewSession'
import Reports from './pages/Reports'
import Login from './pages/Login'
import Signup from './pages/Signup'


function Navigation({ isLoggedIn, handleLogout, dockItems }) {
  const location = useLocation();
  
  return (
    <div className="absolute top-5 left-0 w-full z-50">
      <div className="flex items-center justify-between px-8 py-4 w-full">
        <div className="flex-1 text-white font-bold text-xl">
          Interview Prep
        </div>
        
        <div className="flex-1 flex justify-center">
          <FloatingDock items={dockItems} />
        </div>
        <div className="flex-1 flex justify-end space-x-3">
        {isLoggedIn ?(
          <Button 
              borderRadius="1rem" 
              className="bg-red-500/80 backdrop-blur-md text-white border-white/20 hover:bg-red-600/80 transition-all duration-300 px-4 py-2 text-sm font-medium cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) :(
            <>
            <Link to="/login">
          <Button 
            borderRadius="1rem" 
            className="bg-white/10 backdrop-blur-md text-white border-white/20 hover:bg-white/20 transition-all duration-300 px-4 py-2 text-sm font-medium cursor-pointer"
          >
            Login
          </Button>
          </Link>
          <Link to="/signup">
          <Button 
            borderRadius="1rem"
            className="bg-white/10 backdrop-blur-md text-white border-white/20 hover:bg-white/20 transition-all duration-300 px-4 py-2 text-sm font-medium cursor-pointer"
          >
            Sign Up
          </Button>
          </Link>
          </>
          ) 
        }
        </div>
      </div>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const handleLogin = () => {
    setIsLoggedIn(true);
  }
  const handleLogout=()=>{
    setIsLoggedIn(false);
  }

  const dockItems = [
    {
      title: "Home",
      icon: <IconHome className="h-full w-full text-neutral-600 dark:text-neutral-300" />,
      href: "/",
    },
    {
      title: "Profile",
      icon: <IconUser className="h-full w-full text-neutral-600 dark:text-neutral-300" />,
      href: "/profile",
    },
    {
      title: "Interview",
      icon: <IconCode className="h-full w-full text-neutral-600 dark:text-neutral-300" />,
      href: "/interview",
    },
    {
      title: "Reports",
      icon: <IconChartBar className="h-full w-full text-neutral-600 dark:text-neutral-300" />,
      href: "/reports",
    },
  ];

  return (
    <Router>
      <div className="w-full min-h-screen relative">
        <div className="fixed inset-0 w-full h-full">
          <DarkVeil />
        </div>

        <Navigation 
          isLoggedIn={isLoggedIn}
          handleLogout={handleLogout}
          dockItems={dockItems}
        />
        <div className="relative z-40 w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" replace />} />
            <Route path="/interview" element={isLoggedIn ? <Interview /> : <Navigate to="/login" replace />} />
            <Route path="/interview-session" element={isLoggedIn ? <InterviewSession /> : <Navigate to="/login" replace />} />
            <Route path="/reports" element={isLoggedIn ? <Reports /> : <Navigate to="/login" replace />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App

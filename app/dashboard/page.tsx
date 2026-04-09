'use client';
import React from "react";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
export default function DashboardPage(){

    const [progress, setProgress] = useState(0);
    const {user, loading} = useAuth();
    const router = useRouter();
  useEffect(() => {
      if(!user && !loading){
        router.push('/login');
      }
      setProgress(30);
  }, []);

  return (
    <div className="flex flex-col gap-4">
        <Progress value={(progress/30)*100} className="h-1.5" />
    </div>
  )
}

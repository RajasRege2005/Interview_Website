'use client';
import React from "react";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
const DashboardPage= ()=> {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(30);
  }, []);

  return (
    <div className="flex flex-col gap-4">
        <Progress value={(progress/30)*100} className="h-1.5" />
    </div>
  )
}

export default DashboardPage;
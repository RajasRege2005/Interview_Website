'use client'

import React, { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { Card } from '@/components/ui/card'
import { title } from 'process'
import { get } from 'http'

export default function CodingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [problem, setProblem]=useState(null);
  const questions=[

    {
       title:'two-sum',
       difficulty:'Easy',
      desc:'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.'
    }
    ,
    {
      title:'Longest Substring Without Repeating Characters',
      difficulty:'Medium',
      desc:'Given a string s, find the length of the longest substring without repeating characters.'
    }
    ,
    {
      title:'Median of Two Sorted Arrays',
      difficulty:'Hard',
      desc:'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.'
    }
  ]
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
    const getProblemContent = () => {
  fetch(`https://leetcode-api-pied.vercel.app/problem/two-sum`)
    .then(res => {
      if (!res.ok) throw new Error("API Error: " + res.status);
      return res.json();
    })
    .then(res=>{
      setProblem(res);
    })
    .catch(err => console.error("Request failed:", err));
};
  getProblemContent();
}, [loading, user, router])

  


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Coding Challenges</h1>
      <div className="grid md:grid-cols-2 gap-6">
            {questions.map((question, index) => (
              <div 
                key={index} 
                className="group bg-card border border-border rounded-xl p-8 hover:border-primary/30 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-[0_0_20px_oklch(0.72_0.19_180)]"
              >
                <div className="text-sm mb-2 text-primary font-semibold">{question.difficulty}</div>
                <h3 className="text-2xl font-bold text-foreground mb-3">{question.title}</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">{question.desc}</p>
              </div>
            ))}
          </div>
    </div>
  )

}
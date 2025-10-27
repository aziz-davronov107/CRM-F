"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { apiClient } from "@/lib/api-client"
import {
  Teacher,
  CreateTeacherData,
  UpdateTeacherData,
  TeacherFilters,
} from "@/lib/types"

// BE javobiga moslang
type AddCoinResult = { teacher: { newCoin: number } }

const getErrMsg = (e: unknown) =>
  (e as any)?.response?.data?.message ||
  (e as Error)?.message ||
  "Unexpected error"

const filtersKey = (filters: TeacherFilters) => JSON.stringify(filters ?? {})

/* ===========================
   useTeachers
=========================== */
export function useTeachers(filters: TeacherFilters = {}) {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)
  const dep = filtersKey(filters)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  const fetchTeachers = useCallback(async () => {
    let isCanceled = false
    setLoading(true)
    setError(null)

    try {
      // faqat 1 ta argument (filters) — extra config YUBORMAYMIZ
      const data = await apiClient.getTeachers(filters) as Teacher[]
      if (!isCanceled && mountedRef.current) {
        setTeachers(Array.isArray(data) ? data : [])
      }
    } catch (e) {
      if (!isCanceled && mountedRef.current) {
        setError(getErrMsg(e) || "Failed to fetch teachers")
        setTeachers([])
      }
    } finally {
      if (!isCanceled && mountedRef.current) setLoading(false)
    }

    // cleanup
    return () => { isCanceled = true }
  }, [dep])

  const createTeacher = useCallback(
    async (teacherData: CreateTeacherData): Promise<Teacher> => {
      try {
        const newTeacher = await apiClient.createTeacher(teacherData) as Teacher
        if (mountedRef.current) {
          setTeachers(prev => [newTeacher, ...prev])
        }
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("teachers-updated"))
        }
        return newTeacher
      } catch (e) {
        throw new Error(getErrMsg(e) || "Failed to create teacher")
      }
    },
    []
  )

  const updateTeacher = useCallback(
    async (id: number, updateData: UpdateTeacherData): Promise<Teacher> => {
      try {
        const updated = await apiClient.updateTeacher(id, updateData) as Teacher
        if (mountedRef.current) {
          setTeachers(prev => prev.map(t => (t.id === id ? updated : t)))
        }
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("teachers-updated"))
        }
        return updated
      } catch (e) {
        throw new Error(getErrMsg(e) || "Failed to update teacher")
      }
    },
    []
  )

  const deleteTeacher = useCallback(
    async (id: number): Promise<void> => {
      try {
        await apiClient.deleteTeacher(id) as void
        if (mountedRef.current) {
          setTeachers(prev => prev.filter(t => t.id !== id))
        }
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("teachers-updated"))
        }
      } catch (e) {
        throw new Error(getErrMsg(e) || "Failed to delete teacher")
      }
    },
    []
  )

  const addCoin = useCallback(
    async (id: number, amount: number, reason: string): Promise<AddCoinResult> => {
      try {
        const result = await apiClient.addCoinToTeacher(id, amount, reason) as AddCoinResult
        if (mountedRef.current) {
          setTeachers(prev =>
            prev.map(t => (t.id === id ? ({ ...t, coin: result?.teacher?.newCoin } as Teacher) : t))
          )
        }
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("teachers-updated"))
        }
        return result
      } catch (e) {
        throw new Error(getErrMsg(e) || "Failed to add coin")
      }
    },
    []
  )

  // Global refresh event
  useEffect(() => {
    const handleRefresh = () => { fetchTeachers() }
    if (typeof window !== "undefined") {
      window.addEventListener("teachers-updated", handleRefresh)
      return () => window.removeEventListener("teachers-updated", handleRefresh)
    }
  }, [fetchTeachers])

  // Filters o'zgarsa qayta fetch
  useEffect(() => { fetchTeachers() }, [fetchTeachers])

  return {
    teachers,
    loading,
    error,
    refetch: fetchTeachers,
    createTeacher,
    updateTeacher,
    deleteTeacher,
    addCoin,
  }
}

/* ===========================
   useTeacher
=========================== */
export function useTeacher(id: number) {
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  const fetchTeacher = useCallback(async () => {
    if (!id) return
    let isCanceled = false
    setLoading(true)
    setError(null)

    try {
      // faqat 1 ta argument — extra config yo‘q
      const data = await apiClient.getTeacherById(id) as Teacher
      if (!isCanceled && mountedRef.current) setTeacher(data)
    } catch (e) {
      if (!isCanceled && mountedRef.current) {
        setError(getErrMsg(e) || "Failed to fetch teacher")
        setTeacher(null)
      }
    } finally {
      if (!isCanceled && mountedRef.current) setLoading(false)
    }

    return () => { isCanceled = true }
  }, [id])

  useEffect(() => { fetchTeacher() }, [fetchTeacher])

  return { teacher, loading, error, refetch: fetchTeacher }
}

/* ===========================
   useTeacherStatistics
=========================== */
export function useTeacherStatistics<TStats = any>(id: number) {
  const [statistics, setStatistics] = useState<TStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  const fetchStatistics = useCallback(async () => {
    if (!id) return
    let isCanceled = false
    setLoading(true)
    setError(null)

    try {
      // E’TIBOR: API generic emas — <TStats> bermaymiz.
      const data = await apiClient.getTeacherStatistics(id) as TStats
      if (!isCanceled && mountedRef.current) {
        setStatistics((data ?? null) as TStats | null)
      }
    } catch (e) {
      if (!isCanceled && mountedRef.current) {
        setError(getErrMsg(e) || "Failed to fetch teacher statistics")
        setStatistics(null)
      }
    } finally {
      if (!isCanceled && mountedRef.current) setLoading(false)
    }

    return () => { isCanceled = true }
  }, [id])

  useEffect(() => { fetchStatistics() }, [fetchStatistics])

  return { statistics, loading, error, refetch: fetchStatistics }
}

// BRANCHES API - Frontend Integration Examples
// Bu file-da barcha API usage misollari bor

import React, { useState } from 'react'
import { apiClient } from '@/lib/api-client'
import { useBranches, useBranch } from '@/hooks/use-branches'
import { createBranchSchema } from '@/lib/schemas'
import { BranchStatus } from '@/lib/types'
import { z } from 'zod'

// ====================================
// 1. HOOKS USAGE EXAMPLES
// ====================================

// Basic usage - barcha filiallar
export function BranchesListExample() {
  const { branches, loading, error, refetch } = useBranches()
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  
  return (
    <div>
      {branches.map(branch => (
        <div key={branch.id}>
          <h3>{branch.name}</h3>
          <p>{branch.region}, {branch.district}</p>
          <p>Status: {branch.status}</p>
        </div>
      ))}
    </div>
  )
}

// Filtered usage
export function FilteredBranchesExample() {
  const { branches, loading } = useBranches({ 
    center_id: 1,
    region: "Toshkent",
    status: "ACTIVE",
    limit: 20 
  })
  
  return <div>Active Toshkent branches: {branches.length}</div>
}

// Single branch
export function BranchDetailExample({ branchId }: { branchId: number }) {
  const { branch, loading, error } = useBranch(branchId)
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!branch) return <div>Branch not found</div>
  
  return (
    <div>
      <h1>{branch.name}</h1>
      <p>{branch.address}</p>
      <p>Phone: {branch.phone}</p>
      <p>Rooms: {branch.rooms?.length || 0}</p>
      <p>Courses: {branch.courses?.length || 0}</p>
      <p>Teachers: {branch.teachers?.length || 0}</p>
    </div>
  )
}

// ====================================
// 2. CRUD OPERATIONS EXAMPLES
// ====================================

// Create branch example
export async function createBranchExample() {
  try {
    const newBranch = await apiClient.createBranch({
      name: "Yangi filial",
      region: "Toshkent",
      district: "Chilonzor",
      address: "Chilonzor 9-kvartal, 12-uy",
      phone: "+998901234567",
      status: "ACTIVE",
      center_id: 1
    })
    
    console.log('Created branch:', newBranch)
    return newBranch
  } catch (error) {
    console.error('Failed to create branch:', error)
    throw error
  }
}

// Update branch example
export async function updateBranchExample(branchId: number) {
  try {
    const updatedBranch = await apiClient.updateBranch(branchId, {
      name: "Yangilangan nom",
      status: "INACTIVE",
      phone: "+998909876543"
    })
    
    console.log('Updated branch:', updatedBranch)
    return updatedBranch
  } catch (error) {
    console.error('Failed to update branch:', error)
    throw error
  }
}

// Delete branch example
export async function deleteBranchExample(branchId: number) {
  try {
    await apiClient.deleteBranch(branchId)
    console.log('Branch deleted successfully')
  } catch (error) {
    console.error('Failed to delete branch:', error)
    throw error
  }
}

// ====================================
// 3. COMPONENT INTEGRATION EXAMPLES
// ====================================

// Full component with CRUD operations
export function BranchManagementExample() {
  const { branches, loading, createBranch, updateBranch, deleteBranch } = useBranches()
  
  const handleCreate = async () => {
    try {
      await createBranch({
        name: "Test Branch",
        region: "Toshkent",
        district: "Yunusobod", 
        address: "Test address",
        phone: "+998901234567",
        status: "ACTIVE",
        center_id: 1
      })
      alert('Branch created!')
    } catch (error) {
      alert('Error creating branch')
    }
  }
  
  const handleUpdate = async (branchId: number) => {
    try {
      await updateBranch(branchId, {
        name: "Updated name",
        status: "INACTIVE"
      })
      alert('Branch updated!')
    } catch (error) {
      alert('Error updating branch')
    }
  }
  
  const handleDelete = async (branchId: number) => {
    if (confirm('Are you sure?')) {
      try {
        await deleteBranch(branchId)
        alert('Branch deleted!')
      } catch (error) {
        alert('Error deleting branch')
      }
    }
  }
  
  if (loading) return <div>Loading...</div>
  
  return (
    <div>
      <button onClick={handleCreate}>Create Branch</button>
      
      {branches.map(branch => (
        <div key={branch.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <h3>{branch.name}</h3>
          <p>{branch.address}</p>
          <p>Status: {branch.status}</p>
          <button onClick={() => handleUpdate(branch.id)}>Update</button>
          <button onClick={() => handleDelete(branch.id)}>Delete</button>
        </div>
      ))}
    </div>
  )
}

// ====================================
// 4. SEARCH & FILTER EXAMPLES  
// ====================================

export function SearchAndFilterExample() {
  const [filters, setFilters] = useState({
    region: "",
    status: "",
    search: ""
  })
  
  // API da search qilish uchun hook bilan
  const { branches, loading } = useBranches({
    region: filters.region || undefined,
    status: filters.status as "ACTIVE" | "INACTIVE" | undefined
  })
  
  // Client-side search (API search mavjud bo'lmasa)
  const filteredBranches = branches.filter(branch => 
    branch.name.toLowerCase().includes(filters.search.toLowerCase())
  )
  
  return (
    <div>
      <input 
        placeholder="Search branches..."
        value={filters.search}
        onChange={(e) => setFilters({...filters, search: e.target.value})}
      />
      
      <select 
        value={filters.region} 
        onChange={(e) => setFilters({...filters, region: e.target.value})}
      >
        <option value="">All regions</option>
        <option value="Toshkent">Toshkent</option>
        <option value="Andijon">Andijon</option>
        <option value="Samarkand">Samarkand</option>
      </select>
      
      <select 
        value={filters.status}
        onChange={(e) => setFilters({...filters, status: e.target.value})}
      >
        <option value="">All status</option>
        <option value="ACTIVE">Active</option>
        <option value="INACTIVE">Inactive</option>
      </select>
      
      <div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          filteredBranches.map(branch => (
            <div key={branch.id}>
              <h3>{branch.name}</h3>
              <p>{branch.region} - {branch.status}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// ====================================
// 5. FORM VALIDATION EXAMPLES
// ====================================

export function BranchFormWithValidation() {
  const [formData, setFormData] = useState({
    name: "",
    region: "",
    district: "",
    address: "",
    phone: "",
    status: "ACTIVE" as BranchStatus,
    center_id: 1
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { createBranch } = useBranches()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Validate form data
      createBranchSchema.parse(formData)
      setErrors({})
      
      // Submit to API
      await createBranch(formData)
      alert('Branch created successfully!')
      
      // Reset form
      setFormData({
        name: "",
        region: "",
        district: "",
        address: "",
        phone: "",
        status: "ACTIVE" as BranchStatus,
        center_id: 1
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Validation errors
        const newErrors: Record<string, string> = {}
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(newErrors)
      } else {
        // API errors
        alert('Failed to create branch')
      }
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input 
          placeholder="Branch name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
        {errors.name && <span style={{color: 'red'}}>{errors.name}</span>}
      </div>
      
      <div>
        <input 
          placeholder="Region"
          value={formData.region}
          onChange={(e) => setFormData({...formData, region: e.target.value})}
        />
        {errors.region && <span style={{color: 'red'}}>{errors.region}</span>}
      </div>
      
      <div>
        <input 
          placeholder="District"
          value={formData.district}
          onChange={(e) => setFormData({...formData, district: e.target.value})}
        />
        {errors.district && <span style={{color: 'red'}}>{errors.district}</span>}
      </div>
      
      <div>
        <textarea 
          placeholder="Address"
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
        />
        {errors.address && <span style={{color: 'red'}}>{errors.address}</span>}
      </div>
      
      <div>
        <input 
          placeholder="+998901234567"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
        />
        {errors.phone && <span style={{color: 'red'}}>{errors.phone}</span>}
      </div>
      
      <div>
        <select 
          value={formData.status}
          onChange={(e) => setFormData({...formData, status: e.target.value as BranchStatus})}
        >
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
        {errors.status && <span style={{color: 'red'}}>{errors.status}</span>}
      </div>
      
      <button type="submit">Create Branch</button>
    </form>
  )
}

// ====================================
// 6. ERROR HANDLING EXAMPLES
// ====================================

export function ErrorHandlingExample() {
  const { branches, loading, error, refetch } = useBranches()
  
  const handleRetry = () => {
    refetch()
  }
  
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ 
          width: '20px', 
          height: '20px', 
          border: '2px solid #ccc', 
          borderTop: '2px solid #333',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        Loading branches...
      </div>
    )
  }
  
  if (error) {
    return (
      <div style={{ 
        padding: '20px', 
        border: '1px solid #ff6b6b', 
        borderRadius: '5px',
        backgroundColor: '#ffe0e0',
        color: '#d63447'
      }}>
        <h3>Error loading branches</h3>
        <p>{error}</p>
        <button onClick={handleRetry} style={{ marginTop: '10px' }}>
          Try Again
        </button>
      </div>
    )
  }
  
  return (
    <div>
      <h2>Branches ({branches.length})</h2>
      {branches.map(branch => (
        <div key={branch.id}>
          {branch.name} - {branch.status}
        </div>
      ))}
    </div>
  )
}

// ====================================
// 7. ADVANCED USAGE EXAMPLES
// ====================================

// Pagination example
export function PaginatedBranchesExample() {
  const [page, setPage] = useState(1)
  const limit = 10
  
  const { branches, loading, totalPages } = useBranches({ 
    page, 
    limit,
    sortBy: "name",
    sortOrder: "asc"
  })
  
  return (
    <div>
      <div>
        {branches.map(branch => (
          <div key={branch.id}>{branch.name}</div>
        ))}
      </div>
      
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button 
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        
        <span>Page {page} of {totalPages}</span>
        
        <button 
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  )
}

// Statistics example
export function BranchStatisticsExample() {
  const { branches, loading } = useBranches({ limit: 1000 })
  
  if (loading) return <div>Loading statistics...</div>
  
  const stats = {
    total: branches.length,
    active: branches.filter(b => b.status === 'ACTIVE').length,
    inactive: branches.filter(b => b.status === 'INACTIVE').length,
    totalRooms: branches.reduce((sum, b) => sum + (b.rooms?.length || 0), 0),
    totalCourses: branches.reduce((sum, b) => sum + (b.courses?.length || 0), 0),
    totalTeachers: branches.reduce((sum, b) => sum + (b.teachers?.length || 0), 0),
    regions: [...new Set(branches.map(b => b.region))].length
  }
  
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h3>Total Branches</h3>
        <p style={{ fontSize: '2em', margin: 0 }}>{stats.total}</p>
      </div>
      
      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h3>Active</h3>
        <p style={{ fontSize: '2em', margin: 0, color: 'green' }}>{stats.active}</p>
      </div>
      
      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h3>Inactive</h3>
        <p style={{ fontSize: '2em', margin: 0, color: 'red' }}>{stats.inactive}</p>
      </div>
      
      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h3>Regions</h3>
        <p style={{ fontSize: '2em', margin: 0 }}>{stats.regions}</p>
      </div>
      
      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h3>Total Rooms</h3>
        <p style={{ fontSize: '2em', margin: 0 }}>{stats.totalRooms}</p>
      </div>
      
      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h3>Total Courses</h3>
        <p style={{ fontSize: '2em', margin: 0 }}>{stats.totalCourses}</p>
      </div>
      
      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h3>Total Teachers</h3>
        <p style={{ fontSize: '2em', margin: 0 }}>{stats.totalTeachers}</p>
      </div>
    </div>
  )
}
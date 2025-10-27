# 🏪 BRANCHES API Integration - Frontend

Bu loyihada Branches API to'liq integratsiya qilingan va ishlatishga tayyor!

## 🚀 O'rnatilgan Komponentlar

### 1. **API Client** (`lib/api-client.ts`)
- Base URL `http://localhost:5000` ga o'zgartirildi
- Centers uchun metodlar:
  - `getCenters(params)` - barcha markazlar
  - `getCenterById(id)` - bitta markaz
- Branches uchun maxsus metodlar qo'shildi:
  - `getBranches(params)` - barcha filiallar
  - `getBranchById(id)` - bitta filial
  - `createBranch(data)` - yangi filial yaratish
  - `updateBranch(id, data)` - filialni yangilash
  - `deleteBranch(id)` - filialni o'chirish

### 2. **Types** (`lib/types.ts`)
```typescript
interface Branch {
  id: number
  name: string
  region: string
  district: string
  address: string
  phone: string
  status: "ACTIVE" | "INACTIVE"
  center_id: number
  center?: Center
  rooms?: Room[]
  courses?: Course[]
  teachers?: Teacher[]
  groups?: Group[]
  createdAt: string
  updatedAt: string
}

interface CreateBranchData {
  name: string
  region: string
  district: string
  address: string
  phone: string
  status: BranchStatus
  center_id: number
}
```

### 3. **Custom Hooks**

#### **useBranches** (`hooks/use-branches.ts`)
```typescript
const { 
  branches, 
  loading, 
  error, 
  createBranch, 
  updateBranch, 
  deleteBranch,
  getBranchById,
  refetch 
} = useBranches({
  center_id: 1,
  region: "Toshkent",
  status: "ACTIVE"
})
```

#### **useCenters** (`hooks/use-centers.ts`)
```typescript
const { 
  centers, 
  loading, 
  error, 
  refetch 
} = useCenters({
  region: "Toshkent",
  limit: 100
})
```

### 4. **Validation Schemas** (`lib/schemas.ts`)
- `createBranchSchema` - yangi filial validatsiyasi
- `updateBranchSchema` - filial yangilash validatsiyasi  
- `branchFiltersSchema` - filterlar validatsiyasi
- Telefon raqam formati: `+998XXXXXXXXX`

### 5. **Components**

#### **BranchesList** (`components/branches/branches-list.tsx`)
- Real API data ko'rsatadi
- Loading states
- Error handling
- Statistics (rooms, courses, teachers, groups soni)
- Status badges (ACTIVE/INACTIVE)
- Delete confirmation
- Pagination support

#### **CreateBranchDialog** (`components/branches/create-branch-dialog.tsx`)
- Yangi filial yaratish formi
- API integratsiyasi
- Validation
- Loading states
- Toast notifications
- Form fields:
  - Center (dropdown from API)
  - Branch name
  - Region
  - District  
  - Address (textarea)
  - Phone (+998XXXXXXXXX format)
  - Status (ACTIVE/INACTIVE)

#### **EditBranchDialog** (`components/branches/edit-branch-dialog.tsx`)
- Filialni tahrirlash formi
- Barcha fieldlar yangilanishi mumkin
- API integratsiyasi
- Validation
- Loading states

#### **BranchesHeader** (`components/branches/branches-header.tsx`)
- Search branches
- Filter by center, region, status
- Active filters count badge
- Create new branch button
- Responsive design

#### **BranchesPage** (`app/branches/page.tsx`)
- To'liq sahifa integratsiyasi
- Filters state management
- Components orasida ma'lumot uzatish

## 📊 API Endpoints Usage

### 1. GET /branches - Barcha filiallar olish
```javascript
const { branches, loading, error } = useBranches({
  center_id: 1,
  region: "Toshkent", 
  status: "ACTIVE",
  page: 1,
  limit: 10,
  sortBy: "name",
  sortOrder: "asc"
})
```

### 2. POST /branches - Yangi filial yaratish
```javascript
const createBranch = async (data) => {
  await apiClient.createBranch({
    name: "Chilonzor filiali",
    region: "Toshkent",
    district: "Chilonzor", 
    address: "Chilonzor 9-kvartal",
    phone: "+998901234567",
    status: "ACTIVE",
    center_id: 1
  })
}
```

### 3. GET /branches/:id - Filialni ID bo'yicha olish
```javascript
const { branch, loading, error } = useBranch(branchId)
```

### 4. PATCH /branches/:id - Filialni yangilash
```javascript
await updateBranch(branchId, {
  name: "Yangi nom",
  status: "INACTIVE"
})
```

### 5. DELETE /branches/:id - Filialni o'chirish
```javascript
await deleteBranch(branchId)
```

## 🎨 Features

### ✅ Real-time Features
- **Live Search** - nom bo'yicha qidirish
- **Filtering** - region, status bo'yicha filterlash
- **Sorting** - nom, region, sana bo'yicha tartiblash
- **Pagination** - katta ro'yxatlar uchun

### ✅ UI/UX Features
- **Loading States** - barcha amallar uchun
- **Error Handling** - API xatolari uchun toast
- **Success Notifications** - muvaffaqiyatli amallar uchun
- **Responsive Design** - barcha qurilmalar uchun
- **Validation** - form validation
- **Statistics** - har bir filial uchun

### ✅ Data Features
- **Relationships** - center, rooms, courses, teachers, groups
- **Status Management** - ACTIVE/INACTIVE
- **Phone Validation** - +998XXXXXXXXX format
- **Date Display** - Created/Updated dates

## 🛠️ Qo'llanma

### 1. Yangi filial yaratish:
1. "Add Branch" tugmasini bosing
2. Barcha maydonlarni to'ldiring
3. "Create Branch" tugmasini bosing
4. Success toast ko'rinadi

### 2. Filialni tahrirlash:
1. Filial kartasidan "Edit" tugmasini bosing
2. Kerakli maydonlarni o'zgartiring
3. "Save Changes" tugmasini bosing

### 3. Filialni o'chirish:
1. Filial kartasidan "Delete" tugmasini bosing
2. Tasdiqlash kerak

### 4. Filterlash:
1. "Filters" tugmasini bosing
2. Region va Status tanlang
3. "Clear all" bilan filterni tozalang

### 5. Qidiruv:
1. Yuqori qismidagi search fieldga nom yozing
2. Real-time natijalar ko'rsatiladi

## 🔧 Environment Setup

`.env.local` faylida:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

## 📞 API Test Examples

### Browser Console da test qilish:
```javascript
// Get all branches
const branches = await fetch('http://localhost:5000/branches').then(r => r.json())

// Create branch
const newBranch = await fetch('http://localhost:5000/branches', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: "Test filial",
    region: "Toshkent", 
    district: "Yunusobod",
    address: "Test address",
    phone: "+998901234567",
    status: "ACTIVE",
    center_id: 1
  })
}).then(r => r.json())
```

## 🎯 Next Steps

1. **Centers API** integratsiyasini qo'shish
2. **Rooms API** ni branches bilan bog'lash
3. **Teachers API** ni branches bilan bog'lash
4. **Advanced filtering** - price range, capacity
5. **Export functionality** - Excel/PDF
6. **Bulk operations** - multiple delete/update

---

**Branches API to'liq integratsiya qilingan! 🎉**

Barcha komponentlar real API bilan ishlaydi va production-ready!
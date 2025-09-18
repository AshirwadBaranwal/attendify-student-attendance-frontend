// 🎯 DUMMY COLUMN CONFIGURATIONS - COMPLETE EXAMPLES
// Copy this entire block and comment it in your code for future reference

/*
// 📚 COMPLETE SORTING EXAMPLES FOR REFERENCE

const dummyColumns = [
  // 🔢 SERIAL NUMBER - Never sortable
  {
    accessorKey: "slNo",
    header: "Sl No.",
    cell: ({ row }) => row.index + 1,
    enableSorting: false, // ❌ Serial numbers don't need sorting
  },

  // 📝 TEXT SORTING - Department names (A-Z first)
  {
    accessorKey: "name",
    header: "Department Name",
    cell: ({ row }) => row.original.name,
    enableSorting: true,
    sortingFn: "text", // Case-insensitive text sorting
    sortDescFirst: false, // A-Z first (default behavior)
    // Click: unsorted → A-Z → Z-A → unsorted
  },

  // 📅 DATE SORTING - Newest first
  {
    accessorKey: "createdAt",
    header: "Created Date",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    enableSorting: true,
    sortingFn: "datetime", // ✅ Proper date comparison
    sortDescFirst: true, // ✅ Newest first
    // Click: unsorted → newest first → oldest first → unsorted
  },

  // 🔢 NUMBER SORTING - Student count (highest first)
  {
    accessorKey: "studentCount",
    header: "Students",
    cell: ({ row }) => row.original.studentCount || 0,
    enableSorting: true,
    sortingFn: "alphanumeric", // Proper number sorting (2, 10, 100 not 10, 100, 2)
    sortDescFirst: true, // Highest count first
  },

  // 💰 SALARY SORTING - Highest first
  {
    accessorKey: "hodSalary",
    header: "HOD Salary",
    cell: ({ row }) => row.original.hodSalary ? `₹${row.original.hodSalary.toLocaleString()}` : "N/A",
    enableSorting: true,
    sortingFn: "alphanumeric",
    sortDescFirst: true, // Highest salary first
  },

  // 📊 RATING SORTING - Best rating first  
  {
    accessorKey: "rating",
    header: "Department Rating",
    cell: ({ row }) => {
      const rating = row.original.rating;
      return rating ? `${rating}/5 ⭐` : "Not Rated";
    },
    enableSorting: true,
    sortingFn: "alphanumeric",
    sortDescFirst: true, // 5 stars → 1 star
  },

  // 🎯 CUSTOM SORTING - Priority/Status
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = row.original.priority;
      const colors = {
        urgent: "text-red-600",
        high: "text-orange-600", 
        medium: "text-yellow-600",
        low: "text-green-600"
      };
      return <span className={colors[priority] || ""}>{priority}</span>;
    },
    enableSorting: true,
    sortingFn: (rowA, rowB, columnId) => {
      // Custom sorting function
      const priorityOrder = { 
        urgent: 4, 
        high: 3, 
        medium: 2, 
        low: 1,
        undefined: 0 
      };
      const a = priorityOrder[rowA.getValue(columnId)] || 0;
      const b = priorityOrder[rowB.getValue(columnId)] || 0;
      return a - b; // Returns negative, 0, or positive for sorting
    },
    sortDescFirst: true, // Urgent first
  },

  // 📋 STATUS SORTING - Custom order
  {
    accessorKey: "status", 
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const badges = {
        active: <span className="px-2 py-1 bg-green-100 text-green-800 rounded">Active</span>,
        inactive: <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded">Inactive</span>,
        suspended: <span className="px-2 py-1 bg-red-100 text-red-800 rounded">Suspended</span>
      };
      return badges[status] || status;
    },
    enableSorting: true,
    sortingFn: (rowA, rowB, columnId) => {
      const statusOrder = {
        active: 3,
        inactive: 2,
        suspended: 1
      };
      const a = statusOrder[rowA.getValue(columnId)] || 0;
      const b = statusOrder[rowB.getValue(columnId)] || 0; 
      return a - b;
    },
    sortDescFirst: true, // Active departments first
  },

  // 🔤 CASE-SENSITIVE TEXT - Exact text matching
  {
    accessorKey: "code",
    header: "Department Code", 
    cell: ({ row }) => row.original.code,
    enableSorting: true,
    sortingFn: "textCaseSensitive", // CSE comes before cse
    sortDescFirst: false,
  },

  // 📞 NO SORTING - Phone numbers (formatted data)
  {
    accessorKey: "phone",
    header: "Contact",
    cell: ({ row }) => row.original.phone ? `+91 ${row.original.phone}` : "N/A",
    enableSorting: false, // ❌ Formatted data doesn't sort well
  },

  // 🎭 MIXED DATA - Auto detection
  {
    accessorKey: "mixedField",
    header: "Mixed Data",
    cell: ({ row }) => row.original.mixedField,
    enableSorting: true,
    sortingFn: "auto", // Let TanStack decide based on data type
  },

  // 🚫 ACTIONS - Never sortable
  {
    id: "actions",
    header: "Actions",
    enableSorting: false, // ❌ Action buttons never need sorting
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <button>Edit</button>
        <button>Delete</button>
      </div>
    ),
  }
];

// 📊 SORTING FUNCTIONS REFERENCE:
const sortingFnReference = {
  // TEXT SORTING
  "text": "Case-insensitive text (default for strings)",
  "textCaseSensitive": "Case-sensitive text sorting",
  
  // NUMBER SORTING  
  "alphanumeric": "Numbers and text mixed (2, 10, 100)",
  "alphanumericCaseSensitive": "Case-sensitive alphanumeric",
  
  // DATE SORTING
  "datetime": "Proper date/time comparison",
  
  // AUTOMATIC
  "auto": "TanStack decides based on data type",
  "basic": "Simple comparison (fastest)",
  
  // CUSTOM FUNCTION
  (rowA, rowB, columnId) => {
    // Return: negative (a < b), 0 (equal), positive (a > b)
    const a = rowA.getValue(columnId);
    const b = rowB.getValue(columnId);
    return a - b; // or any custom logic
  }
};

// 🎯 SORT DIRECTION REFERENCE:
const sortDirectionReference = {
  sortDescFirst: true,  // First click: desc (Z-A, newest, highest)
  sortDescFirst: false, // First click: asc (A-Z, oldest, lowest) - DEFAULT
};

// 🎨 VISUAL INDICATORS:
// unsorted: ↕️ (ArrowUpDown)  
// asc: ↑ (ArrowUp)
// desc: ↓ (ArrowDown)

// 💡 BEST PRACTICES:
// ✅ DO: Enable sorting for data users need to find/compare
// ✅ DO: Use datetime for dates, alphanumeric for numbers
// ✅ DO: sortDescFirst for dates, ratings, counts
// ❌ DON'T: Sort action buttons, serial numbers, formatted data
// ❌ DON'T: Sort computed fields that change based on other data

// 🚀 PERFORMANCE TIPS:
// - Specify sortingFn explicitly for large datasets
// - Use "basic" for simple data types
// - Avoid complex calculations in custom sorting functions

*/

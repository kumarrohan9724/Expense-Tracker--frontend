// import React, { useState, useMemo } from 'react';
// import {
//   Box,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Typography,
//   IconButton,
//   Chip,
//   Tooltip,
//   TextField,
//   MenuItem,
//   Select,
//   FormControl,
//   InputLabel,
//   TablePagination,
//   Stack,
//   CircularProgress,
//   InputAdornment,
//   useTheme,
//   Button
// } from '@mui/material';
// import { format, isWithinInterval, parseISO, startOfDay, endOfDay } from 'date-fns';
// import { useExpenses, useDeleteExpense } from '../../hooks/useExpenses';

// // Icons
// import EditIcon from '@mui/icons-material/EditRounded';
// import DeleteIcon from '@mui/icons-material/DeleteOutlineRounded';
// import SearchIcon from '@mui/icons-material/SearchRounded';
// import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
// import DateRangeIcon from '@mui/icons-material/DateRangeRounded';
// import ClearIcon from '@mui/icons-material/ClearRounded';

// interface Props {
//   onEditExpense: (expense: any) => void;
// }

// export default function ExpenseList({ onEditExpense }: Props) {
//   const theme = useTheme();
//   const { data: expenses = [], isLoading, error } = useExpenses();
//   const deleteExpense = useDeleteExpense();

//   // --- State ---
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
  
//   // Filters
//   const [searchTerm, setSearchTerm] = useState('');
//   const [categoryFilter, setCategoryFilter] = useState('All');
//   const [sortBy, setSortBy] = useState('date-desc');
  
//   // Date Range State
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');

//   // --- Handlers ---
//   const handleChangePage = (event: unknown, newPage: number) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const handleDelete = (id: string) => {
//     if (window.confirm('Are you sure you want to delete this record?')) {
//       deleteExpense.mutate(id);
//     }
//   };

//   const clearDateFilter = () => {
//     setStartDate('');
//     setEndDate('');
//   };

//   // --- Data Processing (Filter & Sort) ---
//   const processedData = useMemo(() => {
//     let data = [...expenses];

//     // 1. Filter by Search
//     if (searchTerm) {
//       const lowerTerm = searchTerm.toLowerCase();
//       data = data.filter(item => 
//         item.description.toLowerCase().includes(lowerTerm) ||
//         (item.amount && item.amount.toString().includes(lowerTerm))
//       );
//     }

//     // 2. Filter by Category
//     if (categoryFilter !== 'All') {
//       data = data.filter(item => item.categories?.name === categoryFilter);
//     }

//     // 3. Filter by Date Range
//     if (startDate || endDate) {
//       data = data.filter(item => {
//         const itemDate = new Date(item.date).getTime();
//         const start = startDate ? startOfDay(parseISO(startDate)).getTime() : 0;
//         // If end date is selected, set it to the END of that day (23:59:59)
//         const end = endDate ? endOfDay(parseISO(endDate)).getTime() : Infinity;

//         return itemDate >= start && itemDate <= end;
//       });
//     }

//     // 4. Sorting
//     data.sort((a, b) => {
//       switch (sortBy) {
//         case 'date-asc': return new Date(a.date).getTime() - new Date(b.date).getTime();
//         case 'date-desc': return new Date(b.date).getTime() - new Date(a.date).getTime();
//         case 'amount-desc': return Number(b.amount) - Number(a.amount);
//         case 'amount-asc': return Number(a.amount) - Number(b.amount);
//         default: return 0;
//       }
//     });

//     return data;
//   }, [expenses, searchTerm, categoryFilter, sortBy, startDate, endDate]);

//   // Extract unique categories for the filter dropdown
//   const uniqueCategories = useMemo(() => {
//     const cats = new Set(expenses.map((e: any) => e.categories?.name || 'Uncategorized'));
//     return ['All', ...Array.from(cats)];
//   }, [expenses]);

//   // Pagination Slice
//   const visibleRows = processedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

//   // Common styles for dark inputs
//   const inputStyles = {
//     color: '#fff',
//     backgroundColor: 'rgba(0,0,0,0.2)',
//     '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
//     '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
//     '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.main },
//     '.MuiSvgIcon-root': { color: 'rgba(255,255,255,0.5)' },
//     input: { color: '#fff' }
//   };

//   if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress color="primary" /></Box>;
//   if (error) return <Typography color="error" align="center" sx={{ p: 4 }}>Error loading financial data.</Typography>;

//   return (
//     <Paper 
//       sx={{ 
//         width: '100%', 
//         overflow: 'hidden',
//         borderRadius: 1,
//         background: 'rgba(255,255,255,0.02)',
//         border: '1px solid rgba(255,255,255,0.08)',
//       }}
//     >
//       {/* --- Toolbar / Filters --- */}
//       <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        
//         {/* Top Row: Search and Sort */}
//         <Stack 
//           direction={{ xs: 'column', md: 'row' }} 
//           spacing={2} 
//           justifyContent="space-between" 
//           alignItems={{ xs: 'stretch', md: 'center' }}
//           sx={{ mb: 3 }}
//         >
//            <TextField
//             placeholder="Search transactions..."
//             size="small"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon sx={{ color: 'rgba(255,255,255,0.4)' }} />
//                 </InputAdornment>
//               ),
//             }}
//             sx={{ flexGrow: 1, maxWidth: { md: 350 }, '& .MuiOutlinedInput-root': inputStyles }}
//           />

//           <Stack direction="row" spacing={2}>
//             <FormControl size="small" sx={{ minWidth: 140 }}>
//                 <InputLabel sx={{ color: 'rgba(255,255,255,0.5)' }}>Category</InputLabel>
//                 <Select
//                   value={categoryFilter}
//                   label="Category"
//                   onChange={(e) => setCategoryFilter(e.target.value)}
//                   sx={{ ...inputStyles, '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' } }}
//                 >
//                   {uniqueCategories.map((cat: any) => (
//                     <MenuItem key={cat} value={cat}>{cat}</MenuItem>
//                   ))}
//                 </Select>
//             </FormControl>

//             <FormControl size="small" sx={{ minWidth: 140 }}>
//               <InputLabel sx={{ color: 'rgba(255,255,255,0.5)' }}>Sort By</InputLabel>
//               <Select
//                 value={sortBy}
//                 label="Sort By"
//                 onChange={(e) => setSortBy(e.target.value)}
//                 sx={{ ...inputStyles, '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' } }}
//               >
//                 <MenuItem value="date-desc">Newest First</MenuItem>
//                 <MenuItem value="date-asc">Oldest First</MenuItem>
//                 <MenuItem value="amount-desc">Highest Amount</MenuItem>
//                 <MenuItem value="amount-asc">Lowest Amount</MenuItem>
//               </Select>
//             </FormControl>
//           </Stack>
//         </Stack>

//         {/* Bottom Row: Date Range Filters */}
//         <Stack direction="row" spacing={2} alignItems="center" sx={{ flexWrap: 'wrap', gap: 2 }}>
//             <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <DateRangeIcon fontSize="small" /> Date Range:
//             </Typography>
            
//             <TextField
//                 type="date"
//                 size="small"
//                 value={startDate}
//                 onChange={(e) => setStartDate(e.target.value)}
//                 sx={{ 
//                     maxWidth: 160,
//                     '& .MuiOutlinedInput-root': inputStyles,
//                     // Hide calendar icon color override needed for some browsers
//                     'input::-webkit-calendar-picker-indicator': { filter: 'invert(1)' } 
//                 }}
//             />
//             <Typography sx={{ color: 'rgba(255,255,255,0.3)' }}>to</Typography>
//             <TextField
//                 type="date"
//                 size="small"
//                 value={endDate}
//                 onChange={(e) => setEndDate(e.target.value)}
//                 sx={{ 
//                     maxWidth: 160,
//                     '& .MuiOutlinedInput-root': inputStyles,
//                     'input::-webkit-calendar-picker-indicator': { filter: 'invert(1)' }
//                 }}
//             />

//             {(startDate || endDate) && (
//                 <Button 
//                     startIcon={<ClearIcon />} 
//                     size="small" 
//                     onClick={clearDateFilter}
//                     sx={{ 
//                         color: 'rgba(255,255,255,0.6)', 
//                         textTransform: 'none',
//                         '&:hover': { color: '#fff', background: 'rgba(255,255,255,0.1)' }
//                     }}
//                 >
//                     Clear Dates
//                 </Button>
//             )}
//         </Stack>
//       </Box>

//       {/* --- Table --- */}
//       <TableContainer sx={{ maxHeight: 600 }}>
//         <Table stickyHeader aria-label="expenses table">
//           <TableHead>
//             <TableRow>
//               {['Date', 'Description', 'Category', 'Amount', 'Actions'].map((head) => (
//                 <TableCell
//                   key={head}
//                   align={head === 'Amount' ? 'right' : head === 'Actions' ? 'center' : 'left'}
//                   sx={{
//                     backgroundColor: '#1e293b',
//                     color: 'rgba(255,255,255,0.7)',
//                     fontWeight: 600,
//                     borderBottom: '1px solid rgba(255,255,255,0.1)',
//                     textTransform: 'uppercase',
//                     fontSize: '0.75rem',
//                     letterSpacing: '1px',
//                     py: 2
//                   }}
//                 >
//                   {head}
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {visibleRows.length > 0 ? (
//               visibleRows.map((row: any) => (
//                 <TableRow
//                   key={row.id}
//                   hover
//                   sx={{
//                     '&:last-child td, &:last-child th': { border: 0 },
//                     borderBottom: '1px solid rgba(255,255,255,0.04)',
//                     transition: 'background-color 0.2s',
//                     '&:hover': {
//                       backgroundColor: 'rgba(139, 92, 246, 0.08) !important',
//                       '& .action-buttons': { opacity: 1 }
//                     }
//                   }}
//                 >
//                   <TableCell sx={{ color: 'rgba(255,255,255,0.6)', borderBottomColor: 'rgba(255,255,255,0.04)' }}>
//                     {format(new Date(row.date), 'MMM dd, yyyy')}
//                   </TableCell>
                  
//                   <TableCell sx={{ color: '#fff', fontWeight: 500, borderBottomColor: 'rgba(255,255,255,0.04)' }}>
//                     {row.description}
//                   </TableCell>
                  
//                   <TableCell sx={{ borderBottomColor: 'rgba(255,255,255,0.04)' }}>
//                     <Chip 
//                       label={row.categories?.name || 'Uncategorized'} 
//                       size="small"
//                       sx={{ 
//                         backgroundColor: 'rgba(139, 92, 246, 0.15)', 
//                         color: '#C4B5FD', 
//                         borderRadius: '6px',
//                         fontWeight: 500,
//                         fontSize: '0.75rem',
//                         height: 24
//                       }}
//                     />
//                   </TableCell>
                  
//                   <TableCell align="right" sx={{ borderBottomColor: 'rgba(255,255,255,0.04)' }}>
//                     <Typography 
//                       variant="body2" 
//                       sx={{ 
//                         fontWeight: 700, 
//                         color: '#fff',
//                         fontFamily: 'monospace',
//                         fontSize: '0.9rem'
//                       }}
//                     >
//                       ${Number(row.amount).toFixed(2)}
//                     </Typography>
//                   </TableCell>
                  
//                   <TableCell align="center" sx={{ borderBottomColor: 'rgba(255,255,255,0.04)' }}>
//                     <Stack 
//                       direction="row" 
//                       spacing={1} 
//                       justifyContent="center"
//                       className="action-buttons"
//                       sx={{ 
//                         opacity: { xs: 1, md: 0 },
//                         transition: 'opacity 0.2s' 
//                       }}
//                     >
//                       <Tooltip title="Edit">
//                         <IconButton 
//                           size="small" 
//                           onClick={() => onEditExpense(row)}
//                           sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#8B5CF6' } }}
//                         >
//                           <EditIcon fontSize="small" />
//                         </IconButton>
//                       </Tooltip>
//                       <Tooltip title="Delete">
//                         <IconButton 
//                           size="small" 
//                           onClick={() => handleDelete(row.id)}
//                           sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#EF4444' } }}
//                         >
//                           <DeleteIcon fontSize="small" />
//                         </IconButton>
//                       </Tooltip>
//                     </Stack>
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={5} align="center" sx={{ py: 8, border: 'none' }}>
//                   <Stack alignItems="center" spacing={2} sx={{ opacity: 0.5 }}>
//                     <SentimentDissatisfiedIcon sx={{ fontSize: 48 }} />
//                     <Typography>No transactions found matching your criteria.</Typography>
//                     <Button 
//                         variant="text" 
//                         onClick={() => { 
//                             setSearchTerm(''); 
//                             setCategoryFilter('All');
//                             clearDateFilter(); 
//                         }}
//                         sx={{ color: theme.palette.primary.main }}
//                     >
//                         Clear All Filters
//                     </Button>
//                   </Stack>
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* --- Pagination --- */}
//       <TablePagination
//         rowsPerPageOptions={[5, 10, 25]}
//         component="div"
//         count={processedData.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//         sx={{
//           borderTop: '1px solid rgba(255,255,255,0.08)',
//           color: 'rgba(255,255,255,0.7)',
//           '.MuiTablePagination-selectIcon': { color: 'rgba(255,255,255,0.7)' },
//           '.MuiTablePagination-actions': { color: 'rgba(255,255,255,0.7)' }
//         }}
//       />
//     </Paper>
//   );
// }

import React, { useState, useMemo } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Chip,
  Tooltip,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TablePagination,
  Stack,
  CircularProgress,
  InputAdornment,
  useTheme,
  Button,
  useMediaQuery,
  Divider
} from '@mui/material';
import { format, parseISO, startOfDay, endOfDay } from 'date-fns';
import { useExpenses, useDeleteExpense } from '../../hooks/useExpenses';

// Icons
import EditIcon from '@mui/icons-material/EditRounded';
import DeleteIcon from '@mui/icons-material/DeleteOutlineRounded';
import SearchIcon from '@mui/icons-material/SearchRounded';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import DateRangeIcon from '@mui/icons-material/DateRangeRounded';
import ClearIcon from '@mui/icons-material/ClearRounded';

interface Props {
  onEditExpense: (expense: any) => void;
}

export default function ExpenseList({ onEditExpense }: Props) {
  const theme = useTheme();
  // Breakpoint to switch between Table (Desktop) and Cards (Mobile)
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { data: expenses = [], isLoading, error } = useExpenses();
  const deleteExpense = useDeleteExpense();

  // --- State ---
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc');
  
  // Date Range State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // --- Handlers ---
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    // Scroll to top on mobile when changing pages for better UX
    if (isMobile) window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      deleteExpense.mutate(id);
    }
  };

  const clearDateFilter = () => {
    setStartDate('');
    setEndDate('');
  };

  // --- Data Processing (Filter & Sort) ---
  const processedData = useMemo(() => {
    let data = [...expenses];

    // 1. Filter by Search
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      data = data.filter(item => 
        item.description.toLowerCase().includes(lowerTerm) ||
        (item.amount && item.amount.toString().includes(lowerTerm))
      );
    }

    // 2. Filter by Category
    if (categoryFilter !== 'All') {
      data = data.filter(item => item.categories?.name === categoryFilter);
    }

    // 3. Filter by Date Range
    if (startDate || endDate) {
      data = data.filter(item => {
        const itemDate = new Date(item.date).getTime();
        const start = startDate ? startOfDay(parseISO(startDate)).getTime() : 0;
        const end = endDate ? endOfDay(parseISO(endDate)).getTime() : Infinity;
        return itemDate >= start && itemDate <= end;
      });
    }

    // 4. Sorting
    data.sort((a, b) => {
      switch (sortBy) {
        case 'date-asc': return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'date-desc': return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'amount-desc': return Number(b.amount) - Number(a.amount);
        case 'amount-asc': return Number(a.amount) - Number(b.amount);
        default: return 0;
      }
    });

    return data;
  }, [expenses, searchTerm, categoryFilter, sortBy, startDate, endDate]);

  // Extract unique categories
  const uniqueCategories = useMemo(() => {
    const cats = new Set(expenses.map((e: any) => e.categories?.name || 'Uncategorized'));
    return ['All', ...Array.from(cats)];
  }, [expenses]);

  // Pagination Slice
  const visibleRows = processedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Common styles
  const inputStyles = {
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.2)',
    '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.main },
    '.MuiSvgIcon-root': { color: 'rgba(255,255,255,0.5)' },
    input: { color: '#fff' }
  };

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress color="primary" /></Box>;
  if (error) return <Typography color="error" align="center" sx={{ p: 4 }}>Error loading financial data.</Typography>;

  return (
    <Paper 
      sx={{ 
        width: '100%', 
        overflow: 'hidden',
        borderRadius: { xs: 0, md: 2 }, // Rounded only on desktop
        background: { xs: 'transparent', md: 'rgba(255,255,255,0.02)' }, // Transparent bg on mobile to let cards pop
        border: { xs: 'none', md: '1px solid rgba(255,255,255,0.08)' },
      }}
      elevation={0}
    >
      {/* --- Toolbar / Filters --- */}
      <Box sx={{ p: { xs: 2, md: 3 }, borderBottom: { xs: 'none', md: '1px solid rgba(255,255,255,0.08)' } }}>
        
        {/* Top Row: Search and Sort */}
        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          spacing={2} 
          justifyContent="space-between" 
          alignItems={{ xs: 'stretch', md: 'center' }}
          sx={{ mb: 2 }}
        >
           <TextField
            placeholder="Search..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'rgba(255,255,255,0.4)' }} />
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1, maxWidth: { md: 350 }, '& .MuiOutlinedInput-root': inputStyles }}
          />

          <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', md: 'auto' } }}>
            <FormControl size="small" sx={{ flex: 1, minWidth: 120 }}>
                <InputLabel sx={{ color: 'rgba(255,255,255,0.5)' }}>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  label="Category"
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  sx={{ ...inputStyles, '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' } }}
                >
                  {uniqueCategories.map((cat: any) => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
            </FormControl>

            <FormControl size="small" sx={{ flex: 1, minWidth: 120 }}>
              <InputLabel sx={{ color: 'rgba(255,255,255,0.5)' }}>Sort</InputLabel>
              <Select
                value={sortBy}
                label="Sort"
                onChange={(e) => setSortBy(e.target.value)}
                sx={{ ...inputStyles, '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' } }}
              >
                <MenuItem value="date-desc">Newest</MenuItem>
                <MenuItem value="date-asc">Oldest</MenuItem>
                <MenuItem value="amount-desc">Highest $</MenuItem>
                <MenuItem value="amount-asc">Lowest $</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Stack>

        {/* Bottom Row: Date Range Filters */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                <DateRangeIcon fontSize="small" />
            </Typography>
            
            <Stack direction="row" spacing={1} alignItems="center" sx={{ flex: 1 }}>
              <TextField
                  type="date"
                  size="small"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  sx={{ 
                      flex: 1,
                      maxWidth: 160,
                      '& .MuiOutlinedInput-root': inputStyles,
                      'input::-webkit-calendar-picker-indicator': { filter: 'invert(1)' } 
                  }}
              />
              <Typography sx={{ color: 'rgba(255,255,255,0.3)' }}>-</Typography>
              <TextField
                  type="date"
                  size="small"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  sx={{ 
                      flex: 1,
                      maxWidth: 160,
                      '& .MuiOutlinedInput-root': inputStyles,
                      'input::-webkit-calendar-picker-indicator': { filter: 'invert(1)' }
                  }}
              />
            </Stack>

            {(startDate || endDate) && (
                <Button 
                    startIcon={<ClearIcon />} 
                    size="small" 
                    onClick={clearDateFilter}
                    sx={{ 
                        color: 'rgba(255,255,255,0.6)', 
                        textTransform: 'none',
                        '&:hover': { color: '#fff', background: 'rgba(255,255,255,0.1)' }
                    }}
                >
                    Clear
                </Button>
            )}
        </Stack>
      </Box>

      {/* --- Content Area (Responsive Switch) --- */}
      {visibleRows.length === 0 ? (
        <Box sx={{ p: 8, textAlign: 'center', opacity: 0.5 }}>
             <SentimentDissatisfiedIcon sx={{ fontSize: 48, mb: 1 }} />
            <Typography>No transactions found.</Typography>
             <Button 
                variant="text" 
                onClick={() => { 
                    setSearchTerm(''); 
                    setCategoryFilter('All');
                    clearDateFilter(); 
                }}
                sx={{ mt: 1 }}
            >
                Clear Filters
            </Button>
        </Box>
      ) : (
        <>
          {/* --- DESKTOP TABLE VIEW --- */}
          {!isMobile && (
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader aria-label="expenses table">
                <TableHead>
                  <TableRow>
                    {['Date', 'Description', 'Category', 'Amount', 'Actions'].map((head) => (
                      <TableCell
                        key={head}
                        align={head === 'Amount' ? 'right' : head === 'Actions' ? 'center' : 'left'}
                        sx={{
                          backgroundColor: '#1e293b',
                          color: 'rgba(255,255,255,0.7)',
                          fontWeight: 600,
                          borderBottom: '1px solid rgba(255,255,255,0.1)',
                          textTransform: 'uppercase',
                          fontSize: '0.75rem',
                          letterSpacing: '1px',
                          py: 2
                        }}
                      >
                        {head}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visibleRows.map((row: any) => (
                    <TableRow
                      key={row.id}
                      hover
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          backgroundColor: 'rgba(139, 92, 246, 0.08) !important',
                          '& .action-buttons': { opacity: 1 }
                        }
                      }}
                    >
                      <TableCell sx={{ color: 'rgba(255,255,255,0.6)', borderBottomColor: 'rgba(255,255,255,0.04)' }}>
                        {format(new Date(row.date), 'MMM dd, yyyy')}
                      </TableCell>
                      
                      <TableCell sx={{ color: '#fff', fontWeight: 500, borderBottomColor: 'rgba(255,255,255,0.04)' }}>
                        {row.description}
                      </TableCell>
                      
                      <TableCell sx={{ borderBottomColor: 'rgba(255,255,255,0.04)' }}>
                        <Chip 
                          label={row.categories?.name || 'Uncategorized'} 
                          size="small"
                          sx={{ 
                            backgroundColor: 'rgba(139, 92, 246, 0.15)', 
                            color: '#C4B5FD', 
                            borderRadius: '6px',
                            fontWeight: 500,
                            fontSize: '0.75rem',
                            height: 24
                          }}
                        />
                      </TableCell>
                      
                      <TableCell align="right" sx={{ borderBottomColor: 'rgba(255,255,255,0.04)' }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#fff', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                          ${Number(row.amount).toFixed(2)}
                        </Typography>
                      </TableCell>
                      
                      <TableCell align="center" sx={{ borderBottomColor: 'rgba(255,255,255,0.04)' }}>
                        <Stack 
                          direction="row" 
                          spacing={1} 
                          justifyContent="center"
                          className="action-buttons"
                          sx={{ opacity: 0, transition: 'opacity 0.2s' }}
                        >
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => onEditExpense(row)} sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#8B5CF6' } }}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" onClick={() => handleDelete(row.id)} sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#EF4444' } }}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* --- MOBILE CARD VIEW --- */}
          {isMobile && (
            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {visibleRows.map((row: any) => (
                <Paper
                  key={row.id}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    background: 'rgba(30, 41, 59, 0.7)', // Slightly lighter than global bg
                    border: '1px solid rgba(255,255,255,0.1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Card Header: Date & Actions */}
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.5 }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: 0.5 }}>
                      {format(new Date(row.date), 'EEE, MMM dd, yyyy')}
                    </Typography>
                    <Stack direction="row" spacing={0}>
                      <IconButton 
                        size="small" 
                        onClick={() => onEditExpense(row)} 
                        sx={{ color: 'rgba(255,255,255,0.4)', p: 1, '&:hover': { color: '#8B5CF6' } }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => handleDelete(row.id)} 
                        sx={{ color: 'rgba(255,255,255,0.4)', p: 1, '&:hover': { color: '#EF4444' } }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Stack>

                  {/* Card Body: Description & Amount */}
                  <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                    <Typography variant="body1" sx={{ color: '#fff', fontWeight: 500, lineHeight: 1.3 }}>
                      {row.description}
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, fontFamily: 'monospace' }}>
                      ${Number(row.amount).toFixed(2)}
                    </Typography>
                  </Stack>

                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', mb: 1.5 }} />

                  {/* Card Footer: Category */}
                   <Chip 
                      label={row.categories?.name || 'Uncategorized'} 
                      size="small"
                      sx={{ 
                        backgroundColor: 'rgba(139, 92, 246, 0.15)', 
                        color: '#C4B5FD', 
                        borderRadius: '6px',
                        fontWeight: 500,
                        fontSize: '0.75rem',
                      }}
                    />
                </Paper>
              ))}
            </Box>
          )}
        </>
      )}

      {/* --- Pagination --- */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={processedData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          color: 'rgba(255,255,255,0.7)',
          backgroundColor: { xs: 'rgba(0,0,0,0.2)', md: 'transparent' }, // Darker bg for pagination on mobile
          '.MuiTablePagination-selectIcon': { color: 'rgba(255,255,255,0.7)' },
          '.MuiTablePagination-actions': { color: 'rgba(255,255,255,0.7)' },
          '.MuiToolbar-root': { pl: { xs: 1, md: 2 }, pr: { xs: 1, md: 2 } } // Adjust padding for mobile
        }}
      />
    </Paper>
  );
}
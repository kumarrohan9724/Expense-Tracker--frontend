// src/components/SummaryCards.tsx
'use client'
import { SimpleGrid, Box, Text, Icon, Flex, Badge } from '@chakra-ui/react';
import { TrendingUp, TrendingDown, RefreshCw, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export default function SummaryCards({ transactions, budgets }: { transactions: any[], budgets: any[] }) {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
  
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

  const netFlow = totalIncome - totalExpense;

  const stats = [
    { label: 'Total Income', value: `$${totalIncome.toFixed(2)}`, icon: TrendingUp, color: 'income.500' },
    { label: 'Total Expense', value: `$${totalExpense.toFixed(2)}`, icon: TrendingDown, color: 'expense.500' },
    { label: 'Net Monthly Flow', value: `$${netFlow.toFixed(2)}`, icon: RefreshCw, color: netFlow >= 0 ? 'green.500' : 'red.500' },
    { label: 'Total Budgeted', value: `$${budgets.reduce((acc, b) => acc + parseFloat(b.monthly_limit), 0).toFixed(2)}`, icon: Wallet, color: 'brand.500' },
  ];

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5} mb={8}>
      {stats.map((stat, index) => (
        <MotionBox
          key={index}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          p={6}
          bg="white"
          borderRadius="xl"
          boxShadow="lg"
          borderLeft="4px solid"
          borderColor={stat.color}
          minH="120px"
        >
          <Flex align="center" justify="space-between" h="full">
            <Box>
              <Text fontSize="sm" color="gray.500" fontWeight="medium">{stat.label}</Text>
              <Text 
                fontSize={{base: '2xl', md: '3xl'}} 
                fontWeight="extrabold" 
                mt={1} 
                color={stat.color}
              >
                {stat.value}
              </Text>
              {stat.label === 'Net Monthly Flow' && (
                <Badge colorScheme={netFlow >= 0 ? 'green' : 'red'} mt={1}>
                    {netFlow >= 0 ? 'Surplus' : 'Deficit'}
                </Badge>
              )}
            </Box>
            <Icon as={stat.icon} boxSize={10} color={stat.color} opacity={0.6} />
          </Flex>
        </MotionBox>
      ))}
    </SimpleGrid>
  );
}
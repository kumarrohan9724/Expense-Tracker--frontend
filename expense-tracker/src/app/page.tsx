// src/app/page.tsx
import { Container, Flex, Heading, Box, SimpleGrid, Tabs, TabList, Tab, TabPanels, TabPanel, Text } 
from '@chakra-ui/react';
import TransactionForm from '@/components/TransactionForm'; // Renamed
import SummaryCards from '@/components/SummaryCards';
import AnalyticsChart from '@/components/AnalyticsChart'; // New Chart
import TransactionList from '@/components/TransactionList'; // Renamed
import BudgetGoals from '@/components/BudgetGoals'; // New Component
import BudgetGoalManager from '@/components/BudgetGoalManager'; // <<< NEW IMPORT

import { getTransactions, getBudgets, getGoals } from './actions';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const transactions = await getTransactions();
  const budgets = await getBudgets();
  const goals = await getGoals();

  return (
    <Container maxW="container.xl" py={8}>
      <Flex justify="space-between" align="center" mb={8} wrap="wrap" gap={4}>
        <Box>
          <Heading size="xl" color="brand.600" fontFamily="heading">FlowFinance Pro 💸</Heading>
          <Text color="gray.500" mt={1}>Your complete financial overview.</Text>
        </Box>
        <TransactionForm />
      </Flex>

      {/* 1. KEY STATS */}
      <SummaryCards transactions={transactions} budgets={budgets} />

      {/* 2. MAIN TABS (Analytics, Budgeting) */}
      <Tabs colorScheme="brand" isLazy mb={8} variant="enclosed-colored" bg="white" borderRadius="xl" boxShadow="lg">
        <TabList>
            <Tab fontWeight="bold">Dashboard & Analytics</Tab>
            <Tab fontWeight="bold">Recent Transactions</Tab>
            <Tab fontWeight="bold">Manage Budgets & Goals</Tab> {/* NEW TAB */}
        </TabList>

        <TabPanels p={4}>
            {/* Analytics Tab */}
            <TabPanel>
                <AnalyticsChart transactions={transactions} />
            </TabPanel>

            {/* Budgeting & Goals Tab */}
  

            {/* Transaction List Tab */}
            <TabPanel>
                <TransactionList transactions={transactions} />
            </TabPanel>

            <TabPanel>
                <BudgetGoalManager budgets={budgets} goals={goals} transactions={transactions} /> 
            </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
}
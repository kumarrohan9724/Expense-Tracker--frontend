// src/components/BudgetGoalManager.tsx
'use client'
import { 
  Box, Text, Progress, SimpleGrid, VStack, Heading, 
  Flex, Input, Button, Tabs, TabList, Tab, TabPanels, 
  TabPanel, FormControl, FormLabel, Select, IconButton, 
  useToast, Tooltip, InputGroup, InputLeftElement 
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Goal, Trash2, Calendar, Target } from 'lucide-react';
import { addBudget, updateGoal, deleteBudget, addGoal, deleteGoal } from '@/app/actions'; 
import { useState } from 'react';

// --- Framer Motion Variants for Animations ---
const MotionBox = motion(Box);
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

// --- Helper function to calculate spent (Client-side) ---
const calculateSpent = (transactions: any[], category: string) => {
    // Filter transactions for the current month and year
    const monthlyExpenses = transactions
        .filter(t => t.type === 'expense')
        .filter(t => {
            const date = new Date(t.created_at);
            const today = new Date();
            return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
        });
    
    // Sum the amounts for the specified category
    return monthlyExpenses
        .filter(t => t.category === category)
        .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
};


export default function BudgetGoalManager({ budgets, goals, transactions }: { budgets: any[], goals: any[], transactions: any[] }) {
  const toast = useToast();
  // State to manage which goal's input is currently being edited/updated
  const [goalAmount, setGoalAmount] = useState<Record<number, number>>({}); 

  // --- Dynamic Budget Form ---
  const BudgetForm = () => (
    <form action={async (formData) => {
        await addBudget(formData);
        toast({ title: "Budget Updated/Created!", status: "success", duration: 2000 });
    }}>
        <VStack spacing={4} p={2} bg="gray.50" borderRadius="lg">
            <Text fontSize="sm" color="gray.600" w="full">Define your spending limit per category.</Text>
            
            <FormControl isRequired>
                <FormLabel fontSize="sm" mb={1}>Category Name</FormLabel>
                {/* Input allows for setting NEW categories or typing an EXISTING one to UPDATE its limit */}
                <Input 
                    name="category" 
                    placeholder="Type in a Category (e.g., Clothing, Rent)" 
                    bg="white" 
                />
            </FormControl>
            
            <FormControl isRequired>
                <FormLabel fontSize="sm" mb={1}>Monthly Limit ($)</FormLabel>
                <InputGroup>
                    <InputLeftElement pointerEvents="none">
                        <DollarSign size={18} color="gray" />
                    </InputLeftElement>
                    <Input name="monthly_limit" type="number" step="1" placeholder="e.g., 500.00" bg="white" />
                </InputGroup>
            </FormControl>
            
            <Button type="submit" colorScheme="brand" leftIcon={<DollarSign size={18} />} w="full" mt={2} boxShadow="md">
                Set/Update Budget
            </Button>
        </VStack>
    </form>
  );

  // --- Dynamic Goal Form (Detailed Creation) ---
  const GoalForm = () => (
    <form action={async (formData) => {
        await addGoal(formData);
        toast({ title: "New Goal Created!", status: "info", duration: 2000 });
    }}>
        <VStack spacing={4} p={2} bg="purple.50" borderRadius="lg">
            <Text fontSize="sm" color="purple.600" w="full">Define the details of your savings goal.</Text>

            <FormControl isRequired>
                <FormLabel fontSize="sm" mb={1}>Goal Name</FormLabel>
                <Input name="name" placeholder="e.g., New Laptop Fund" bg="white" />
            </FormControl>
            
            <FormControl isRequired>
                <FormLabel fontSize="sm" mb={1}>Target Amount ($)</FormLabel>
                <InputGroup>
                    <InputLeftElement pointerEvents="none">
                        <Target size={18} color="gray" />
                    </InputLeftElement>
                    <Input name="target_amount" type="number" step="1" placeholder="e.g., 1500.00" bg="white" />
                </InputGroup>
            </FormControl>
            
            <FormControl>
                <FormLabel fontSize="sm" mb={1}>Target Date (Optional)</FormLabel>
                <InputGroup>
                    <InputLeftElement pointerEvents="none">
                        <Calendar size={18} color="gray" />
                    </InputLeftElement>
                    <Input name="target_date" type="date" bg="white" />
                </InputGroup>
            </FormControl>
            
            <Button type="submit" colorScheme="purple" leftIcon={<Goal size={18} />} w="full" mt={2} boxShadow="md">
                Create Goal
            </Button>
        </VStack>
    </form>
  );
  
  // --- Goal Update Handler ---
  const handleGoalUpdate = async (goalId: number, currentAmount: number, amountToAdd: number) => {
    const newAmount = currentAmount + amountToAdd;
    if (newAmount >= 0) {
        await updateGoal(goalId, newAmount);
        setGoalAmount(prev => ({ ...prev, [goalId]: 0 })); // Reset input after update
        toast({ title: "Goal updated!", status: "success", duration: 2000 });
    } else {
        toast({ title: "Cannot withdraw more than saved.", status: "error", duration: 2000 });
    }
  };


  return (
    <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} mb={8}>
        {/* BUDGET MANAGEMENT (VIEW & CREATE) */}
        <MotionBox 
            bg="white" 
            p={6} 
            borderRadius="3xl"
            boxShadow="2xl"
            border="1px solid"
            borderColor="brand.500"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
        >
            <Heading size="lg" mb={4} color="brand.600">Dynamic Budget Control</Heading>
            
            <Tabs colorScheme="brand" variant="soft-rounded" mb={6}>
                <TabList>
                    <Tab fontWeight="bold">View Budgets</Tab>
                    <Tab fontWeight="bold">Set New</Tab>
                </TabList>
                <TabPanels>
                    {/* Budget View Tab */}
                    <TabPanel p={0} pt={4}>
                        <VStack spacing={4} align="stretch" as={motion.div} variants={containerVariants} initial="hidden" animate="visible">
                            <AnimatePresence>
                                {budgets.map((budget) => {
                                    const spent = calculateSpent(transactions, budget.category);
                                    const percentage = (spent / budget.monthly_limit) * 100;
                                    const statusColor = percentage > 90 ? 'red' : percentage > 50 ? 'orange' : 'green';
                                    
                                    return (
                                        <MotionBox 
                                            key={budget.id} 
                                            variants={itemVariants}
                                            exit={{ opacity: 0, x: -50 }}
                                            p={4} bg="gray.50" borderRadius="xl" 
                                            borderLeft={`5px solid var(--chakra-colors-${statusColor}-500)`}
                                            cursor="pointer"
                                        >
                                            <Flex justify="space-between" align="center">
                                                <Box>
                                                    <Text fontWeight="extrabold">{budget.category}</Text>
                                                    <Text fontSize="xs" color="gray.500">Limit: ${parseFloat(budget.monthly_limit).toFixed(2)}</Text>
                                                </Box>
                                                <Tooltip label="Delete Budget">
                                                    <IconButton 
                                                        icon={<Trash2 size={16} />} 
                                                        aria-label="Delete Budget" 
                                                        size="sm" 
                                                        variant="ghost" 
                                                        colorScheme="red"
                                                        onClick={() => deleteBudget(budget.id)}
                                                    />
                                                </Tooltip>
                                            </Flex>
                                            <Progress 
                                                value={Math.min(percentage, 100)} 
                                                colorScheme={statusColor} 
                                                size="xs" 
                                                mt={2} 
                                                borderRadius="full" 
                                            />
                                            <Text fontSize="sm" mt={1} fontWeight="semibold" color={statusColor}>
                                                Spent: ${spent.toFixed(2)} ({percentage.toFixed(0)}%)
                                            </Text>
                                        </MotionBox>
                                    );
                                })}
                            </AnimatePresence>
                        </VStack>
                    </TabPanel>
                    
                    {/* Budget Creation/Update Tab */}
                    <TabPanel pt={4}>
                        <BudgetForm />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </MotionBox>

        {/* GOALS MANAGEMENT (VIEW & CREATE) */}
        <MotionBox 
            // Glassmorphism-like effect with gradient
            bg="linear-gradient(145deg, rgba(255,255,255,0.9), rgba(220, 220, 255, 0.7))"
            p={6} 
            borderRadius="3xl"
            boxShadow="2xl"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
            style={{ backdropFilter: 'blur(5px)' }} 
        >
            <Heading size="lg" mb={4} color="purple.600">Financial Goal Tracker</Heading>
            
            <Tabs colorScheme="purple" variant="soft-rounded" mb={6}>
                <TabList>
                    <Tab fontWeight="bold">View Goals</Tab>
                    <Tab fontWeight="bold">Create New</Tab>
                </TabList>
                <TabPanels>
                    {/* Goals View Tab */}
                    <TabPanel p={0} pt={4}>
                        <VStack spacing={4} align="stretch" as={motion.div} variants={containerVariants} initial="hidden" animate="visible">
                            <AnimatePresence>
                                {goals.map((goal) => {
                                    const percentage = (goal.current_amount / goal.target_amount) * 100;
                                    const remaining = goal.target_amount - goal.current_amount;
                                    const targetDate = goal.target_date ? new Date(goal.target_date).toLocaleDateString() : 'N/A';
                                    
                                    return (
                                        <MotionBox 
                                            key={goal.id} 
                                            variants={itemVariants}
                                            exit={{ opacity: 0, x: 50 }}
                                            p={4} 
                                            bg="purple.50" 
                                            borderRadius="xl"
                                        >
                                            <Flex justify="space-between" align="center">
                                                <Text fontWeight="bold" color="purple.700">{goal.name}</Text>
                                                <Tooltip label="Delete Goal">
                                                    <IconButton 
                                                        icon={<Trash2 size={16} />} 
                                                        aria-label="Delete Goal" 
                                                        size="sm" 
                                                        variant="ghost" 
                                                        colorScheme="red"
                                                        onClick={() => deleteGoal(goal.id)}
                                                    />
                                                </Tooltip>
                                            </Flex>
                                            <Text fontSize="sm" color="gray.600">
                                                Target: ${parseFloat(goal.target_amount).toFixed(2)} | Date: **{targetDate}**
                                            </Text>
                                            <Text fontSize="xs" color="gray.600">
                                                Remaining: ${remaining.toFixed(2)}
                                            </Text>
                                            <Progress 
                                                value={Math.min(percentage, 100)} 
                                                colorScheme="purple" 
                                                size="sm" 
                                                mt={2} 
                                                borderRadius="full" 
                                            />
                                            
                                            {/* Saving/Withdrawal Interface */}
                                            <Flex mt={3} gap={2}>
                                                <Input 
                                                    placeholder="Add/Withdraw amount (use negative for withdrawal)" 
                                                    type="number" 
                                                    size="sm"
                                                    value={goalAmount[goal.id] || ''}
                                                    onChange={(e) => setGoalAmount(prev => ({ 
                                                        ...prev, 
                                                        [goal.id]: parseFloat(e.target.value) || 0 
                                                    }))}
                                                />
                                                <Button 
                                                    size="sm" 
                                                    colorScheme="purple"
                                                    onClick={() => handleGoalUpdate(goal.id, goal.current_amount, goalAmount[goal.id] || 0)}
                                                    isDisabled={!goalAmount[goal.id]}
                                                >
                                                    Update
                                                </Button>
                                            </Flex>
                                        </MotionBox>
                                    );
                                })}
                            </AnimatePresence>
                        </VStack>
                    </TabPanel>
                    
                    {/* Goal Creation Tab */}
                    <TabPanel pt={4}>
                        <GoalForm />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </MotionBox>
    </SimpleGrid>
  );
}
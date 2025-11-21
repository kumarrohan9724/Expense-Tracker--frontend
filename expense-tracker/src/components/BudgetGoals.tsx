// src/components/BudgetGoals.tsx
'use client'
import { 
  Box, Text, Progress, SimpleGrid, VStack, Heading, 
  Flex, Input, Button 
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { updateGoal } from '@/app/actions';

const MotionBox = motion(Box);

export default function BudgetGoals({ budgets, goals, transactions }: { budgets: any[], goals: any[], transactions: any[] }) {
  
  // Calculate spent amount for the current month
  const monthlyExpenses = transactions
    .filter(t => t.type === 'expense')
    .filter(t => {
      const date = new Date(t.created_at);
      const today = new Date();
      return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    });

  const getSpent = (category: string) => {
    return monthlyExpenses
      .filter(t => t.category === category)
      .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
  };

  const [currentAmount, setCurrentAmount] = useState(0);

  return (
    <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} mb={8}>
        {/* BUDGET TRACKING */}
        <MotionBox 
            bg="white" 
            p={6} 
            borderRadius="xl" 
            boxShadow="lg"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
        >
            <Heading size="md" mb={4}>Monthly Budget Overview 🎯</Heading>
            <VStack spacing={4} align="stretch">
                {budgets.map((budget) => {
                    const spent = getSpent(budget.category);
                    const percentage = (spent / budget.monthly_limit) * 100;
                    const statusColor = percentage > 90 ? 'red' : percentage > 50 ? 'orange' : 'green';
                    
                    return (
                        <Box key={budget.id}>
                            <Flex justify="space-between" mb={1}>
                                <Text fontWeight="semibold">{budget.category}</Text>
                                <Text fontSize="sm" color={statusColor}>
                                    ${spent.toFixed(2)} / ${parseFloat(budget.monthly_limit).toFixed(2)}
                                </Text>
                            </Flex>
                            <Progress 
                                value={Math.min(percentage, 100)} 
                                colorScheme={statusColor} 
                                size="sm" 
                                borderRadius="full" 
                            />
                            {percentage > 100 && (
                                <Text fontSize="xs" color="red.500" mt={1}>
                                    ⚠️ Over budget by ${(spent - parseFloat(budget.monthly_limit)).toFixed(2)}
                                </Text>
                            )}
                        </Box>
                    );
                })}
            </VStack>
        </MotionBox>

        {/* FINANCIAL GOALS */}
        <MotionBox 
            bg="white" 
            p={6} 
            borderRadius="xl" 
            boxShadow="lg"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
        >
            <Heading size="md" mb={4}>Financial Goals 💰</Heading>
            <VStack spacing={4} align="stretch">
                {goals.map((goal) => {
                    const percentage = (goal.current_amount / goal.target_amount) * 100;
                    const remaining = goal.target_amount - goal.current_amount;
                    
                    return (
                        <Box key={goal.id} p={3} bg="gray.50" borderRadius="md">
                            <Text fontWeight="bold">{goal.name}</Text>
                            <Text fontSize="sm" color="gray.600">
                                Target: ${parseFloat(goal.target_amount).toFixed(2)} 
                                (Remaining: ${remaining.toFixed(2)})
                            </Text>
                            <Progress 
                                value={Math.min(percentage, 100)} 
                                colorScheme="brand" 
                                size="sm" 
                                mt={2} 
                                borderRadius="full" 
                            />
                            
                            {/* Simple Add/Update Goal Savings */}
                            <Flex mt={3}>
                                <Input 
                                    placeholder="Add amount to goal" 
                                    type="number" 
                                    size="sm"
                                    onChange={(e) => setCurrentAmount(parseFloat(e.target.value) || 0)}
                                />
                                <Button 
                                    size="sm" 
                                    ml={2} 
                                    colorScheme="brand"
                                    onClick={() => updateGoal(goal.id, goal.current_amount + currentAmount)}
                                >
                                    Save
                                </Button>
                            </Flex>
                        </Box>
                    );
                })}
            </VStack>
        </MotionBox>
    </SimpleGrid>
  );
}
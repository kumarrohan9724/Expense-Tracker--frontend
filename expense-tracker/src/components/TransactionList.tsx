// src/components/TransactionList.tsx
'use client'
import { Box, Text, Flex, IconButton, Badge, VStack, useToast } from '@chakra-ui/react';
import { Trash2 } from 'lucide-react';
import { deleteTransaction } from '@/app/actions';
import { motion, AnimatePresence } from 'framer-motion';

const MotionFlex = motion(Flex);

export default function TransactionList({ transactions }: { transactions: any[] }) {
  const toast = useToast();
  
  const handleDelete = async (id: number) => {
    await deleteTransaction(id);
    toast({
        title: "Transaction Deleted.",
        status: "success",
        duration: 2000,
        isClosable: true,
    });
  }

  return (
    <Box bg="white" p={6} borderRadius="xl" boxShadow="sm" flex="1">
      <VStack spacing={3} align="stretch">
        <AnimatePresence initial={false}>
          {transactions.map((transaction) => {
            const isExpense = transaction.type === 'expense';
            const color = isExpense ? 'expense.500' : 'income.500';
            const badgeColor = isExpense ? 'red' : 'green';

            return (
              <MotionFlex
                key={transaction.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                layout
                p={4}
                bg="white"
                borderWidth="1px"
                borderColor="gray.200"
                borderRadius="lg"
                justify="space-between"
                align="center"
                _hover={{ bg: isExpense ? 'red.50' : 'green.50' }}
              >
                <Box>
                  <Text fontWeight="semibold">{transaction.title}</Text>
                  <Badge colorScheme={badgeColor} fontSize="xs" mt={1} mr={2}>{transaction.category}</Badge>
                  <Badge colorScheme="gray" fontSize="xs">{isExpense ? 'OUT' : 'IN'}</Badge>
                  <Text fontSize="xs" color="gray.500" mt={1}>
                      {new Date(transaction.created_at).toLocaleDateString()}
                  </Text>
                </Box>
                
                <Flex align="center" gap={4}>
                  <Text fontWeight="bold" color={color} fontSize="lg">
                    {isExpense ? '-' : '+'}${parseFloat(transaction.amount).toFixed(2)}
                  </Text>
                  <IconButton
                    aria-label="Delete"
                    icon={<Trash2 size={18} />}
                    size="sm"
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => handleDelete(transaction.id)}
                  />
                </Flex>
              </MotionFlex>
            );
          })}
        </AnimatePresence>
        {transactions.length === 0 && (
          <Text textAlign="center" color="gray.400" py={8}>No transactions yet. Add your first income or expense!</Text>
        )}
      </VStack>
    </Box>
  );
}
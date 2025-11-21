// src/components/TransactionForm.tsx
'use client'
import { 
  Button, Modal, ModalOverlay, ModalContent, ModalHeader, 
  ModalBody, ModalCloseButton, FormControl, FormLabel, 
  Input, Select, useDisclosure, VStack, RadioGroup, Stack, Radio 
} from '@chakra-ui/react';
import { addTransaction } from '@/app/actions';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function TransactionForm() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [type, setType] = useState('expense');

  return (
    <>
      <Button 
        leftIcon={<Plus size={20}/>} 
        colorScheme={type === 'income' ? 'income' : 'brand'} 
        onClick={onOpen}
        size="lg"
        boxShadow="lg"
      >
        Add Transaction
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay backdropFilter="blur(5px)" />
        <ModalContent borderRadius="xl">
          <ModalHeader>Add New {type === 'expense' ? 'Expense' : 'Income'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form action={async (formData) => {
              await addTransaction(formData);
              onClose();
            }}>
              <VStack spacing={4}>
                
                <FormControl isRequired>
                    <FormLabel>Type</FormLabel>
                    <RadioGroup onChange={setType} value={type} name="type">
                        <Stack direction="row" spacing={6}>
                            <Radio value="expense" colorScheme="red">Expense</Radio>
                            <Radio value="income" colorScheme="green">Income</Radio>
                        </Stack>
                    </RadioGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Title</FormLabel>
                  <Input name="title" placeholder="e.g. Salary / Grocery Shopping" />
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>Amount ($)</FormLabel>
                  <Input name="amount" type="number" step="0.01" placeholder="0.00" />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Category</FormLabel>
                  <Select name="category">
                    {/* Add more categories based on type if needed */}
                    <option value="Salary">Salary (Income)</option>
                    <option value="Investment">Investment (Income)</option>
                    <option value="Food">Food (Expense)</option>
                    <option value="Transport">Transport (Expense)</option>
                    <option value="Bills">Bills (Expense)</option>
                    <option value="Shopping">Shopping (Expense)</option>
                  </Select>
                </FormControl>

                <Button type="submit" colorScheme={type === 'income' ? 'income' : 'brand'} width="full" mt={2}>
                  Save Transaction
                </Button>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
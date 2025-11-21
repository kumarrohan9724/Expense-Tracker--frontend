// src/components/Providers.tsx
'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { motion } from 'framer-motion';

// --- NEW THEME DEFINITION ---
const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'gray.100', // Lighter background
        color: 'gray.800',
      },
    },
  },
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
  colors: {
    brand: {
      50: '#E6E6FF',
      500: '#6C63FF', // Primary Purple
      600: '#5A54D8',
    },
    income: {
        500: '#38A169', // Green
    },
    expense: {
        500: '#E53E3E', // Red
    }
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: 'lg',
      },
    },
    Box: {
        baseStyle: {
            transition: 'box-shadow 0.3s ease-in-out',
            _hover: {
                boxShadow: 'md',
            }
        }
    }
  }
})
// --- END NEW THEME DEFINITION ---

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        {children}
      </ChakraProvider>
    </CacheProvider>
  )
}
// You'll need to install a Google Font like 'Inter' if you use it in the theme.
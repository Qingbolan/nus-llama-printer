import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SSHConfig, PrintJob, Printer } from '@/types/printer'

interface PrinterState {
  // SSH Configuration
  sshConfig: SSHConfig | null
  setSshConfig: (config: SSHConfig | null) => void

  // Print Jobs
  printJobs: PrintJob[]
  setPrintJobs: (jobs: PrintJob[]) => void
  addPrintJob: (job: PrintJob) => void
  updatePrintJob: (jobId: string, updates: Partial<PrintJob>) => void
  removePrintJob: (jobId: string) => void

  // Printers
  printers: Printer[]
  setPrinters: (printers: Printer[]) => void
  selectedPrinter: Printer | null
  setSelectedPrinter: (printer: Printer | null) => void

  // Current upload/print state
  currentFile: File | null
  currentFilePath: string | null
  setCurrentFile: (file: File | null, path: string | null) => void

  // UI State
  isConnected: boolean
  setIsConnected: (connected: boolean) => void
}

export const usePrinterStore = create<PrinterState>()(
  persist(
    (set) => ({
      // SSH Configuration
      sshConfig: null,
      setSshConfig: (config) => set({ sshConfig: config }),

      // Print Jobs
      printJobs: [],
      setPrintJobs: (jobs) => set({ printJobs: jobs }),
      addPrintJob: (job) =>
        set((state) => ({ printJobs: [job, ...state.printJobs] })),
      updatePrintJob: (jobId, updates) =>
        set((state) => ({
          printJobs: state.printJobs.map((job) =>
            job.id === jobId ? { ...job, ...updates } : job
          ),
        })),
      removePrintJob: (jobId) =>
        set((state) => ({
          printJobs: state.printJobs.filter((job) => job.id !== jobId),
        })),

      // Printers
      printers: [],
      setPrinters: (printers) => set({ printers }),
      selectedPrinter: null,
      setSelectedPrinter: (printer) => set({ selectedPrinter: printer }),

      // Current upload/print state
      currentFile: null,
      currentFilePath: null,
      setCurrentFile: (file, path) =>
        set({ currentFile: file, currentFilePath: path }),

      // UI State
      isConnected: false,
      setIsConnected: (connected) => set({ isConnected: connected }),
    }),
    {
      name: 'printer-storage',
      partialize: (state) => ({
        sshConfig: state.sshConfig,
        selectedPrinter: state.selectedPrinter,
      }),
    }
  )
)

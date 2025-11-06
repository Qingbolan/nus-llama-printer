import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { SectionHeader, Section, PageContainer } from '@/components/ui/section-header'
import { SimpleCard, SimpleCardContent } from '@/components/ui/simple-card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Info,
  Server,
  FileText,
  Printer,
  CheckCircle,
  XCircle,
  HelpCircle,
  Mail,
  BookOpen,
} from 'lucide-react'

export default function HelpPage() {
  return (
    <PageContainer maxWidth="lg">
      <SectionHeader
        title="Help & Documentation"
        description="Complete guide for printing from NUS SoC servers"
        icon={HelpCircle}
      />

      <Section>
        {/* Overview */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Overview
          </h3>
          <p className="text-muted-foreground">
            Print@SoC is a desktop application that simplifies printing documents
            from NUS School of Computing's Linux servers. It provides a user-friendly
            interface for submitting print jobs without using command-line tools.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="p-4 bg-accent/50 rounded-lg border border-border/50">
              <div className="font-semibold mb-2">For Students</div>
              <div className="text-sm text-muted-foreground">
                Connect to <Badge variant="secondary">stu.comp.nus.edu.sg</Badge>
              </div>
            </div>
            <div className="p-4 bg-accent/50 rounded-lg border border-border/50">
              <div className="font-semibold mb-2">For Staff</div>
              <div className="text-sm text-muted-foreground">
                Connect to <Badge variant="secondary">stf.comp.nus.edu.sg</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Requirements Checklist */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            Before You Print
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <strong>SSH Connection Required:</strong> You must be connected to stu or stf server
              </div>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Supported File Types:</strong> Only PDF, PostScript, and ASCII files
              </div>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Print Quota:</strong> Ensure you have sufficient print quota
              </div>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <strong>File Transfer:</strong> Upload your file to the server first
              </div>
            </li>
          </ul>
        </div>

        {/* Main Content Accordion */}
        <Accordion type="single" collapsible className="w-full space-y-2">
          <AccordionItem value="how-to-print" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-primary" />
                <span className="font-semibold">How to Print</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div>
                <h4 className="font-semibold mb-3">1. Connect to Server</h4>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-4">
                  <li>Go to the Login page</li>
                  <li>Enter your NUSNET ID and password</li>
                  <li>Or use SSH key authentication</li>
                  <li>Click "Connect" to establish SSH connection</li>
                </ul>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">2. Upload PDF File</h4>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-4">
                  <li>Navigate to "New Print Job"</li>
                  <li>Click to select your PDF file</li>
                  <li>The app will automatically upload it to the server</li>
                </ul>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">3. Configure Print Settings</h4>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-4">
                  <li><strong>Copies:</strong> Number of copies to print</li>
                  <li><strong>Duplex Mode:</strong> Single-sided or double-sided printing</li>
                  <li><strong>Pages per Sheet:</strong> 1, 2, 4, 6, or 9 pages per sheet</li>
                  <li><strong>Booklet Mode:</strong> Arrange pages for booklet printing</li>
                </ul>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">4. Select Printer</h4>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-4">
                  <li>Choose from available printers</li>
                  <li>View printer location and status</li>
                  <li>Queues with "-sx" suffix are single-sided only</li>
                </ul>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">5. Submit Job</h4>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-4">
                  <li>Click "Submit Print Job"</li>
                  <li>Monitor job status in "Jobs History"</li>
                  <li>Cancel if needed before printing starts</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="multi-page" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <span className="font-semibold">Multi-Page Layout (pdfjam)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <p className="text-sm text-muted-foreground">
                Use the "Pages per Sheet" setting to automatically create multi-page layouts:
              </p>

              <div className="space-y-3">
                <div className="p-3 bg-accent/50 rounded-lg border border-border/50">
                  <div className="font-semibold mb-1">2 pages side by side</div>
                  <code className="text-sm text-muted-foreground">
                    pdfjam --nup 2x1 input.pdf -o output.pdf
                  </code>
                </div>

                <div className="p-3 bg-accent/50 rounded-lg border border-border/50">
                  <div className="font-semibold mb-1">4 pages on one sheet</div>
                  <code className="text-sm text-muted-foreground">
                    pdfjam --nup 2x2 input.pdf -o output.pdf
                  </code>
                </div>

                <div className="p-3 bg-accent/50 rounded-lg border border-border/50">
                  <div className="font-semibold mb-1">Custom layout</div>
                  <code className="text-sm text-muted-foreground">
                    pdfjam --nup [columns]x[rows] input.pdf -o output.pdf
                  </code>
                </div>
              </div>

              <Alert>
                <Info className="w-4 h-4" />
                <AlertTitle>Tip</AlertTitle>
                <AlertDescription>
                  The app handles this automatically based on your "Pages per Sheet" setting
                </AlertDescription>
              </Alert>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="commands" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-primary" />
                <span className="font-semibold">Useful Print Commands</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <p className="text-sm text-muted-foreground mb-4">
                For reference - these commands run automatically
              </p>
              <div>
                <div className="font-semibold mb-2">Submit print job:</div>
                <code className="block p-3 bg-muted rounded text-sm">
                  lpr -P [queue-name] filename.pdf
                </code>
              </div>

              <div>
                <div className="font-semibold mb-2">Check print job status:</div>
                <code className="block p-3 bg-muted rounded text-sm">
                  lpq -P [queue-name]
                </code>
              </div>

              <div>
                <div className="font-semibold mb-2">Cancel a print job:</div>
                <code className="block p-3 bg-muted rounded text-sm">
                  lprm -P [queue-name] [job-number]
                </code>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="notes" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="font-semibold">Important Notes</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <Alert variant="destructive">
                <AlertTitle>Print jobs will be rejected if:</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>The file is detected as unprintable</li>
                    <li>PostScript files don't have the proper magic code (%!)</li>
                    <li>You have insufficient print quota</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="p-4 bg-accent/50 rounded-lg border border-border/50">
                <h4 className="font-semibold mb-2">Paper Management</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Staff can load paper when printers run out</li>
                  <li>• Paper reams are stored in the printer room</li>
                  <li>• If supplies are empty, notify the General Office</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Contact Section */}
        <div className="space-y-4 pt-4 border-t border-border/50">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            Need Help?
          </h3>
          <p className="text-muted-foreground">If you have questions about rejected print jobs, contact:</p>
          <a
            href="mailto:techsvc@comp.nus.edu.sg"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <Mail className="w-4 h-4" />
            techsvc@comp.nus.edu.sg
          </a>

          <div className="pt-4">
            <h4 className="font-semibold mb-3">Additional Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://dochub.comp.nus.edu.sg/cf/guides/unix/soc_unix_env"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  SoC Unix Environment Guide
                </a>
              </li>
              <li>
                <a
                  href="https://dochub.comp.nus.edu.sg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Print Quota Policy
                </a>
              </li>
              <li>
                <a
                  href="https://dochub.comp.nus.edu.sg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Printers and Print Queues Documentation
                </a>
              </li>
            </ul>
          </div>
        </div>
      </Section>
    </PageContainer>
  )
}

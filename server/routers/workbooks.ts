import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { readFile } from "fs/promises";
import { join } from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export const workbooksRouter = router({
  /**
   * Download workbook as PDF
   */
  downloadWorkbook: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      try {
        const mdPath = join(process.cwd(), 'client', 'public', 'workbooks', `${input.slug}-workbook.md`);
        const pdfPath = join(process.cwd(), 'temp', `${input.slug}-workbook.pdf`);
        
        // Convert Markdown to PDF using manus-md-to-pdf utility
        await execAsync(`manus-md-to-pdf "${mdPath}" "${pdfPath}"`);
        
        // Read the PDF file
        const pdfBuffer = await readFile(pdfPath);
        
        // Return as base64 for download
        return {
          filename: `${input.slug}-workbook.pdf`,
          content: pdfBuffer.toString('base64'),
          contentType: 'application/pdf'
        };
      } catch (error) {
        console.error('Error generating workbook PDF:', error);
        throw new Error('Failed to generate workbook PDF');
      }
    }),
});

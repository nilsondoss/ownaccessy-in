import type { Request, Response } from 'express';
import archiver from 'archiver';
import { verifyToken } from '../../../lib/auth.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function handler(req: Request, res: Response) {
  try {
    // Verify admin authentication
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Get project root directory (4 levels up from this file)
    const projectRoot = path.resolve(__dirname, '../../../../../');

    // Set response headers for ZIP download
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `ownaccessy-project-${timestamp}.zip`;
    
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Create archiver instance
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });

    // Handle archiver errors
    archive.on('error', (err) => {
      console.error('Archive error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to create archive' });
      }
    });

    // Pipe archive to response
    archive.pipe(res);

    // Define exclusion patterns
    const excludePatterns = [
      'node_modules/**',
      'dist/**',
      'build/**',
      '.next/**',
      '.cache/**',
      'coverage/**',
      '.git/**',
      '.env',
      '.env.local',
      '.env.production',
      '.env.development',
      '*.log',
      'npm-debug.log*',
      'yarn-debug.log*',
      'yarn-error.log*',
      '.DS_Store',
      'Thumbs.db',
      '*.swp',
      '*.swo',
      '*~',
      '.vscode/**',
      '.idea/**',
      '*.zip',
      'tmp/**',
      'temp/**',
    ];

    // Helper function to check if path should be excluded
    const shouldExclude = (filePath: string): boolean => {
      const relativePath = path.relative(projectRoot, filePath);
      return excludePatterns.some(pattern => {
        const regex = new RegExp(
          '^' + pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*') + '$'
        );
        return regex.test(relativePath);
      });
    };

    // Recursively add files to archive
    const addDirectory = (dirPath: string, zipPath: string = '') => {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        const zipEntryPath = zipPath ? path.join(zipPath, entry.name) : entry.name;

        // Skip excluded paths
        if (shouldExclude(fullPath)) {
          continue;
        }

        if (entry.isDirectory()) {
          addDirectory(fullPath, zipEntryPath);
        } else if (entry.isFile()) {
          archive.file(fullPath, { name: zipEntryPath });
        }
      }
    };

    // Add all project files
    addDirectory(projectRoot);

    // Finalize the archive
    await archive.finalize();

  } catch (error) {
    console.error('Download project error:', error);
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Failed to download project',
        message: error instanceof Error ? error.message : String(error)
      });
    }
  }
}

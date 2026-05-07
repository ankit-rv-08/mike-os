// fileService.js - Secure file operations for MIKE OS
const fs = require('fs').promises;
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '..', '..');

// Safe path resolution
function safePath(fileName) {
  const normalized = path.normalize(fileName);
  const fullPath = path.join(PROJECT_ROOT, normalized);
  
  // Security: Ensure we stay within project
  if (!fullPath.startsWith(PROJECT_ROOT)) {
    throw new Error('Access denied: Cannot access files outside project');
  }
  
  return fullPath;
}

async function readProjectFile(fileName) {
  try {
    const filePath = safePath(fileName);
    const stats = await fs.stat(filePath);
    
    if (stats.isDirectory()) {
      throw new Error(`${fileName} is a directory, not a file`);
    }
    
    const contents = await fs.readFile(filePath, 'utf8');
    
    // Return metadata too
    return {
      name: path.basename(filePath),
      path: path.relative(PROJECT_ROOT, filePath),
      size: stats.size,
      modified: stats.mtime,
      contents: contents,
      lines: contents.split('\n').length
    };
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`File "${fileName}" not found`);
    }
    throw error;
  }
}

async function listProjectFiles(directory = '') {
  try {
    const dirPath = safePath(directory || '.');
    const files = await fs.readdir(dirPath, { withFileTypes: true });
    
    const fileList = await Promise.all(
      files
        .filter(f => !f.name.startsWith('.') && f.name !== 'node_modules')
        .map(async (f) => {
          const fullPath = path.join(dirPath, f.name);
          const stats = await fs.stat(fullPath);
          return {
            name: f.name,
            type: f.isDirectory() ? 'folder' : 'file',
            size: stats.size,
            modified: stats.mtime,
            path: path.relative(PROJECT_ROOT, fullPath)
          };
        })
    );
    
    // Sort: folders first, then alphabetical
    return fileList.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  } catch (error) {
    throw new Error(`Cannot read directory: ${error.message}`);
  }
}

async function writeProjectFile(fileName, content) {
  try {
    const filePath = safePath(fileName);
    
    // Create directory if it doesn't exist
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    
    await fs.writeFile(filePath, content, 'utf8');
    
    return {
      success: true,
      path: path.relative(PROJECT_ROOT, filePath),
      size: Buffer.byteLength(content, 'utf8')
    };
  } catch (error) {
    throw new Error(`Cannot write file: ${error.message}`);
  }
}

// New: Search within project files
async function searchInFiles(query, directory = '') {
  try {
    const dirPath = safePath(directory || '.');
    const results = [];
    
    const searchDir = async (dir) => {
      const files = await fs.readdir(dir, { withFileTypes: true });
      
      for (const file of files) {
        const fullPath = path.join(dir, file.name);
        
        if (file.name.startsWith('.') || file.name === 'node_modules') continue;
        
        if (file.isDirectory()) {
          await searchDir(fullPath);
        } else if (file.name.match(/\.(js|json|md|txt|html|css)$/)) {
          try {
            const content = await fs.readFile(fullPath, 'utf8');
            const lines = content.split('\n');
            
            lines.forEach((line, index) => {
              if (line.toLowerCase().includes(query.toLowerCase())) {
                results.push({
                  file: path.relative(PROJECT_ROOT, fullPath),
                  line: index + 1,
                  content: line.trim().substring(0, 200)
                });
              }
            });
          } catch {
            // Skip binary files
          }
        }
      }
    };
    
    await searchDir(dirPath);
    return results.slice(0, 20); // Limit results
  } catch (error) {
    throw new Error(`Search failed: ${error.message}`);
  }
}

module.exports = { 
  readProjectFile, 
  listProjectFiles, 
  writeProjectFile,
  searchInFiles 
};
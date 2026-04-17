import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { randomUUID } from 'crypto';
import { spawn } from 'child_process';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    
    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    const bytes = await audioFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const tempFileName = `${randomUUID()}.wav`;
    const tempFilePath = join(tmpdir(), tempFileName);
    
    await writeFile(tempFilePath, buffer);

    try {
      const analysisResult = await analyzeAudioWithPython(tempFilePath);
      
      await unlink(tempFilePath);
      
      return NextResponse.json(analysisResult);
    } catch (error) {
      await unlink(tempFilePath).catch(() => {});
      throw error;
    }
  } catch (error) {
    console.error('Audio analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze audio', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

async function analyzeAudioWithPython(audioFilePath: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const scriptPath = join(process.cwd(), 'scripts', 'analyze_audio_whisper.py');
    const venvPythonPath = join(process.cwd(), 'venv', 'Scripts', 'python.exe');
    const pythonCommand = existsSync(venvPythonPath) ? venvPythonPath : 'python';
    
    
    const pythonProcess = spawn(pythonCommand, [scriptPath, audioFilePath]);
    
    let outputData = '';
    let errorData = '';
    
    pythonProcess.stdout.on('data', (data) => {
      outputData += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      errorData += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
      
      if (code !== 0) {
        console.error('Python script error:', errorData);
        reject(new Error(`Python script failed with code ${code}: ${errorData}`));
        return;
      }
      
      try {
        const result = JSON.parse(outputData);
        resolve(result);
      } catch (error) {
        console.error('Failed to parse Python output:', outputData);
        reject(new Error('Failed to parse analysis results'));
      }
    });
    
    pythonProcess.on('error', (error) => {
      reject(new Error(`Failed to start Python process: ${error.message}`));
    });
  });
}

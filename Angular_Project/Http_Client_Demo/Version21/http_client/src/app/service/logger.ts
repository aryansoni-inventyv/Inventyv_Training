import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Logger{
  
  logRequest(url: string, method: string) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`🚀 [${timestamp}] ${method} Request to: ${url}`);
  }

  logResponse(url: string, status: number, duration: number) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`✅ [${timestamp}] Response from: ${url}`);
    console.log(`   Status: ${status} | Duration: ${duration}ms`);
  }

  logError(url: string, status: number, error: string) {
    const timestamp = new Date().toLocaleTimeString();
    console.error(`❌ [${timestamp}] Error from: ${url}`);
    console.error(`   Status: ${status} | Error: ${error}`);
  }

  logInfo(message: string) {
    console.log(`ℹ️ ${message}`);
  }
}
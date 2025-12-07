import { AnalysisResponse } from '../types';
import { MCP_SERVER_URL, MCP_API_KEY, USE_MOCK_API } from '../constants';

const mockAnalysis = (prompt: string): AnalysisResponse => {
  const isSuspicious = prompt.toLowerCase().includes('password') || prompt.toLowerCase().includes('ignore');
  
  return {
    timestamp: new Date().toISOString(),
    promptInjection: {
      detected: isSuspicious,
      confidence: isSuspicious ? 0.89 : 0.12,
      description: isSuspicious 
        ? "Potential jailbreak pattern detected in prompt structure." 
        : "No injection patterns detected."
    },
    harmfulIntent: {
      detected: isSuspicious,
      severity: isSuspicious ? 'high' : 'safe',
      description: isSuspicious 
        ? "Request attempts to bypass security controls." 
        : "Intent appears benign."
    },
    piiDetection: {
      found: isSuspicious,
      types: isSuspicious ? ['email', 'ssn'] : [],
      maskedPrompt: isSuspicious 
        ? prompt.replace(/password/gi, '[REDACTED]').replace(/ignore/gi, '[REDACTED]') 
        : prompt
    }
  };
};

// Helper for JSON-RPC calls to the MCP server
async function callMcp(method: string, params: any = {}) {
  try {
    const response = await fetch(MCP_SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MCP_API_KEY}`
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Math.floor(Math.random() * 1000000), // Random ID for the request
        method,
        params
      })
    });

    if (!response.ok) {
      throw new Error(`MCP Connection Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(`MCP JSON-RPC Error: ${data.error.message} (Code: ${data.error.code})`);
    }

    return data.result;
  } catch (error) {
    console.error(`Failed to call MCP method ${method}:`, error);
    throw error;
  }
}

export const analyzePrompt = async (prompt: string): Promise<AnalysisResponse> => {
  if (USE_MOCK_API) {
    // Simulate network latency for the UI experience
    await new Promise(resolve => setTimeout(resolve, 2000));
    return mockAnalysis(prompt);
  }

  try {
    // 1. Discover Available Tools
    // We first list tools to find the correct workflow tool name exposed by n8n
    const listToolsResult = await callMcp('tools/list');
    const tools = listToolsResult?.tools;

    if (!tools || tools.length === 0) {
      throw new Error("No tools available on the n8n MCP server.");
    }

    // 2. Find the specific 'Gurdrails' workflow
    // We check for exact match or case-insensitive match to be robust
    const targetToolName = "Gurdrails";
    const toolToCall = tools.find((t: any) => 
      t.name === targetToolName || 
      t.name.toLowerCase() === targetToolName.toLowerCase()
    );

    if (!toolToCall) {
      const availableNames = tools.map((t: any) => t.name).join(', ');
      console.error(`Tool '${targetToolName}' not found. Available tools:`, availableNames);
      throw new Error(`The required workflow '${targetToolName}' was not found on the server. Available workflows: ${availableNames}`);
    }

    console.log(`Connecting to MCP Tool: ${toolToCall.name}`);

    // 3. Execute the Tool
    const callResult = await callMcp('tools/call', {
      name: toolToCall.name,
      arguments: {
        prompt: prompt
      }
    });

    // 4. Process the Result
    // MCP tool execution results are typically in the 'content' array
    const content = callResult?.content;
    
    if (!content || !Array.isArray(content) || content.length === 0) {
      throw new Error("Received empty content from MCP tool execution.");
    }

    // Extract text content
    const textContent = content.find((c: any) => c.type === 'text')?.text;
    
    if (!textContent) {
      throw new Error("No text output found in MCP response.");
    }

    // Parse the JSON response from the text content
    let parsedData;
    try {
      // Clean up any potential markdown code blocks if the LLM wrapped it
      const cleanJson = textContent.replace(/```json\n?|\n?```/g, '').trim();
      parsedData = JSON.parse(cleanJson);
    } catch (e) {
      console.warn("Failed to parse JSON directly from tool output:", textContent);
      throw new Error("The MCP tool did not return valid JSON data.");
    }

    // Ensure we match our internal type structure
    return {
      promptInjection: parsedData.promptInjection || { detected: false, confidence: 0, description: "Unknown" },
      harmfulIntent: parsedData.harmfulIntent || { detected: false, severity: "safe", description: "Unknown" },
      piiDetection: parsedData.piiDetection || { found: false, types: [], maskedPrompt: prompt },
      timestamp: parsedData.timestamp || new Date().toISOString()
    };

  } catch (error: any) {
    console.error("MCP Analysis failed", error);
    // Provide a user-friendly error message that bubbles up to the UI
    throw new Error(error.message || "Failed to connect to security analysis server.");
  }
};

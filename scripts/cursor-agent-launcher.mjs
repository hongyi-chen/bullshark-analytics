#!/usr/bin/env node

/**
 * Cursor Cloud Agent Launcher
 * 
 * Launches a Cursor Cloud Agent to perform weekly accessibility and code quality reviews.
 * Designed to run on a schedule (e.g., via GitHub Actions cron).
 */

import { Buffer } from 'node:buffer';

const CURSOR_API_BASE = 'https://api.cursor.com/v0';
const REPOSITORY_URL = 'https://github.com/hongyi-chen/bullshark-analytics';

/**
 * Get the current date in YYYY-MM-DD format
 */
function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Create the comprehensive review prompt for the agent
 */
function createReviewPrompt() {
  return `Please perform a comprehensive weekly code review focusing on the following areas:

**1. Accessibility (WCAG 2.1 AA Compliance)**
- Semantic HTML usage (proper heading hierarchy, landmarks, lists)
- ARIA attributes (labels, roles, live regions, descriptions)
- Keyboard navigation support (focus management, tab order, keyboard shortcuts)
- Color contrast ratios (text/background, interactive elements)
- Form accessibility (labels, error messages, required fields)
- Image alt text and decorative image handling
- Screen reader compatibility

**2. TypeScript & React Best Practices**
- Type safety and proper type annotations
- Proper React hooks usage and dependencies
- Component composition and reusability
- Props validation and interface definitions
- Avoiding any/unknown types where possible
- Proper error handling

**3. Performance Optimizations**
- Unnecessary re-renders
- Large bundle sizes or unused dependencies
- Image optimization opportunities
- Code splitting opportunities
- Memoization opportunities (useMemo, useCallback)

**4. Code Quality**
- Code duplication and refactoring opportunities
- Consistent naming conventions
- Dead code removal
- Complex functions that could be simplified
- Missing error boundaries
- Console.log statements or debug code

Please create a PR with improvements for the most impactful issues you find. Prioritize accessibility fixes and critical performance/quality issues.`;
}

/**
 * Make a request to the Cursor API
 */
async function cursorApiRequest(endpoint, options = {}) {
  const apiKey = process.env.CURSOR_API_KEY;
  
  if (!apiKey) {
    throw new Error('CURSOR_API_KEY environment variable is required');
  }

  const url = `${CURSOR_API_BASE}${endpoint}`;
  const authHeader = `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Cursor API request failed (${response.status}): ${errorText}`);
  }

  return response.json();
}

/**
 * Launch a new Cursor Cloud Agent
 */
async function launchAgent() {
  const branchName = `cursor/weekly-review-${getCurrentDate()}`;
  
  console.log('🚀 Launching Cursor Cloud Agent...');
  console.log(`📦 Repository: ${REPOSITORY_URL}`);
  console.log(`🌿 Branch: ${branchName}`);
  
  const payload = {
    prompt: {
      text: createReviewPrompt(),
    },
    source: {
      repository: REPOSITORY_URL,
      ref: 'main',
    },
    target: {
      branchName: branchName,
      autoCreatePr: true,
      openAsCursorGithubApp: false,
      skipReviewerRequest: false,
    },
    // Let Cursor auto-select the best model
    // model is optional - omitting it uses auto-selection
  };

  try {
    const result = await cursorApiRequest('/agents', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    console.log('✅ Agent launched successfully!');
    console.log(`📋 Agent ID: ${result.id}`);
    console.log(`📊 Status: ${result.status}`);
    console.log(`🔗 Agent URL: ${result.target.url}`);
    
    if (result.target.prUrl) {
      console.log(`🔀 PR URL: ${result.target.prUrl}`);
    }

    return result;
  } catch (error) {
    console.error('❌ Failed to launch agent:', error.message);
    throw error;
  }
}

/**
 * Get agent status (optional - for monitoring)
 */
async function getAgentStatus(agentId) {
  try {
    const result = await cursorApiRequest(`/agents/${agentId}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to get agent status: ${error.message}`);
    throw error;
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    // Verify API key is set
    if (!process.env.CURSOR_API_KEY) {
      console.error('❌ Error: CURSOR_API_KEY environment variable is not set');
      console.error('');
      console.error('To obtain a Cursor API key:');
      console.error('1. Visit https://cursor.com/settings');
      console.error('2. Navigate to the API section');
      console.error('3. Generate a new API key');
      console.error('4. Add it to your GitHub repository secrets as CURSOR_API_KEY');
      process.exit(1);
    }

    // Launch the agent
    const agent = await launchAgent();
    
    console.log('');
    console.log('🎯 Next steps:');
    console.log('- The agent is now analyzing your codebase');
    console.log('- A PR will be created automatically when the review is complete');
    console.log(`- Monitor progress at: ${agent.target.url}`);
    
    // Optional: Poll for status updates
    if (process.env.WAIT_FOR_COMPLETION === 'true') {
      console.log('');
      console.log('⏳ Waiting for agent to complete...');
      
      let status = agent.status;
      while (status !== 'FINISHED' && status !== 'FAILED' && status !== 'STOPPED') {
        await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30 seconds
        const updated = await getAgentStatus(agent.id);
        status = updated.status;
        console.log(`📊 Status: ${status}`);
      }
      
      console.log('');
      console.log(`🏁 Agent completed with status: ${status}`);
    }
    
  } catch (error) {
    console.error('');
    console.error('💥 Fatal error:', error.message);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

import express, { Request, Response } from "express";
import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import path from "node:path";
import fs from "node:fs";

const getServer = () => {
  // Create an MCP server
  const server = new McpServer({
    name: "personal-mcp-server",
    version: "1.0.0",
  });

  // Add a "hello world" resource
  server.registerResource(
    "greeting",
    new ResourceTemplate("greeting://{name}", { list: undefined }),
    {
      title: "Greeting Resource",
      description: "Dynamic greeting generator",
    },
    async (uri, { name }) => ({
      contents: [
        {
          uri: uri.href,
          text: `Hello, ${name}! This is your personal MCP server.`,
        },
      ],
    })
  );

  // Add a resource for core principles
  server.registerResource(
    "core-principles",
    "principles://core",
    {
      title: "Core Principles",
      description: "The core principles for development.",
      mimeType: "text/markdown",
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          text: `## Core Principles\n\n- **Consistency First**: All code should follow established patterns and standards\n- **Object-Oriented Preference**: Favor OOP design patterns unless functional programming is more appropriate for the specific use case\n- **Self-Documenting Code**: Write code that explains itself through clear naming and structure\n- **Containerized Development**: All projects should be Docker-ready from the start\n- **Maintainability**: Code should be easy to read, modify, and extend`,
        },
      ],
    })
  );

  // Add a dynamic resource for language-specific coding standards
  server.registerResource(
    "language-standards",
    new ResourceTemplate("standards://language/{languageName}", {
      list: undefined,
    }),
    {
      title: "Language-Specific Coding Standards",
      description: "Provides coding standards for a specific language.",
    },
    async (uri, { languageName }) => {
      if (Array.isArray(languageName)) {
        languageName = languageName[0];
      }

      const lowerLang = (languageName as string).toLowerCase();
      const filePath = path.join(process.cwd(), "standards", `${lowerLang}.md`);

      let standardsText: string;
      let mimeType = "text/markdown";

      try {
        standardsText = await fs.promises.readFile(filePath, "utf-8");
      } catch (error) {
        standardsText = `No specific coding standards found for '${languageName}'.`;
        mimeType = "text/plain";
      }

      return {
        contents: [
          {
            uri: uri.href,
            text: standardsText,
            mimeType: mimeType,
          },
        ],
      };
    }
  );

  // Add a resource for the CLAUDE.md rules
  server.registerResource(
    "claude-rules",
    "rules://claude.md",
    {
      title: "Claude AI Rules",
      description: "The global rules for the AI assistant.",
      mimeType: "text/markdown",
    },
    async (uri) => {
      const filePath = path.join(process.cwd(), 'context-template', 'CLAUDE.md');
      const fileContent = await fs.promises.readFile(filePath, "utf-8");
      return {
        contents: [
          {
            uri: uri.href,
            text: fileContent,
          },
        ],
      };
    }
  );

  // Add a resource for the base PRP template
  server.registerResource(
    "prp-base-template",
    "templates://prp_base.md",
    {
      title: "Base PRP Template",
      description: "The base template for generating new PRPs.",
      mimeType: "text/markdown",
    },
    async (uri) => {
      const filePath = path.join(process.cwd(), 'context-template', 'PRPs', 'templates', 'prp_base.md');
      const fileContent = await fs.promises.readFile(filePath, "utf-8");
      return {
        contents: [
          {
            uri: uri.href,
            text: fileContent,
          },
        ],
      };
    }
  );

  // Add a dynamic resource for listing and reading examples
  server.registerResource(
    "examples",
    new ResourceTemplate("examples://{exampleName}", { list: undefined }),
    {
      title: "Code Examples",
      description: "Provides code examples from the context-template/examples directory.",
    },
    async (uri, { exampleName }) => {
      const examplesDir = path.join(process.cwd(), 'context-template', 'examples');

      if (exampleName === 'list') {
        const files = await fs.promises.readdir(examplesDir);
        const fileList = files.map(file => `- ${file}`).join('\n');
        return {
          contents: [
            {
              uri: uri.href,
              text: `Available examples:\n${fileList}`,
              mimeType: "text/markdown",
            },
          ],
        };
      }

      const filePath = path.join(examplesDir, exampleName as string);
      try {
        const fileContent = await fs.promises.readFile(filePath, "utf-8");
        return {
          contents: [
            {
              uri: uri.href,
              text: fileContent,
              mimeType: "text/plain",
            },
          ],
        };
      } catch (error) {
        return {
          contents: [
            {
              uri: uri.href,
              text: `Example '${exampleName}' not found.`,
              mimeType: "text/plain",
            },
          ],
        };
      }
    }
  );

  // Add a prompt for generating a PRP
  server.registerPrompt(
    "generate-prp",
    {
      title: "Generate PRP",
      description: "Generates a Product Requirements Prompt (PRP) from an initial feature request.",
      argsSchema: { initialContent: z.string() },
    },
    async ({ initialContent }) => {
      const templatePath = path.join(process.cwd(), 'context-template', 'PRPs', 'templates', 'prp_base.md');
      const templateContent = await fs.promises.readFile(templatePath, 'utf-8');
      const prpContent = templateContent.replace("[What needs to be built - be specific about the end state and desires]", initialContent);

      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: prpContent,
            },
          },
        ],
      };
    }
  );

  // Add a prompt for executing a PRP
  server.registerPrompt(
    "execute-prp",
    {
      title: "Execute PRP",
      description: "Executes a Product Requirements Prompt (PRP) to implement a feature.",
      argsSchema: { prpContent: z.string() },
    },
    async ({ prpContent }) => {
      const executionInstructions = `\n# Execute BASE PRP\n\nImplement a feature using using the PRP file.\n\n## PRP File: \n\n${prpContent}\n\n## Execution Process\n\n1. **Load PRP**\n   - Read the specified PRP file\n   - Understand all context and requirements\n   - Follow all instructions in the PRP and extend the research if needed\n   - Ensure you have all needed context to implement the PRP fully\n   - Do more web searches and codebase exploration as needed\n\n2. **ULTRATHINK**\n   - Think hard before you execute the plan. Create a comprehensive plan addressing all requirements.\n   - Break down complex tasks into smaller, manageable steps using your todos tools.\n   - Use the TodoWrite tool to create and track your implementation plan.\n   - Identify implementation patterns from existing code to follow.\n\n3. **Execute the plan**\n   - Execute the PRP\n   - Implement all the code\n\n4. **Validate**\n   - Run each validation command\n   - Fix any failures\n   - Re-run until all pass\n\n5. **Complete**\n   - Ensure all checklist items done\n   - Run final validation suite\n   - Report completion status\n   - Read the PRP again to ensure you have implemented everything\n\n6. **Reference the PRP**\n   - You can always reference the PRP again if needed\n\nNote: If validation fails, use error patterns in PRP to fix and retry.\n      `;

      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: executionInstructions,
            },
          },
        ],
      };
    }
  );

  return server;
};

const app = express();
app.use(express.json());

app.post("/mcp", async (req: Request, res: Response) => {
  // In stateless mode, create a new instance of transport and server for each request
  // to ensure complete isolation.
  try {
    const server = getServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });
    res.on("close", () => {
      transport.close();
      server.close();
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error("Error handling MCP request:", error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: "Internal server error",
        },
        id: null,
      });
    }
  }
});

// SSE notifications and session termination are not supported in stateless mode
app.get("/mcp", async (req: Request, res: Response) => {
  res.writeHead(405).end(
    JSON.stringify({
      jsonrpc: "2.0",
      error: { code: -32000, message: "Method not allowed." },
      id: null,
    })
  );
});

app.delete("/mcp", async (req: Request, res: Response) => {
  res.writeHead(405).end(
    JSON.stringify({
      jsonrpc: "2.0",
      error: { code: -32000, message: "Method not allowed." },
      id: null,
    })
  );
});

const PORT = 7575;
app.listen(PORT, () => {
  console.log(`MCP Stateless Streamable HTTP Server listening on port ${PORT}`);
});

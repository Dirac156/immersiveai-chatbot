// Part 1: Chatbot Creation and UI
(function () {
  // Step 1: Dynamically load Tailwind CSS from CDN
  const tailwindCDN = document.createElement("link");
  tailwindCDN.rel = "stylesheet";
  tailwindCDN.href =
    "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"; // Load the Tailwind CSS CDN
  document.head.appendChild(tailwindCDN);

  // Step 2: Dynamically load Prism.js and its CSS for code highlighting
  const prismCDN = document.createElement("link");
  prismCDN.rel = "stylesheet";
  prismCDN.href =
    "https://cdnjs.cloudflare.com/ajax/libs/prism/1.27.0/themes/prism-tomorrow.min.css"; // Load Prism.js CSS
  document.head.appendChild(prismCDN);

  const prismScript = document.createElement("script");
  prismScript.src =
    "https://cdnjs.cloudflare.com/ajax/libs/prism/1.27.0/prism.min.js"; // Load Prism.js
  prismScript.onload = function () {
    console.log("Prism.js loaded for syntax highlighting.");
  };
  document.head.appendChild(prismScript);

  // Retrieve the script element
  const scriptTag = document.currentScript;

  // Fetch project_id and workflow_id from the script tag's data attributes
  const projectId = scriptTag.getAttribute("data-project-id");
  const workflowId = scriptTag.getAttribute("data-workflow-id");

  // Create chatbot button and container
  const chatbotBtn = document.createElement("button");
  chatbotBtn.innerText = "Chat with us!";
  chatbotBtn.classList.add(
    "bg-green-500",
    "text-white",
    "font-bold",
    "rounded-lg",
    "px-10",
    "py-2",
    "text-sm"
  );
  chatbotBtn.style.position = "fixed";
  chatbotBtn.style.bottom = "20px";
  chatbotBtn.style.right = "20px";
  chatbotBtn.style.cursor = "pointer";

  const chatbotWindow = document.createElement("div");
  chatbotWindow.style.position = "fixed";
  chatbotWindow.style.bottom = "70px";
  chatbotWindow.style.right = "20px";
  chatbotWindow.style.width = "340px";
  chatbotWindow.style.height = "500px";
  chatbotWindow.style.backgroundColor = "white";
  chatbotWindow.style.border = "1px solid #ccc";
  chatbotWindow.style.borderRadius = "5px";
  chatbotWindow.style.display = "none"; // Initially hidden
  chatbotWindow.style.overflow = "auto";

  const chatbotHeader = document.createElement("div");
  chatbotHeader.classList.add(
    "bg-green-500",
    "text-white",
    "text-start",
    "py-4",
    "px-4",
    "text-base",
    "font-bold",
    "flex",
    "justify-between"
  );

  const chatbotHeaderText = document.createElement("p");
  chatbotHeaderText.innerText = "Chatbot";

  const chatbotCloseBtn = document.createElement("button");
  chatbotCloseBtn.classList.add("text-white", "cursor-pointer");
  chatbotCloseBtn.innerText = "X";
  chatbotCloseBtn.addEventListener("click", function () {
    chatbotWindow.style.display = "none";
  });

  chatbotHeader.appendChild(chatbotHeaderText);
  chatbotHeader.appendChild(chatbotCloseBtn);

  const chatbotBody = document.createElement("div");
  chatbotBody.style.padding = "10px";
  chatbotBody.style.height = "calc(100% - 50px)";
  chatbotBody.style.overflowY = "auto";

  const chatbotFooter = document.createElement("div");
  chatbotFooter.style.padding = "10px";
  chatbotFooter.style.textAlign = "center";
  chatbotFooter.style.fontSize = "14px";
  chatbotFooter.style.color = "#999";
  chatbotFooter.innerText = "Powered by ImmerseLLM";

  const chatbotInputBox = document.createElement("div");
  chatbotInputBox.classList.add(
    "flex",
    "justify-start",
    "items-center",
    "gap-1",
    "p-2",
    "w-full"
  );

  const chatbotInput = document.createElement("input");
  chatbotInput.classList.add(
    "rounded-base",
    "w-full",
    "p-2",
    "border",
    "border-gray-300"
  );
  chatbotInput.placeholder = "Type your message...";
  chatbotInput.type = "text";
  chatbotInput.style.width = "100%";
  chatbotInput.style.padding = "10px";
  chatbotInput.style.border = "1px solid #ccc";
  chatbotInput.style.boxSizing = "border-box";

  const chatbotInputBtn = document.createElement("button");
  chatbotInputBtn.classList.add(
    "rounded-base",
    "p-2",
    "bg-green-500",
    "text-white",
    "cursor-pointer"
  );
  chatbotInputBtn.innerText = "Send";
  chatbotInputBtn.style.padding = "10px";

  chatbotInputBox.appendChild(chatbotInput);
  chatbotInputBox.appendChild(chatbotInputBtn);

  // Part 2: Chatbot Interactivity with Loading Indicator and Error Handling
  chatbotInputBtn.addEventListener("click", function () {
    handleMessage();
  });

  chatbotInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && chatbotInput.value.trim() !== "") {
      handleMessage();
    }
  });

  async function handleMessage() {
    const userMessage = chatbotInput.value.trim();
    if (userMessage === "") return;

    // Create user message box
    const userMessageBox = createMessageElement(userMessage, "user");
    chatbotBody.appendChild(userMessageBox);

    chatbotInput.value = "";

    // Show loading indicator
    const loadingMessageBox = createMessageElement("Loading...", "loading");
    chatbotBody.appendChild(loadingMessageBox);

    // Send message to the server
    try {
      const response = await sendMessageToServer(userMessage);
      chatbotBody.removeChild(loadingMessageBox); // Remove loading indicator

      const botMessageBox = createMessageElement(
        parseAIResponse(response),
        "bot"
      );
      chatbotBody.appendChild(botMessageBox);
    } catch (error) {
      chatbotBody.removeChild(loadingMessageBox); // Remove loading indicator
      const errorMessageBox = createMessageElement(
        "Error: Failed to get a response from the server.",
        "error"
      );
      chatbotBody.appendChild(errorMessageBox);
      console.error("Error:", error);
    }

    chatbotBody.scrollTop = chatbotBody.scrollHeight; // Scroll to the latest message
  }

  // Create message elements
  function createMessageElement(text, type) {
    const messageBox = document.createElement("div");
    messageBox.style.margin = "5px";
    messageBox.style.padding = "10px";
    messageBox.style.borderRadius = "5px";

    if (type === "user") {
      messageBox.style.backgroundColor = "#f1f1f1";
    } else if (type === "bot") {
      messageBox.style.backgroundColor = "#22c55e"; // Bot's response
      messageBox.style.color = "#fff";
    } else if (type === "loading") {
      messageBox.innerHTML = `<span>Loading...</span>`;
      messageBox.style.backgroundColor = "#e0e0e0";
    } else if (type === "error") {
      messageBox.innerHTML = `<span>${text}</span>`;
      messageBox.style.backgroundColor = "#ffcccc"; // Error message background
    }

    messageBox.innerText = text;
    return messageBox;
  }

  chatbotWindow.appendChild(chatbotHeader);
  chatbotWindow.appendChild(chatbotBody);
  chatbotWindow.appendChild(chatbotInputBox);
  chatbotWindow.appendChild(chatbotFooter);

  document.body.appendChild(chatbotBtn);
  document.body.appendChild(chatbotWindow);

  // Toggle chatbot visibility
  chatbotBtn.addEventListener("click", function () {
    chatbotWindow.style.display =
      chatbotWindow.style.display === "none" ? "block" : "none";
  });

  // Part 3: Communication with Server
  async function sendMessageToServer(message) {
    const response = await fetch(
      `http://localhost:8000/project/${projectId}/workflow/${workflowId}/chat`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: message }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data from server");
    }

    const data = await response.json();
    return data.response;
  }

  function parseAIResponse(response) {
    // This regular expression captures the code block inside triple backticks
    const codeBlockRegex = /```[a-zA-Z]*\n([\s\S]*?)```/g;
    let formattedResponse = response;

    formattedResponse = formattedResponse.replace(
      codeBlockRegex,
      function (match, code) {
        return `
      <div class="code-container">
        <button class="copy-btn">Copy</button>
        <pre><code class="language-javascript">${code.trim()}</code></pre>
      </div>`;
      }
    );

    return formattedResponse;
  }
})();

// Part 1: Chatbot Creation and UI
(function () {
  // Step 1: Dynamically load Tailwind CSS from CDN
  const tailwindCDN = document.createElement("link");
  tailwindCDN.rel = "stylesheet";
  tailwindCDN.href =
    "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"; // Load the Tailwind CSS CDN
  document.head.appendChild(tailwindCDN);
  // Inject Tailwind and custom scoped CSS
  const styleElement = document.createElement("style");
  styleElement.innerText = `
    #chatbot-container .bg-green-500 { background-color: #22c55e; }
    #chatbot-container .text-white { color: #fff; }
    #chatbot-container .rounded-full { border-radius: 9999px; }
    /* Other scoped Tailwind styles */
  `;
  document.head.appendChild(styleElement);

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
    // Prism is ready to be used for syntax highlighting
    console.log("Prism.js loaded for syntax highlighting.");
  };
  document.head.appendChild(prismScript);

  // Retrieve the script element
  const scriptTag = document.currentScript;

  // Fetch org_id and api_key from the script tag's data attributes
  const projectId = scriptTag.getAttribute("data-project-id");
  const workflowId = scriptTag.getAttribute("data-workflow-id");

  if (!orgId || !apiKey) {
    console.error("Chatbot requires 'org_id' and 'api_key' parameters.");
    return;
  }

  console.log(
    "Chatbot initialized with org_id:",
    orgId,
    "and api_key:",
    apiKey
  );

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

  //
  const chatbotHeaderText = document.createElement("p");
  chatbotHeaderText.classList.add();
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

  // Part 2: Chatbot Interactivity
  chatbotInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && chatbotInput.value.trim() !== "") {
      const userMessageBox = document.createElement("div");
      userMessageBox.classList.add(
        "bg-[#f1f1f1]",
        "flex",
        "justify-start",
        "items-center"
      );

      const userMessageAvatar = document.createElement("div");
      userMessageAvatar.classList.add(
        "rounded-full",
        "w-10",
        "h-10",
        "bg-gray-300",
        "mx-2",
        "text-white",
        "flex",
        "items-center",
        "justify-center",
        "bg-none"
      );

      userMessageAvatar.innerHTML = `
          <svg stroke="none" fill="black" stroke-width="0"
              viewBox="0 0 16 16" height="15" width="15" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z">
              </path>
            </svg>
      `;

      const userMessage = document.createElement("div");
      userMessage.style.backgroundColor = "#f1f1f1";
      userMessage.style.margin = "5px";
      userMessage.style.padding = "10px";
      userMessage.style.borderRadius = "5px";
      userMessage.innerText = chatbotInput.value;

      userMessageBox.appendChild(userMessageAvatar);
      userMessageBox.appendChild(userMessage);

      chatbotBody.appendChild(userMessageBox);
      chatbotInput.value = "";

      // Placeholder: Send the message to the server and handle response
      sendMessageToServer(userMessage.innerText).then((response) => {
        const botMessageBox = document.createElement("div");
        botMessageBox.classList.add(
          "flex",
          "justify-center",
          "items-center",
          "gap-2"
        );

        const botMessage = document.createElement("div");
        botMessage.classList.add("bg-green-500", "text-white");
        botMessage.style.margin = "5px";
        botMessage.style.padding = "10px";
        botMessage.style.borderRadius = "5px";
        botMessage.innerHTML = parseAIResponse(response);

        const botMessageAvatar = document.createElement("div");
        // botMessageAvatar.classList.add("bg-gray-100", "rounded-full");
        botMessageAvatar.innerHTML = `
              <svg stroke="none" fill="black" stroke-width="1.5"
                viewBox="0 0 24 24" aria-hidden="true" height="15" width="15" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z">
                </path>
              </svg>
        `;

        botMessageBox.appendChild(botMessageAvatar);
        botMessageBox.appendChild(botMessage);

        chatbotBody.appendChild(botMessageBox);

        // Enable Prism.js highlighting for the code blocks inside chatbotBody
        Prism.highlightAllUnder(chatbotBody);

        // Enable copy button functionality
        const copyButtons = chatbotBody.querySelectorAll(".copy-btn");
        copyButtons.forEach((btn) => {
          btn.addEventListener("click", function () {
            const codeBlock =
              btn.nextElementSibling.querySelector("code").innerText;
            navigator.clipboard.writeText(codeBlock).then(() => {
              btn.innerText = "Copied!";
              setTimeout(() => {
                btn.innerText = "Copy";
              }, 2000);
            });
          });
        });
      });
    }
  });

  chatbotInputBtn.addEventListener("click", function (event) {
    // if (event.key === "Enter" && chatbotInput.value.trim() !== "") {
    const userMessage = document.createElement("div");
    userMessage.style.backgroundColor = "#f1f1f1";
    userMessage.style.margin = "5px";
    userMessage.style.padding = "10px";
    userMessage.style.borderRadius = "5px";
    userMessage.innerText = chatbotInput.value;

    chatbotBody.appendChild(userMessage);
    chatbotInput.value = "";

    // Placeholder: Send the message to the server and handle response
    sendMessageToServer(userMessage.innerText).then((response) => {
      const botMessageBox = document.createElement("div");
      botMessageBox.classList.add(
        "flex",
        "justify-center",
        "items-center",
        "gap-2"
      );

      const botMessage = document.createElement("div");
      botMessage.classList.add("bg-green-500", "text-white");
      botMessage.style.margin = "5px";
      botMessage.style.padding = "10px";
      botMessage.style.borderRadius = "5px";
      botMessage.innerHTML = parseAIResponse(response.response);

      const botMessageAvatar = document.createElement("div");
      // botMessageAvatar.classList.add("bg-gray-100", "rounded-full");
      botMessageAvatar.innerHTML = `
              <svg stroke="none" fill="black" stroke-width="1.5"
                viewBox="0 0 24 24" aria-hidden="true" height="15" width="15" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z">
                </path>
              </svg>
        `;

      botMessageBox.appendChild(botMessageAvatar);
      botMessageBox.appendChild(botMessage);

      chatbotBody.appendChild(botMessageBox);

      // Enable Prism.js highlighting for the code blocks inside chatbotBody
      Prism.highlightAllUnder(chatbotBody);

      // Enable copy button functionality
      const copyButtons = chatbotBody.querySelectorAll(".copy-btn");
      copyButtons.forEach((btn) => {
        btn.addEventListener("click", function () {
          const codeBlock =
            btn.nextElementSibling.querySelector("code").innerText;
          navigator.clipboard.writeText(codeBlock).then(() => {
            btn.innerText = "Copied!";
            setTimeout(() => {
              btn.innerText = "Copy";
            }, 2000);
          });
        });
      });
    });
  });

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
    // Send the user's message to the server and return the bot's response
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
    const data = await response.json();
    return data.response;
  }

  function parseAIResponse(response) {
    // This regular expression captures the code block inside triple backticks and ignores the language identifier
    const codeBlockRegex = /```[a-zA-Z]*\n([\s\S]*?)```/g;
    let formattedResponse = response;

    // Replace code blocks with <pre><code> HTML tags with Prism.js classes
    formattedResponse = formattedResponse.replace(
      codeBlockRegex,
      function (match, code) {
        return `
      <div class="code-container">
        <button class="copy-btn">Copy</button>
        <pre><code class="language-javascript">${code.trim()}</code></pre>
      </div>`; // Code container with copy button and Prism.js class for highlighting
      }
    );

    return formattedResponse; // Return the response with formatted code blocks and plain text
  }

  return formattedResponse; // Return the response with formatted code blocks and plain text
})();

function startChat() {
  document.getElementById('introduction-container').style.display = 'none';
  document.getElementById('chat-container').style.display = 'flex';
  document.getElementById('chat-container').style.flexDirection = 'column';
}

async function sendMessage() {
  const input = document.getElementById('input-text').value;
  const chatWindow = document.getElementById('chat-window');
  const url = 'https://hiresiddhartha.azurewebsites.net/api/message';
  const key = 'XJez5tp6Z9Pcm12-Vz_ev275gDkaWUGevD3Rzamg_k8KAzFuTFJWDg==';
  const headers = new Headers();
  headers.append('x-functions-key', key);
  headers.append('Content-Type', 'application/json');

  // Append user's message
  const userDiv = document.createElement('div');
  userDiv.className = 'user-message';
  userDiv.textContent = input;
  chatWindow.appendChild(userDiv);

  // Clear input field
  document.getElementById('input-text').value = '';

  // Adding typing animation
  const typingDiv = document.createElement('div');
  typingDiv.className = 'typing-animation';
  const appendedTypingDiv = chatWindow.appendChild(typingDiv); // Keep a reference to the appended node

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ content: input }),
    });

    if (!response.ok) {
      let errorText = await response.text();
      errorText = errorText ? ` - ${errorText}` : '';
      throw new Error(`Oops: ${response.status} ${response.statusText}${errorText}`);
    }

    // Remove typing animation
    chatWindow.removeChild(appendedTypingDiv);

    const result = await response.json();
    const responseDiv = document.createElement('div');
    responseDiv.className = 'response-message';

    // Extract the message content
    const messageContent = result.message;

    // Split response text by line breaks and append as separate paragraphs
    const lines = messageContent.split('\n');
    lines.forEach(line => {
      const paragraph = document.createElement('p');
      paragraph.textContent = line;
      responseDiv.appendChild(paragraph);
    });

    chatWindow.appendChild(responseDiv);
  } catch (error) {
    // Remove typing animation in case of error
    chatWindow.removeChild(appendedTypingDiv);

    // Append error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = `Error: ${error.message}`;
    chatWindow.appendChild(errorDiv);
  }
}

// Event listener to send message with the Enter key
document.getElementById('input-text').addEventListener('keydown', function (e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

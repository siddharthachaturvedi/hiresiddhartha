
function startChat() {
  document.getElementById('introduction-container').style.display = 'none';
  document.getElementById('chat-container').style.display = 'flex';
  document.getElementById('chat-container').style.flexDirection = 'column'; // Ensure that the container is flex column
}


async function sendMessage() {
  const input = document.getElementById('input-text').value;
  const chatWindow = document.getElementById('chat-window');

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
  chatWindow.appendChild(typingDiv);

  const response = await fetch('https://hiresiddhartha.azurewebsites.net/api/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: input }),
  });

  // Remove typing animation
  chatWindow.removeChild(typingDiv);

  const result = await response.json();

  // Append bot response message
  const responseDiv = document.createElement('div');
  responseDiv.className = 'response-message'; // Changed from 'bot-message'

  // Split response text by line breaks and append as separate paragraphs
  const lines = result.message.content.split('\n');
  lines.forEach(line => {
    const paragraph = document.createElement('p');
    paragraph.textContent = line;
    responseDiv.appendChild(paragraph);
  });

  chatWindow.appendChild(responseDiv);
}

// Event listener to send message with the Enter key
document.getElementById('input-text').addEventListener('keydown', function (e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
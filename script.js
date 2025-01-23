const GITHUB_TOKEN = 'your_personal_access_token'; // Replace with your GitHub token
const REPO_OWNER = 'your_github_username';        // Replace with your GitHub username
const REPO_NAME = 'your_repository_name';         // Replace with your repository name
const FILE_PATH = 'leetcode_problems.json';       // Path to the JSON file in your repo

// Fetch the file content from GitHub
async function fetchFile() {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Error fetching file: ${response.statusText}`);
    }
    const data = await response.json();
    const content = atob(data.content); // Decode Base64 content
    document.getElementById('editor').value = content;
    document.getElementById('sha').value = data.sha; // Store the file's SHA
  } catch (error) {
    console.error('Error:', error);
    alert('Error fetching the file.');
  }
}

// Save changes to the file on GitHub
async function saveChanges() {
  const updatedContent = document.getElementById('editor').value;
  const sha = document.getElementById('sha').value;

  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Updated leetcode_problems.json via GitHub API',
        content: btoa(updatedContent), // Encode to Base64
        sha: sha, // Required for updates
      }),
    });
    if (response.ok) {
      alert('Changes saved successfully!');
      fetchFile(); // Reload the updated content
    } else {
      throw new Error(`Error saving file: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error saving the changes.');
  }
}

// Load the file content on page load
document.addEventListener('DOMContentLoaded', fetchFile);

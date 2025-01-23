const REPO_OWNER = 'BhasuruKrishnaChaitanya';
const REPO_NAME = 'leetcode-editor';
const BRANCH_NAME = 'json-updates';
const FILE_PATH = 'leetcode_problems.json';

async function saveChanges() {
  const updatedContent = document.getElementById('editor').value;

  try {
    const response = await fetch('/api/save-file', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        updatedContent,
        branch: BRANCH_NAME,
        filePath: FILE_PATH,
      }),
    });

    if (response.ok) {
      alert('Changes saved successfully!');
    } else {
      console.error('Error saving changes:', await response.json());
      alert('Failed to save changes.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while saving the changes.');
  }
}
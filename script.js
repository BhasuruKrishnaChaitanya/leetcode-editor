document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("questions-container");
    const saveButton = document.getElementById("save-btn");

    // Load questions from leetcode_problems.json
    const fetchQuestions = async () => {
        try {
            const response = await fetch('https://raw.githubusercontent.com/BhasuruKrishnaChaitanya/leetcode-editor/main/leetcode_problems.json');
            const data = await response.json();
            container.innerHTML = data.map(q => `
                <div>
                    <input type="checkbox" id="question-${q.id}" ${q.done ? 'checked' : ''}>
                    <label for="question-${q.id}">${q.title}</label>
                    <a href="${q.url}" target="_blank">(Link)</a>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    fetchQuestions();

    // Save updated questions
    saveButton.addEventListener("click", async () => {
        const updatedQuestions = Array.from(container.children).map((div, index) => {
            const checkbox = div.querySelector('input[type="checkbox"]');
            return {
                id: index + 1,
                title: div.querySelector('label').textContent,
                url: div.querySelector('a').href,
                done: checkbox.checked
            };
        });

        try {
            const response = await fetch('https://api.github.com/repos/BhasuruKrishnaChaitanya/leetcode-editor/dispatches', {
                method: 'POST',
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json',
                    // No PAT here; GitHub Actions handles the commit
                },
                body: JSON.stringify({
                    event_type: 'update_file',
                    client_payload: {
                        updatedData: updatedQuestions
                    }
                })
            });

            if (response.ok) {
                alert('Progress saved successfully!');
            } else {
                alert('Failed to save progress.');
                console.error('Error:', await response.text());
            }
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    });
});

// Webhook Poll Data Collector
// This script sends poll responses to any webhook endpoint

class WebhookCollector {
    constructor(webhookUrl, options = {}) {
        this.webhookUrl = webhookUrl;
        this.options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };
    }

    async submitPollResponse(pollData) {
        try {
            const response = await fetch(this.webhookUrl, {
                ...this.options,
                body: JSON.stringify({
                    type: 'poll_response',
                    data: pollData,
                    timestamp: new Date().toISOString()
                })
            });

            if (response.ok) {
                console.log('Poll response submitted via webhook');
                return await response.json();
            } else {
                throw new Error(`Webhook error: ${response.status}`);
            }
        } catch (error) {
            console.error('Failed to submit poll via webhook:', error);
            // Fallback to localStorage
            this.saveToLocalStorage(pollData);
            throw error;
        }
    }

    saveToLocalStorage(pollData) {
        const existingData = JSON.parse(localStorage.getItem('hamroawaz_poll_responses') || '[]');
        existingData.push(pollData);
        localStorage.setItem('hamroawaz_poll_responses', JSON.stringify(existingData));
    }
}

// Usage examples:
// GitHub webhook: const collector = new WebhookCollector('https://api.github.com/repos/username/repo/issues');
// Zapier webhook: const collector = new WebhookCollector('https://hooks.zapier.com/hooks/catch/your-webhook-url');
// Custom server: const collector = new WebhookCollector('https://your-server.com/api/polls');

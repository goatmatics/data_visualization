// Poll Lifecycle Management System
// Handles poll activation, deactivation, and automatic ending

class PollLifecycleManager {
    constructor() {
        this.pollConfig = null;
        this.loadPollConfig();
    }

    // Load poll configuration from localStorage or default
    loadPollConfig() {
        const saved = localStorage.getItem('hamroawaz_poll_config');
        if (saved) {
            this.pollConfig = JSON.parse(saved);
        } else {
            this.initializeDefaultConfig();
        }
    }

    // Initialize default poll configuration
    initializeDefaultConfig() {
        this.pollConfig = {
            polls: {},
            globalSettings: {
                defaultDuration: 30, // days
                autoEnd: true,
                allowVoting: true
            }
        };
        this.savePollConfig();
    }

    // Save poll configuration to localStorage
    savePollConfig() {
        localStorage.setItem('hamroawaz_poll_config', JSON.stringify(this.pollConfig));
    }

    // Set poll status (active, paused, ended)
    setPollStatus(pollId, status, endDate = null) {
        if (!this.pollConfig.polls[pollId]) {
            this.pollConfig.polls[pollId] = {
                status: 'active',
                startDate: new Date().toISOString(),
                endDate: null,
                allowVoting: true
            };
        }

        this.pollConfig.polls[pollId].status = status;
        
        if (endDate) {
            this.pollConfig.polls[pollId].endDate = endDate;
        }

        if (status === 'ended') {
            this.pollConfig.polls[pollId].allowVoting = false;
        }

        this.savePollConfig();
        this.updatePollUI(pollId);
    }

    // Set poll end date
    setPollEndDate(pollId, endDate) {
        if (!this.pollConfig.polls[pollId]) {
            this.pollConfig.polls[pollId] = {
                status: 'active',
                startDate: new Date().toISOString(),
                endDate: null,
                allowVoting: true
            };
        }

        this.pollConfig.polls[pollId].endDate = endDate;
        this.savePollConfig();
        this.updatePollUI(pollId);
    }

    // Check if poll is active
    isPollActive(pollId) {
        const poll = this.pollConfig.polls[pollId];
        if (!poll) return true; // Default to active if not configured

        if (poll.status === 'ended') return false;
        if (poll.status === 'paused') return false;

        // Check if poll has expired
        if (poll.endDate) {
            const now = new Date();
            const endDate = new Date(poll.endDate);
            if (now > endDate) {
                this.setPollStatus(pollId, 'ended');
                return false;
            }
        }

        return poll.allowVoting;
    }

    // Get poll status
    getPollStatus(pollId) {
        const poll = this.pollConfig.polls[pollId];
        if (!poll) return 'active';

        // Check if poll has expired
        if (poll.endDate) {
            const now = new Date();
            const endDate = new Date(poll.endDate);
            if (now > endDate && poll.status !== 'ended') {
                this.setPollStatus(pollId, 'ended');
                return 'ended';
            }
        }

        return poll.status;
    }

    // Get time remaining for poll
    getTimeRemaining(pollId) {
        const poll = this.pollConfig.polls[pollId];
        if (!poll || !poll.endDate) return null;

        const now = new Date();
        const endDate = new Date(poll.endDate);
        const diff = endDate - now;

        if (diff <= 0) return null;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        return { days, hours, minutes };
    }

    // Update poll UI based on status
    updatePollUI(pollId) {
        const pollCard = document.querySelector(`[data-poll-id="${pollId}"]`);
        if (!pollCard) return;

        const status = this.getPollStatus(pollId);
        const submitBtn = pollCard.querySelector('.submit-poll-btn');
        const pollHeader = pollCard.querySelector('.poll-header');

        // Remove existing status indicators
        pollCard.querySelectorAll('.poll-status-indicator').forEach(el => el.remove());

        // Add status indicator
        const statusIndicator = document.createElement('div');
        statusIndicator.className = 'poll-status-indicator';
        
        switch (status) {
            case 'active':
                statusIndicator.innerHTML = `
                    <span class="status-badge status-active">
                        <span class="status-icon">🟢</span>
                        <span class="status-text">Active</span>
                    </span>
                `;
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                }
                break;
                
            case 'paused':
                statusIndicator.innerHTML = `
                    <span class="status-badge status-paused">
                        <span class="status-icon">⏸️</span>
                        <span class="status-text">Paused</span>
                    </span>
                `;
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.style.opacity = '0.5';
                    submitBtn.textContent = 'Voting Paused';
                }
                break;
                
            case 'ended':
                statusIndicator.innerHTML = `
                    <span class="status-badge status-ended">
                        <span class="status-icon">🔴</span>
                        <span class="status-text">Ended</span>
                    </span>
                `;
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.style.opacity = '0.5';
                    submitBtn.textContent = 'Voting Ended';
                }
                break;
        }

        if (pollHeader) {
            pollHeader.appendChild(statusIndicator);
        }

        // Add countdown timer if poll is active and has end date
        if (status === 'active') {
            const timeRemaining = this.getTimeRemaining(pollId);
            if (timeRemaining) {
                this.addCountdownTimer(pollCard, pollId, timeRemaining);
            }
        }
    }

    // Add countdown timer to poll
    addCountdownTimer(pollCard, pollId, timeRemaining) {
        // Remove existing timer
        pollCard.querySelectorAll('.poll-countdown').forEach(el => el.remove());

        const countdownEl = document.createElement('div');
        countdownEl.className = 'poll-countdown';
        countdownEl.innerHTML = `
            <div class="countdown-timer">
                <span class="countdown-label">Time Remaining:</span>
                <span class="countdown-time" data-poll-id="${pollId}">
                    ${timeRemaining.days}d ${timeRemaining.hours}h ${timeRemaining.minutes}m
                </span>
            </div>
        `;

        const pollHeader = pollCard.querySelector('.poll-header');
        if (pollHeader) {
            pollHeader.appendChild(countdownEl);
        }

        // Start countdown update
        this.startCountdownUpdate(pollId);
    }

    // Start countdown update interval
    startCountdownUpdate(pollId) {
        const interval = setInterval(() => {
            const timeRemaining = this.getTimeRemaining(pollId);
            const countdownEl = document.querySelector(`[data-poll-id="${pollId}"] .countdown-time`);
            
            if (!timeRemaining || !countdownEl) {
                clearInterval(interval);
                return;
            }

            countdownEl.textContent = `${timeRemaining.days}d ${timeRemaining.hours}h ${timeRemaining.minutes}m`;

            // Check if poll should end
            if (timeRemaining.days === 0 && timeRemaining.hours === 0 && timeRemaining.minutes === 0) {
                this.setPollStatus(pollId, 'ended');
                clearInterval(interval);
            }
        }, 60000); // Update every minute
    }

    // Initialize all polls on page load
    initializePolls() {
        const pollCards = document.querySelectorAll('.poll-card');
        pollCards.forEach(pollCard => {
            const pollId = this.extractPollId(pollCard);
            if (pollId) {
                this.updatePollUI(pollId);
            }
        });
    }

    // Extract poll ID from poll card
    extractPollId(pollCard) {
        const radioInput = pollCard.querySelector('input[type="radio"]');
        if (radioInput) {
            return radioInput.name;
        }
        return null;
    }

    // Admin functions for poll management
    adminSetPollActive(pollId) {
        this.setPollStatus(pollId, 'active');
        console.log(`✅ Poll ${pollId} activated`);
    }

    adminPausePoll(pollId) {
        this.setPollStatus(pollId, 'paused');
        console.log(`⏸️ Poll ${pollId} paused`);
    }

    adminEndPoll(pollId) {
        this.setPollStatus(pollId, 'ended');
        console.log(`🔴 Poll ${pollId} ended`);
    }

    adminSetPollDuration(pollId, days) {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + days);
        this.setPollEndDate(pollId, endDate.toISOString());
        console.log(`⏰ Poll ${pollId} set to end in ${days} days`);
    }

    // Get all poll statuses
    getAllPollStatuses() {
        const statuses = {};
        const pollCards = document.querySelectorAll('.poll-card');
        
        pollCards.forEach(pollCard => {
            const pollId = this.extractPollId(pollCard);
            if (pollId) {
                statuses[pollId] = {
                    status: this.getPollStatus(pollId),
                    isActive: this.isPollActive(pollId),
                    timeRemaining: this.getTimeRemaining(pollId)
                };
            }
        });
        
        return statuses;
    }
}

// Global instance
window.pollLifecycleManager = new PollLifecycleManager();

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.pollLifecycleManager.initializePolls();
    }, 1000);
});

// Admin console functions
window.adminPolls = {
    // Set poll active
    activate: (pollId) => window.pollLifecycleManager.adminSetPollActive(pollId),
    
    // Pause poll
    pause: (pollId) => window.pollLifecycleManager.adminPausePoll(pollId),
    
    // End poll
    end: (pollId) => window.pollLifecycleManager.adminEndPoll(pollId),
    
    // Set poll duration
    setDuration: (pollId, days) => window.pollLifecycleManager.adminSetPollDuration(pollId, days),
    
    // Get all statuses
    status: () => window.pollLifecycleManager.getAllPollStatuses(),
    
    // Set global voting
    setGlobalVoting: (allow) => {
        window.pollLifecycleManager.pollConfig.globalSettings.allowVoting = allow;
        window.pollLifecycleManager.savePollConfig();
        console.log(`🌐 Global voting ${allow ? 'enabled' : 'disabled'}`);
    }
};

// NeonFaq-SplitLayout.ts - Simple Split Layout
class NeonFaqSplit {
    private questions: NodeListOf<HTMLElement>;
    private selectedQuestionEl: HTMLElement | null;
    private selectedAnswerEl: HTMLElement | null;
    private answerContentEl: HTMLElement | null;
    private noSelectionEl: HTMLElement | null;
    private currentIndex: number = 0;

    constructor() {
        this.questions = document.querySelectorAll('[data-faq-question]');
        this.selectedQuestionEl = document.querySelector('[data-selected-question]');
        this.selectedAnswerEl = document.querySelector('[data-selected-answer]');
        this.answerContentEl = document.querySelector('[data-faq-answer-content]');
        this.noSelectionEl = document.querySelector('[data-faq-no-selection]');
    }

    init(): void {
        this.attachEventListeners();
        this.selectQuestion(0); // Select first question by default
    }

    private attachEventListeners(): void {
        this.questions.forEach((question, index) => {
            question.addEventListener('click', () => this.selectQuestion(index));
            question.addEventListener('keydown', (e) => this.handleKeydown(e, index));
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleGlobalKeydown(e));
    }

    private handleKeydown(event: KeyboardEvent, index: number): void {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.selectQuestion(index);
        }
    }

    private handleGlobalKeydown(event: KeyboardEvent): void {
        const focusedElement = document.activeElement as HTMLElement;
        const isFaqQuestion = focusedElement?.hasAttribute('data-faq-question');
        
        if (!isFaqQuestion) return;

        const currentIndex = Array.from(this.questions).indexOf(focusedElement);
        if (currentIndex === -1) return;

        let nextIndex: number;

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                nextIndex = (currentIndex + 1) % this.questions.length;
                (this.questions[nextIndex] as HTMLElement).focus();
                break;
            case 'ArrowUp':
                event.preventDefault();
                nextIndex = currentIndex === 0 ? this.questions.length - 1 : currentIndex - 1;
                (this.questions[nextIndex] as HTMLElement).focus();
                break;
            case 'Home':
                event.preventDefault();
                (this.questions[0] as HTMLElement).focus();
                break;
            case 'End':
                event.preventDefault();
                (this.questions[this.questions.length - 1] as HTMLElement).focus();
                break;
        }
    }

    private selectQuestion(index: number): void {
        if (index < 0 || index >= this.questions.length) return;

        // Remove selected class from all questions
        this.questions.forEach((q, i) => {
            q.classList.remove('selected');
            q.setAttribute('aria-pressed', 'false');
        });

        // Add selected class to current question
        this.questions[index].classList.add('selected');
        this.questions[index].setAttribute('aria-pressed', 'true');

        // Update answer content
        this.updateAnswerContent(index);
        this.currentIndex = index;

        // Show answer content, hide placeholder
        if (this.answerContentEl && this.noSelectionEl) {
            this.answerContentEl.classList.remove('hidden');
            this.noSelectionEl.classList.add('hidden');
        }
    }

    private updateAnswerContent(index: number): void {
        const questionEl = this.questions[index];
        const questionText = questionEl.querySelector('.neon-faq-splitQuestionText')?.textContent || '';
        
        // Get answer content from data attribute or find it in the original data
        const answerContent = this.getAnswerContent(index);

        if (this.selectedQuestionEl) {
            this.selectedQuestionEl.textContent = questionText;
        }

        if (this.selectedAnswerEl) {
            this.selectedAnswerEl.textContent = answerContent;
        }
    }

    private getAnswerContent(index: number): string {
        // Get answer from data attribute
        const questionEl = this.questions[index];
        return questionEl.dataset.answer || `Answer for question ${index + 1}`;
    }
}

// Simple initialization
const initNeonFaqSplit = (): void => {
    const faqSplit = new NeonFaqSplit();
    faqSplit.init();
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNeonFaqSplit);
} else {
    initNeonFaqSplit();
}

// Astro page load handling
document.addEventListener('astro:page-load', initNeonFaqSplit);

export { NeonFaqSplit };
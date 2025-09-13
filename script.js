document.addEventListener('DOMContentLoaded', function () {
    // Set today's date as default
    const today = new Date().toISOString().substr(0, 10);
    document.getElementById('expense-date').value = today;

    // Load expenses from localStorage
    loadExpenses();

    // Add expense button event listener
    document.getElementById('add-expense').addEventListener('click', addExpense);
});

// Expenses array
let expenses = [];

// Function to add an expense
function addExpense() {
    const nameInput = document.getElementById('expense-name');
    const amountInput = document.getElementById('expense-amount');
    const categoryInput = document.getElementById('expense-category');
    const dateInput = document.getElementById('expense-date');

    const name = nameInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const category = categoryInput.value;
    const date = dateInput.value;

    // Validate inputs
    if (name === '' || isNaN(amount) || amount <= 0 || date === '') {
        alert('Please fill all fields with valid values.');
        return;
    }

    // Create expense object
    const expense = {
        id: Date.now(), // unique ID
        name,
        amount,
        category,
        date
    };

    // Add to expenses array
    expenses.push(expense);

    // Save to localStorage
    saveExpenses();

    // Update UI
    renderExpenses();
    updateSummary();

    // Clear form inputs
    nameInput.value = '';
    amountInput.value = '';
    categoryInput.value = 'Food';
    dateInput.value = new Date().toISOString().substr(0, 10);

    // Focus on name input
    nameInput.focus();
}

// Function to delete an expense
function deleteExpense(id) {
    if (confirm('Are you sure you want to delete this expense?')) {
        expenses = expenses.filter(expense => expense.id !== id);
        saveExpenses();
        renderExpenses();
        updateSummary();
    }
}

// Function to save expenses to localStorage
function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Function to load expenses from localStorage
function loadExpenses() {
    const storedExpenses = localStorage.getItem('expenses');
    if (storedExpenses) {
        expenses = JSON.parse(storedExpenses);
        renderExpenses();
        updateSummary();
    }
}

// Function to render expenses in the UI
function renderExpenses() {
    const expensesContainer = document.getElementById('expenses-container');

    if (expenses.length === 0) {
        expensesContainer.innerHTML = '<div class="no-expenses">No expenses added yet. Start by adding an expense above!</div>';
        return;
    }

    // Clear container
    expensesContainer.innerHTML = '';

    // Sort expenses by date (newest first)
    expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Add each expense to the container
    expenses.forEach(expense => {
        const expenseElement = document.createElement('div');
        expenseElement.className = 'expense-item';

        // Format date for display
        const formattedDate = new Date(expense.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        expenseElement.innerHTML = `
                    <div class="expense-details">
                        <div class="expense-name">${expense.name}</div>
                        <div class="expense-category">${expense.category}</div>
                    </div>
                    <div class="expense-actions">
                        <div class="expense-amount">R${expense.amount.toFixed(2)}</div>
                        <div class="expense-date">${formattedDate}</div>
                        <button class="delete-btn" data-id="${expense.id}">Delete</button>
                    </div>
                `;

        expensesContainer.appendChild(expenseElement);
    });

    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function () {
            const id = parseInt(this.getAttribute('data-id'));
            deleteExpense(id);
        });
    });
}

// Function to update the summary information
function updateSummary() {
    // Update total expenses
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    document.querySelector('.total-expenses').textContent = `R${total.toFixed(2)}`;
    document.getElementById('total-expenses-count').textContent = expenses.length;

    // Update largest expense
    const largest = expenses.length > 0 ?
        Math.max(...expenses.map(expense => expense.amount)) : 0;
    document.getElementById('largest-expense').textContent = `R${largest.toFixed(2)}`;

    // Update average expense
    const average = expenses.length > 0 ? total / expenses.length : 0;
    document.getElementById('average-expense').textContent = `R${average.toFixed(2)}`;
}
document.addEventListener('DOMContentLoaded', function () {
    const expenseForm = document.getElementById('expenseForm');
    const expenseList = document.getElementById('expenseList');
    const successModal = document.getElementById('successModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    let expenses = [];

    // Load expenses from localStorage
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
        expenses = JSON.parse(savedExpenses);
        renderExpenses();
    }

    // Form submit event
    expenseForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const expenseName = document.getElementById('expenseName').value;
        const amount = document.getElementById('amount').value;
        const currency = document.getElementById('currency').value; // Selected currency
        const date = document.getElementById('date').value; // Date input from user

        if (!expenseName || !amount || !date) {
            alert("Please fill all fields");
            return;
        }

        const expense = {
            id: Date.now(),
            name: expenseName,
            amount: parseFloat(amount),
            currency: currency,
            date: date, // Use the selected date
        };

        // If editing an existing expense, update the expense list
        const editIndex = expenseForm.getAttribute('data-edit-index');
        if (editIndex !== null) {
            expenses[editIndex] = expense; // Replace the edited expense
            expenseForm.removeAttribute('data-edit-index'); // Remove the edit mode
        } else {
            expenses.unshift(expense); // Add new expense
        }

        localStorage.setItem('expenses', JSON.stringify(expenses));
        renderExpenses();

        // Show success modal
        successModal.classList.remove('hidden');

        // Close modal after 3 seconds
        setTimeout(() => {
            successModal.classList.add('hidden');
        }, 3000);

        expenseForm.reset(); // Reset form
    });

    function renderExpenses() {
        expenseList.innerHTML = '';

        if (expenses.length === 0) {
            expenseList.innerHTML = `
                <div class="text-center text-gray-500 py-8">
                    <i class="bi bi-receipt text-4xl mb-2"></i>
                    <p>No expenses added yet</p>
                </div>
            `;
            return;
        }

        expenses.forEach((expense, index) => {
            const expenseEl = document.createElement('div');
            expenseEl.className = 'expense-item bg-gray-50 p-4 rounded-lg flex justify-between items-center';
            expenseEl.innerHTML = `
                <div>
                    <h3 class="font-medium text-gray-800">${expense.name}</h3>
                    <p class="text-sm text-gray-500">${expense.date}</p>
                </div>
                <div class="flex items-center">
                    <span class="font-semibold text-gray-800">
                        ${expense.currency === 'INR' ? '₹' : '$'}${expense.amount.toFixed(2)}
                    </span>
                    <button onclick="editExpense(${index})" class="ml-4 text-blue-500 hover:text-blue-700 transition-colors">
                        <i class="bi bi-pencil"></i> Edit
                    </button>
                    <button onclick="deleteExpense(${expense.id})" class="ml-4 text-red-500 hover:text-red-700 transition-colors">
                        <i class="bi bi-trash"></i> Delete
                    </button>
                </div>
            `;
            expenseList.appendChild(expenseEl);
        });
    }

    // Function to edit expense
    window.editExpense = function (index) {
        const expense = expenses[index];
        document.getElementById('expenseName').value = expense.name;
        document.getElementById('amount').value = expense.amount;
        document.getElementById('currency').value = expense.currency;
        document.getElementById('date').value = expense.date;

        expenseForm.setAttribute('data-edit-index', index); // Mark the form as editing
    };

    // Function to delete expense
    window.deleteExpense = function (id) {
        expenses = expenses.filter(expense => expense.id !== id);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        renderExpenses();
    };

    // Close the modal when the close button is clicked
    closeModalBtn.addEventListener('click', function () {
        successModal.classList.add('hidden');
    });
});

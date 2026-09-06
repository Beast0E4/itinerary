import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useTripId } from '../hooks/useTripId';
import { fetchBudget, updateBudget, selectBudgetSummary } from '../features/budget/budgetSlice';
import {
  fetchExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  selectAllExpenses,
} from '../features/expenses/expensesSlice';
import BudgetOverviewCard from '../components/budget/BudgetOverviewCard';
import CategoryPieChart from '../components/budget/CategoryPieChart';
import ExpenseTable from '../components/budget/ExpenseTable';
import ExpenseFormModal from '../components/budget/ExpenseFormModal';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';

export default function BudgetPage() {
  const dispatch = useAppDispatch();
  const tripId = useTripId();
  const summary = useAppSelector(selectBudgetSummary);
  const expenses = useAppSelector(selectAllExpenses);

  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [totalBudgetInput, setTotalBudgetInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (tripId) {
      dispatch(fetchBudget(tripId));
      dispatch(fetchExpenses(tripId));
    }
  }, [tripId, dispatch]);

  const handleExpenseSubmit = async (form) => {
    setSubmitting(true);
    const result = editingExpense
      ? await dispatch(updateExpense({ tripId, expenseId: editingExpense.id, payload: form }))
      : await dispatch(addExpense({ tripId, payload: form }));
    setSubmitting(false);

    if (result.meta.requestStatus === 'fulfilled') {
      toast.success(editingExpense ? 'Expense updated' : 'Expense logged');
      setExpenseModalOpen(false);
      dispatch(fetchBudget(tripId));
    } else {
      toast.error(result.payload || 'Something went wrong');
    }
  };

  const handleDeleteExpense = async (expense) => {
    const result = await dispatch(deleteExpense({ tripId, expenseId: expense.id }));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Expense removed');
      dispatch(fetchBudget(tripId));
    }
  };

  const openBudgetModal = () => {
    setTotalBudgetInput(summary?.totalBudget ?? '');
    setBudgetModalOpen(true);
  };

  const handleBudgetSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await dispatch(
      updateBudget({ tripId, payload: { totalBudget: Number(totalBudgetInput) } })
    );
    setSubmitting(false);
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Budget updated');
      setBudgetModalOpen(false);
    }
  };

  if (!summary) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <BudgetOverviewCard summary={summary} onEditBudget={openBudgetModal} />
        <CategoryPieChart breakdown={summary.categoryBreakdown} currency={summary.currency} />
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg">Expenses</h2>
          <button
            onClick={() => {
              setEditingExpense(null);
              setExpenseModalOpen(true);
            }}
            className="btn-ghost text-sm"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={1.75} />
            Log expense
          </button>
        </div>
        <ExpenseTable
          expenses={expenses}
          onEdit={(e) => {
            setEditingExpense(e);
            setExpenseModalOpen(true);
          }}
          onDelete={handleDeleteExpense}
        />
      </div>

      <ExpenseFormModal
        open={expenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
        onSubmit={handleExpenseSubmit}
        initialValues={editingExpense}
        submitting={submitting}
      />

      <Modal open={budgetModalOpen} onClose={() => setBudgetModalOpen(false)} title="Set total budget">
        <form onSubmit={handleBudgetSubmit} className="space-y-4">
          <Input
            label={`Total budget (${summary.currency})`}
            type="number"
            step="0.01"
            min="0"
            required
            value={totalBudgetInput}
            onChange={(e) => setTotalBudgetInput(e.target.value)}
          />
          <Button type="submit" loading={submitting} className="w-full">
            Save
          </Button>
        </form>
      </Modal>
    </div>
  );
}
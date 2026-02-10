import React, { useState, useMemo } from 'react';
import { Search, Plus } from 'lucide-react';
import InvoicesTable from './components/InvoicesTable';
import InvoiceFilters from './components/InvoiceFilters';
import { useInvoices } from '../../contexts/InvoicesContext';
import { Invoice, InvoiceStatus } from '../../types';
import Button from '../../components/shared/ui/Button';
import { useNavigate } from 'react-router-dom';

const InvoicesPage: React.FC = () => {
  const navigate = useNavigate();
  const { invoices, updateInvoice, deleteInvoice } = useInvoices();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'All'>('All');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);




  const filteredInvoices = useMemo(() => {
    let result = invoices;

    // Apply search filter
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      result = result.filter(invoice =>
        invoice.clientName.toLowerCase().includes(lowercasedQuery) ||
        invoice.clientCompany.toLowerCase().includes(lowercasedQuery) ||
        invoice.invoiceNumber.toLowerCase().includes(lowercasedQuery)
      );
    }

    // Apply status filter
    if (statusFilter !== 'All') {
      result = result.filter(invoice => invoice.status === statusFilter);
    }

    return result;
  }, [invoices, searchQuery, statusFilter]);

  const sortedInvoices = useMemo(() => {
    const calculateTotal = (invoice: Invoice) => {
      const subtotal = invoice.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
      const tax = subtotal * (invoice.taxRate / 100);
      return subtotal + tax;
    };

    let sortableInvoices = filteredInvoices.map(invoice => ({
      ...invoice,
      totalAmount: calculateTotal(invoice),
    }));

    if (sortConfig !== null) {
      sortableInvoices.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof typeof a];
        const bValue = b[sortConfig.key as keyof typeof b];
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableInvoices;
  }, [filteredInvoices, sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // ... (summary calculation remains same) ...
  const summary = useMemo(() => {
    const calculateTotal = (invoice: Invoice) => {
      const subtotal = invoice.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
      const tax = subtotal * (invoice.taxRate / 100);
      return subtotal + tax;
    };

    const totalInvoices = sortedInvoices.length;
    const totalAmount = sortedInvoices.reduce((sum, invoice) => sum + calculateTotal(invoice), 0);
    const paidAmount = sortedInvoices
      .filter(inv => inv.status === 'Paid')
      .reduce((sum, invoice) => sum + calculateTotal(invoice), 0);

    return { totalInvoices, totalAmount, paidAmount };
  }, [sortedInvoices]);

  // Handle invoice selection (Removed as per new requirements)

  // Status Update Handler
  const handleUpdateStatus = (id: string, status: InvoiceStatus) => {
    updateInvoice(id, { status });
  };

  // Delete Handler
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      deleteInvoice(id);
    }
  }

  // Export all invoices as CSV
  const exportInvoicesAsCSV = () => {
    const invoicesWithTotals = sortedInvoices.map(invoice => {
      const subtotal = invoice.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
      const tax = subtotal * (invoice.taxRate / 100);
      const total = subtotal + tax;
      return {
        ...invoice,
        totalAmount: total
      };
    });

    const headers = ['Invoice Number', 'Client Name', 'Client Company', 'Client Email', 'Issue Date', 'Due Date', 'Status', 'Total Amount'];
    const csvContent = [
      headers.join(','),
      ...invoicesWithTotals.map(invoice => [
        `"${invoice.invoiceNumber}"`,
        `"${invoice.clientName}"`,
        `"${invoice.clientCompany}"`,
        `"${invoice.clientEmail}"`,
        `"${invoice.issueDate}"`,
        `"${invoice.dueDate}"`,
        `"${invoice.status}"`,
        `"${invoice.totalAmount.toFixed(2)}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `invoices-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 w-full sm:w-64 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => navigate('/invoices/create')}
            className="bg-primary hover:bg-primary-dark text-white shadow-sm"
          >
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Total Invoices</h3>
          <p className="text-3xl font-bold text-gray-900">{summary.totalInvoices}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Total Amount</h3>
          <p className="text-3xl font-bold text-gray-900">${summary.totalAmount.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Amount Paid</h3>
          <p className="text-3xl font-bold text-green-600">${summary.paidAmount.toFixed(2)}</p>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Filter by:</span>
          <InvoiceFilters
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportInvoicesAsCSV}
            className="text-gray-600 hover:text-gray-800"
          >
            Export CVS
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <InvoicesTable
          invoices={sortedInvoices}
          requestSort={requestSort}
          sortConfig={sortConfig}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default InvoicesPage;
import React, { useState, useEffect } from 'react';
import { getAllPayouts, processPayout, rejectPayout } from '@/api/owner/payoutsApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2, CheckCircle, XCircle, Clock, AlertCircle, Lock, Unlock } from 'lucide-react';

interface Payout {
  id: number;
  talent_id: number;
  job_id: number;
  gross_amount: number;
  escrow_fee: number;
  net_amount: number;
  currency: string;
  status: string;
  escrow_status: string;
  employer_approval_status: string;
  payout_method: string;
  reference_number: string;
  created_at: string;
  processed_at: string;
  released_at: string;
  talent_name: string;
  talent_email: string;
  talent_image: string;
  job_title: string;
  processed_by_name: string;
}

interface PayoutsListProps {
  onRefresh: () => void;
  refreshTrigger: number;
}

const PayoutsList: React.FC<PayoutsListProps> = ({ onRefresh, refreshTrigger }) => {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('pending');
  const [search, setSearch] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [transactionId, setTransactionId] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    fetchPayouts();
  }, [page, status, search, refreshTrigger]);

  const fetchPayouts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllPayouts({
        status: status === 'all' ? 'all' : status,
        page,
        limit: 10,
        search: search || undefined,
      });
      
      if (response && response.payouts && Array.isArray(response.payouts)) {
        setPayouts(response.payouts);
        setTotalPages(response.pagination?.pages || 1);
      } else {
        setPayouts([]);
        setError('Invalid response format from server');
      }
    } catch (error: any) {
      console.error('Error fetching payouts:', error);
      setPayouts([]);
      setError(error.message || 'Failed to fetch payouts');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayout = async (payoutId: number) => {
    if (!transactionId.trim()) {
      alert('Please enter transaction ID');
      return;
    }

    setProcessingId(payoutId);
    try {
      await processPayout(payoutId, { transaction_id: transactionId });
      alert('Payout released from escrow successfully!');
      setTransactionId('');
      onRefresh();
    } catch (error) {
      alert('Failed to process payout');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectPayout = async (payoutId: number) => {
    if (!rejectReason.trim() || rejectReason.length < 5) {
      alert('Please enter a reason (at least 5 characters)');
      return;
    }

    setRejectingId(payoutId);
    try {
      await rejectPayout(payoutId, { failed_reason: rejectReason });
      alert('Payout rejected successfully!');
      setRejectReason('');
      onRefresh();
    } catch (error) {
      alert('Failed to reject payout');
    } finally {
      setRejectingId(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'failed':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getEscrowStatusIcon = (escrowStatus: string) => {
    switch (escrowStatus) {
      case 'held':
        return <Lock className="w-4 h-4 text-blue-600" />;
      case 'released':
        return <Unlock className="w-4 h-4 text-green-600" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-amber-600" />;
      default:
        return null;
    }
  };

  const getEscrowStatusColor = (escrowStatus: string) => {
    switch (escrowStatus) {
      case 'held':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'released':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'approved':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getApprovalStatusColor = (approvalStatus: string) => {
    switch (approvalStatus) {
      case 'approved':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="all">All</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-900 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by talent name, email, or reference..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Payouts Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          </div>
        ) : payouts && payouts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">No payouts found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Reference</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Talent</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Escrow Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Employer Approval</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {payouts && payouts.map((payout) => (
                  <React.Fragment key={payout.id}>
                    <tr className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 text-sm font-mono text-slate-600">{payout.reference_number}</td>
                      <td className="px-6 py-4 text-sm">
                        <div>
                          <p className="font-medium text-slate-900">{payout.talent_name}</p>
                          <p className="text-xs text-slate-600">{payout.talent_email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="space-y-1">
                          <p className="font-semibold text-slate-900">ETB {(payout.net_amount || 0).toFixed(2)}</p>
                          <p className="text-xs text-slate-500">Fee: ETB {(payout.escrow_fee || 0).toFixed(2)}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getEscrowStatusColor(payout.escrow_status)} w-fit`}>
                          {getEscrowStatusIcon(payout.escrow_status)}
                          <span className="capitalize font-medium text-xs">{payout.escrow_status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getApprovalStatusColor(payout.employer_approval_status)} w-fit`}>
                          {payout.employer_approval_status === 'approved' && <CheckCircle className="w-4 h-4" />}
                          {payout.employer_approval_status === 'rejected' && <XCircle className="w-4 h-4" />}
                          {payout.employer_approval_status === 'pending' && <Clock className="w-4 h-4" />}
                          <span className="capitalize font-medium text-xs">{payout.employer_approval_status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(payout.status)} w-fit`}>
                          {getStatusIcon(payout.status)}
                          <span className="capitalize font-medium text-xs">{payout.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setExpandedId(expandedId === payout.id ? null : payout.id)}
                          className="text-xs"
                        >
                          {expandedId === payout.id ? 'Hide' : 'Show'} Details
                        </Button>
                      </td>
                    </tr>

                    {/* Expanded Details Row */}
                    {expandedId === payout.id && (
                      <tr className="bg-slate-50">
                        <td colSpan={7} className="px-6 py-4">
                          <div className="space-y-4">
                            {/* Workflow Status */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="bg-white p-4 rounded-lg border border-slate-200">
                                <p className="text-xs font-semibold text-slate-600 mb-2">ESCROW STATUS</p>
                                <p className="text-lg font-bold text-blue-600 capitalize">{payout.escrow_status}</p>
                                <p className="text-xs text-slate-500 mt-1">Money held in escrow</p>
                              </div>

                              <div className="bg-white p-4 rounded-lg border border-slate-200">
                                <p className="text-xs font-semibold text-slate-600 mb-2">EMPLOYER APPROVAL</p>
                                <p className="text-lg font-bold text-amber-600 capitalize">{payout.employer_approval_status}</p>
                                <p className="text-xs text-slate-500 mt-1">Awaiting work approval</p>
                              </div>

                              <div className="bg-white p-4 rounded-lg border border-slate-200">
                                <p className="text-xs font-semibold text-slate-600 mb-2">PAYOUT STATUS</p>
                                <p className="text-lg font-bold text-green-600 capitalize">{payout.status}</p>
                                <p className="text-xs text-slate-500 mt-1">Final payment status</p>
                              </div>
                            </div>

                            {/* Workflow Timeline */}
                            <div className="bg-white p-4 rounded-lg border border-slate-200">
                              <p className="text-sm font-semibold text-slate-900 mb-3">Workflow Timeline</p>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                  <span className="text-slate-600">Created: <span className="font-medium">{new Date(payout.created_at).toLocaleString()}</span></span>
                                </div>
                                {payout.employer_approval_status === 'approved' && (
                                  <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                                    <span className="text-slate-600">Employer Approved: <span className="font-medium">Pending release</span></span>
                                  </div>
                                )}
                                {payout.released_at && (
                                  <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                    <span className="text-slate-600">Released: <span className="font-medium">{new Date(payout.released_at).toLocaleString()}</span></span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Action Buttons */}
                            {payout.status === 'pending' && payout.employer_approval_status === 'approved' && payout.escrow_status === 'held' && (
                              <div className="bg-green-50 p-4 rounded-lg border border-green-200 space-y-3">
                                <p className="text-sm font-semibold text-green-900">Release Payment from Escrow</p>
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="Enter transaction ID"
                                    value={transactionId}
                                    onChange={(e) => setTransactionId(e.target.value)}
                                    className="flex-1"
                                  />
                                  <Button
                                    onClick={() => handleProcessPayout(payout.id)}
                                    disabled={processingId === payout.id}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                  >
                                    {processingId === payout.id ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <>
                                        <Unlock className="w-4 h-4 mr-2" />
                                        Release
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </div>
                            )}

                            {payout.status === 'pending' && (
                              <div className="bg-red-50 p-4 rounded-lg border border-red-200 space-y-3">
                                <p className="text-sm font-semibold text-red-900">Reject Payout</p>
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="Enter rejection reason (min 5 characters)"
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    className="flex-1"
                                  />
                                  <Button
                                    onClick={() => handleRejectPayout(payout.id)}
                                    disabled={rejectingId === payout.id}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                  >
                                    {rejectingId === payout.id ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <>
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Reject
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">
              Page {page} of {totalPages}
            </span>
          </div>
          <Button
            variant="outline"
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default PayoutsList;

import { useState, useEffect } from 'react'
import { Shield, CheckCircle, AlertTriangle } from 'lucide-react'
import { getReports, reviewReport as apiReviewReport } from '../api/index.js'
import { REPORTS as MOCK_REPORTS } from '../data/mockData'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function normalizeReport(r) {
  return {
    ...r,
    reporterName: r.reporterName ?? r.reporter?.display_name ?? 'Unknown',
    reportedName: r.reportedName ?? r.reported?.display_name ?? 'Unknown',
    eventArtist:  r.eventArtist  ?? r.events?.artist ?? null,
    createdAt:    r.createdAt    ?? r.created_at,
  }
}

export default function AdminReports() {
  const [reports, setReports] = useState(MOCK_REPORTS)
  const [loadingId, setLoadingId] = useState(null)
  const [filter, setFilter] = useState('unreviewed')

  useEffect(() => {
    getReports()
      .then(data => setReports(data.map(normalizeReport)))
      .catch(() => setReports(MOCK_REPORTS))
  }, [])

  const filtered = reports.filter(r =>
    filter === 'all' ? true : filter === 'unreviewed' ? !r.reviewed : r.reviewed
  )

  function markReviewed(id) {
    setLoadingId(id)
    setReports(prev => prev.map(r => r.id === id ? { ...r, reviewed: true } : r))
    apiReviewReport(id).catch(() => {}).finally(() => setLoadingId(null))
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <Shield size={20} className="text-brand-400" />
        <h1 className="page-title">Admin — Reports</h1>
      </div>
      <p className="text-sm text-gray-500 mb-5">Review and moderate user reports.</p>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {['unreviewed', 'reviewed', 'all'].map(tab => (
          <button key={tab} onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition ${
              filter === tab ? 'bg-brand-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}>
            {tab}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-500 self-center">
          {reports.filter(r => !r.reviewed).length} pending
        </span>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-500 py-16">No reports in this category.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map(report => (
            <div key={report.id} className={`card border ${report.reviewed ? 'border-gray-800 opacity-60' : 'border-yellow-900'}`}>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  {report.reviewed
                    ? <CheckCircle size={16} className="text-green-500 shrink-0" />
                    : <AlertTriangle size={16} className="text-yellow-500 shrink-0" />
                  }
                  <span className={`text-xs font-semibold uppercase ${report.reviewed ? 'text-green-500' : 'text-yellow-500'}`}>
                    {report.reviewed ? 'Reviewed' : 'Pending'}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{formatDate(report.createdAt)}</span>
              </div>

              <div className="flex flex-col gap-1.5 text-sm mb-3">
                <p><span className="text-gray-500">Reporter:</span> <span className="text-gray-200">{report.reporterName}</span></p>
                <p><span className="text-gray-500">Reported:</span> <span className="text-red-300 font-medium">{report.reportedName}</span></p>
                {report.eventArtist && (
                  <p><span className="text-gray-500">Event:</span> <span className="text-gray-200">{report.eventArtist}</span></p>
                )}
              </div>

              <div className="bg-gray-800 rounded-xl px-4 py-3 text-sm text-gray-300 mb-3">
                "{report.reason}"
              </div>

              {!report.reviewed && (
                <div className="flex gap-2">
                  <button
                    onClick={() => markReviewed(report.id)}
                    className="btn-primary flex-1 py-2 text-xs"
                  >
                    <CheckCircle size={14} /> Mark Reviewed
                  </button>
                  <button className="btn-secondary flex-1 py-2 text-xs text-red-400 border-red-800 hover:bg-red-900/20">
                    Suspend User
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

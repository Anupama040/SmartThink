import React, { useState } from 'react';
import { Database, PlusCircle, Search, Filter, Activity, Clock, FileText, UserCheck, ShieldAlert } from 'lucide-react';

export const QuestionBank = ({ showToast }) => {
    const [questions, setQuestions] = useState([
        { id: 1, text: "If A can do a work in 10 days and B in 15 days...", topic: "Time and Work", difficulty: "Medium", type: "Multiple Choice", status: "Approved" },
        { id: 2, text: "Find the odd one out: 3, 5, 11, 14, 17, 21", topic: "Number Series", difficulty: "Easy", type: "Multiple Choice", status: "Draft" },
        { id: 3, text: "Write a function to reverse a linked list.", topic: "Data Structures", difficulty: "Hard", type: "Coding", status: "Approved" }
    ]);

    const deleteQ = (id) => {
        setQuestions(questions.filter(q => q.id !== id));
        showToast("Question successfully deleted from the bank.");
    };

    return (
        <div className="relative z-10 animate-fade-in max-w-6xl mx-auto">
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-bold tracking-tight mb-2">Question Bank</h2>
                    <p className="text-muted text-lg">Curate and manage assessment questions across all topics.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => showToast('Opened advanced filter menu')} className="px-4 py-2 bg-surface hover:bg-surface-hover text-primary rounded-lg text-sm font-medium border border-border flex items-center gap-2">
                        <Filter className="w-4 h-4" /> Filters
                    </button>
                    <button onClick={() => showToast('Opening Question Editor...')} className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold flex items-center gap-2">
                        <PlusCircle className="w-4 h-4" /> Add Question
                    </button>
                </div>
            </header>
            
            <div className="bg-card border border-border rounded-3xl shadow-2xl overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-5 bg-surface-hover border-b border-border font-bold text-xs text-muted uppercase tracking-wider">
                    <div className="col-span-5">Question Preview</div>
                    <div className="col-span-2">Topic & Type</div>
                    <div className="col-span-2">Difficulty</div>
                    <div className="col-span-1">Status</div>
                    <div className="col-span-2 text-right">Actions</div>
                </div>
                <div className="divide-y divide-border/50">
                    {questions.map(q => (
                        <div key={q.id} className="grid grid-cols-12 gap-4 p-5 items-center hover:bg-surface-hover transition-colors">
                            <div className="col-span-5">
                                <p className="font-bold text-primary text-sm line-clamp-1">{q.text}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-xs text-primary font-bold">{q.topic}</p>
                                <p className="text-[10px] text-muted">{q.type}</p>
                            </div>
                            <div className="col-span-2">
                                <span className={`px-2 py-1 text-[10px] font-bold rounded ${q.difficulty === 'Hard' ? 'bg-red-500/10 text-red-400' : q.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'}`}>{q.difficulty}</span>
                            </div>
                            <div className="col-span-1">
                                <span className="text-xs font-bold text-muted">{q.status}</span>
                            </div>
                            <div className="col-span-2 flex justify-end gap-3">
                                <button onClick={() => showToast(`Editing question ${q.id}...`)} className="text-blue-400 hover:text-blue-300 text-xs font-bold transition-colors">Edit</button>
                                <button onClick={() => deleteQ(q.id)} className="text-red-400 hover:text-red-300 text-xs font-bold transition-colors">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const ReportsAnalytics = ({ showToast, analytics }) => {
    // Use data from backend if available, otherwise fallback to empty/defaults
    const candidates = analytics?.topCandidates || [];
    const usageTrendsRaw = analytics?.usageTrends || [0,0,0,0,0,0,0];
    
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const usageTrends = usageTrendsRaw.map((usage, i) => ({
        day: days[i],
        usage: usage + 'k',
        raw: usage
    }));

    // Find max value to scale the bars properly. Fallback to 100 if all 0
    const maxUsage = Math.max(...usageTrendsRaw, 100);

    const exportAnalyticsCSV = () => {
        let csvContent = "Top Performing Candidates\nName,Test,Score\n";
        csvContent += candidates.map(c => `"${c.name}","${c.test}","${c.score}"`).join('\n');
        
        csvContent += "\n\nPlatform Usage Trends\nDay,Usage\n";
        csvContent += usageTrends.map(t => `"${t.day}","${t.usage}"`).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'analytics_report.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showToast('Exporting full analytics report to CSV...');
    };

    return (
        <div className="relative z-10 animate-fade-in max-w-6xl mx-auto">
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-bold tracking-tight mb-2">Reports & Analytics</h2>
                    <p className="text-muted text-lg">Detailed insights into candidate performance and content effectiveness.</p>
                </div>
                <button onClick={exportAnalyticsCSV} className="px-4 py-2 bg-surface hover:bg-surface-hover border border-border text-primary rounded-lg text-sm font-bold transition-colors">
                    Export to CSV
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-card border border-border p-6 rounded-3xl shadow-xl">
                    <h3 className="font-bold text-primary mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-indigo-400" /> Platform Usage Trends</h3>
                    <div className="h-48 flex items-end gap-2 px-2 pb-2">
                        {usageTrends.map((t, i) => {
                            const heightPercent = maxUsage === 0 ? 0 : Math.round((t.raw / maxUsage) * 100);
                            return (
                                <div key={i} className="flex-1 bg-indigo-500/20 hover:bg-indigo-500/40 border border-indigo-500/50 rounded-t-sm transition-colors relative group" style={{ height: `${Math.max(heightPercent, 5)}%` }}>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] py-1 px-2 rounded hidden group-hover:block">{t.usage}</div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex justify-between text-xs text-muted mt-2 px-2">
                        {days.map((d, i) => <span key={i}>{d}</span>)}
                    </div>
                </div>
                
                <div className="bg-card border border-border p-6 rounded-3xl shadow-xl">
                    <h3 className="font-bold text-primary mb-4 flex items-center gap-2"><UserCheck className="w-5 h-5 text-emerald-400" /> Top Performing Candidates</h3>
                    <div className="space-y-4">
                        {candidates.length === 0 ? (
                            <div className="text-center text-muted p-4">No candidate data available.</div>
                        ) : candidates.map((c, i) => (
                            <div key={i} className="flex justify-between items-center p-3 bg-surface rounded-xl">
                                <div>
                                    <p className="font-bold text-sm text-primary">{c.name}</p>
                                    <p className="text-[10px] text-muted uppercase">{c.test}</p>
                                </div>
                                <span className="text-emerald-400 font-black">{c.score}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const AuditLogs = ({ showToast }) => {
    return (
        <div className="relative z-10 animate-fade-in max-w-6xl mx-auto">
            <header className="mb-10">
                <h2 className="text-4xl font-bold tracking-tight mb-2">Audit & Roles</h2>
                <p className="text-muted text-lg">System-level event tracking and RBAC configuration.</p>
            </header>

            <div className="bg-card border border-border rounded-3xl p-6 shadow-xl mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-primary text-xl">System Audit Log</h3>
                    <button onClick={() => showToast('Exporting audit logs...')} className="text-sm font-bold text-indigo-400 hover:text-indigo-300">Download Log</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-muted">
                        <thead className="text-xs uppercase border-b border-border/50">
                            <tr>
                                <th className="py-3 px-4 font-bold">Timestamp</th>
                                <th className="py-3 px-4 font-bold">Admin ID</th>
                                <th className="py-3 px-4 font-bold">Action Taken</th>
                                <th className="py-3 px-4 font-bold">Target Resource</th>
                                <th className="py-3 px-4 font-bold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {[
                                { t: '2026-06-18 10:42:01', id: 'admin@smartthink.com', act: 'UPDATE_SETTINGS', res: 'System Config', st: 'SUCCESS' },
                                { t: '2026-06-18 09:15:22', id: 'mod@smartthink.com', act: 'DELETE_POST', res: 'ForumPost#492', st: 'SUCCESS' },
                                { t: '2026-06-17 14:30:00', id: 'admin@smartthink.com', act: 'CREATE_TEST', res: 'MockTest#12', st: 'SUCCESS' },
                                { t: '2026-06-17 11:05:40', id: 'unknown_ip', act: 'ADMIN_LOGIN', res: 'AuthService', st: 'FAILED' }
                            ].map((log, i) => (
                                <tr key={i} className="hover:bg-surface-hover transition-colors">
                                    <td className="py-3 px-4 font-mono text-xs">{log.t}</td>
                                    <td className="py-3 px-4">{log.id}</td>
                                    <td className="py-3 px-4 font-bold text-primary">{log.act}</td>
                                    <td className="py-3 px-4 text-xs">{log.res}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 text-[10px] font-bold rounded ${log.st === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>{log.st}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

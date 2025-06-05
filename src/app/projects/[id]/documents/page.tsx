"use client";
import { fakeProjectDocument1, fakeProjectDocument2 } from '@/types/project-document';

const documents = [fakeProjectDocument1, fakeProjectDocument2];

export default function DocumentsPage() {
    return (
        <div className="min-h-screen bg-background/80">
            <div className="container mx-auto px-4 py-20">
                <h1 className="text-4xl font-bold tracking-tight mb-4">Documents</h1>
                {documents.length === 0 ? (
                    <p className="text-muted-foreground text-lg">No documents yet. Upload or add documents for this project here.</p>
                ) : (
                    <div className="overflow-x-auto rounded-lg border bg-card">
                        <table className="min-w-full divide-y divide-border">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">File Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Uploaded At</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Link</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {documents.map((doc) => (
                                    <tr key={doc.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{doc.fileName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">{doc.financialDocumentType.replace('_', ' ')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{doc.uploadedAt.toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">View</a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
} 
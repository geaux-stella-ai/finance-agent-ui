"use client";
import { useState } from 'react';
import { fakeProjectDocument1, fakeProjectDocument2, FinancialDocumentType, FileFormat, ProjectDocument } from '@/types/project-document';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

const documentsInitial = [fakeProjectDocument1, fakeProjectDocument2];
const financialTypes: FinancialDocumentType[] = ['balance_sheet', 'income_statement'];

export default function DocumentsPage() {
    const router = useRouter();
    const [documents, setDocuments] = useState<ProjectDocument[]>(documentsInitial);
    const [file, setFile] = useState<File | null>(null);
    const [financialType, setFinancialType] = useState<FinancialDocumentType>('balance_sheet');
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [showOverrideDialog, setShowOverrideDialog] = useState(false);
    const [pendingDoc, setPendingDoc] = useState<{ file: File; financialType: FinancialDocumentType } | null>(null);
    const [mainDialogOpen, setMainDialogOpen] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFinancialType(e.target.value as FinancialDocumentType);
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!file) {
            setError('Please select a file.');
            return;
        }
        // Check for file name conflict
        if (documents.some(doc => doc.fileName === file.name)) {
            setPendingDoc({ file, financialType });
            setShowOverrideDialog(true);
            return;
        }
        await doUpload(file, financialType, false);
    };

    const doUpload = async (file: File, financialType: FinancialDocumentType, override: boolean) => {
        setUploading(true);
        setTimeout(() => {
            const fileFormat = file.name.endsWith('.xlsx') ? 'xlsx' : 'csv';
            const newDoc: ProjectDocument = {
                id: crypto.randomUUID(),
                fileName: file.name,
                fileFormat: fileFormat as FileFormat,
                financialDocumentType: financialType,
                url: URL.createObjectURL(file), // For demo only
                uploadedAt: new Date(),
            };
            setDocuments(prev => {
                if (override) {
                    // Replace the document with the same fileName
                    return [newDoc, ...prev.filter(doc => doc.fileName !== file.name)];
                } else {
                    return [newDoc, ...prev];
                }
            });
            setFile(null);
            setUploading(false);
            setMainDialogOpen(false);
        }, 1000);
    };

    const handleOverride = async () => {
        if (pendingDoc) {
            await doUpload(pendingDoc.file, pendingDoc.financialType, true);
            setShowOverrideDialog(false);
            setPendingDoc(null);
        }
    };

    const handleCancelOverride = () => {
        setShowOverrideDialog(false);
        setPendingDoc(null);
    };

    return (
        <div className="min-h-screen bg-background/80">
            <div className="container mx-auto px-4 py-20">
                <button
                    className="mb-6 bg-muted text-foreground px-4 py-2 rounded-lg font-medium hover:bg-accent border flex items-center gap-2"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>
                <h1 className="text-4xl font-bold tracking-tight mb-4">Documents</h1>
                <Dialog open={mainDialogOpen} onOpenChange={setMainDialogOpen}>
                    <DialogTrigger asChild>
                        <button
                            className="mb-8 bg-primary text-background px-6 py-2 rounded-lg font-medium hover:bg-primary/80 disabled:opacity-50"
                        >
                            Upload
                        </button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader className="mb-4">
                            <DialogTitle>Upload Document</DialogTitle>
                        </DialogHeader>
                        <form className="flex flex-col gap-4" onSubmit={handleUpload}>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-background hover:file:bg-primary/80"
                                accept=".csv,.xlsx"
                                disabled={uploading}
                            />
                            <select
                                value={financialType}
                                onChange={handleTypeChange}
                                className="rounded-lg border px-3 py-2 text-sm bg-background"
                                disabled={uploading}
                            >
                                {financialTypes.map(type => (
                                    <option key={type} value={type}>{type.replace('_', ' ')}</option>
                                ))}
                            </select>
                            {error && <div className="text-destructive font-medium">{error}</div>}
                            <div className="flex justify-end gap-2">
                                <DialogClose asChild>
                                    <button
                                        type="button"
                                        className="px-4 py-2 rounded-lg border bg-muted text-muted-foreground hover:bg-accent"
                                        disabled={uploading}
                                    >
                                        Cancel
                                    </button>
                                </DialogClose>
                                <button
                                    type="submit"
                                    className="bg-primary text-background px-6 py-2 rounded-lg font-medium hover:bg-primary/80 disabled:opacity-50"
                                    disabled={uploading}
                                >
                                    {uploading ? 'Uploading...' : 'Upload'}
                                </button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
                {/* Override confirmation dialog */}
                <Dialog open={showOverrideDialog} onOpenChange={setShowOverrideDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>File Name Conflict</DialogTitle>
                        </DialogHeader>
                        <div className="mb-4">A document with this file name already exists. Do you want to override it?</div>
                        <div className="flex justify-end gap-2">
                            <button
                                className="px-4 py-2 rounded-lg border bg-muted text-muted-foreground hover:bg-accent"
                                onClick={handleCancelOverride}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-primary text-background px-6 py-2 rounded-lg font-medium hover:bg-primary/80"
                                onClick={handleOverride}
                            >
                                Override
                            </button>
                        </div>
                    </DialogContent>
                </Dialog>
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
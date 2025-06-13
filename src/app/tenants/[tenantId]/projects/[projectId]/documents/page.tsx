"use client";
import { useState, useEffect } from 'react';
import { TabularDocumentType, ProjectDocument } from '@/types/project-document';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose
} from '@/components/ui/dialog';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import apiClient from '@/lib/api-client';

const documentTypes: TabularDocumentType[] = ['balance_sheet', 'income_statement'];

export default function DocumentsPage() {
    const router = useRouter();
    const params = useParams();
    const [documents, setDocuments] = useState<ProjectDocument[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [documentType, setDocumentType] = useState<TabularDocumentType>('balance_sheet');
    const [company, setCompany] = useState('');
    const [annotation, setAnnotation] = useState('');
    const [documentName, setDocumentName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [showOverrideDialog, setShowOverrideDialog] = useState(false);
    const [pendingDoc, setPendingDoc] = useState<{ file: File; type: TabularDocumentType; company: string; annotation?: string } | null>(null);
    const [mainDialogOpen, setMainDialogOpen] = useState(false);
    const [nextToken, setNextToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async (token?: string) => {
        setLoading(true);
        try {
            const response = await apiClient.get(
                `/api/v1/tenants/${params.tenantId}/projects/${params.projectId}/tabular_documents`,
                {
                    params: token ? { next_token: token } : undefined
                }
            );
            if (!token) {
                setDocuments(response.data.items);
            } else {
                setDocuments(prev => [...prev, ...response.data.items]);
            }
            setNextToken(response.data.next_token);
        } catch (error) {
            setError('Failed to fetch documents. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const loadMore = () => {
        if (!loading && nextToken) {
            fetchDocuments(nextToken);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        const name = e.target.value.toLowerCase();
        if (name.length >= 20) {
            setError('Name must be less than 20 characters.');
            return;
        }
        if (!/^[a-z0-9 ]*$/.test(name)) {
            setError('Name must contain only lowercase English letters, numbers, and spaces.');
            return;
        }
        setDocumentName(name);
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDocumentType(e.target.value as TabularDocumentType);
    };

    const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCompany(e.target.value);
    };

    const handleAnnotationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setAnnotation(e.target.value);
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!file) {
            setError('Please select a file.');
            return;
        }
        if (!company) {
            setError('Please enter a company name.');
            return;
        }
        if (!documentName) {
            setError('Please enter a document name.');
            return;
        }

        // Check for name conflict
        if (documents.some(doc => doc.name === documentName)) {
            setPendingDoc({ file, type: documentType, company, annotation });
            setShowOverrideDialog(true);
            return;
        }
        await doUpload(file, documentType, company, annotation, false);
    };

    const doUpload = async (file: File, type: TabularDocumentType, company: string, annotation: string, override: boolean) => {
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('name', documentName);
            formData.append('type', type);
            formData.append('company', company);
            if (annotation) {
                formData.append('annotation', annotation);
            }

            const response = await apiClient.post(
                `/api/v1/tenants/${params.tenantId}/projects/${params.projectId}/tabular_documents`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            // check response
            if (response.status !== 201) {
                console.error(response.data);
                throw new Error('Failed to upload document. Please try again.');
            }

            await fetchDocuments(); // Refresh the documents list
            setFile(null);
            setDocumentName('');
            setCompany('');
            setAnnotation('');
            setUploading(false);
            setMainDialogOpen(false);
        } catch (error: any) {
            console.error('Upload error:', error);
            if (error.response?.data?.detail) {
                setError(error.response.data.detail);
            } else {
                setError('Failed to upload document. Please try again.');
            }
            setUploading(false);
        }
    };

    const handleOverride = async () => {
        if (pendingDoc) {
            await doUpload(pendingDoc.file, pendingDoc.type, pendingDoc.company, pendingDoc.annotation || '', true);
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
                            <input
                                type="text"
                                value={documentName}
                                onChange={handleNameChange}
                                placeholder="Document Name"
                                className="rounded-lg border px-3 py-2 text-sm bg-background"
                                disabled={uploading}
                                required
                            />
                            <input
                                type="text"
                                value={company}
                                onChange={handleCompanyChange}
                                placeholder="Company Name"
                                className="rounded-lg border px-3 py-2 text-sm bg-background"
                                disabled={uploading}
                                required
                            />
                            <select
                                value={documentType}
                                onChange={handleTypeChange}
                                className="rounded-lg border px-3 py-2 text-sm bg-background"
                                disabled={uploading}
                            >
                                {documentTypes.map(type => (
                                    <option key={type} value={type}>{type.replace('_', ' ')}</option>
                                ))}
                            </select>
                            <textarea
                                value={annotation}
                                onChange={handleAnnotationChange}
                                placeholder="Annotation (optional)"
                                className="rounded-lg border px-3 py-2 text-sm bg-background"
                                disabled={uploading}
                                rows={3}
                            />
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
                    <>
                        <div className="overflow-x-auto rounded-lg border bg-card">
                            <table className="min-w-full divide-y divide-border">
                                <thead className="bg-muted">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Company</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Uploaded At</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Size</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {documents.map((doc) => (
                                        <tr key={doc.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{doc.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">{doc.type.replace('_', ' ')}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">{doc.company}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(doc.created_at).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">{(doc.file_size_byte / 1024).toFixed(1)} KB</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {nextToken && (
                            <div className="mt-4 flex justify-center">
                                <button
                                    onClick={loadMore}
                                    disabled={loading}
                                    className="px-4 py-2 rounded-lg border bg-muted text-muted-foreground hover:bg-accent disabled:opacity-50"
                                >
                                    {loading ? 'Loading...' : 'Load More'}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
} 
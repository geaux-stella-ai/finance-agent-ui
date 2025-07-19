"use client";
import { useState, useEffect } from 'react';
import { TabularDocumentType, ProjectDocument } from '@/types/project-document';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
    DialogFooter,
} from '@/components/ui/dialog';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Trash2, ChevronDown, ChevronRight, Table } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { fetchTables, fetchTableData, TableInfo } from '@/lib/api/tables';
import { DataTable, TableData } from '@/components/data-table/DataTable';

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
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [documentToDelete, setDocumentToDelete] = useState<ProjectDocument | null>(null);
    const [deleting, setDeleting] = useState(false);

    // Table-related state
    const [tables, setTables] = useState<TableInfo[]>([]);
    const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
    const [tableData, setTableData] = useState<TableData | null>(null);
    const [loadingTables, setLoadingTables] = useState(false);
    const [loadingTableData, setLoadingTableData] = useState(false);
    const [tableError, setTableError] = useState<string | null>(null);
    const [tablesExpanded, setTablesExpanded] = useState(false);

    useEffect(() => {
        fetchDocuments();
        loadTables();
    }, []);

    const loadTables = async () => {
        setLoadingTables(true);
        setTableError(null);
        try {
            const tableList = await fetchTables(
                params.tenantId as string,
                params.projectId as string
            );
            setTables(tableList);
            // Auto-expand if tables are found
            if (tableList.length > 0) {
                setTablesExpanded(true);
            }
        } catch (error) {
            console.error('Error loading tables:', error);
            setTableError('Failed to load tables');
        } finally {
            setLoadingTables(false);
        }
    };

    const handleViewTable = async (tableId: string) => {
        // If clicking the same table that's already selected, hide it
        if (selectedTableId === tableId && tableData) {
            setSelectedTableId(null);
            setTableData(null);
            return;
        }

        setSelectedTableId(tableId);
        setLoadingTableData(true);
        setTableError(null);

        try {
            const data = await fetchTableData(
                params.tenantId as string,
                params.projectId as string,
                tableId
            );
            setTableData(data);
        } catch (error) {
            console.error('Error loading table data:', error);
            setTableError('Failed to load table data');
            setTableData(null);
        } finally {
            setLoadingTableData(false);
        }
    };

    const toggleTablesSection = () => {
        setTablesExpanded(!tablesExpanded);
    };

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
            await loadTables(); // Refresh the tables list
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

    const handleDeleteClick = (document: ProjectDocument) => {
        setDocumentToDelete(document);
        setDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!documentToDelete) return;

        setDeleting(true);
        try {
            await apiClient.delete(
                `/api/v1/tenants/${params.tenantId}/projects/${params.projectId}/tabular_documents/${documentToDelete.id}`
            );
            await fetchDocuments(); // Refresh the list
            setDeleteDialogOpen(false);
            setDocumentToDelete(null);
        } catch (error: any) {
            console.error('Delete error:', error);
            if (error.response?.data?.detail) {
                setError(error.response.data.detail);
            } else {
                setError('Failed to delete document. Please try again.');
            }
        } finally {
            setDeleting(false);
        }
    };

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
        setDocumentToDelete(null);
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
                {/* Document List */}
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
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Actions</th>
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
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDeleteClick(doc)}
                                                    className="text-destructive hover:text-destructive/80"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </td>
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

                {/* Data Tables Section */}
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={toggleTablesSection}
                                className="flex items-center gap-2 text-2xl font-bold tracking-tight hover:text-primary transition-colors"
                            >
                                {tablesExpanded ? (
                                    <ChevronDown className="w-6 h-6" />
                                ) : (
                                    <ChevronRight className="w-6 h-6" />
                                )}
                                Data Tables
                            </button>
                            {tables.length > 0 && (
                                <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm font-medium">
                                    {tables.length}
                                </span>
                            )}
                        </div>
                        {loadingTables && (
                            <div className="text-sm text-muted-foreground">Loading tables...</div>
                        )}
                    </div>

                    {tablesExpanded && (
                        <div className="space-y-4">
                            {tableError && (
                                <div className="text-destructive font-medium bg-destructive/10 p-3 rounded-lg">
                                    {tableError}
                                </div>
                            )}

                            {tables.length === 0 && !loadingTables ? (
                                <div className="text-muted-foreground bg-muted/50 p-8 rounded-lg text-center">
                                    <Table className="w-12 h-12 mx-auto mb-3 text-muted-foreground/60" />
                                    <p className="text-lg">No data tables found</p>
                                    <p className="text-sm">Upload documents to generate data tables automatically</p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        {tables.map((table) => (
                                            <div key={table.table_id} className="border rounded-lg p-4 bg-card">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h3 className="font-medium">{table.table_name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
                                                    <span className={`text-xs px-2 py-1 rounded-full ${table.source === 'user_upload'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-green-100 text-green-800'
                                                        }`}>
                                                        {table.source.replace('_', ' ')}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-3">
                                                    {table.row_count} rows • {table.column_count} columns
                                                </p>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleViewTable(table.table_id)}
                                                    disabled={loadingTableData && selectedTableId === table.table_id}
                                                    className="w-full"
                                                    variant={selectedTableId === table.table_id && tableData ? "destructive" : "outline"}
                                                >
                                                    {loadingTableData && selectedTableId === table.table_id
                                                        ? 'Loading...'
                                                        : selectedTableId === table.table_id && tableData
                                                            ? 'Hide Table'
                                                            : 'View Table'
                                                    }
                                                </Button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Table Data Display */}
                                    {tableData && (
                                        <div className="mt-6">
                                            <DataTable data={tableData} />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Document</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        Are you sure you want to delete "{documentToDelete?.name}"? This action cannot be undone.
                    </p>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={handleCancelDelete}
                            disabled={deleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            {deleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
} 
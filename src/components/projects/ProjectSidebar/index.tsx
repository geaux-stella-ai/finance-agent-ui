'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Associate, generateSampleAssociate } from '@/types/associate';

const ProjectSidebar = () => {
    const router = useRouter();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [associates, setAssociates] = useState<Associate[]>([]);

    useEffect(() => {
        // Generate sample associates
        const sampleAssociates = Array.from({ length: 3 }, (_, i) =>
            generateSampleAssociate((i + 1).toString())
        );
        setAssociates(sampleAssociates);
    }, []);

    return (
        <motion.aside
            className="relative flex h-screen shrink-0 grow-0 flex-col overflow-hidden px-2 py-3 font-dmmono"
            initial={{ width: '16rem' }}
            animate={{ width: isCollapsed ? '2.5rem' : '16rem' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
            <motion.button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute right-2 top-2 z-10 p-1"
                aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                type="button"
                whileTap={{ scale: 0.95 }}
            >
                <Icon
                    type="sheet"
                    size="xs"
                    className={`transform ${isCollapsed ? 'rotate-180' : 'rotate-0'}`}
                />
            </motion.button>

            <motion.div
                className="w-60 space-y-5"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isCollapsed ? 0 : 1, x: isCollapsed ? -20 : 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                style={{
                    pointerEvents: isCollapsed ? 'none' : 'auto'
                }}
            >
                <div className="space-y-2">
                    <div className="text-xs font-medium uppercase text-primary">Team</div>
                    <div className="space-y-2">
                        {associates.map((associate) => (
                            <div
                                key={associate.id}
                                className="flex flex-col gap-1 rounded-lg border border-primary/15 bg-accent p-3"
                            >
                                <div className="text-sm font-medium">{associate.name}</div>
                                <div className="text-xs text-muted-foreground">
                                    {associate.specialization}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </motion.aside>
    );
};

export default ProjectSidebar; 
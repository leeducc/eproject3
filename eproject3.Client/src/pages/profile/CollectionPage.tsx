// pages/profile/CollectionPage.tsx

import {
    GetCollections,
    CreateCollection,
    GetCollectionItems,
    RemoveFromCollection,
    DeleteCollection,
    CollectionDto,
    CollectionItemDto
} from "@/dtos";
import { toast } from "react-toastify";
import { Trash2, Search, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { client } from "@/gateway";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function CollectionPage() {
    // confirmation state
    const [confirmCol, setConfirmCol] = useState<CollectionDto | null>(null);

    // after confirming delete
    const confirmDelete = async () => {
        if (!confirmCol) return;
        try {
            await client.delete(new DeleteCollection({ id: confirmCol.id }));
            toast.success(`Collection “${confirmCol.name}” deleted`);
            await loadCollections();
        } catch {
            toast.error("Failed to delete collection");
        } finally {
            setConfirmCol(null);
        }
    };

    const [collections, setCollections]     = useState<CollectionDto[]>([]);
    const [filtered,    setFiltered]        = useState<CollectionDto[]>([]);
    const [searchTerm,  setSearchTerm]      = useState("");
    const [filterPrefix,setFilterPrefix]    = useState("All");
    const [newName,     setNewName]         = useState("");
    const [itemsById,   setItemsById]       = useState<Record<number,CollectionItemDto[]>>({});
    const [loadingCols, setLoadingCols]     = useState(true);
    const [loadingItems,setLoadingItems]    = useState<Record<number,boolean>>({});

    const builtIns = ["Favorites","Look Again"];

    // fetch
    const loadCollections = async () => {
        setLoadingCols(true);
        try {
            const res = await client.get(new GetCollections());
            setCollections(res.collections);
            setFiltered(res.collections);
        } finally {
            setLoadingCols(false);
        }
    };

    useEffect(() => { loadCollections(); }, []);

    // create
    const handleCreate = async () => {
        if (!newName.trim()) return;
        try {
            await client.post(new CreateCollection({ name: newName }));
            toast.success(`Collection “${newName}” created`);
            setNewName("");
            loadCollections();
        } catch {
            toast.error("Failed to create collection");
        }
    };

    // filter
    useEffect(() => {
        let cols = collections;
        if (searchTerm) cols = cols.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
        if (filterPrefix !== "All") cols = cols.filter(c => c.name.startsWith(filterPrefix));
        setFiltered(cols);
    }, [searchTerm, filterPrefix, collections]);

    // load items
    const loadItems = async (col: CollectionDto) => {
        if (itemsById[col.id]) return;
        setLoadingItems(prev => ({ ...prev, [col.id]: true }));
        try {
            const res = await client.get(new GetCollectionItems({ name: col.name }));
            setItemsById(prev => ({ ...prev, [col.id]: res.items }));
        } catch {
        } finally {
            setLoadingItems(prev => ({ ...prev, [col.id]: false }));
        }
    };

    // remove item
    const handleRemove = async (col: CollectionDto, pid: number) => {
        if (builtIns.includes(col.name)) return;
        try {
            await client.delete(new RemoveFromCollection({ name: col.name, productId: pid }));
            setItemsById(prev => ({
                ...prev,
                [col.id]: prev[col.id].filter(i => i.productId !== pid)
            }));
        } catch {}
    };

    if (loadingCols) return <div className="py-10 text-center">Loading…</div>;

    return (
        <>
            <div className="p-4">
                <div className="flex flex-wrap gap-2 mb-6 items-center">
                    <Search className="w-5 h-5 text-gray-500" />
                    <input placeholder="Search collections..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} className="flex-1 border rounded px-2 py-1 min-w-[150px]"/>
                    <Filter className="w-5 h-5 text-gray-500" />
                    <select value={filterPrefix} onChange={e=>setFilterPrefix(e.target.value)} className="border rounded px-2 py-1">
                        <option>All</option><option>F</option><option>L</option>
                    </select>
                    <input placeholder="New collection" value={newName} onChange={e=>setNewName(e.target.value)} className="border rounded px-2 py-1 min-w-[150px]"/>
                    <button onClick={handleCreate} className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700">Create</button>
                </div>
                <div className="space-y-8">
                    {filtered.map(col=> (
                        <div key={col.id} className="bg-white shadow rounded p-4" onMouseEnter={()=>loadItems(col)}>
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-xl font-semibold">{col.name}</h3>
                                {!builtIns.includes(col.name) && (
                                    <button onClick={()=>setConfirmCol(col)} className="text-red-600 hover:text-red-800"><Trash2 className="w-5 h-5"/></button>
                                )}
                            </div>
                            <div className="flex overflow-x-auto gap-4">
                                {loadingItems[col.id] ? <div>Loading...</div> : (itemsById[col.id]||[]).map(item=> (
                                    <div key={item.productId} className="min-w-[180px] bg-gray-50 rounded p-2 flex-shrink-0">
                                        <Link to={`/product/${item.productId}`}><img src={`https://localhost:5001/${item.image}`} alt={item.title} className="h-32 w-full object-cover rounded"/><p className="mt-2 text-sm font-medium">{item.title}</p></Link>
                                        {!builtIns.includes(col.name) && (<button onClick={()=>handleRemove(col,item.productId)} className="mt-1 text-red-600 hover:text-red-800 flex items-center"><Trash2 className="w-4 h-4 mr-1"/>Remove</button>)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Dialog open={!!confirmCol} onOpenChange={()=>setConfirmCol(null)}>
                <DialogContent>
                    <DialogHeader>Confirm Deletion</DialogHeader>
                    <p className="py-4">Deleting “{confirmCol?.name}” will remove the collection and all its items.</p>
                    <DialogFooter className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={()=>setConfirmCol(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

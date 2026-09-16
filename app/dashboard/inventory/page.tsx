"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Modal } from "@/components/dashboard/modal";
import { StatusPill } from "@/components/dashboard/status-pill";
import { DashboardField, dashboardInputClass } from "@/components/dashboard/form-field";
import { useLocalStorage } from "@/lib/use-local-storage";
import { seedInventory, type InventoryItem, type InventoryStatus } from "@/lib/dashboard-data";
import { fadeUp, staggerContainer } from "@/lib/motion";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const STATUS_OPTIONS: InventoryStatus[] = ["Available", "Reserved", "Sold"];

const STATUS_TONE: Record<InventoryStatus, "green" | "amber" | "slate"> = {
  Available: "green",
  Reserved: "amber",
  Sold: "slate",
};

type DraftVehicle = {
  make: string;
  model: string;
  trim: string;
  year: string;
  price: string;
  mileage: string;
  status: InventoryStatus;
  image: string;
};

const EMPTY_DRAFT: DraftVehicle = {
  make: "",
  model: "",
  trim: "",
  year: String(new Date().getFullYear()),
  price: "",
  mileage: "",
  status: "Available",
  image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80",
};

function toDraft(item: InventoryItem): DraftVehicle {
  return {
    make: item.make,
    model: item.model,
    trim: item.trim,
    year: String(item.year),
    price: String(item.price),
    mileage: String(item.mileage),
    status: item.status,
    image: item.image,
  };
}

export default function InventoryPage() {
  const [inventory, setInventory] = useLocalStorage("dt_inventory", seedInventory);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<InventoryStatus | "All">("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftVehicle>(EMPTY_DRAFT);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return inventory.filter((item) => {
      const matchesSearch = `${item.make} ${item.model} ${item.trim}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [inventory, search, statusFilter]);

  const openAddModal = () => {
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
    setModalOpen(true);
  };

  const openEditModal = (item: InventoryItem) => {
    setEditingId(item.id);
    setDraft(toDraft(item));
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!draft.make.trim() || !draft.model.trim() || !draft.price.trim()) return;

    if (editingId) {
      setInventory((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                make: draft.make.trim(),
                model: draft.model.trim(),
                trim: draft.trim.trim(),
                year: Number(draft.year) || item.year,
                price: Number(draft.price) || item.price,
                mileage: Number(draft.mileage) || item.mileage,
                status: draft.status,
                image: draft.image.trim() || item.image,
              }
            : item,
        ),
      );
    } else {
      const newItem: InventoryItem = {
        id: `vehicle-${Date.now()}`,
        make: draft.make.trim(),
        model: draft.model.trim(),
        trim: draft.trim.trim() || "Base",
        year: Number(draft.year) || new Date().getFullYear(),
        price: Number(draft.price) || 0,
        mileage: Number(draft.mileage) || 0,
        transmission: "Automatic",
        fuelType: "Gasoline",
        bodyType: "Sedan",
        color: "Jet Black",
        colorHex: "#0a0a0b",
        status: draft.status,
        image: draft.image.trim() || EMPTY_DRAFT.image,
      };
      setInventory((prev) => [newItem, ...prev]);
    }

    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id);
      return;
    }
    setInventory((prev) => prev.filter((item) => item.id !== id));
    setConfirmDeleteId(null);
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Inventory</h1>
          <p className="mt-1 text-sm text-slate-500">{inventory.length} vehicles on the lot.</p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="flex h-11 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          <Plus size={16} />
          Add Vehicle
        </button>
      </div>

      <motion.div variants={fadeUp} className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search make, model, or trim"
            className={`${dashboardInputClass} pl-10`}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as InventoryStatus | "All")}
          className={`${dashboardInputClass} sm:w-48`}
        >
          <option value="All">All statuses</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </motion.div>

      <motion.div variants={fadeUp} className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs font-medium uppercase tracking-wide text-slate-500">
              <th className="px-5 py-3">Vehicle</th>
              <th className="px-5 py-3">Year</th>
              <th className="px-5 py-3">Mileage</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((item) => (
              <tr key={item.id}>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      <Image src={item.image} alt={`${item.make} ${item.model}`} fill sizes="56px" className="object-cover" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{item.make} {item.model}</p>
                      <p className="text-xs text-slate-500">{item.trim}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-slate-600">{item.year}</td>
                <td className="px-5 py-3 text-slate-600">{item.mileage.toLocaleString()} km</td>
                <td className="px-5 py-3 text-slate-600">{currency.format(item.price)}</td>
                <td className="px-5 py-3">
                  <StatusPill label={item.status} tone={STATUS_TONE[item.status]} />
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      aria-label="Edit vehicle"
                      onClick={() => openEditModal(item)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      aria-label="Delete vehicle"
                      onClick={() => handleDelete(item.id)}
                      className={`flex h-8 items-center justify-center rounded-lg px-2 text-xs font-medium transition-colors ${
                        confirmDeleteId === item.id
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : "text-slate-500 hover:bg-red-50 hover:text-red-600"
                      }`}
                    >
                      {confirmDeleteId === item.id ? "Confirm?" : <Trash2 size={15} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Vehicle" : "Add Vehicle"}>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <DashboardField label="Make">
              <input value={draft.make} onChange={(e) => setDraft((d) => ({ ...d, make: e.target.value }))} className={dashboardInputClass} />
            </DashboardField>
            <DashboardField label="Model">
              <input value={draft.model} onChange={(e) => setDraft((d) => ({ ...d, model: e.target.value }))} className={dashboardInputClass} />
            </DashboardField>
          </div>
          <DashboardField label="Trim">
            <input value={draft.trim} onChange={(e) => setDraft((d) => ({ ...d, trim: e.target.value }))} className={dashboardInputClass} />
          </DashboardField>
          <div className="grid grid-cols-3 gap-4">
            <DashboardField label="Year">
              <input type="number" value={draft.year} onChange={(e) => setDraft((d) => ({ ...d, year: e.target.value }))} className={dashboardInputClass} />
            </DashboardField>
            <DashboardField label="Price">
              <input type="number" value={draft.price} onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))} className={dashboardInputClass} />
            </DashboardField>
            <DashboardField label="Mileage">
              <input type="number" value={draft.mileage} onChange={(e) => setDraft((d) => ({ ...d, mileage: e.target.value }))} className={dashboardInputClass} />
            </DashboardField>
          </div>
          <DashboardField label="Status">
            <select value={draft.status} onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value as InventoryStatus }))} className={dashboardInputClass}>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </DashboardField>
          <DashboardField label="Image URL">
            <input value={draft.image} onChange={(e) => setDraft((d) => ({ ...d, image: e.target.value }))} className={dashboardInputClass} />
          </DashboardField>
          <button
            type="button"
            onClick={handleSave}
            className="mt-2 flex h-11 items-center justify-center rounded-xl bg-indigo-600 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            {editingId ? "Save Changes" : "Add Vehicle"}
          </button>
        </div>
      </Modal>
    </motion.div>
  );
}

"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import type { IngredientRecord as Ingredient, NutritionBasis, UnitConversion } from "@/app/data/models/ingredient";

type FormState = Omit<Ingredient, "_id">;

const defaultForm = (): FormState => ({
  name: "",
  brand: "",
  category: "",
  nutritionBasis: "raw",
  kcalPer1g: 0,
  proteinPer1g: 0,
  carbsPer1g: 0,
  fatPer1g: 0,
  isActive: true,
  unitConversions: [{ unit: "g", grams: 1 }],
});

function Field({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
}: Readonly<{
  label: string;
  type?: string;
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
}>) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-1.5">
        {label}
      </label>
      <input
        type={type}
        step={type === "number" ? "0.0001" : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-white/30 focus:outline-none transition"
      />
    </div>
  );
}

function UnitConversionRow({
  uc,
  ucKey,
  onChange,
  onRemove,
}: Readonly<{
  uc: UnitConversion;
  ucKey: number;
  onChange: (updated: UnitConversion) => void;
  onRemove: () => void;
}>) {
  return (
    <div key={ucKey} className="flex items-center gap-2">
      <input
        type="text"
        value={uc.unit}
        onChange={(e) => onChange({ ...uc, unit: e.target.value })}
        placeholder="unit (e.g. tbsp)"
        className="flex-1 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/20 focus:border-white/30 focus:outline-none transition"
      />
      <input
        type="number"
        step="0.01"
        value={uc.grams}
        onChange={(e) => onChange({ ...uc, grams: Number.parseFloat(e.target.value) || 0 })}
        placeholder="grams"
        className="w-24 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/20 focus:border-white/30 focus:outline-none transition"
      />
      <button
        type="button"
        onClick={onRemove}
        className="px-2.5 py-2 text-xs border border-red-500/25 text-red-400/70 rounded-lg hover:border-red-500/50 hover:text-red-400 transition"
      >
        ✕
      </button>
    </div>
  );
}

function UnitConversionsList({
  conversions,
  ucKeys,
  onAdd,
  onChange,
  onRemove,
}: Readonly<{
  conversions: UnitConversion[];
  ucKeys: number[];
  onAdd: () => void;
  onChange: (idx: number, updated: UnitConversion) => void;
  onRemove: (idx: number) => void;
}>) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">
        Unit Conversions
      </p>
      <div className="space-y-2">
        {conversions.map((uc, idx) => (
          <UnitConversionRow
            key={ucKeys[idx]}
            uc={uc}
            ucKey={ucKeys[idx]}
            onChange={(updated) => onChange(idx, updated)}
            onRemove={() => onRemove(idx)}
          />
        ))}
        <button
          type="button"
          onClick={onAdd}
          className="mt-1 text-xs text-white/40 hover:text-white border border-white/10 hover:border-white/25 px-3 py-1.5 rounded-lg transition"
        >
          + Add conversion
        </button>
      </div>
    </div>
  );
}

export default function IngredientsManager() {
  const [items, setItems] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [editItem, setEditItem] = useState<Ingredient | null>(null);
  const [form, setForm] = useState<FormState>(defaultForm());
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const ucKeyCounter = useRef(0);
  const [ucKeys, setUcKeys] = useState<number[]>([]);

  function nextUcKey() { return ++ucKeyCounter.current; }

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/ingredients");
      setItems(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function openCreate() {
    setForm(defaultForm());
    setUcKeys([]);
    setEditItem(null);
    setFormError("");
    setModal("create");
  }

  function openEdit(item: Ingredient) {
    const keys = (item.unitConversions ?? []).map(() => nextUcKey());
    setUcKeys(keys);
    setForm({
      name: item.name,
      brand: item.brand ?? "",
      category: item.category ?? "",
      nutritionBasis: item.nutritionBasis,
      kcalPer1g: item.kcalPer1g,
      proteinPer1g: item.proteinPer1g,
      carbsPer1g: item.carbsPer1g,
      fatPer1g: item.fatPer1g,
      isActive: item.isActive,
      unitConversions: item.unitConversions ?? [],
    });
    setEditItem(item);
    setFormError("");
    setModal("edit");
  }

  function closeModal() {
    setModal(null);
    setEditItem(null);
    setFormError("");
  }

  async function handleSave() {
    setSaving(true);
    setFormError("");
    try {
      const url =
        modal === "edit"
          ? `/api/admin/ingredients/${editItem?._id ?? ""}`
          : "/api/admin/ingredients";
      const method = modal === "edit" ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json();
        setFormError(d.error || "Failed to save.");
        return;
      }
      closeModal();
      load();
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(item: Ingredient) {
    setTogglingId(item._id);
    try {
      await fetch(`/api/admin/ingredients/${item._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !item.isActive }),
      });
      load();
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/ingredients/${id}`, { method: "DELETE" });
    setConfirmDelete(null);
    load();
  }

  const filtered = items.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      (i.category ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (i.brand ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-1">
            Admin / Ingredients
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight">Ingredients</h1>
          <p className="text-sm text-white/40 mt-1">
            {items.length} total · {items.filter((i) => i.isActive).length} active
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-bold rounded-xl hover:bg-white/90 transition"
        >
          <span className="text-lg leading-none">+</span> New Ingredient
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          placeholder="Search by name, category, brand…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/25 focus:border-white/30 focus:outline-none transition"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center gap-2 text-white/30 text-sm py-12">
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          Loading ingredients…
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10 bg-white/[0.04]">
                <tr>
                  {["Name", "Category", "Brand", "Basis", "Kcal/g", "Prot/g", "Carbs/g", "Fat/g", "Status", "Actions"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-white/30 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, i) => (
                  <tr
                    key={item._id}
                    className={`border-t border-white/5 transition hover:bg-white/[0.03] ${
                      i % 2 === 0 ? "" : "bg-white/[0.015]"
                    }`}
                  >
                    <td className="px-4 py-3 font-semibold whitespace-nowrap">{item.name}</td>
                    <td className="px-4 py-3 text-white/50 whitespace-nowrap">{item.category || "—"}</td>
                    <td className="px-4 py-3 text-white/50 whitespace-nowrap">{item.brand || "—"}</td>
                    <td className="px-4 py-3 text-white/50">{item.nutritionBasis}</td>
                    <td className="px-4 py-3 tabular-nums">{item.kcalPer1g}</td>
                    <td className="px-4 py-3 tabular-nums">{item.proteinPer1g}</td>
                    <td className="px-4 py-3 tabular-nums">{item.carbsPer1g}</td>
                    <td className="px-4 py-3 tabular-nums">{item.fatPer1g}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${
                          item.isActive
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : "bg-white/5 text-white/30 border-white/10"
                        }`}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <button
                          onClick={() => openEdit(item)}
                          className="px-2.5 py-1 text-xs border border-white/15 rounded-lg text-white/60 hover:text-white hover:border-white/35 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggle(item)}
                          disabled={togglingId === item._id}
                          className={`px-2.5 py-1 text-xs border rounded-lg transition disabled:opacity-50 ${
                            item.isActive
                              ? "border-yellow-500/25 text-yellow-400/80 hover:border-yellow-500/50 hover:text-yellow-400"
                              : "border-green-500/25 text-green-400/80 hover:border-green-500/50 hover:text-green-400"
                          }`}
                        >
                          {item.isActive ? "Deactivate" : "Activate"}
                        </button>
                        {confirmDelete === item._id ? (
                          <>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="px-2.5 py-1 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setConfirmDelete(null)}
                              className="px-2.5 py-1 text-xs border border-white/15 rounded-lg text-white/50 hover:text-white transition"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setConfirmDelete(item._id)}
                            className="px-2.5 py-1 text-xs border border-red-500/25 text-red-400/70 rounded-lg hover:border-red-500/50 hover:text-red-400 transition"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-4 py-12 text-center text-white/25 text-sm"
                    >
                      {search ? "No ingredients match your search." : "No ingredients yet."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 sticky top-0 bg-neutral-900 z-10">
              <h2 className="font-bold text-base">
                {modal === "create" ? "New Ingredient" : `Edit: ${editItem?.name}`}
              </h2>
              <button
                onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition text-xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Modal body */}
            <div className="p-6 space-y-4">
              <Field
                label="Name *"
                value={form.name}
                onChange={(v) => setField("name", v)}
                placeholder="e.g. Chicken Breast"
              />
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Brand"
                  value={form.brand ?? ""}
                  onChange={(v) => setField("brand", v)}
                  placeholder="e.g. Organic Valley"
                />
                <Field
                  label="Category"
                  value={form.category ?? ""}
                  onChange={(v) => setField("category", v)}
                  placeholder="e.g. Proteins"
                />
              </div>

              <div>
                <label
                  htmlFor="ingredient-basis"
                  className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-1.5"
                >
                  Nutrition Basis
                </label>
                <select
                  id="ingredient-basis"
                  value={form.nutritionBasis}
                  onChange={(e) => setField("nutritionBasis", e.target.value as NutritionBasis)}
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white focus:border-white/30 focus:outline-none transition"
                >
                  <option value="raw">Raw</option>
                  <option value="dry">Dry</option>
                  <option value="cooked">Cooked</option>
                </select>
              </div>

              <p className="text-xs text-white/30 -mb-1">
                Nutrition values per 1 gram of ingredient
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Kcal / g"
                  type="number"
                  value={form.kcalPer1g}
                  onChange={(v) => setField("kcalPer1g", Number.parseFloat(v) || 0)}
                />
                <Field
                  label="Protein / g"
                  type="number"
                  value={form.proteinPer1g}
                  onChange={(v) => setField("proteinPer1g", Number.parseFloat(v) || 0)}
                />
                <Field
                  label="Carbs / g"
                  type="number"
                  value={form.carbsPer1g}
                  onChange={(v) => setField("carbsPer1g", Number.parseFloat(v) || 0)}
                />
                <Field
                  label="Fat / g"
                  type="number"
                  value={form.fatPer1g}
                  onChange={(v) => setField("fatPer1g", Number.parseFloat(v) || 0)}
                />
              </div>

              {/* Unit Conversions */}
              <UnitConversionsList
                conversions={form.unitConversions ?? []}
                ucKeys={ucKeys}
                onAdd={() => {
                  setField("unitConversions", [...(form.unitConversions ?? []), { unit: "", grams: 0 }]);
                  setUcKeys((ks) => [...ks, nextUcKey()]);
                }}
                onChange={(idx, updated) => {
                  const next = [...(form.unitConversions ?? [])];
                  next[idx] = updated;
                  setField("unitConversions", next);
                }}
                onRemove={(idx) => {
                  setField("unitConversions", (form.unitConversions ?? []).filter((_, i) => i !== idx));
                  setUcKeys((ks) => ks.filter((_, i) => i !== idx));
                }}
              />

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.isActive}
                  onClick={() => setField("isActive", !form.isActive)}
                  className={`relative w-10 h-6 rounded-full transition focus:outline-none focus:ring-2 focus:ring-white/20 ${
                    form.isActive ? "bg-green-500" : "bg-white/20"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                      form.isActive ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-sm text-white/70">Active</span>
              </div>

              {formError && (
                <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
                  {formError}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-2.5 bg-white text-black text-sm font-bold rounded-xl hover:bg-white/90 disabled:opacity-50 transition"
                >
                  {(() => {
                    if (saving) return "Saving…";
                    return modal === "create" ? "Create Ingredient" : "Save Changes";
                  })()}
                </button>
                <button
                  onClick={closeModal}
                  className="px-5 py-2.5 border border-white/15 text-sm rounded-xl text-white/60 hover:text-white hover:border-white/35 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";

type RecipeStatus = "draft" | "published" | "archived";

type Recipe = {
  _id: string;
  title: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  tags?: string[];
  servings: number;
  servingUnit?: string | null;
  status: RecipeStatus;
};

type FormState = {
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
  tags: string; // comma-separated in form
  servings: number;
  servingUnit: string;
  status: RecipeStatus;
};

const defaultForm = (): FormState => ({
  title: "",
  slug: "",
  description: "",
  imageUrl: "",
  tags: "",
  servings: 1,
  servingUnit: "",
  status: "draft",
});

const STATUS_STYLES: Record<RecipeStatus, string> = {
  published: "bg-green-500/10 text-green-400 border-green-500/20",
  draft: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  archived: "bg-white/5 text-white/30 border-white/10",
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-|-$/g, "");
}

function Field({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  hint,
}: Readonly<{
  label: string;
  type?: string;
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
}>) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-white/30 focus:outline-none transition"
      />
      {hint && <p className="text-xs text-white/25 mt-1">{hint}</p>}
    </div>
  );
}

export default function RecipesManager() {
  const [items, setItems] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [editItem, setEditItem] = useState<Recipe | null>(null);
  const [form, setForm] = useState<FormState>(defaultForm());
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/recipes");
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
    setEditItem(null);
    setFormError("");
    setModal("create");
  }

  function openEdit(item: Recipe) {
    setForm({
      title: item.title,
      slug: item.slug,
      description: item.description ?? "",
      imageUrl: item.imageUrl ?? "",
      tags: (item.tags ?? []).join(", "),
      servings: item.servings,
      servingUnit: item.servingUnit ?? "",
      status: item.status,
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
      const payload = {
        ...form,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        servings: Number(form.servings) || 1,
      };
      const url =
        modal === "edit"
          ? `/api/admin/recipes/${editItem?._id ?? ""}`
          : "/api/admin/recipes";
      const method = modal === "edit" ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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

  async function handleToggleStatus(item: Recipe) {
    const nextStatus: RecipeStatus =
      item.status === "published" ? "archived" : "published";
    setTogglingId(item._id);
    try {
      await fetch(`/api/admin/recipes/${item._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      load();
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/recipes/${id}`, { method: "DELETE" });
    setConfirmDelete(null);
    load();
  }

  const filtered = items.filter(
    (i) =>
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.slug.toLowerCase().includes(search.toLowerCase()) ||
      (i.tags ?? []).some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-1">
            Admin / Recipes
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight">Recipes</h1>
          <p className="text-sm text-white/40 mt-1">
            {items.length} total ·{" "}
            {items.filter((i) => i.status === "published").length} published
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-bold rounded-xl hover:bg-white/90 transition"
        >
          <span className="text-lg leading-none">+</span> New Recipe
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
          placeholder="Search by title, slug, tags…"
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
          Loading recipes…
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10 bg-white/[0.04]">
                <tr>
                  {["Title", "Slug", "Tags", "Servings", "Status", "Actions"].map(
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
                    <td className="px-4 py-3 font-semibold whitespace-nowrap max-w-xs truncate">
                      {item.title}
                    </td>
                    <td className="px-4 py-3 text-white/40 font-mono text-xs whitespace-nowrap">
                      {item.slug}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(item.tags ?? []).slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/50 border border-white/10"
                          >
                            {t}
                          </span>
                        ))}
                        {(item.tags ?? []).length > 3 && (
                          <span className="text-xs text-white/30">
                            +{(item.tags ?? []).length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white/50">
                      {item.servings}
                      {item.servingUnit ? ` ${item.servingUnit}` : ""}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${STATUS_STYLES[item.status]}`}
                      >
                        {item.status}
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
                          onClick={() => handleToggleStatus(item)}
                          disabled={togglingId === item._id}
                          className={`px-2.5 py-1 text-xs border rounded-lg transition disabled:opacity-50 ${
                            item.status === "published"
                              ? "border-yellow-500/25 text-yellow-400/80 hover:border-yellow-500/50 hover:text-yellow-400"
                              : "border-green-500/25 text-green-400/80 hover:border-green-500/50 hover:text-green-400"
                          }`}
                        >
                          {item.status === "published" ? "Archive" : "Publish"}
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
                      colSpan={6}
                      className="px-4 py-12 text-center text-white/25 text-sm"
                    >
                      {search ? "No recipes match your search." : "No recipes yet."}
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
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 sticky top-0 bg-neutral-900 z-10">
              <h2 className="font-bold text-base">
                {modal === "create" ? "New Recipe" : `Edit: ${editItem?.title}`}
              </h2>
              <button
                onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition text-xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <Field
                label="Title *"
                value={form.title}
                onChange={(v) => {
                  setField("title", v);
                  if (modal === "create") setField("slug", slugify(v));
                }}
                placeholder="e.g. High-Protein Chicken Bowl"
              />
              <Field
                label="Slug *"
                value={form.slug}
                onChange={(v) => setField("slug", slugify(v))}
                placeholder="e.g. high-protein-chicken-bowl"
                hint="URL-friendly identifier — auto-generated from title"
              />
              <div>
                <label
                  htmlFor="desc-textarea"
                  className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-1.5"
                >
                  Description
                </label>
                <textarea
                  id="desc-textarea"
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                  placeholder="Short description…"
                  rows={3}
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-white/30 focus:outline-none transition resize-none"
                />
              </div>
              <Field
                label="Image URL"
                value={form.imageUrl}
                onChange={(v) => setField("imageUrl", v)}
                placeholder="https://…"
              />
              <Field
                label="Tags"
                value={form.tags}
                onChange={(v) => setField("tags", v)}
                placeholder="high-protein, meal-prep, chicken"
                hint="Comma-separated"
              />
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Servings"
                  type="number"
                  value={form.servings}
                  onChange={(v) => setField("servings", Number.parseInt(v) || 1)}
                />
                <Field
                  label="Serving Unit"
                  value={form.servingUnit}
                  onChange={(v) => setField("servingUnit", v)}
                  placeholder="e.g. container"
                />
              </div>
              <div>
                <label
                  htmlFor="recipe-status"
                  className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-1.5"
                >
                  Status
                </label>
                <select
                  id="recipe-status"
                  value={form.status}
                  onChange={(e) => setField("status", e.target.value as RecipeStatus)}
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white focus:border-white/30 focus:outline-none transition"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
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
                    return modal === "create" ? "Create Recipe" : "Save Changes";
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
